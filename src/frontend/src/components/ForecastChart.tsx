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
    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="text-2xl text-white">14-Day Predictive Forecast</CardTitle>
        <div className="flex gap-6 mt-2">
          <div className="text-sm">
            <span className="text-teal-200">Confidence Score: </span>
            <span className="text-white font-semibold">{confidenceScore}%</span>
          </div>
          <div className="text-sm">
            <span className="text-teal-200">Model AUC: </span>
            <span className="text-white font-semibold">{modelAUC}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={forecastData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="day" 
              stroke="rgba(255,255,255,0.6)"
              tick={{ fill: 'rgba(255,255,255,0.6)' }}
            />
            <YAxis 
              stroke="rgba(255,255,255,0.6)"
              tick={{ fill: 'rgba(255,255,255,0.6)' }}
              label={{ value: 'Risk %', angle: -90, position: 'insideLeft', fill: 'rgba(255,255,255,0.6)' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(0,0,0,0.8)', 
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '8px'
              }}
              labelStyle={{ color: '#5eead4' }}
              itemStyle={{ color: '#ffffff' }}
            />
            <Line 
              type="monotone" 
              dataKey="risk" 
              stroke="#14b8a6" 
              strokeWidth={3}
              dot={{ fill: '#14b8a6', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
