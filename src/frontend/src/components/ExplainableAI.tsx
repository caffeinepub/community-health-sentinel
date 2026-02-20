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
    { name: 'Rainfall Impact', value: normalizedRainfall, color: 'bg-blue-500' },
    { name: 'Humidity Impact', value: normalizedHumidity, color: 'bg-cyan-500' },
    { name: 'Turbidity Impact', value: normalizedTurbidity, color: 'bg-yellow-500' },
    { name: 'Bacteria Index Impact', value: normalizedBacteria, color: 'bg-red-500' }
  ];

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="text-2xl text-white">Explainable AI – Factor Contribution</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Factor Impact Chart */}
        <div className="space-y-4">
          {factors.map((factor) => (
            <div key={factor.name} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-teal-200 font-medium">{factor.name}</span>
                <span className="text-white font-semibold">{factor.value.toFixed(1)}%</span>
              </div>
              <div className="h-6 bg-white/10 rounded-full overflow-hidden">
                <div
                  className={`h-full ${factor.color} transition-all duration-1000 ease-out`}
                  style={{ width: `${(factor.value / 30) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Explanation Text */}
        <div className="bg-white/10 rounded-lg p-4 border border-white/20">
          <p className="text-white leading-relaxed">
            The outbreak risk is primarily driven by rainfall and bacterial load. Elevated turbidity and humidity further increase disease transmission probability.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
