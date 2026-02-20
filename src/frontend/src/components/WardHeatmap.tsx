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
}

export default function WardHeatmap({ overallRisk: propOverallRisk }: WardHeatmapProps) {
  const [overallRisk, setOverallRisk] = useState<number>(propOverallRisk || 50);
  const [wardDataList, setWardDataList] = useState<WardData[]>([]);
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
      setOverallRisk(riskPercentage);
      setUpdateTrigger(prev => prev + 1);
    };
    
    window.addEventListener('risk-data-updated', handleRiskUpdate);
    
    return () => {
      window.removeEventListener('risk-data-updated', handleRiskUpdate);
    };
  }, []);
  
  // Load ward data on mount and listen for updates
  useEffect(() => {
    // Load initial ward data from generator
    const initialData = Array.from({ length: 9 }, (_, i) => getWardData(i + 1));
    setWardDataList(initialData);
    
    // Listen for ward data updates from GovernmentDataPanel
    const handleWardDataUpdate = (event: Event) => {
      const customEvent = event as CustomEvent;
      console.log('Ward data updated:', customEvent.detail);
      
      // Reload ward data (in production, this would come from the event detail)
      const updatedData = Array.from({ length: 9 }, (_, i) => getWardData(i + 1));
      setWardDataList(updatedData);
      setUpdateTrigger(prev => prev + 1);
    };
    
    window.addEventListener('wardDataUpdated', handleWardDataUpdate);
    
    return () => {
      window.removeEventListener('wardDataUpdated', handleWardDataUpdate);
    };
  }, []);

  /**
   * Calculate ward-specific outbreak probability using scientifically grounded formula
   * 
   * Formula: Ward_Risk = Base_Risk × (1 + Sanitation_Factor + Water_Treatment_Factor + Population_Density_Factor + Environmental_Factor)
   * 
   * Factors:
   * - Sanitation_Factor: (100 - sanitation_coverage) / 200 → Lower coverage = higher risk
   * - Water_Treatment_Factor: (100 - water_treatment_coverage) / 200 → Lower coverage = higher risk
   * - Population_Density_Factor: (population_density - 2000) / 10000, clamped to 0-0.3 → Higher density = higher risk
   * - Environmental_Factor: Ward-specific multiplier (0.8-1.2) based on geography
   * 
   * Result is normalized to 0-100% range
   */
  const getWardRisk = (wardIndex: number): number => {
    const wardData = wardDataList[wardIndex];
    if (!wardData) return overallRisk;
    
    const wardId = wardIndex + 1;
    
    // Calculate ward-specific risk using the scientific formula
    const wardRisk = calculateWardRisk(overallRisk, {
      sanitation_coverage: wardData.sanitationCoverage,
      water_treatment_coverage: wardData.waterTreatmentCoverage,
      population_density: wardData.populationDensity,
      environmental_multiplier: getDefaultEnvironmentalMultiplier(wardId)
    });
    
    return wardRisk;
  };

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
          {Array.from({ length: 9 }, (_, index) => {
            const ward = index + 1;
            const wardRisk = getWardRisk(index);
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
