import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import DistrictRiskOverview from '@/components/DistrictRiskOverview';
import RiskPredictionPanel from '@/components/RiskPredictionPanel';
import ForecastChart from '@/components/ForecastChart';
import AlertEngine from '@/components/AlertEngine';
import WardHeatmap from '@/components/WardHeatmap';
import ExplainableAI from '@/components/ExplainableAI';
import DataFreshnessFooter from '@/components/DataFreshnessFooter';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [riskData, setRiskData] = useState<{
    riskPercentage: number;
    inputs: { rainfall: number; humidity: number; turbidity: number; bacteriaIndex: number };
  } | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gov-dark via-gov-primary to-gov-teal/20">
      {/* Header */}
      <header className="border-b border-white/10 bg-gov-dark/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/assets/generated/health-icon.dim_128x128.png" alt="Health Icon" className="w-10 h-10" />
              <div>
                <h1 className="text-xl font-bold text-white">Community Health Sentinel</h1>
                <p className="text-xs text-teal-300">District Health Intelligence Dashboard</p>
              </div>
            </div>
            <Button
              onClick={() => navigate({ to: '/' })}
              variant="ghost"
              className="text-teal-400 hover:text-teal-300 hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </div>
      </header>

      {/* Main Dashboard Content */}
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* District Risk Overview */}
        <DistrictRiskOverview currentRisk={riskData?.riskPercentage} />

        {/* Risk Prediction Panel (includes Real-Time Risk Analysis with enhanced gauge) */}
        <RiskPredictionPanel onPredictionComplete={setRiskData} />

        {/* 14-Day Predictive Forecast */}
        <ForecastChart />

        {/* Automated Response Recommendation (Alert Engine) */}
        {riskData && <AlertEngine riskPercentage={riskData.riskPercentage} />}

        {/* Ward Risk Distribution */}
        <WardHeatmap />

        {/* Explainable AI – Factor Contribution */}
        {riskData && <ExplainableAI riskPercentage={riskData.riskPercentage} inputs={riskData.inputs} />}

        {/* Data Freshness Footer */}
        <DataFreshnessFooter />
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-gov-dark/80 backdrop-blur-sm mt-12">
        <div className="container mx-auto px-4 py-6 text-center">
          <p className="text-teal-200 text-sm">
            © {new Date().getFullYear()} Community Health Sentinel. Built with love using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                typeof window !== 'undefined' ? window.location.hostname : 'community-health-sentinel'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-400 hover:text-teal-300 underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
