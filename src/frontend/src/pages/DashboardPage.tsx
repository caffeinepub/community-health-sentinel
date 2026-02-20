import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ArrowLeft } from 'lucide-react';
import type { UserRole } from '../App';
import DistrictRiskOverview from '@/components/DistrictRiskOverview';
import RiskPredictionPanel from '@/components/RiskPredictionPanel';
import ForecastChart from '@/components/ForecastChart';
import WardHeatmap from '@/components/WardHeatmap';
import DataFreshnessFooter from '@/components/DataFreshnessFooter';
import SystemArchitecture from '@/components/SystemArchitecture';
import SafetyAdvisory from '@/components/SafetyAdvisory';
import PreventiveRecommendations from '@/components/PreventiveRecommendations';
import DiseaseClassification from '@/components/DiseaseClassification';
import InterventionPriority from '@/components/InterventionPriority';
import AlertHistory from '@/components/AlertHistory';
import PatientCaseTrend from '@/components/PatientCaseTrend';
import WardComparison from '@/components/WardComparison';
import ResourceEstimation from '@/components/ResourceEstimation';
import WardSelector from '@/components/WardSelector';
import RiskGauge from '@/components/RiskGauge';
import ExportButton from '@/components/ExportButton';
import LastGovernmentReport from '@/components/LastGovernmentReport';
import GovernmentDataPanel from '@/components/GovernmentDataPanel';
import CaseVolumeProjection from '@/components/CaseVolumeProjection';
import ResourcePlanning from '@/components/ResourcePlanning';
import ExplainableAI from '@/components/ExplainableAI';

interface DashboardPageProps {
  userRole: UserRole;
}

export default function DashboardPage({ userRole }: DashboardPageProps) {
  const navigate = useNavigate();
  const [riskData, setRiskData] = useState<{
    riskPercentage: number;
    riskCategory: string;
    inputs: { rainfall: number; humidity: number; turbidity: number; bacteriaIndex: number };
  } | null>(null);
  const [selectedWard, setSelectedWard] = useState<string>('');
  const [activeTab, setActiveTab] = useState('overview');

  // Listen for risk data updates from GovernmentDataPanel
  useEffect(() => {
    const handleRiskUpdate = (event: CustomEvent) => {
      setRiskData(event.detail);
    };
    
    window.addEventListener('risk-data-updated', handleRiskUpdate as EventListener);
    
    return () => {
      window.removeEventListener('risk-data-updated', handleRiskUpdate as EventListener);
    };
  }, []);

  const getRiskCategory = (risk: number): 'low' | 'moderate' | 'high' => {
    if (risk < 30) return 'low';
    if (risk < 70) return 'moderate';
    return 'high';
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/assets/generated/health-icon.dim_128x128.png" alt="Health Icon" className="w-10 h-10" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Community Health Sentinel</h1>
                <p className="text-xs text-gray-600">AI Early Warning System - Coimbatore District</p>
              </div>
            </div>
            <Button
              onClick={() => navigate({ to: '/' })}
              variant="ghost"
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </div>
      </header>

      {/* Main Dashboard Content */}
      <main className="container mx-auto px-4 py-8 space-y-6">
        {/* Data Freshness Indicator */}
        <DataFreshnessFooter />

        {/* Role-Based Content */}
        {userRole === 'community' && (
          <>
            {/* Common Citizen View - PUBLIC TRANSPARENCY DASHBOARD */}
            <h1 className="text-3xl font-bold text-blue-600 mb-6">Public Transparency Dashboard</h1>
            
            <LastGovernmentReport />
            
            {riskData && <RiskGauge riskPercentage={riskData.riskPercentage} />}
            
            <DiseaseClassification />
            
            {riskData && <SafetyAdvisory riskCategory={getRiskCategory(riskData.riskPercentage)} />}
            
            <PreventiveRecommendations />
            
            <WardHeatmap overallRisk={riskData?.riskPercentage} />
            
            <AlertHistory />
          </>
        )}

        {userRole === 'healthcare' && (
          <>
            {/* Hospital / PHC View */}
            <WardSelector selectedWard={selectedWard} onWardChange={setSelectedWard} />
            
            {selectedWard && (
              <>
                <RiskPredictionPanel 
                  onPredictionComplete={setRiskData} 
                  userRole={userRole}
                  selectedWard={selectedWard}
                />
                
                {riskData && (
                  <>
                    <RiskGauge riskPercentage={riskData.riskPercentage} />
                    <DiseaseClassification />
                  </>
                )}
                
                <ForecastChart />
                <PatientCaseTrend />
                
                {riskData && (
                  <>
                    <CaseVolumeProjection riskCategory={getRiskCategory(riskData.riskPercentage)} />
                    <ResourcePlanning riskCategory={getRiskCategory(riskData.riskPercentage)} />
                  </>
                )}
                
                <AlertHistory filterWard={selectedWard} />
              </>
            )}
          </>
        )}

        {userRole === 'admin' && (
          <>
            {/* Government Dashboard with Tabs */}
            <GovernmentDataPanel />
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-gray-100 border border-gray-200 rounded-lg p-1">
                <TabsTrigger 
                  value="overview"
                  className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger 
                  value="priority"
                  className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600"
                >
                  Intervention Priority
                </TabsTrigger>
                <TabsTrigger 
                  value="alerts"
                  className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600"
                >
                  Alert History
                </TabsTrigger>
                <TabsTrigger 
                  value="analytics"
                  className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600"
                >
                  Analytics
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6 mt-6">
                <DistrictRiskOverview currentRisk={riskData?.riskPercentage} />
                {riskData && (
                  <>
                    <RiskGauge riskPercentage={riskData.riskPercentage} />
                    <DiseaseClassification />
                  </>
                )}
                <WardHeatmap overallRisk={riskData?.riskPercentage} />
              </TabsContent>

              <TabsContent value="priority" className="space-y-6 mt-6">
                <InterventionPriority overallRisk={riskData?.riskPercentage || 50} />
              </TabsContent>

              <TabsContent value="alerts" className="space-y-6 mt-6">
                <AlertHistory />
              </TabsContent>

              <TabsContent value="analytics" className="space-y-6 mt-6">
                <ForecastChart />
                <PatientCaseTrend />
                <WardComparison overallRisk={riskData?.riskPercentage || 50} />
                {riskData && (
                  <>
                    <ResourceEstimation 
                      riskLevel={getRiskCategory(riskData.riskPercentage)} 
                      riskPercentage={riskData.riskPercentage} 
                    />
                    <ExplainableAI riskPercentage={riskData.riskPercentage} inputs={riskData.inputs} />
                  </>
                )}
                <ExportButton overallRisk={riskData?.riskPercentage || 50} />
              </TabsContent>
            </Tabs>
          </>
        )}

        {/* System Architecture - Available to all roles */}
        <SystemArchitecture />
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white mt-12">
        <div className="container mx-auto px-4 py-6 text-center">
          <p className="text-gray-600 text-sm">
            © {new Date().getFullYear()} Community Health Sentinel. Built with ❤️ using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                typeof window !== 'undefined' ? window.location.hostname : 'community-health-sentinel'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
