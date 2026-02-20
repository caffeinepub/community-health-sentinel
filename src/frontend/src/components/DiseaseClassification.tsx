import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

interface DiseaseData {
  name: string;
  probability: number;
  color: string;
}

interface EnvironmentalParams {
  rainfall: number;
  humidity: number;
  turbidity: number;
  bacteriaIndex: number;
}

export default function DiseaseClassification() {
  const [diseaseData, setDiseaseData] = useState<DiseaseData[]>([]);
  
  // Calculate disease probabilities based on environmental parameters
  const calculateDiseaseProbabilities = (params: EnvironmentalParams): DiseaseData[] => {
    // Normalize parameters to 0-1 scale
    const normalizedRainfall = Math.min(params.rainfall / 200, 1);
    const normalizedHumidity = params.humidity / 100;
    const normalizedTurbidity = Math.min(params.turbidity / 50, 1);
    const normalizedBacteria = Math.min(params.bacteriaIndex / 1000, 1);
    
    // Calculate raw scores using weighted formulas
    // Cholera: heavily influenced by bacteria and turbidity
    const choleraScore = (
      normalizedBacteria * 0.40 +
      normalizedTurbidity * 0.30 +
      normalizedRainfall * 0.20 +
      normalizedHumidity * 0.10
    );
    
    // Typhoid: contamination and sanitation factors
    const typhoidScore = (
      normalizedBacteria * 0.35 +
      normalizedTurbidity * 0.25 +
      normalizedHumidity * 0.25 +
      normalizedRainfall * 0.15
    );
    
    // Dysentery: water quality and bacteria
    const dysenteryScore = (
      normalizedBacteria * 0.45 +
      normalizedTurbidity * 0.30 +
      normalizedRainfall * 0.15 +
      normalizedHumidity * 0.10
    );
    
    // Hepatitis A: sanitation and contamination
    const hepatitisAScore = (
      normalizedBacteria * 0.30 +
      normalizedTurbidity * 0.30 +
      normalizedHumidity * 0.25 +
      normalizedRainfall * 0.15
    );
    
    // Normalize to sum to 100%
    const totalScore = choleraScore + typhoidScore + dysenteryScore + hepatitisAScore;
    
    const diseases = [
      {
        name: 'Cholera',
        probability: totalScore > 0 ? Math.round((choleraScore / totalScore) * 100) : 25,
        color: '#2563EB'
      },
      {
        name: 'Typhoid',
        probability: totalScore > 0 ? Math.round((typhoidScore / totalScore) * 100) : 25,
        color: '#2563EB'
      },
      {
        name: 'Dysentery',
        probability: totalScore > 0 ? Math.round((dysenteryScore / totalScore) * 100) : 25,
        color: '#2563EB'
      },
      {
        name: 'Hepatitis A',
        probability: totalScore > 0 ? Math.round((hepatitisAScore / totalScore) * 100) : 25,
        color: '#2563EB'
      }
    ];
    
    // Adjust for rounding errors to ensure sum is exactly 100
    const sum = diseases.reduce((acc, d) => acc + d.probability, 0);
    if (sum !== 100 && diseases.length > 0) {
      diseases[0].probability += (100 - sum);
    }
    
    // Sort by probability (highest first) and highlight the highest in red
    diseases.sort((a, b) => b.probability - a.probability);
    diseases[0].color = '#DC2626'; // Red for highest risk
    
    return diseases;
  };
  
  // Initialize with default data
  useEffect(() => {
    const lastReport = localStorage.getItem('last_government_report');
    let defaultParams: EnvironmentalParams = {
      rainfall: 50,
      humidity: 60,
      turbidity: 10,
      bacteriaIndex: 200
    };
    
    if (lastReport) {
      try {
        const report = JSON.parse(lastReport);
        defaultParams = {
          rainfall: report.rainfall || 50,
          humidity: report.humidity || 60,
          turbidity: report.turbidity || 10,
          bacteriaIndex: report.bacteriaLevel || 200
        };
      } catch (e) {
        console.error('[DiseaseClassification] Error parsing last report:', e);
      }
    }
    
    setDiseaseData(calculateDiseaseProbabilities(defaultParams));
  }, []);
  
  // Listen for disease classification updates
  useEffect(() => {
    const handleDiseaseClassificationUpdate = (event: Event) => {
      const customEvent = event as CustomEvent<EnvironmentalParams>;
      const params = customEvent.detail;
      
      console.log('[DiseaseClassification] Received environmental parameters:', params);
      
      const newDiseaseData = calculateDiseaseProbabilities(params);
      console.log('[DiseaseClassification] Calculated disease probabilities:', newDiseaseData);
      
      setDiseaseData(newDiseaseData);
    };
    
    window.addEventListener('disease-classification-updated', handleDiseaseClassificationUpdate);
    
    return () => {
      window.removeEventListener('disease-classification-updated', handleDiseaseClassificationUpdate);
    };
  }, []);

  const highestDisease = diseaseData.length > 0 ? diseaseData[0] : { name: 'N/A', probability: 0 };

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
