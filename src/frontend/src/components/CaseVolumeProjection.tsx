import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TrendingUp } from 'lucide-react';

interface CaseVolumeProjectionProps {
  riskCategory: 'low' | 'moderate' | 'high';
}

interface ProjectionData {
  day: string;
  cases: number;
}

export default function CaseVolumeProjection({ riskCategory }: CaseVolumeProjectionProps) {
  const generateProjections = (): ProjectionData[] => {
    const baseValues = {
      low: { min: 5, max: 15 },
      moderate: { min: 20, max: 50 },
      high: { min: 60, max: 120 }
    };

    const range = baseValues[riskCategory];
    const projections: ProjectionData[] = [];

    for (let day = 1; day <= 7; day++) {
      const variance = Math.random() * (range.max - range.min) + range.min;
      const trend = day * 2; // Slight upward trend
      const cases = Math.round(variance + trend);
      projections.push({
        day: `Day ${day}`,
        cases
      });
    }

    return projections;
  };

  const projections = generateProjections();

  return (
    <Card className="bg-white border-medical-border shadow-medical rounded-xl">
      <CardHeader className="p-6">
        <CardTitle className="text-2xl text-medical-slate flex items-center gap-3">
          <TrendingUp className="w-8 h-8 text-medical-blue" />
          Expected Case Volume Projection
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 pt-0 space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-medical-slate text-sm">
            <span className="font-semibold">Note:</span> These are simulated estimates based on current risk levels and environmental conditions.
          </p>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-medical-slate font-semibold">Day</TableHead>
              <TableHead className="text-medical-slate font-semibold text-right">Projected Cases</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projections.map((projection) => (
              <TableRow key={projection.day}>
                <TableCell className="text-medical-slate">{projection.day}</TableCell>
                <TableCell className="text-medical-slate text-right font-semibold">{projection.cases}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
