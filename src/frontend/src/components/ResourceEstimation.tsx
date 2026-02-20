import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ResourceEstimationProps {
  riskLevel: 'low' | 'moderate' | 'high';
  riskPercentage: number;
}

export default function ResourceEstimation({ riskLevel, riskPercentage }: ResourceEstimationProps) {
  const calculateResources = () => {
    const riskFactor = riskPercentage / 100;
    
    const baseStaff = 20;
    const baseBeds = 30;
    const basePurificationUnits = 5;
    const baseChlorinationTeams = 3;
    
    return [
      {
        resource: 'Medical Staff',
        quantity: Math.round(baseStaff * (1 + riskFactor * 2)),
        unit: 'staff members'
      },
      {
        resource: 'Hospital Beds',
        quantity: Math.round(baseBeds * (1 + riskFactor * 2.5)),
        unit: 'beds'
      },
      {
        resource: 'Water Purification Units',
        quantity: Math.round(basePurificationUnits * (1 + riskFactor * 1.5)) + (riskLevel === 'high' ? 3 : 0),
        unit: 'units'
      },
      {
        resource: 'Chlorination Teams',
        quantity: Math.round(baseChlorinationTeams * (1 + riskFactor * 2)) + (riskLevel === 'high' ? 2 : 0),
        unit: 'teams'
      }
    ];
  };

  const resourceData = calculateResources();

  return (
    <Card className="bg-white border-medical-border shadow-medical rounded-xl">
      <CardHeader className="p-6">
        <CardTitle className="text-2xl text-medical-slate">Resource Requirement Estimation</CardTitle>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={resourceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="resource" stroke="#64748B" tick={{ fill: '#64748B' }} />
            <YAxis stroke="#64748B" tick={{ fill: '#64748B' }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#FFFFFF', 
                border: '1px solid #E2E8F0',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
              }}
              formatter={(value: number, name: string, props: any) => [
                `${value} ${props.payload.unit}`,
                'Required'
              ]}
            />
            <Bar dataKey="quantity" fill="#2563EB" radius={[8, 8, 0, 0]} label={{ position: 'top', fill: '#64748B' }} />
          </BarChart>
        </ResponsiveContainer>
        
        <div className="mt-6 space-y-2">
          {resourceData.map((resource, index) => (
            <div key={index} className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span className="text-medical-slate font-medium">{resource.resource}</span>
              <span className="text-medical-blue font-semibold">
                {resource.quantity} {resource.unit}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
