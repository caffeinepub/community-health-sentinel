import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Droplet, Hand, AlertOctagon } from 'lucide-react';

export default function PreventiveRecommendations() {
  const recommendations = [
    {
      icon: Droplet,
      text: 'Boil drinking water for at least 5 minutes before consumption'
    },
    {
      icon: Hand,
      text: 'Wash hands frequently with soap and clean water, especially before meals'
    },
    {
      icon: AlertOctagon,
      text: 'Avoid street food and uncooked vegetables during high risk periods'
    },
    {
      icon: Shield,
      text: 'Seek immediate medical attention if experiencing symptoms like diarrhea or fever'
    }
  ];

  return (
    <Card className="bg-white border-medical-border shadow-medical rounded-xl">
      <CardHeader className="p-6">
        <CardTitle className="text-2xl text-medical-slate">Preventive Recommendations</CardTitle>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <div className="space-y-4">
          {recommendations.map((rec, index) => {
            const Icon = rec.icon;
            return (
              <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <Icon className="w-5 h-5 text-medical-blue shrink-0 mt-0.5" />
                <p className="text-medical-slate">{rec.text}</p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
