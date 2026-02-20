import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, AlertTriangle, Cloud, CheckCircle } from 'lucide-react';

interface DistrictRiskOverviewProps {
  currentRisk?: number;
}

export default function DistrictRiskOverview({ currentRisk }: DistrictRiskOverviewProps) {
  const riskIndex = currentRisk ?? 45;
  const highRiskWards = currentRisk ? (currentRisk > 70 ? 3 : currentRisk > 40 ? 1 : 0) : 1;
  const monsoonImpact = currentRisk ? (currentRisk > 60 ? 'High' : currentRisk > 35 ? 'Moderate' : 'Low') : 'Moderate';

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white">District Risk Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* District Risk Index */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-teal-200 flex items-center gap-2">
              <Activity className="w-4 h-4" />
              District Risk Index
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-white">{riskIndex.toFixed(0)}%</div>
            <p className="text-xs text-teal-300 mt-1">Current outbreak probability</p>
          </CardContent>
        </Card>

        {/* Active High-Risk Wards */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-teal-200 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              High-Risk Wards
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-white">{highRiskWards}</div>
            <p className="text-xs text-teal-300 mt-1">Require immediate attention</p>
          </CardContent>
        </Card>

        {/* Monsoon Impact Level */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-teal-200 flex items-center gap-2">
              <Cloud className="w-4 h-4" />
              Monsoon Impact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-white">{monsoonImpact}</div>
            <p className="text-xs text-teal-300 mt-1">Environmental pressure level</p>
          </CardContent>
        </Card>

        {/* System Status */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-teal-200 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge className="bg-green-500/20 text-green-300 border-green-400 text-lg px-3 py-1">
              Operational
            </Badge>
            <p className="text-xs text-teal-300 mt-2">All sensors active</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
