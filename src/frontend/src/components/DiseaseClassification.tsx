import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

interface DiseaseData {
  name: string;
  probability: number;
  color: string;
}

export default function DiseaseClassification() {
  // Generate simulated disease probabilities
  const generateDiseaseData = (): DiseaseData[] => {
    const diseases = ['Cholera', 'Typhoid', 'Dysentery', 'Hepatitis A'];
    const probabilities = [35, 28, 22, 15]; // Sum to 100
    
    return diseases.map((name, index) => ({
      name,
      probability: probabilities[index],
      color: index === 0 ? '#DC2626' : '#2563EB' // Highest in red, others in blue
    }));
  };

  const diseaseData = generateDiseaseData();
  const highestDisease = diseaseData[0];

  return (
    <Card className="bg-white border-medical-border shadow-medical rounded-xl">
      <CardHeader className="p-6">
        <CardTitle className="text-2xl text-medical-slate">Disease Risk Distribution</CardTitle>
      </CardHeader>
      <CardContent className="p-6 pt-0 space-y-6">
        {/* Horizontal Bar Chart */}
        <div>
          <h3 className="text-lg font-semibold text-medical-slate mb-4">Probability by Disease</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={diseaseData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis type="number" stroke="#64748B" tick={{ fill: '#64748B' }} />
              <YAxis dataKey="name" type="category" stroke="#64748B" tick={{ fill: '#64748B' }} width={100} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#FFFFFF', 
                  border: '1px solid #E2E8F0',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                }}
                formatter={(value: number) => `${value}%`}
              />
              <Bar dataKey="probability" radius={[0, 8, 8, 0]}>
                {diseaseData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div>
          <h3 className="text-lg font-semibold text-medical-slate mb-4">Distribution Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={diseaseData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, probability }) => `${name}: ${probability}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="probability"
              >
                {diseaseData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => `${value}%`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Highest Risk Alert */}
        <div className="bg-red-50 border border-medical-red rounded-lg p-4">
          <p className="text-sm font-semibold text-medical-red">
            Highest Risk: {highestDisease.name} ({highestDisease.probability}%)
          </p>
          <p className="text-xs text-medical-grey mt-1">
            This disease shows the highest probability based on current environmental conditions.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
