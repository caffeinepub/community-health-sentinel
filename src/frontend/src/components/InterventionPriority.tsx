import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getAllWardsData } from '@/utils/wardDataGenerator';

interface InterventionPriorityProps {
  overallRisk: number;
}

interface WardPriority {
  wardName: string;
  outbreakProbability: number;
  vulnerabilityWeight: number;
  priorityScore: number;
  priorityRank: number;
}

export default function InterventionPriority({ overallRisk }: InterventionPriorityProps) {
  const wardsData = getAllWardsData();
  const adjustmentFactors = [0.85, 1.15, 0.95, 1.10, 0.90, 1.05, 1.12, 0.88, 1.08];

  const calculatePriorities = (): WardPriority[] => {
    const priorities = wardsData.map((ward, index) => {
      const outbreakProbability = Math.min(100, Math.max(0, overallRisk * adjustmentFactors[index]));
      
      // Calculate vulnerability weight
      let vulnerabilityWeight = 1;
      if (ward.sanitationCoverage < 50) vulnerabilityWeight += 1;
      if (ward.waterTreatmentCoverage < 60) vulnerabilityWeight += 1;
      if (ward.populationDensity > 2000) vulnerabilityWeight += 1;
      
      // Calculate priority score
      const rawScore = outbreakProbability * vulnerabilityWeight;
      
      return {
        wardName: `Ward ${index + 1}`,
        outbreakProbability,
        vulnerabilityWeight,
        priorityScore: rawScore,
        priorityRank: 0
      };
    });

    // Normalize to 0-100 scale
    const maxScore = Math.max(...priorities.map(p => p.priorityScore));
    const minScore = Math.min(...priorities.map(p => p.priorityScore));
    const range = maxScore - minScore || 1;

    priorities.forEach(p => {
      p.priorityScore = ((p.priorityScore - minScore) / range) * 100;
    });

    // Sort by priority score descending and assign ranks
    priorities.sort((a, b) => b.priorityScore - a.priorityScore);
    priorities.forEach((p, index) => {
      p.priorityRank = index + 1;
    });

    return priorities;
  };

  const priorities = calculatePriorities();
  const topPriorities = priorities.slice(0, 3);
  const topWardNames = topPriorities.map(p => p.wardName).join(' and ');

  return (
    <Card className="bg-white border-medical-border shadow-medical rounded-xl">
      <CardHeader className="p-6">
        <CardTitle className="text-2xl text-medical-slate">Intervention Priority</CardTitle>
      </CardHeader>
      <CardContent className="p-6 pt-0 space-y-6">
        {/* Priority Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-medical-slate font-semibold">Ward Name</TableHead>
                <TableHead className="text-medical-slate font-semibold">Outbreak Probability</TableHead>
                <TableHead className="text-medical-slate font-semibold">Vulnerability Weight</TableHead>
                <TableHead className="text-medical-slate font-semibold">Priority Score</TableHead>
                <TableHead className="text-medical-slate font-semibold">Priority Rank</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {priorities.map((priority, index) => (
                <TableRow 
                  key={priority.wardName}
                  className={index < 3 ? 'bg-red-50' : ''}
                >
                  <TableCell className="font-medium text-medical-slate">
                    {priority.wardName}
                    {index < 3 && (
                      <Badge className="ml-2 bg-medical-red text-white">
                        Immediate Intervention Required
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-medical-grey">{priority.outbreakProbability.toFixed(1)}%</TableCell>
                  <TableCell className="text-medical-grey">{priority.vulnerabilityWeight}</TableCell>
                  <TableCell className="text-medical-grey">{priority.priorityScore.toFixed(1)}</TableCell>
                  <TableCell className="text-medical-grey">#{priority.priorityRank}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Bar Chart */}
        <div>
          <h3 className="text-lg font-semibold text-medical-slate mb-4">Priority Score by Ward</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={priorities}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="wardName" stroke="#64748B" tick={{ fill: '#64748B' }} />
              <YAxis stroke="#64748B" tick={{ fill: '#64748B' }} label={{ value: 'Priority Score', angle: -90, position: 'insideLeft', fill: '#64748B' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#FFFFFF', 
                  border: '1px solid #E2E8F0',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                }}
              />
              <Bar dataKey="priorityScore" fill="#2563EB" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recommendation Box */}
        <div className="bg-blue-50 border border-medical-blue rounded-lg p-4">
          <h4 className="font-semibold text-medical-slate mb-2">Deployment Recommendation</h4>
          <p className="text-sm text-medical-grey">
            Deploy chlorination teams to {topWardNames} first. These wards show the highest priority scores based on outbreak probability and vulnerability factors.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
