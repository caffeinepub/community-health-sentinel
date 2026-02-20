import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Phone, Clock } from 'lucide-react';

export default function NearestSupportCenter() {
  const supportCenter = {
    name: 'Central District Health Center',
    address: '123 Health Avenue, District Central, State 560001',
    phone: '+91 80 2345 6789',
    hours: 'Open 24/7 - Emergency Services Available'
  };

  return (
    <Card className="bg-white border-medical-border shadow-medical rounded-xl">
      <CardHeader className="p-6">
        <CardTitle className="text-2xl text-medical-slate flex items-center gap-3">
          <MapPin className="w-8 h-8 text-medical-blue" />
          Nearest Support Center
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 pt-0 space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
          <div>
            <p className="text-medical-slate font-bold text-lg">{supportCenter.name}</p>
          </div>
          
          <div className="flex items-start gap-2">
            <MapPin className="w-5 h-5 text-medical-blue shrink-0 mt-0.5" />
            <p className="text-medical-slate">{supportCenter.address}</p>
          </div>

          <div className="flex items-center gap-2">
            <Phone className="w-5 h-5 text-medical-blue shrink-0" />
            <p className="text-medical-slate font-semibold">{supportCenter.phone}</p>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-medical-blue shrink-0" />
            <p className="text-medical-slate">{supportCenter.hours}</p>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <p className="text-medical-green text-sm font-medium">
            ✓ Emergency services available for immediate assistance
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
