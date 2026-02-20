import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface RiskGaugeProps {
  riskPercentage?: number;
}

export default function RiskGauge({ riskPercentage: propRiskPercentage }: RiskGaugeProps) {
  const [riskPercentage, setRiskPercentage] = useState<number>(propRiskPercentage || 50);
  
  // Update from props
  useEffect(() => {
    if (propRiskPercentage !== undefined) {
      setRiskPercentage(propRiskPercentage);
    }
  }, [propRiskPercentage]);
  
  // Listen for risk data updates
  useEffect(() => {
    const handleRiskUpdate = (event: Event) => {
      const customEvent = event as CustomEvent;
      const { riskPercentage: newRisk } = customEvent.detail;
      setRiskPercentage(newRisk);
    };
    
    window.addEventListener('risk-data-updated', handleRiskUpdate);
    
    return () => {
      window.removeEventListener('risk-data-updated', handleRiskUpdate);
    };
  }, []);
  
  const getRiskColor = (): string => {
    if (riskPercentage < 30) return '#16A34A'; // Green
    if (riskPercentage < 70) return '#F59E0B'; // Yellow
    return '#DC2626'; // Red
  };

  const getRiskLabel = (): string => {
    if (riskPercentage < 30) return 'LOW RISK';
    if (riskPercentage < 70) return 'MEDIUM RISK';
    return 'HIGH RISK';
  };

  const riskColor = getRiskColor();
  const riskLabel = getRiskLabel();

  return (
    <Card className="bg-white border-medical-border shadow-medical rounded-xl">
      <CardHeader className="p-6">
        <CardTitle className="text-2xl text-medical-slate">Current Risk Level</CardTitle>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <div className="flex flex-col items-center space-y-6">
          <div className="text-center">
            <div className="text-6xl font-bold mb-2" style={{ color: riskColor }}>
              {riskPercentage.toFixed(1)}%
            </div>
            <div className="text-xl font-semibold" style={{ color: riskColor }}>
              {riskLabel}
            </div>
          </div>
          
          <div className="w-full">
            <Progress 
              value={riskPercentage} 
              className="h-4"
              style={{
                backgroundColor: '#E5E7EB'
              }}
            />
          </div>

          <div className="text-center text-sm text-medical-grey">
            <p>Prediction Confidence: 87%</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
