import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronDown, ChevronUp, ArrowDown } from 'lucide-react';

export default function SystemArchitecture() {
  const [isExpanded, setIsExpanded] = useState(false);

  const architectureLayers = [
    'User Dashboard',
    'Analytics Engine',
    'Predictive Model Layer',
    'Cloud Deployment Ready Infrastructure'
  ];

  return (
    <Card className="bg-white border-medical-border shadow-medical rounded-xl">
      <CardHeader 
        className="p-6 cursor-pointer hover:bg-gray-50 transition-colors rounded-t-xl"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl text-medical-slate">System Design & Scalability</CardTitle>
          {isExpanded ? (
            <ChevronUp className="w-6 h-6 text-medical-grey" />
          ) : (
            <ChevronDown className="w-6 h-6 text-medical-grey" />
          )}
        </div>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="p-6 pt-0 space-y-6">
          {/* Architecture Flow Diagram */}
          <div className="flex flex-col items-center space-y-4 py-4">
            {architectureLayers.map((layer, index) => (
              <div key={layer} className="flex flex-col items-center">
                <div className="bg-blue-50 border-2 border-medical-blue rounded-lg px-6 py-4 text-center min-w-[300px]">
                  <p className="text-medical-slate font-semibold">{layer}</p>
                </div>
                {index < architectureLayers.length - 1 && (
                  <ArrowDown className="w-6 h-6 text-medical-blue my-2" />
                )}
              </div>
            ))}
          </div>

          {/* Deployment Note */}
          <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
            <p className="text-medical-slate text-sm leading-relaxed">
              <span className="font-semibold">Deployment Note:</span> Designed for expansion across multiple districts with modular deployment.
            </p>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
