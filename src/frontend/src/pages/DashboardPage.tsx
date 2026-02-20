import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ArrowLeft } from 'lucide-react';
import type { UserRole } from '../App';
import DistrictRiskOverview from '@/components/DistrictRiskOverview';
import RiskPredictionPanel from '@/components/RiskPredictionPanel';
import ForecastChart from '@/components/ForecastChart';
import AlertEngine from '@/components/AlertEngine';
import WardHeatmap from '@/components/WardHeatmap';
import ExplainableAI from '@/components/ExplainableAI';
import DataFreshnessFooter from '@/components/DataFreshnessFooter';
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
import RiskGauge from '@/components/RiskGauge';
import ExportButton from '@/components/ExportButton';

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

  const getRiskCategory = (risk: number): 'low' | 'moderate' | 'high' => {
    if (risk < 30) return 'low';
    if (risk < 70) return 'moderate';
    return 'high';
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-medical-border bg-white sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/assets/generated/health-icon.dim_128x128.png" alt="Health Icon" className="w-10 h-10" />
              <div>
                <h1 className="text-xl font-bold text-medical-slate">Community Health Sentinel</h1>
                <p className="text-xs text-medical-grey">AI Early Warning System - Coimbatore District</p>
              </div>
            </div>
            <Button
              onClick={() => navigate({ to: '/' })}
              variant="ghost"
              className="text-medical-blue hover:text-medical-blue-soft hover:bg-blue-50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </div>
      </header>

      {/* Main Dashboard Content */}
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Data Freshness Indicator */}
        <DataFreshnessFooter />

        {/* District Risk Overview */}
        <DistrictRiskOverview currentRisk={riskData?.riskPercentage} />

        {/* Role-Based Content */}
        {userRole === 'community' && (
          <>
            {/* Common Citizen View */}
            <RiskPredictionPanel 
              onPredictionComplete={setRiskData} 
              userRole={userRole}
            />
            
            {riskData && (
              <>
                <RiskGauge riskPercentage={riskData.riskPercentage} />
                <DiseaseClassification />
                <SafetyAdvisory riskCategory={getRiskCategory(riskData.riskPercentage)} />
              </>
            )}
            
            <PreventiveRecommendations />
            <NearestSupportCenter />
            <WardHeatmap overallRisk={riskData?.riskPercentage} />
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
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-medical-bg border border-medical-border rounded-lg p-1">
                <TabsTrigger 
                  value="overview"
                  className="data-[state=active]:bg-white data-[state=active]:text-medical-blue data-[state=active]:border-b-2 data-[state=active]:border-medical-blue"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger 
                  value="priority"
                  className="data-[state=active]:bg-white data-[state=active]:text-medical-blue data-[state=active]:border-b-2 data-[state=active]:border-medical-blue"
                >
                  Intervention Priority
                </TabsTrigger>
                <TabsTrigger 
                  value="alerts"
                  className="data-[state=active]:bg-white data-[state=active]:text-medical-blue data-[state=active]:border-b-2 data-[state=active]:border-medical-blue"
                >
                  Alert History
                </TabsTrigger>
                <TabsTrigger 
                  value="analytics"
                  className="data-[state=active]:bg-white data-[state=active]:text-medical-blue data-[state=active]:border-b-2 data-[state=active]:border-medical-blue"
                >
                  Analytics
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-8 mt-8">
                <RiskPredictionPanel 
                  onPredictionComplete={setRiskData} 
                  userRole={userRole}
                />
                {riskData && (
                  <>
                    <RiskGauge riskPercentage={riskData.riskPercentage} />
                    <DiseaseClassification />
                  </>
                )}
                <WardHeatmap overallRisk={riskData?.riskPercentage} />
                {riskData && <AlertEngine riskPercentage={riskData.riskPercentage} />}
              </TabsContent>

              <TabsContent value="priority" className="space-y-8 mt-8">
                <InterventionPriority overallRisk={riskData?.riskPercentage || 50} />
              </TabsContent>

              <TabsContent value="alerts" className="space-y-8 mt-8">
                <AlertHistory />
              </TabsContent>

              <TabsContent value="analytics" className="space-y-8 mt-8">
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
      <footer className="border-t border-medical-border bg-white mt-12">
        <div className="container mx-auto px-4 py-6 text-center">
          <p className="text-medical-grey text-sm">
            © {new Date().getFullYear()} Community Health Sentinel. Built with ❤️ using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                typeof window !== 'undefined' ? window.location.hostname : 'community-health-sentinel'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-medical-blue hover:text-medical-blue-soft underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
