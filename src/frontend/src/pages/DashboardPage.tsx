import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import type { UserRole } from '../App';

// Import components
import DistrictRiskOverview from '@/components/DistrictRiskOverview';
import RiskPredictionPanel from '@/components/RiskPredictionPanel';
import RiskGauge from '@/components/RiskGauge';
import AlertEngine from '@/components/AlertEngine';
import WardHeatmap from '@/components/WardHeatmap';
import ExplainableAI from '@/components/ExplainableAI';
import ForecastChart from '@/components/ForecastChart';
import DataFreshnessFooter from '@/components/DataFreshnessFooter';
import RiskComponentBreakdown from '@/components/RiskComponentBreakdown';
import SystemArchitecture from '@/components/SystemArchitecture';
import SafetyAdvisory from '@/components/SafetyAdvisory';
import PreventiveRecommendations from '@/components/PreventiveRecommendations';
import NearestSupportCenter from '@/components/NearestSupportCenter';
import CaseVolumeProjection from '@/components/CaseVolumeProjection';
import ResourcePlanning from '@/components/ResourcePlanning';
import DiseaseClassification from '@/components/DiseaseClassification';
import InterventionPriority from '@/components/InterventionPriority';
import AlertHistory from '@/components/AlertHistory';
import PatientCaseTrend from '@/components/PatientCaseTrend';
import WardComparison from '@/components/WardComparison';
import ResourceEstimation from '@/components/ResourceEstimation';
import WardSelector from '@/components/WardSelector';
import ExportButton from '@/components/ExportButton';
import LastGovernmentReport from '@/components/LastGovernmentReport';
import GovernmentDataPanel from '@/components/GovernmentDataPanel';

interface DashboardPageProps {
  userRole: UserRole;
  onLogout: () => void;
}

export default function DashboardPage({ userRole, onLogout }: DashboardPageProps) {
  const navigate = useNavigate();
  const [riskPercentage, setRiskPercentage] = useState<number>(50);
  const [riskCategory, setRiskCategory] = useState<string>('Low (Green)');
  const [selectedWard, setSelectedWard] = useState<string>('');
  const [inputs, setInputs] = useState({ rainfall: 0, humidity: 0, turbidity: 0, bacteriaIndex: 0 });

  const handlePredictionComplete = (data: {
    riskPercentage: number;
    riskCategory: string;
    inputs: { rainfall: number; humidity: number; turbidity: number; bacteriaIndex: number };
  }) => {
    setRiskPercentage(data.riskPercentage);
    setRiskCategory(data.riskCategory);
    setInputs(data.inputs);
  };

  const handleLogout = () => {
    onLogout();
    navigate({ to: '/' });
  };

  const getRiskCategorySimple = (risk: number): 'low' | 'moderate' | 'high' => {
    if (risk < 30) return 'low';
    if (risk < 70) return 'moderate';
    return 'high';
  };

  const getRiskLevel = (risk: number): 'low' | 'moderate' | 'high' => {
    if (risk < 30) return 'low';
    if (risk < 70) return 'moderate';
    return 'high';
  };

  // Common Citizen View (Read-only)
  if (userRole === 'citizen') {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-blue-600">Public Transparency Dashboard</h1>
              <p className="text-sm text-gray-600">Real-time disease outbreak risk monitoring</p>
            </div>
            <Button onClick={handleLogout} variant="outline" className="flex items-center gap-2">
              <LogOut className="w-4 h-4" />
              Exit
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
          <DistrictRiskOverview />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <WardHeatmap />
            <LastGovernmentReport />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SafetyAdvisory riskCategory={getRiskCategorySimple(riskPercentage)} />
            <PreventiveRecommendations />
          </div>

          <NearestSupportCenter />
          <DataFreshnessFooter />
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 mt-12">
          <div className="max-w-7xl mx-auto px-6 py-6 text-center text-sm text-gray-600">
            <p>
              © {new Date().getFullYear()} | Built with ❤️ using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </footer>
      </div>
    );
  }

  // Hospital/PHC View
  if (userRole === 'healthcare') {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-blue-600">Hospital / PHC Dashboard</h1>
              <p className="text-sm text-gray-600">Ward-specific risk assessment and monitoring</p>
            </div>
            <Button onClick={handleLogout} variant="outline" className="flex items-center gap-2">
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
          <WardSelector selectedWard={selectedWard} onWardChange={setSelectedWard} />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RiskPredictionPanel 
              onPredictionComplete={handlePredictionComplete} 
              userRole={userRole}
              selectedWard={selectedWard}
            />
            <div className="space-y-6">
              <RiskGauge riskPercentage={riskPercentage} />
              <AlertEngine riskPercentage={riskPercentage} />
            </div>
          </div>

          <DiseaseClassification />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CaseVolumeProjection riskCategory={getRiskCategorySimple(riskPercentage)} />
            <ResourcePlanning riskCategory={getRiskCategorySimple(riskPercentage)} />
          </div>

          <ExplainableAI riskPercentage={riskPercentage} inputs={inputs} />
          <DataFreshnessFooter />
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 mt-12">
          <div className="max-w-7xl mx-auto px-6 py-6 text-center text-sm text-gray-600">
            <p>
              © {new Date().getFullYear()} | Built with ❤️ using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </footer>
      </div>
    );
  }

  // Government View
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-blue-600">Government Control Panel</h1>
            <p className="text-sm text-gray-600">District-wide monitoring and intervention management</p>
          </div>
          <Button onClick={handleLogout} variant="outline" className="flex items-center gap-2">
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <Tabs defaultValue="analytics" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="analytics">Analytics Dashboard</TabsTrigger>
            <TabsTrigger value="data-entry">Data Entry</TabsTrigger>
          </TabsList>

          <TabsContent value="analytics" className="space-y-6">
            <DistrictRiskOverview />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <WardHeatmap />
              <LastGovernmentReport />
            </div>

            <DiseaseClassification />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PatientCaseTrend />
              <WardComparison overallRisk={riskPercentage} />
            </div>

            <InterventionPriority />
            <ResourceEstimation riskPercentage={riskPercentage} riskLevel={getRiskLevel(riskPercentage)} />
            <AlertHistory />
            
            <div className="flex justify-center">
              <ExportButton overallRisk={riskPercentage} />
            </div>

            <SystemArchitecture />
            <DataFreshnessFooter />
          </TabsContent>

          <TabsContent value="data-entry" className="space-y-6">
            <GovernmentDataPanel />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-6 text-center text-sm text-gray-600">
          <p>
            © {new Date().getFullYear()} | Built with ❤️ using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
