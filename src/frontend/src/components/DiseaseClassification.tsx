import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts';

interface DiseaseProbability {
  name: string;
  probability: number;
}

export default function DiseaseClassification() {
  const [diseaseProbabilities, setDiseaseProbabilities] = useState<DiseaseProbability[]>([
    { name: 'Cholera', probability: 25 },
    { name: 'Typhoid', probability: 25 },
    { name: 'Dysentery', probability: 25 },
    { name: 'Hepatitis A', probability: 25 }
  ]);

  useEffect(() => {
    const handleUpdate = (event: Event) => {
      const customEvent = event as CustomEvent;
      const detail = customEvent.detail;

      if (detail && detail.probabilities) {
        const probs = detail.probabilities;
        const newProbabilities: DiseaseProbability[] = [
          { name: 'Cholera', probability: probs.Cholera || 0 },
          { name: 'Typhoid', probability: probs.Typhoid || 0 },
          { name: 'Dysentery', probability: probs.Dysentery || 0 },
          { name: 'Hepatitis A', probability: probs['Hepatitis A'] || 0 }
        ];
        setDiseaseProbabilities(newProbabilities);
      }
    };

    window.addEventListener('disease-classification-updated', handleUpdate);
    return () => window.removeEventListener('disease-classification-updated', handleUpdate);
  }, []);

  const COLORS = ['#2563EB', '#F59E0B', '#DC2626', '#16A34A'];

  const highestProb = Math.max(...diseaseProbabilities.map(d => d.probability));
  const highestDisease = diseaseProbabilities.find(d => d.probability === highestProb);

  return (
    <Card className="bg-white border-gray-200 shadow-md rounded-lg">
      <CardHeader className="p-6">
        <CardTitle className="text-2xl text-blue-600 font-bold">Disease Risk Distribution</CardTitle>
        <p className="text-sm text-gray-600 mt-1">Probability breakdown for waterborne diseases (4 diseases)</p>
      </CardHeader>
      <CardContent className="p-6 pt-0 space-y-6">
        {/* Bar Chart */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Probability by Disease</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={diseaseProbabilities}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="name" tick={{ fill: '#6B7280', fontSize: 12 }} />
              <YAxis tick={{ fill: '#6B7280', fontSize: 12 }} label={{ value: 'Probability (%)', angle: -90, position: 'insideLeft', fill: '#6B7280' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '8px' }}
                formatter={(value: number) => `${value.toFixed(1)}%`}
              />
              <Bar dataKey="probability" radius={[8, 8, 0, 0]}>
                {diseaseProbabilities.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Distribution Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={diseaseProbabilities}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, probability }) => `${name}: ${probability.toFixed(1)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="probability"
              >
                {diseaseProbabilities.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => `${value.toFixed(1)}%`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Highest Probability Disease */}
        {highestDisease && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="text-sm font-semibold text-blue-800 mb-1">Most Likely Disease</h3>
            <p className="text-lg font-bold text-blue-600">
              {highestDisease.name} ({highestProb.toFixed(1)}%)
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
