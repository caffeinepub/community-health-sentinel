import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { getWardData, getAllWardsData } from '@/utils/wardDataGenerator';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface InterventionPriorityProps {
  overallRisk: number;
}

export default function InterventionPriority({ overallRisk }: InterventionPriorityProps) {
  const wardsData = getAllWardsData();
  
  const adjustmentFactors = [0.85, 1.15, 0.95, 1.10, 0.90, 1.05, 1.12, 0.88, 1.08];
  
  const calculatePriorityScore = (wardId: number): number => {
    const wardData = getWardData(wardId);
    const wardIndex = wardId - 1;
    
    // Calculate outbreak probability for this ward
    const outbreakProbability = Math.min(100, Math.max(0, overallRisk * adjustmentFactors[wardIndex])) / 100;
    
    // Calculate vulnerability weight
    let vulnerabilityWeight = 1.0;
    if (wardData.sanitationCoverage < 50) vulnerabilityWeight += 1.0;
    if (wardData.waterTreatmentCoverage < 60) vulnerabilityWeight += 1.0;
    if (wardData.populationDensity > 2000) vulnerabilityWeight += 1.0;
    
    // Calculate priority score
    const rawScore = outbreakProbability * vulnerabilityWeight;
    const maxWeight = 4.0; // 1.0 base + 3.0 max bonuses
    const normalizedScore = (rawScore / maxWeight) * 100;
    
    return Math.min(100, normalizedScore);
  };
  
  const wardPriorities = wardsData.map(ward => {
    const wardIndex = ward.wardId - 1;
    const outbreakProb = Math.min(100, Math.max(0, overallRisk * adjustmentFactors[wardIndex]));
    const priorityScore = calculatePriorityScore(ward.wardId);
    
    let vulnerabilityWeight = 1.0;
    if (ward.sanitationCoverage < 50) vulnerabilityWeight += 1.0;
    if (ward.waterTreatmentCoverage < 60) vulnerabilityWeight += 1.0;
    if (ward.populationDensity > 2000) vulnerabilityWeight += 1.0;
    
    return {
      wardId: ward.wardId,
      wardName: `Ward ${ward.wardId}`,
      outbreakProbability: outbreakProb,
      vulnerabilityWeight: vulnerabilityWeight,
      priorityScore: priorityScore,
      sanitationCoverage: ward.sanitationCoverage,
      waterTreatmentCoverage: ward.waterTreatmentCoverage,
      populationDensity: ward.populationDensity
    };
  }).sort((a, b) => b.priorityScore - a.priorityScore);
  
  const chartData = wardPriorities.map(w => ({
    name: w.wardName,
    score: w.priorityScore
  }));
  
  return (
    <Card className="bg-white shadow-md rounded-lg border-gray-200">
      <CardHeader className="p-6">
        <CardTitle className="text-2xl text-blue-600 font-bold">Ward Intervention Priority</CardTitle>
      </CardHeader>
      <CardContent className="p-6 pt-0 space-y-6">
        {/* Priority Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold text-gray-700">Rank</TableHead>
                <TableHead className="font-semibold text-gray-700">Ward</TableHead>
                <TableHead className="font-semibold text-gray-700">Outbreak Probability</TableHead>
                <TableHead className="font-semibold text-gray-700">Vulnerability Weight</TableHead>
                <TableHead className="font-semibold text-gray-700">Priority Score</TableHead>
                <TableHead className="font-semibold text-gray-700">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {wardPriorities.map((ward, index) => {
                const isTopThree = index < 3;
                return (
                  <TableRow 
                    key={ward.wardId}
                    className={isTopThree ? 'bg-red-100 border-l-4 border-red-600' : 'hover:bg-gray-50'}
                  >
                    <TableCell className="font-bold">{index + 1}</TableCell>
                    <TableCell className="font-semibold">{ward.wardName}</TableCell>
                    <TableCell>{ward.outbreakProbability.toFixed(1)}%</TableCell>
                    <TableCell>{ward.vulnerabilityWeight.toFixed(1)}x</TableCell>
                    <TableCell className="font-bold text-lg">{ward.priorityScore.toFixed(1)}</TableCell>
                    <TableCell>
                      {isTopThree && (
                        <Badge className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          Immediate Intervention Required
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
        
        {/* Priority Chart */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Priority Score Visualization</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="name" stroke="#6B7280" />
              <YAxis stroke="#6B7280" label={{ value: 'Priority Score', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Bar dataKey="score" radius={[8, 8, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index < 3 ? '#DC2626' : '#2563EB'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Deployment Recommendations */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">Deployment Recommendations</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start gap-2">
              <span className="font-bold text-red-600">•</span>
              <span><strong>Top 3 Wards:</strong> Deploy emergency response teams immediately. Increase surveillance and testing.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-yellow-600">•</span>
              <span><strong>Wards 4-6:</strong> Enhance preventive measures. Monitor daily and prepare resources.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-green-600">•</span>
              <span><strong>Wards 7-9:</strong> Continue routine monitoring. Maintain health awareness programs.</span>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
