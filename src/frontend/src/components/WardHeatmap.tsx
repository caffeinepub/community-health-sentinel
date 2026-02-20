import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function WardHeatmap() {
  // Generate realistic ward data with varying risk levels
  const wards = [
    { id: 1, name: 'Ward 1 – Central', risk: 72 },
    { id: 2, name: 'Ward 2 – North', risk: 45 },
    { id: 3, name: 'Ward 3 – South', risk: 28 },
    { id: 4, name: 'Ward 4 – East', risk: 65 },
    { id: 5, name: 'Ward 5 – West', risk: 38 },
    { id: 6, name: 'Ward 6 – Northeast', risk: 52 },
    { id: 7, name: 'Ward 7 – Southeast', risk: 18 },
    { id: 8, name: 'Ward 8 – Northwest', risk: 81 }
  ];

  const getRiskColor = (risk: number) => {
    if (risk < 40) return 'bg-green-500/30 border-green-400 text-green-200';
    if (risk < 70) return 'bg-orange-500/30 border-orange-400 text-orange-200';
    return 'bg-red-500/30 border-red-400 text-red-200';
  };

  const getRiskLabel = (risk: number) => {
    if (risk < 40) return 'Low Risk';
    if (risk < 70) return 'Moderate Risk';
    return 'High Risk';
  };

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="text-2xl text-white">Ward Risk Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {wards.map((ward) => (
            <div
              key={ward.id}
              className={`${getRiskColor(
                ward.risk
              )} border-2 rounded-lg p-4 transition-all hover:scale-105 cursor-pointer`}
            >
              <div className="text-sm font-semibold mb-2">{ward.name}</div>
              <div className="text-3xl font-bold mb-1">{ward.risk}%</div>
              <div className="text-xs font-medium">{getRiskLabel(ward.risk)}</div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-6 flex flex-wrap gap-4 justify-center">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded" />
            <span className="text-teal-200 text-sm">Green (&lt;40%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-500 rounded" />
            <span className="text-teal-200 text-sm">Orange (40–70%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded" />
            <span className="text-teal-200 text-sm">Red (&gt;70%)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
