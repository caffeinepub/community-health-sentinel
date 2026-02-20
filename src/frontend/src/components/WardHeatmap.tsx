import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface WardHeatmapProps {
  overallRisk?: number;
}

export default function WardHeatmap({ overallRisk = 50 }: WardHeatmapProps) {
  const wards = Array.from({ length: 9 }, (_, i) => i + 1);
  
  // Unique adjustment factors for each ward
  const adjustmentFactors = [0.85, 1.15, 0.95, 1.10, 0.90, 1.05, 1.12, 0.88, 1.08];

  const getWardRisk = (wardIndex: number): number => {
    const adjustedRisk = overallRisk * adjustmentFactors[wardIndex];
    return Math.min(100, Math.max(0, adjustedRisk));
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
          {wards.map((ward, index) => {
            const wardRisk = getWardRisk(index);
            const riskColor = getRiskColor(wardRisk);
            
            return (
              <div
                key={ward}
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
