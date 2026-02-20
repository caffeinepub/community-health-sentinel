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
      <h2 className="text-2xl font-bold text-medical-slate">District Risk Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* District Risk Index */}
        <Card className="bg-white border-medical-border shadow-medical rounded-xl">
          <CardHeader className="pb-3 p-6">
            <CardTitle className="text-sm font-medium text-medical-grey flex items-center gap-2">
              <Activity className="w-4 h-4" />
              District Risk Index
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="text-4xl font-bold text-medical-slate">{riskIndex.toFixed(0)}%</div>
            <p className="text-xs text-medical-grey mt-1">Current outbreak probability</p>
          </CardContent>
        </Card>

        {/* Active High-Risk Wards */}
        <Card className="bg-white border-medical-border shadow-medical rounded-xl">
          <CardHeader className="pb-3 p-6">
            <CardTitle className="text-sm font-medium text-medical-grey flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              High-Risk Wards
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="text-4xl font-bold text-medical-slate">{highRiskWards}</div>
            <p className="text-xs text-medical-grey mt-1">Require immediate attention</p>
          </CardContent>
        </Card>

        {/* Monsoon Impact Level */}
        <Card className="bg-white border-medical-border shadow-medical rounded-xl">
          <CardHeader className="pb-3 p-6">
            <CardTitle className="text-sm font-medium text-medical-grey flex items-center gap-2">
              <Cloud className="w-4 h-4" />
              Monsoon Impact
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="text-4xl font-bold text-medical-slate">{monsoonImpact}</div>
            <p className="text-xs text-medical-grey mt-1">Environmental pressure level</p>
          </CardContent>
        </Card>

        {/* System Status */}
        <Card className="bg-white border-medical-border shadow-medical rounded-xl">
          <CardHeader className="pb-3 p-6">
            <CardTitle className="text-sm font-medium text-medical-grey flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <Badge className="bg-green-50 text-medical-green border-medical-green text-lg px-3 py-1">
              Operational
            </Badge>
            <p className="text-xs text-medical-grey mt-2">All sensors active</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
