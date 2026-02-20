interface RiskGaugeProps {
  riskPercentage: number;
}

export default function RiskGauge({ riskPercentage }: RiskGaugeProps) {
  const getRiskColor = (risk: number) => {
    if (risk < 40) return { bg: 'bg-green-500', text: 'text-green-300', border: 'border-green-400' };
    if (risk < 70) return { bg: 'bg-orange-500', text: 'text-orange-300', border: 'border-orange-400' };
    return { bg: 'bg-red-500', text: 'text-red-300', border: 'border-red-400' };
  };

  const getRiskLabel = (risk: number) => {
    if (risk < 40) return 'Low Risk';
    if (risk < 70) return 'Moderate Risk';
    return 'High Risk';
  };

  const colors = getRiskColor(riskPercentage);
  const predictionConfidence = 87;

  return (
    <div className="space-y-4">
      <div className="text-center">
        <div className={`text-6xl font-bold ${colors.text} mb-2`}>{riskPercentage.toFixed(1)}%</div>
        <div className={`text-xl font-semibold ${colors.text}`}>{getRiskLabel(riskPercentage)}</div>
      </div>

      {/* Visual Gauge */}
      <div className="relative h-8 bg-white/10 rounded-full overflow-hidden border border-white/20">
        <div
          className={`h-full ${colors.bg} transition-all duration-1000 ease-out`}
          style={{ width: `${riskPercentage}%` }}
        />
      </div>

      {/* Scale Labels */}
      <div className="flex justify-between text-xs text-teal-200">
        <span>0% (Safe)</span>
        <span>40% (Caution)</span>
        <span>70% (Alert)</span>
        <span>100% (Critical)</span>
      </div>

      {/* Prediction Confidence */}
      <div className="text-center pt-2">
        <span className="text-teal-200 text-sm">Prediction Confidence: </span>
        <span className="text-white font-semibold text-sm">{predictionConfidence}%</span>
      </div>
    </div>
  );
}
