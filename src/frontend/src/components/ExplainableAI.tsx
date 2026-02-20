import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ExplainableAIProps {
  riskPercentage: number;
  inputs: {
    rainfall: number;
    humidity: number;
    turbidity: number;
    bacteriaIndex: number;
  };
}

export default function ExplainableAI({ riskPercentage, inputs }: ExplainableAIProps) {
  // Calculate relative impact of each factor
  const normalizedRainfall = Math.min(inputs.rainfall / 200, 1) * 30;
  const normalizedHumidity = (inputs.humidity / 100) * 20;
  const normalizedTurbidity = Math.min(inputs.turbidity / 50, 1) * 25;
  const normalizedBacteria = Math.min(inputs.bacteriaIndex / 1000, 1) * 25;

  const factors = [
    { name: 'Rainfall Impact', value: normalizedRainfall, color: 'bg-medical-blue' },
    { name: 'Humidity Impact', value: normalizedHumidity, color: 'bg-medical-blue-soft' },
    { name: 'Turbidity Impact', value: normalizedTurbidity, color: 'bg-medical-orange' },
    { name: 'Bacteria Index Impact', value: normalizedBacteria, color: 'bg-medical-red' }
  ];

  return (
    <Card className="bg-white border-medical-border shadow-medical rounded-xl">
      <CardHeader className="p-6">
        <CardTitle className="text-2xl text-medical-slate">Explainable AI – Factor Contribution</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-6 pt-0">
        {/* Factor Impact Chart */}
        <div className="space-y-4">
          {factors.map((factor) => (
            <div key={factor.name} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-medical-grey font-medium">{factor.name}</span>
                <span className="text-medical-slate font-semibold">{factor.value.toFixed(1)}%</span>
              </div>
              <div className="h-6 bg-medical-bg rounded-full overflow-hidden">
                <div
                  className={`h-full ${factor.color} transition-all duration-1000 ease-out`}
                  style={{ width: `${(factor.value / 30) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Explanation Text */}
        <div className="bg-medical-bg rounded-lg p-4 border border-medical-border">
          <p className="text-medical-slate leading-relaxed">
            The outbreak risk is primarily driven by rainfall and bacterial load. Elevated turbidity and humidity further increase disease transmission probability.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
