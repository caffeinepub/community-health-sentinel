import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface WardComparisonProps {
  overallRisk: number;
}

export default function WardComparison({ overallRisk }: WardComparisonProps) {
  const adjustmentFactors = [0.85, 1.15, 0.95, 1.10, 0.90, 1.05, 1.12, 0.88, 1.08];

  const wardData = Array.from({ length: 9 }, (_, i) => {
    const wardRisk = Math.min(100, Math.max(0, overallRisk * adjustmentFactors[i]));
    return {
      ward: `Ward ${i + 1}`,
      probability: parseFloat(wardRisk.toFixed(1))
    };
  });

  const getRiskColor = (risk: number): string => {
    if (risk < 30) return '#16A34A'; // Green
    if (risk < 70) return '#F59E0B'; // Yellow
    return '#DC2626'; // Red
  };

  return (
    <Card className="bg-white border-medical-border shadow-medical rounded-xl">
      <CardHeader className="p-6">
        <CardTitle className="text-2xl text-medical-slate">Ward Comparison</CardTitle>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={wardData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="ward" stroke="#64748B" tick={{ fill: '#64748B' }} />
            <YAxis 
              stroke="#64748B" 
              tick={{ fill: '#64748B' }} 
              label={{ value: 'Outbreak Probability (%)', angle: -90, position: 'insideLeft', fill: '#64748B' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#FFFFFF', 
                border: '1px solid #E2E8F0',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
              }}
              formatter={(value: number) => `${value}%`}
            />
            <Bar dataKey="probability" radius={[8, 8, 0, 0]} label={{ position: 'top', fill: '#64748B' }}>
              {wardData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getRiskColor(entry.probability)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
