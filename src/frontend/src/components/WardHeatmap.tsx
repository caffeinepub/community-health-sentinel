import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { getWardData } from '@/utils/wardDataGenerator';
import { calculateWardRisk, getDefaultEnvironmentalMultiplier } from '@/utils/wardRiskCalculator';

interface WardHeatmapProps {
  overallRisk?: number;
}

interface WardData {
  wardId: number;
  sanitationCoverage: number;
  waterTreatmentCoverage: number;
  populationDensity: number;
  riskPrediction?: {
    riskPercentage: number;
    riskCategory: string;
  };
}

export default function WardHeatmap({ overallRisk: propOverallRisk }: WardHeatmapProps) {
  const [overallRisk, setOverallRisk] = useState<number>(propOverallRisk || 50);
  const [wardRisks, setWardRisks] = useState<number[]>(Array(9).fill(0));
  const [updateTrigger, setUpdateTrigger] = useState(0);
  
  // Update from props
  useEffect(() => {
    if (propOverallRisk !== undefined) {
      setOverallRisk(propOverallRisk);
    }
  }, [propOverallRisk]);
  
  // Listen for risk data updates
  useEffect(() => {
    const handleRiskUpdate = (event: Event) => {
      const customEvent = event as CustomEvent;
      const { riskPercentage } = customEvent.detail;
      console.log('[WardHeatmap] Risk data updated, new overall risk:', riskPercentage);
      setOverallRisk(riskPercentage);
      setUpdateTrigger(prev => prev + 1);
    };
    
    window.addEventListener('risk-data-updated', handleRiskUpdate);
    
    return () => {
      window.removeEventListener('risk-data-updated', handleRiskUpdate);
    };
  }, []);
  
  // Helper function to load ward data from localStorage or use generator fallback
  const loadWardData = (wardId: number): WardData => {
    const storedData = localStorage.getItem(`ward_${wardId}_data`);
    if (storedData) {
      try {
        const parsed = JSON.parse(storedData);
        console.log(`[WardHeatmap] Loaded ward ${wardId} data from localStorage:`, parsed);
        return {
          wardId: parsed.wardId,
          sanitationCoverage: parsed.sanitationCoverage,
          waterTreatmentCoverage: parsed.waterTreatmentCoverage,
          populationDensity: parsed.populationDensity,
          riskPrediction: parsed.riskPrediction
        };
      } catch (e) {
        console.error(`[WardHeatmap] Error parsing localStorage data for ward ${wardId}:`, e);
      }
    }
    // Fallback to generator if no localStorage data
    const generatedData = getWardData(wardId);
    console.log(`[WardHeatmap] Using generated data for ward ${wardId}:`, generatedData);
    return generatedData;
  };
  
  // Calculate risk for a specific ward
  const calculateWardRiskValue = (wardId: number, wardData: WardData, baseRisk: number): number => {
    // If we have a stored risk prediction, use it directly
    if (wardData.riskPrediction && wardData.riskPrediction.riskPercentage !== undefined) {
      console.log(`[WardHeatmap] Using stored risk prediction for ward ${wardId}:`, wardData.riskPrediction.riskPercentage);
      return wardData.riskPrediction.riskPercentage;
    }
    
    // Otherwise calculate using the formula
    const calculatedRisk = calculateWardRisk(baseRisk, {
      sanitation_coverage: wardData.sanitationCoverage,
      water_treatment_coverage: wardData.waterTreatmentCoverage,
      population_density: wardData.populationDensity,
      environmental_multiplier: getDefaultEnvironmentalMultiplier(wardId)
    });
    
    console.log(`[WardHeatmap] Calculated risk for ward ${wardId}:`, calculatedRisk);
    return calculatedRisk;
  };
  
  // Load ward data on mount and recalculate risks
  useEffect(() => {
    console.log('[WardHeatmap] Initializing WardHeatmap, loading localStorage data');
    
    // Load all ward data and calculate risks
    const newWardRisks: number[] = [];
    
    for (let wardId = 1; wardId <= 9; wardId++) {
      const wardData = loadWardData(wardId);
      const wardRisk = calculateWardRiskValue(wardId, wardData, overallRisk);
      newWardRisks.push(wardRisk);
      
      console.log(`[WardHeatmap] Loaded ward ${wardId} data from localStorage: ${wardRisk.toFixed(1)}%`);
    }
    
    setWardRisks(newWardRisks);
    console.log('[WardHeatmap] Final grid state after initialization:', newWardRisks);
  }, [overallRisk, updateTrigger]);
  
  // Listen for ward-specific data updates
  useEffect(() => {
    const handleWardDataUpdate = (event: Event) => {
      const customEvent = event as CustomEvent;
      const detail = customEvent.detail;
      
      console.log('[WardHeatmap] Received ward-data-updated event for wardId:', detail.wardId);
      
      if (detail && detail.wardId) {
        const wardId = detail.wardId;
        const wardIndex = wardId - 1; // Convert ward ID (1-9) to array index (0-8)
        
        console.log(`[WardHeatmap] Updating ward ${wardId} at grid cell index ${wardIndex}`);
        
        // Load the updated ward data from localStorage
        const updatedWardData = loadWardData(wardId);
        
        // Calculate the new risk for this specific ward
        const newRisk = calculateWardRiskValue(wardId, updatedWardData, overallRisk);
        
        // Update only the specific ward in the array
        setWardRisks(prevRisks => {
          const newRisks = [...prevRisks];
          const oldRisk = newRisks[wardIndex];
          newRisks[wardIndex] = newRisk;
          
          console.log(`[WardHeatmap] Updated grid cell index ${wardIndex} for ward ${wardId} with risk ${newRisk.toFixed(1)}%`);
          console.log(`[WardHeatmap] Risk changed from ${oldRisk.toFixed(1)}% to ${newRisk.toFixed(1)}%`);
          console.log('[WardHeatmap] Final grid state after update:', newRisks);
          
          return newRisks;
        });
        
        setUpdateTrigger(prev => prev + 1);
      }
    };
    
    window.addEventListener('ward-data-updated', handleWardDataUpdate);
    
    return () => {
      window.removeEventListener('ward-data-updated', handleWardDataUpdate);
    };
  }, [overallRisk]);

  const getRiskColor = (risk: number): string => {
    if (risk < 30) return '#16A34A'; // Green
    if (risk < 70) return '#F59E0B'; // Yellow
    return '#DC2626'; // Red
  };

  return (
    <Card className="bg-white border-medical-border shadow-medical rounded-xl">
      <CardHeader className="p-6">
        <CardTitle className="text-2xl text-medical-slate">Village Risk Heatmap – Coimbatore District</CardTitle>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <div className="grid grid-cols-3 gap-4">
          {wardRisks.map((wardRisk, index) => {
            const ward = index + 1;
            const riskColor = getRiskColor(wardRisk);
            
            return (
              <div
                key={`${ward}-${updateTrigger}`}
                className="rounded-lg p-6 text-center border-2 transition-all hover:scale-105"
                style={{
                  backgroundColor: riskColor,
                  borderColor: riskColor,
                  color: '#FFFFFF'
                }}
              >
                <div className="text-3xl font-bold mb-2">Ward {ward}</div>
                <div className="text-xl font-semibold">{wardRisk.toFixed(1)}%</div>
                <div className="text-sm mt-1 opacity-90">Outbreak Probability</div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
