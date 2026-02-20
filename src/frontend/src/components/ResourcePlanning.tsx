import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Package, Bed } from 'lucide-react';

interface ResourcePlanningProps {
  riskCategory: 'low' | 'moderate' | 'high';
}

export default function ResourcePlanning({ riskCategory }: ResourcePlanningProps) {
  const getRecommendations = () => {
    switch (riskCategory) {
      case 'high':
        return {
          staff: 'Full mobilization required. Activate emergency response teams and recall off-duty personnel.',
          supplies: 'Stock emergency medical supplies, ORS packets, IV fluids, and antibiotics. Ensure 2-week buffer stock.',
          beds: 'Prepare additional isolation beds. Set up temporary treatment centers if needed. Coordinate with nearby facilities.'
        };
      case 'moderate':
        return {
          staff: 'Increase staffing levels by 30%. Place standby teams on alert. Schedule additional shifts.',
          supplies: 'Increase supply orders by 50%. Maintain adequate stock of essential medicines and diagnostic kits.',
          beds: 'Prepare 20% additional bed capacity. Ensure isolation wards are ready for immediate use.'
        };
      default:
        return {
          staff: 'Maintain standard staffing levels. Ensure regular training and preparedness drills.',
          supplies: 'Continue routine supply management. Maintain normal inventory levels.',
          beds: 'Standard bed allocation. Regular maintenance and readiness checks.'
        };
    }
  };

  const recommendations = getRecommendations();

  const sections = [
    { icon: Users, title: 'Staff Allocation', content: recommendations.staff, color: 'text-medical-blue' },
    { icon: Package, title: 'Supply Management', content: recommendations.supplies, color: 'text-medical-orange' },
    { icon: Bed, title: 'Bed Capacity', content: recommendations.beds, color: 'text-medical-red' }
  ];

  return (
    <Card className="bg-white border-medical-border shadow-medical rounded-xl">
      <CardHeader className="p-6">
        <CardTitle className="text-2xl text-medical-slate">Resource Planning Suggestions</CardTitle>
      </CardHeader>
      <CardContent className="p-6 pt-0 space-y-4">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <div key={section.title} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Icon className={`w-5 h-5 ${section.color}`} />
                <h3 className="text-medical-slate font-bold">{section.title}</h3>
              </div>
              <p className="text-medical-slate text-sm leading-relaxed">{section.content}</p>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
