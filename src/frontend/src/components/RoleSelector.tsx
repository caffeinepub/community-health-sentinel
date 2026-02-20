import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Users, Building2, Shield } from 'lucide-react';
import type { UserRole } from '../App';

interface RoleSelectorProps {
  onRoleSelect: (role: UserRole) => void;
}

export default function RoleSelector({ onRoleSelect }: RoleSelectorProps) {
  const roles = [
    {
      id: 'community' as UserRole,
      title: 'Common Citizen',
      description: 'View risk alerts and safety recommendations',
      icon: Users,
      color: 'text-medical-blue'
    },
    {
      id: 'healthcare' as UserRole,
      title: 'Hospital / PHC',
      description: 'Access forecasts and resource planning tools',
      icon: Building2,
      color: 'text-medical-orange'
    },
    {
      id: 'admin' as UserRole,
      title: 'Government Health Authority',
      description: 'Full analytics dashboard and alert controls',
      icon: Shield,
      color: 'text-medical-red'
    }
  ];

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-medical-slate mb-2">Select User Type</h1>
          <p className="text-medical-grey">Choose your role to access the appropriate dashboard view</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <Card
                key={role.id}
                className="bg-white border-medical-border shadow-medical rounded-xl cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105"
                onClick={() => onRoleSelect(role.id)}
              >
                <CardHeader className="p-6 text-center">
                  <div className="flex justify-center mb-4">
                    <div className={`w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center ${role.color}`}>
                      <Icon className="w-8 h-8" />
                    </div>
                  </div>
                  <CardTitle className="text-xl text-medical-slate">{role.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  <CardDescription className="text-center text-medical-grey">
                    {role.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
