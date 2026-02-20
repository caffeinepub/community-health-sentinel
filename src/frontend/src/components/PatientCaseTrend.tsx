import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface CaseDataPoint {
  date: string;
  cases: number;
}

export default function PatientCaseTrend() {
  const generateCaseData = (): CaseDataPoint[] => {
    const data: CaseDataPoint[] = [];
    let baseCases = 25;
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Add realistic variance with occasional spikes
      const variance = (Math.random() - 0.5) * 10;
      const spike = Math.random() > 0.85 ? Math.random() * 15 : 0;
      baseCases = Math.max(5, Math.min(80, baseCases + variance + spike));
      
      data.push({
        date: `${date.getMonth() + 1}/${date.getDate()}`,
        cases: Math.round(baseCases)
      });
    }
    
    return data;
  };

  const caseData = generateCaseData();

  return (
    <Card className="bg-white border-medical-border shadow-medical rounded-xl">
      <CardHeader className="p-6">
        <CardTitle className="text-2xl text-medical-slate">Patient Case Trend</CardTitle>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={caseData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis 
              dataKey="date" 
              stroke="#64748B"
              tick={{ fill: '#64748B' }}
            />
            <YAxis 
              stroke="#64748B"
              tick={{ fill: '#64748B' }}
              label={{ value: 'Cases', angle: -90, position: 'insideLeft', fill: '#64748B' }}
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
              dataKey="cases" 
              stroke="#2563EB" 
              strokeWidth={3}
              dot={{ fill: '#2563EB', r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
