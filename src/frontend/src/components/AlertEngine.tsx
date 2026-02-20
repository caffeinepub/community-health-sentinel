import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, AlertCircle, CheckCircle } from 'lucide-react';

interface AlertEngineProps {
  riskPercentage: number;
}

export default function AlertEngine({ riskPercentage }: AlertEngineProps) {
  if (riskPercentage >= 70) {
    return (
      <Card className="bg-red-500/20 backdrop-blur-sm border-red-400 border-2">
        <CardHeader>
          <CardTitle className="text-2xl text-red-200 flex items-center gap-3">
            <AlertTriangle className="w-8 h-8" />
            Automated Response Recommendation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-red-500/40 rounded-lg p-4 border border-red-400">
            <p className="text-red-100 text-lg font-bold mb-3">
              HIGH RISK DETECTED – Immediate Action Required
            </p>
            <div className="space-y-3">
              <h3 className="text-red-100 font-bold">Recommended Actions:</h3>
              <ul className="space-y-2 text-red-100">
                <li className="flex items-start gap-2">
                  <span className="text-red-300 font-bold">•</span>
                  <span>Conduct emergency water testing</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-300 font-bold">•</span>
                  <span>Initiate chlorination protocols</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-300 font-bold">•</span>
                  <span>Issue public advisory</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-300 font-bold">•</span>
                  <span>Mobilize PHC response teams</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (riskPercentage >= 40) {
    return (
      <Card className="bg-orange-500/20 backdrop-blur-sm border-orange-400 border-2">
        <CardHeader>
          <CardTitle className="text-2xl text-orange-200 flex items-center gap-3">
            <AlertCircle className="w-8 h-8" />
            Automated Response Recommendation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-orange-500/40 rounded-lg p-4 border border-orange-400">
            <p className="text-orange-100 text-lg font-bold mb-3">
              MODERATE RISK – Enhanced Monitoring Required
            </p>
            <div className="space-y-3">
              <h3 className="text-orange-100 font-bold">Recommended Actions:</h3>
              <ul className="space-y-2 text-orange-100">
                <li className="flex items-start gap-2">
                  <span className="text-orange-300 font-bold">•</span>
                  <span>Increase frequency of water quality monitoring</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-300 font-bold">•</span>
                  <span>Review and update emergency response protocols</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-300 font-bold">•</span>
                  <span>Conduct community awareness programs</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-green-500/20 backdrop-blur-sm border-green-400 border-2">
      <CardHeader>
        <CardTitle className="text-2xl text-green-200 flex items-center gap-3">
          <CheckCircle className="w-8 h-8" />
          Automated Response Recommendation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-green-500/40 rounded-lg p-4 border border-green-400">
          <p className="text-green-100 text-lg font-bold mb-3">
            LOW RISK – Normal Operations
          </p>
          <div className="space-y-3">
            <h3 className="text-green-100 font-bold">Recommended Actions:</h3>
            <ul className="space-y-2 text-green-100">
              <li className="flex items-start gap-2">
                <span className="text-green-300 font-bold">•</span>
                <span>Maintain regular water quality testing schedule</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-300 font-bold">•</span>
                <span>Continue routine sanitation and hygiene programs</span>
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
