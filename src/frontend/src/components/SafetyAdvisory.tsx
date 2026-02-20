import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, AlertCircle, CheckCircle } from 'lucide-react';

interface SafetyAdvisoryProps {
  riskCategory: 'low' | 'moderate' | 'high';
}

export default function SafetyAdvisory({ riskCategory }: SafetyAdvisoryProps) {
  const getAdvisoryContent = () => {
    switch (riskCategory) {
      case 'high':
        return {
          icon: AlertTriangle,
          iconColor: 'text-medical-red',
          bgColor: 'bg-red-50',
          borderColor: 'border-medical-red',
          title: 'HIGH RISK ALERT',
          message: 'Urgent precautions are required. Avoid consuming untreated water and maintain strict hygiene practices. Seek immediate medical attention if you experience any symptoms. Follow all public health advisories closely.'
        };
      case 'moderate':
        return {
          icon: AlertCircle,
          iconColor: 'text-medical-orange',
          bgColor: 'bg-orange-50',
          borderColor: 'border-medical-orange',
          title: 'MODERATE RISK ADVISORY',
          message: 'Enhanced preventive measures recommended. Boil drinking water, wash hands frequently, and avoid street food. Monitor your health and report any unusual symptoms to healthcare providers.'
        };
      default:
        return {
          icon: CheckCircle,
          iconColor: 'text-medical-green',
          bgColor: 'bg-green-50',
          borderColor: 'border-medical-green',
          title: 'LOW RISK STATUS',
          message: 'Continue maintaining good hygiene practices. Drink clean water, wash hands regularly, and stay informed about local health updates. General health awareness is recommended.'
        };
    }
  };

  const advisory = getAdvisoryContent();
  const Icon = advisory.icon;

  return (
    <Card className="bg-white border-medical-border shadow-medical rounded-xl">
      <CardHeader className="p-6">
        <CardTitle className="text-2xl text-medical-slate flex items-center gap-3">
          <Icon className={`w-8 h-8 ${advisory.iconColor}`} />
          Safety Advisory
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <div className={`${advisory.bgColor} border ${advisory.borderColor} rounded-lg p-4`}>
          <p className={`${advisory.iconColor} font-bold text-lg mb-3`}>
            {advisory.title}
          </p>
          <p className="text-medical-slate leading-relaxed">
            {advisory.message}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
