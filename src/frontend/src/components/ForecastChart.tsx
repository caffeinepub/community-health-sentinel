import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ForecastDataPoint {
  day: string;
  risk: number;
}

export default function ForecastChart() {
  // Generate realistic 14-day forecast data with appropriate variance
  const generateForecastData = (): ForecastDataPoint[] => {
    const data: ForecastDataPoint[] = [];
    let baseRisk = 45; // Starting risk percentage
    
    for (let i = 1; i <= 14; i++) {
      // Add realistic variance and trend
      const variance = (Math.random() - 0.5) * 8;
      const trend = i * 0.5; // Slight upward trend
      baseRisk = Math.max(20, Math.min(85, baseRisk + variance + trend));
      
      data.push({
        day: `Day ${i}`,
        risk: parseFloat(baseRisk.toFixed(1))
      });
    }
    
    return data;
  };

  const forecastData = generateForecastData();
  const confidenceScore = 87;
  const modelAUC = 0.91;

  return (
    <Card className="bg-white border-medical-border shadow-medical rounded-xl">
      <CardHeader className="p-6">
        <CardTitle className="text-2xl text-medical-slate">14-Day Predictive Forecast</CardTitle>
        <div className="flex gap-6 mt-2">
          <div className="text-sm">
            <span className="text-medical-grey">Confidence Score: </span>
            <span className="text-medical-slate font-semibold">{confidenceScore}%</span>
          </div>
          <div className="text-sm">
            <span className="text-medical-grey">Model AUC: </span>
            <span className="text-medical-slate font-semibold">{modelAUC}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={forecastData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis 
              dataKey="day" 
              stroke="#64748B"
              tick={{ fill: '#64748B' }}
            />
            <YAxis 
              stroke="#64748B"
              tick={{ fill: '#64748B' }}
              label={{ value: 'Risk %', angle: -90, position: 'insideLeft', fill: '#64748B' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#FFFFFF', 
                border: '1px solid #E2E8F0',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
              }}
              labelStyle={{ color: '#1E293B' }}
              itemStyle={{ color: '#2563EB' }}
            />
            <Line 
              type="monotone" 
              dataKey="risk" 
              stroke="#2563EB" 
              strokeWidth={3}
              dot={{ fill: '#2563EB', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
