import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Activity, Droplets, AlertTriangle, TrendingUp } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-medical-border bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/assets/generated/health-icon.dim_128x128.png" alt="Health Icon" className="w-10 h-10" />
            <div>
              <h1 className="text-xl font-bold text-medical-slate">Community Health Sentinel</h1>
              <p className="text-xs text-medical-grey">District Health Intelligence System</p>
            </div>
          </div>
          <Button
            onClick={() => navigate({ to: '/dashboard' })}
            variant="outline"
            className="border-medical-blue text-medical-blue hover:bg-medical-blue hover:text-white"
          >
            Launch Dashboard
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-12 md:py-20">
        <div className="relative">
          {/* Background Image Overlay */}
          <div
            className="absolute inset-0 opacity-5 bg-cover bg-center rounded-2xl"
            style={{ backgroundImage: 'url(/assets/generated/hero-bg.dim_1920x800.png)' }}
          />

          {/* Content */}
          <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-6xl font-bold text-medical-slate leading-tight">
                AI-Powered Early Warning System for Water-Borne Diseases
              </h2>
              <p className="text-xl md:text-2xl text-medical-grey font-medium">
                Predict outbreaks 7–14 days in advance using environmental and water quality data.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
              <Button
                onClick={() => navigate({ to: '/dashboard' })}
                size="lg"
                className="bg-medical-blue hover:bg-blue-700 text-white text-lg px-8 py-6 h-auto shadow-medical"
              >
                Launch Dashboard
              </Button>
            </div>

            {/* Feature Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-12">
              <div className="bg-white rounded-xl p-6 border border-medical-border shadow-medical">
                <Activity className="w-10 h-10 text-medical-blue mb-3 mx-auto" />
                <h3 className="text-medical-slate font-semibold mb-2">Real-Time Monitoring</h3>
                <p className="text-medical-grey text-sm">Continuous environmental data analysis</p>
              </div>
              <div className="bg-white rounded-xl p-6 border border-medical-border shadow-medical">
                <Droplets className="w-10 h-10 text-medical-blue mb-3 mx-auto" />
                <h3 className="text-medical-slate font-semibold mb-2">Water Quality Tracking</h3>
                <p className="text-medical-grey text-sm">Turbidity and bacteria monitoring</p>
              </div>
              <div className="bg-white rounded-xl p-6 border border-medical-border shadow-medical">
                <AlertTriangle className="w-10 h-10 text-medical-blue mb-3 mx-auto" />
                <h3 className="text-medical-slate font-semibold mb-2">Automated Alerts</h3>
                <p className="text-medical-grey text-sm">Immediate notifications for high-risk areas</p>
              </div>
              <div className="bg-white rounded-xl p-6 border border-medical-border shadow-medical">
                <TrendingUp className="w-10 h-10 text-medical-blue mb-3 mx-auto" />
                <h3 className="text-medical-slate font-semibold mb-2">Predictive Analytics</h3>
                <p className="text-medical-grey text-sm">AI-powered outbreak forecasting</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-medical-border bg-white mt-20">
        <div className="container mx-auto px-4 py-6 text-center">
          <p className="text-medical-grey text-sm">
            © {new Date().getFullYear()} Community Health Sentinel. Built with love using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                typeof window !== 'undefined' ? window.location.hostname : 'community-health-sentinel'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-medical-blue hover:text-blue-700 underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
