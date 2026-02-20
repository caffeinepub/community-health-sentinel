import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';

interface AlertEngineProps {
  riskPercentage: number;
}

export default function AlertEngine({ riskPercentage }: AlertEngineProps) {
  const getAlertLevel = (): 'low' | 'moderate' | 'high' => {
    if (riskPercentage < 30) return 'low';
    if (riskPercentage < 70) return 'moderate';
    return 'high';
  };

  const alertLevel = getAlertLevel();

  const alertConfig = {
    low: {
      icon: CheckCircle,
      bgColor: 'bg-green-50',
      borderColor: 'border-medical-green',
      textColor: 'text-medical-green',
      title: 'Low Risk - Routine Monitoring',
      message: 'Current conditions indicate low outbreak risk. Continue standard monitoring protocols.',
      actions: [
        'Maintain regular water quality testing',
        'Continue public health awareness campaigns',
        'Monitor environmental parameters daily'
      ]
    },
    moderate: {
      icon: AlertCircle,
      bgColor: 'bg-yellow-50',
      borderColor: 'border-medical-orange',
      textColor: 'text-medical-orange',
      title: 'Moderate Risk - Enhanced Vigilance',
      message: 'Elevated risk detected. Implement preventive measures and increase monitoring frequency.',
      actions: [
        'Increase water quality testing frequency',
        'Deploy mobile health units to high-risk areas',
        'Distribute water purification tablets',
        'Issue public health advisories'
      ]
    },
    high: {
      icon: AlertTriangle,
      bgColor: 'bg-red-50',
      borderColor: 'border-medical-red',
      textColor: 'text-medical-red',
      title: 'High Risk - Immediate Action Required',
      message: 'Critical outbreak risk detected. Activate emergency response protocols immediately.',
      actions: [
        'Activate emergency response teams',
        'Deploy chlorination units to affected areas',
        'Set up temporary health screening camps',
        'Issue urgent public health warnings',
        'Coordinate with district health authorities',
        'Prepare isolation facilities'
      ]
    }
  };

  const config = alertConfig[alertLevel];
  const Icon = config.icon;

  return (
    <Card className={`${config.bgColor} border-2 ${config.borderColor} shadow-medical rounded-xl`}>
      <CardHeader className="p-6">
        <div className="flex items-center gap-3">
          <Icon className={`w-8 h-8 ${config.textColor}`} />
          <CardTitle className={`text-2xl ${config.textColor}`}>{config.title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-6 pt-0 space-y-4">
        <p className="text-medical-slate font-medium">{config.message}</p>
        
        <div>
          <h4 className="font-semibold text-medical-slate mb-2">Recommended Actions:</h4>
          <ul className="space-y-2">
            {config.actions.map((action, index) => (
              <li key={index} className="flex items-start gap-2 text-medical-grey">
                <span className={`${config.textColor} mt-1`}>•</span>
                <span>{action}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
