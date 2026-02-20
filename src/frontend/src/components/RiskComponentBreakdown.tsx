import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface RiskComponentBreakdownProps {
  rainfall: number;
  humidity: number;
  turbidity: number;
  bacteriaIndex: number;
}

export default function RiskComponentBreakdown({
  rainfall,
  humidity,
  turbidity,
  bacteriaIndex
}: RiskComponentBreakdownProps) {
  // Calculate weighted contributions based on the formula
  const normalizedRainfall = Math.min(rainfall / 200, 1);
  const normalizedHumidity = humidity / 100;
  const normalizedTurbidity = Math.min(turbidity / 50, 1);
  const normalizedBacteria = Math.min(bacteriaIndex / 1000, 1);

  // Apply weights: 30% Rainfall, 25% Turbidity, 25% Contamination, 20% Humidity
  const rainfallContribution = normalizedRainfall * 30;
  const turbidityContribution = normalizedTurbidity * 25;
  const contaminationContribution = normalizedBacteria * 25;
  const humidityContribution = normalizedHumidity * 20;

  const data = [
    { name: 'Rainfall', value: rainfallContribution, color: '#2563EB' },
    { name: 'Turbidity', value: turbidityContribution, color: '#F59E0B' },
    { name: 'Contamination', value: contaminationContribution, color: '#DC2626' },
    { name: 'Humidity', value: humidityContribution, color: '#3B82F6' }
  ];

  return (
    <Card className="bg-white border-medical-border shadow-medical rounded-xl">
      <CardHeader className="p-6">
        <CardTitle className="text-xl text-medical-slate">Risk Component Distribution</CardTitle>
      </CardHeader>
      <CardContent className="p-6 pt-0 space-y-4">
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis 
              dataKey="name" 
              stroke="#64748B"
              tick={{ fill: '#64748B', fontSize: 12 }}
            />
            <YAxis 
              stroke="#64748B"
              tick={{ fill: '#64748B' }}
              label={{ value: 'Contribution (%)', angle: -90, position: 'insideLeft', fill: '#64748B' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#FFFFFF', 
                border: '1px solid #E2E8F0',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
              }}
              labelStyle={{ color: '#1E293B' }}
              formatter={(value: number) => [`${value.toFixed(1)}%`, 'Contribution']}
            />
            <Bar dataKey="value" radius={[8, 8, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-medical-slate text-sm leading-relaxed">
            The system distributes overall risk based on environmental contamination and climatic influence factors.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
