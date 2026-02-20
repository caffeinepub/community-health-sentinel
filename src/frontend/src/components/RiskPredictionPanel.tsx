import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useActor } from '@/hooks/useActor';
import { Loader2 } from 'lucide-react';
import RiskGauge from './RiskGauge';

interface RiskPredictionPanelProps {
  onPredictionComplete: (data: {
    riskPercentage: number;
    inputs: { rainfall: number; humidity: number; turbidity: number; bacteriaIndex: number };
  }) => void;
}

export default function RiskPredictionPanel({ onPredictionComplete }: RiskPredictionPanelProps) {
  const { actor } = useActor();
  const [rainfall, setRainfall] = useState('');
  const [humidity, setHumidity] = useState('');
  const [turbidity, setTurbidity] = useState('');
  const [bacteriaIndex, setBacteriaIndex] = useState('');
  const [riskResult, setRiskResult] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePredict = async () => {
    if (!actor) {
      setError('Backend connection not available');
      return;
    }

    const rainfallNum = parseFloat(rainfall);
    const humidityNum = parseFloat(humidity);
    const turbidityNum = parseFloat(turbidity);
    const bacteriaNum = parseFloat(bacteriaIndex);

    if (isNaN(rainfallNum) || isNaN(humidityNum) || isNaN(turbidityNum) || isNaN(bacteriaNum)) {
      setError('Please enter valid numbers for all fields');
      return;
    }

    if (humidityNum < 0 || humidityNum > 100) {
      setError('Humidity must be between 0 and 100');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await actor.predictOutbreakRisk(rainfallNum, humidityNum, turbidityNum, bacteriaNum);
      setRiskResult(result.riskPercentage);
      onPredictionComplete({
        riskPercentage: result.riskPercentage,
        inputs: { rainfall: rainfallNum, humidity: humidityNum, turbidity: turbidityNum, bacteriaIndex: bacteriaNum }
      });
    } catch (err) {
      setError('Failed to calculate risk. Please try again.');
      console.error('Prediction error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="text-2xl text-white">Interactive Risk Prediction</CardTitle>
        <CardDescription className="text-teal-200">
          Enter environmental parameters to predict 14-day outbreak risk
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="rainfall" className="text-teal-200">
              Rainfall (mm)
            </Label>
            <Input
              id="rainfall"
              type="number"
              placeholder="0-500"
              value={rainfall}
              onChange={(e) => setRainfall(e.target.value)}
              className="bg-white/10 border-white/30 text-white placeholder:text-white/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="humidity" className="text-teal-200">
              Humidity (%)
            </Label>
            <Input
              id="humidity"
              type="number"
              placeholder="0-100"
              value={humidity}
              onChange={(e) => setHumidity(e.target.value)}
              className="bg-white/10 border-white/30 text-white placeholder:text-white/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="turbidity" className="text-teal-200">
              Turbidity (NTU)
            </Label>
            <Input
              id="turbidity"
              type="number"
              placeholder="0-100"
              value={turbidity}
              onChange={(e) => setTurbidity(e.target.value)}
              className="bg-white/10 border-white/30 text-white placeholder:text-white/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bacteria" className="text-teal-200">
              Bacteria Index
            </Label>
            <Input
              id="bacteria"
              type="number"
              placeholder="0-2000"
              value={bacteriaIndex}
              onChange={(e) => setBacteriaIndex(e.target.value)}
              className="bg-white/10 border-white/30 text-white placeholder:text-white/50"
            />
          </div>
        </div>

        <Button
          onClick={handlePredict}
          disabled={isLoading || !rainfall || !humidity || !turbidity || !bacteriaIndex}
          className="w-full bg-teal-500 hover:bg-teal-600 text-white text-lg py-6"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Calculating Risk...
            </>
          ) : (
            'Predict 14-Day Outbreak Risk'
          )}
        </Button>

        {error && (
          <div className="bg-red-500/20 border border-red-400 text-red-200 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {riskResult !== null && (
          <div className="pt-4">
            <RiskGauge riskPercentage={riskResult} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
