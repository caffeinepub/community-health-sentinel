import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useActor } from '@/hooks/useActor';
import { Loader2, Mail, Calculator } from 'lucide-react';
import { sendAlertEmail } from '@/services/EmailAlertService';
import { toast } from 'sonner';

interface EnvironmentalInput {
  timestamp: string;
  rainfall: number;
  humidity: number;
  turbidity: number;
  bacteriaIndex: number;
}

export default function GovernmentDataPanel() {
  const { actor, isFetching } = useActor();
  
  // Form fields
  const [ward, setWard] = useState('');
  const [rainfall, setRainfall] = useState('');
  const [humidity, setHumidity] = useState('');
  const [turbidity, setTurbidity] = useState('');
  const [bacteriaIndex, setBacteriaIndex] = useState('');
  const [sanitationCoverage, setSanitationCoverage] = useState('');
  const [waterTreatmentCoverage, setWaterTreatmentCoverage] = useState('');
  const [populationDensity, setPopulationDensity] = useState('');
  const [reportedCases, setReportedCases] = useState('');
  const [waterSourceType, setWaterSourceType] = useState('');
  const [chlorinationStatus, setChlorinationStatus] = useState(false);
  const [phcCapacity, setPhcCapacity] = useState('');
  const [emergencyResponseStatus, setEmergencyResponseStatus] = useState('');
  
  // 7-day averages
  const [avg7DayRainfall, setAvg7DayRainfall] = useState<number>(0);
  const [avg7DayHumidity, setAvg7DayHumidity] = useState<number>(0);
  
  // Loading states
  const [isCalculating, setIsCalculating] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  
  // Calculate 7-day averages from history
  useEffect(() => {
    const history: EnvironmentalInput[] = JSON.parse(localStorage.getItem('environmental_input_history') || '[]');
    
    if (history.length > 0) {
      const rainfallSum = history.slice(0, 7).reduce((sum, entry) => sum + entry.rainfall, 0);
      const humiditySum = history.slice(0, 7).reduce((sum, entry) => sum + entry.humidity, 0);
      
      setAvg7DayRainfall(rainfallSum / Math.min(history.length, 7));
      setAvg7DayHumidity(humiditySum / Math.min(history.length, 7));
    }
  }, [rainfall, humidity]);
  
  const validateForm = (): boolean => {
    if (!ward) {
      toast.error('Please select a ward');
      return false;
    }
    
    const rainfallNum = parseFloat(rainfall);
    if (isNaN(rainfallNum) || rainfallNum < 0) {
      toast.error('Please enter valid rainfall (≥ 0 mm)');
      return false;
    }
    
    const humidityNum = parseFloat(humidity);
    if (isNaN(humidityNum) || humidityNum < 0 || humidityNum > 100) {
      toast.error('Please enter valid humidity (0-100%)');
      return false;
    }
    
    const turbidityNum = parseFloat(turbidity);
    if (isNaN(turbidityNum) || turbidityNum < 0) {
      toast.error('Please enter valid turbidity (≥ 0 NTU)');
      return false;
    }
    
    const bacteriaNum = parseFloat(bacteriaIndex);
    if (isNaN(bacteriaNum) || bacteriaNum < 0) {
      toast.error('Please enter valid bacteria index (≥ 0)');
      return false;
    }
    
    const sanitationNum = parseFloat(sanitationCoverage);
    if (isNaN(sanitationNum) || sanitationNum < 0 || sanitationNum > 100) {
      toast.error('Please enter valid sanitation coverage (0-100%)');
      return false;
    }
    
    const waterNum = parseFloat(waterTreatmentCoverage);
    if (isNaN(waterNum) || waterNum < 0 || waterNum > 100) {
      toast.error('Please enter valid water treatment coverage (0-100%)');
      return false;
    }
    
    const densityNum = parseFloat(populationDensity);
    if (isNaN(densityNum) || densityNum < 0) {
      toast.error('Please enter valid population density (≥ 0)');
      return false;
    }
    
    const casesNum = parseFloat(reportedCases);
    if (isNaN(casesNum) || casesNum < 0) {
      toast.error('Please enter valid reported cases (≥ 0)');
      return false;
    }
    
    if (!waterSourceType) {
      toast.error('Please select water source type');
      return false;
    }
    
    if (!phcCapacity) {
      toast.error('Please select PHC capacity');
      return false;
    }
    
    if (!emergencyResponseStatus) {
      toast.error('Please select emergency response status');
      return false;
    }
    
    return true;
  };
  
  const calculatePriorityScore = (
    outbreakProbability: number,
    sanitationNum: number,
    waterNum: number,
    densityNum: number
  ): number => {
    let vulnerabilityWeight = 1.0;
    
    if (sanitationNum < 50) vulnerabilityWeight += 1.0;
    if (waterNum < 60) vulnerabilityWeight += 1.0;
    if (densityNum > 2000) vulnerabilityWeight += 1.0;
    
    const rawScore = (outbreakProbability / 100) * vulnerabilityWeight;
    const maxWeight = 4.0;
    const normalizedScore = (rawScore / maxWeight) * 100;
    
    return Math.min(100, normalizedScore);
  };
  
  const getDiseaseClassification = (riskPercentage: number) => {
    if (riskPercentage >= 70) {
      return {
        cholera: 45,
        typhoid: 30,
        dysentery: 15,
        hepatitisA: 10,
        mostLikely: 'Cholera'
      };
    } else if (riskPercentage >= 30) {
      return {
        cholera: 30,
        typhoid: 35,
        dysentery: 20,
        hepatitisA: 15,
        mostLikely: 'Typhoid'
      };
    } else {
      return {
        cholera: 15,
        typhoid: 20,
        dysentery: 35,
        hepatitisA: 30,
        mostLikely: 'Dysentery'
      };
    }
  };
  
  const getRecommendedAction = (riskPercentage: number): string => {
    if (riskPercentage >= 70) {
      return 'Immediate intervention required. Deploy emergency response teams.';
    } else if (riskPercentage >= 30) {
      return 'Monitor closely. Prepare preventive measures.';
    } else {
      return 'Continue routine monitoring and health awareness programs.';
    }
  };
  
  const handleUpdateAndRecalculate = async () => {
    if (!validateForm()) return;
    
    if (!actor) {
      toast.error('Backend connection not available');
      return;
    }
    
    setIsCalculating(true);
    
    try {
      const rainfallNum = parseFloat(rainfall);
      const humidityNum = parseFloat(humidity);
      const turbidityNum = parseFloat(turbidity);
      const bacteriaNum = parseFloat(bacteriaIndex);
      const sanitationNum = parseFloat(sanitationCoverage);
      const waterNum = parseFloat(waterTreatmentCoverage);
      const densityNum = parseFloat(populationDensity);
      const casesNum = parseFloat(reportedCases);
      
      // Call backend to calculate risk
      console.log('Calling backend with:', { rainfallNum, humidityNum, turbidityNum, bacteriaNum });
      const result = await actor.predictOutbreakRisk(rainfallNum, humidityNum, turbidityNum, bacteriaNum);
      console.log('Backend response:', result);
      
      const riskPercentage = result.riskPercentage;
      const riskCategory = result.riskCategory;
      
      // Calculate priority score
      const priorityScore = calculatePriorityScore(riskPercentage, sanitationNum, waterNum, densityNum);
      
      // Get disease classification
      const diseaseClass = getDiseaseClassification(riskPercentage);
      
      // Store input in history for 7-day averages
      const history: EnvironmentalInput[] = JSON.parse(localStorage.getItem('environmental_input_history') || '[]');
      history.unshift({
        timestamp: new Date().toISOString(),
        rainfall: rainfallNum,
        humidity: humidityNum,
        turbidity: turbidityNum,
        bacteriaIndex: bacteriaNum
      });
      localStorage.setItem('environmental_input_history', JSON.stringify(history.slice(0, 7)));
      
      // Store ward-specific data for heatmap calculation
      const wardData = {
        wardId: parseInt(ward),
        sanitationCoverage: sanitationNum,
        waterTreatmentCoverage: waterNum,
        populationDensity: densityNum,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem(`ward_${ward}_data`, JSON.stringify(wardData));
      
      // Update last government report
      localStorage.setItem('last_government_report', JSON.stringify({
        timestamp: new Date().toISOString(),
        ward: `Ward ${ward}`,
        waterQualityIndex: Math.round(100 - riskPercentage),
        bacteriaLevel: bacteriaNum,
        turbidity: turbidityNum,
        rainfall: rainfallNum,
        humidity: humidityNum,
        sanitationCoverage: sanitationNum,
        waterTreatmentCoverage: waterNum,
        riskLevel: riskCategory
      }));
      
      // Determine if email should be sent automatically for high risk
      let emailSent = 'No';
      if (riskPercentage > 70) {
        console.log('High risk detected (>70%), sending automatic alert email...');
        try {
          await sendAlertEmail({
            risk_level: riskCategory,
            risk_percentage: riskPercentage,
            time: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
            rainfall: rainfallNum,
            humidity: humidityNum,
            turbidity: turbidityNum,
            bacteria: bacteriaNum,
            ward: `Ward ${ward}`,
            priority_score: priorityScore
          });
          emailSent = 'Yes';
          console.log('✅ Automatic alert email sent successfully');
          toast.success('Government Alert Sent Successfully', {
            description: `High risk alert email sent for Ward ${ward}`,
            duration: 5000
          });
        } catch (error) {
          console.error('❌ Automatic email send failed:', error);
          toast.error('Email Alert Failed', {
            description: error instanceof Error ? error.message : 'Failed to send email',
            duration: 5000
          });
        }
      }
      
      // Store complete alert record
      const alertRecord = {
        timestamp: new Date().toISOString(),
        ward: `Ward ${ward}`,
        rainfall: rainfallNum,
        humidity: humidityNum,
        turbidity: turbidityNum,
        bacteria: bacteriaNum,
        sanitationCoverage: sanitationNum,
        waterTreatmentCoverage: waterNum,
        riskLevel: riskCategory,
        riskPercentage: riskPercentage,
        diseaseMostLikely: diseaseClass.mostLikely,
        priorityScore: priorityScore,
        emailSent: emailSent,
        recommendedAction: getRecommendedAction(riskPercentage),
        waterSourceType,
        chlorinationStatus: chlorinationStatus ? 'Yes' : 'No',
        phcCapacity,
        emergencyResponseStatus,
        populationDensity: densityNum,
        reportedCases: casesNum
      };
      
      const alerts = JSON.parse(localStorage.getItem('cholera_alerts') || '[]');
      alerts.unshift(alertRecord);
      localStorage.setItem('cholera_alerts', JSON.stringify(alerts.slice(0, 100)));
      
      // Emit custom event for dashboard refresh (including ward data update)
      window.dispatchEvent(new CustomEvent('risk-data-updated', { 
        detail: {
          riskPercentage,
          riskCategory,
          inputs: { rainfall: rainfallNum, humidity: humidityNum, turbidity: turbidityNum, bacteriaIndex: bacteriaNum }
        }
      }));
      
      // Emit ward data update event for WardHeatmap
      window.dispatchEvent(new CustomEvent('wardDataUpdated', {
        detail: wardData
      }));
      
      toast.success('Risk Calculation Complete', {
        description: `Ward ${ward}: ${riskCategory} (${riskPercentage.toFixed(1)}%)`,
        duration: 5000
      });
      
    } catch (error) {
      console.error('Risk calculation error:', error);
      toast.error('Risk Calculation Failed', {
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        duration: 5000
      });
    } finally {
      setIsCalculating(false);
    }
  };
  
  const handleSendAlertManually = async () => {
    if (!ward) {
      toast.error('Please select a ward first', { duration: 5000 });
      return;
    }
    
    setIsSendingEmail(true);
    
    try {
      const rainfallNum = parseFloat(rainfall) || 0;
      const humidityNum = parseFloat(humidity) || 0;
      const turbidityNum = parseFloat(turbidity) || 0;
      const bacteriaNum = parseFloat(bacteriaIndex) || 0;
      const sanitationNum = parseFloat(sanitationCoverage) || 0;
      const waterNum = parseFloat(waterTreatmentCoverage) || 0;
      const densityNum = parseFloat(populationDensity) || 0;
      
      // Get last calculated risk from localStorage
      const lastReport = localStorage.getItem('last_government_report');
      let riskPercentage = 50;
      let riskCategory = 'Medium (Yellow/Amber)';
      let priorityScore = 50;
      
      if (lastReport) {
        const report = JSON.parse(lastReport);
        riskPercentage = 100 - report.waterQualityIndex;
        riskCategory = report.riskLevel;
        priorityScore = calculatePriorityScore(riskPercentage, sanitationNum, waterNum, densityNum);
      }
      
      console.log('Sending manual alert email...');
      await sendAlertEmail({
        risk_level: riskCategory,
        risk_percentage: riskPercentage,
        time: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
        rainfall: rainfallNum,
        humidity: humidityNum,
        turbidity: turbidityNum,
        bacteria: bacteriaNum,
        ward: `Ward ${ward}`,
        priority_score: priorityScore
      });
      
      console.log('✅ Manual alert email sent successfully');
      toast.success('Alert Email Sent Successfully', {
        description: `Manual alert sent for Ward ${ward} at ${new Date().toLocaleTimeString('en-IN')}`,
        duration: 5000
      });
    } catch (error) {
      console.error('❌ Manual email send failed:', error);
      toast.error('Email Alert Failed', {
        description: error instanceof Error ? error.message : 'Failed to send email',
        duration: 5000
      });
    } finally {
      setIsSendingEmail(false);
    }
  };
  
  return (
    <Card className="bg-white shadow-lg rounded-lg border-gray-200">
      <CardHeader className="p-6 bg-blue-600 text-white rounded-t-lg">
        <CardTitle className="text-2xl font-bold">Government Data Update Panel</CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-2 gap-6">
          {/* Ward */}
          <div className="space-y-2">
            <Label htmlFor="ward" className="text-sm font-semibold text-gray-700">Ward <span className="text-red-600">*</span></Label>
            <Select value={ward} onValueChange={setWard}>
              <SelectTrigger id="ward" className="border-gray-300">
                <SelectValue placeholder="Select Ward" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 9 }, (_, i) => i + 1).map((w) => (
                  <SelectItem key={w} value={w.toString()}>Ward {w}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Rainfall */}
          <div className="space-y-2">
            <Label htmlFor="rainfall" className="text-sm font-semibold text-gray-700">Rainfall (mm) <span className="text-red-600">*</span></Label>
            <Input
              id="rainfall"
              type="number"
              min="0"
              step="0.1"
              value={rainfall}
              onChange={(e) => setRainfall(e.target.value)}
              placeholder="e.g., 50.5"
              className="border-gray-300"
            />
            {avg7DayRainfall > 0 && (
              <p className="text-xs text-gray-500">7-day avg: {avg7DayRainfall.toFixed(1)} mm</p>
            )}
          </div>
          
          {/* Humidity */}
          <div className="space-y-2">
            <Label htmlFor="humidity" className="text-sm font-semibold text-gray-700">Humidity (%) <span className="text-red-600">*</span></Label>
            <Input
              id="humidity"
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={humidity}
              onChange={(e) => setHumidity(e.target.value)}
              placeholder="e.g., 75.0"
              className="border-gray-300"
            />
            {avg7DayHumidity > 0 && (
              <p className="text-xs text-gray-500">7-day avg: {avg7DayHumidity.toFixed(1)}%</p>
            )}
          </div>
          
          {/* Turbidity */}
          <div className="space-y-2">
            <Label htmlFor="turbidity" className="text-sm font-semibold text-gray-700">Turbidity (NTU) <span className="text-red-600">*</span></Label>
            <Input
              id="turbidity"
              type="number"
              min="0"
              step="0.1"
              value={turbidity}
              onChange={(e) => setTurbidity(e.target.value)}
              placeholder="e.g., 10.5"
              className="border-gray-300"
            />
          </div>
          
          {/* Bacteria Index */}
          <div className="space-y-2">
            <Label htmlFor="bacteriaIndex" className="text-sm font-semibold text-gray-700">Bacteria Index <span className="text-red-600">*</span></Label>
            <Input
              id="bacteriaIndex"
              type="number"
              min="0"
              step="0.1"
              value={bacteriaIndex}
              onChange={(e) => setBacteriaIndex(e.target.value)}
              placeholder="e.g., 50.0"
              className="border-gray-300"
            />
          </div>
          
          {/* Sanitation Coverage */}
          <div className="space-y-2">
            <Label htmlFor="sanitationCoverage" className="text-sm font-semibold text-gray-700">Sanitation Coverage (%) <span className="text-red-600">*</span></Label>
            <Input
              id="sanitationCoverage"
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={sanitationCoverage}
              onChange={(e) => setSanitationCoverage(e.target.value)}
              placeholder="e.g., 65.0"
              className="border-gray-300"
            />
          </div>
          
          {/* Water Treatment Coverage */}
          <div className="space-y-2">
            <Label htmlFor="waterTreatmentCoverage" className="text-sm font-semibold text-gray-700">Water Treatment Coverage (%) <span className="text-red-600">*</span></Label>
            <Input
              id="waterTreatmentCoverage"
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={waterTreatmentCoverage}
              onChange={(e) => setWaterTreatmentCoverage(e.target.value)}
              placeholder="e.g., 70.0"
              className="border-gray-300"
            />
          </div>
          
          {/* Population Density */}
          <div className="space-y-2">
            <Label htmlFor="populationDensity" className="text-sm font-semibold text-gray-700">Population Density (per km²) <span className="text-red-600">*</span></Label>
            <Input
              id="populationDensity"
              type="number"
              min="0"
              step="1"
              value={populationDensity}
              onChange={(e) => setPopulationDensity(e.target.value)}
              placeholder="e.g., 2500"
              className="border-gray-300"
            />
          </div>
          
          {/* Reported Cases */}
          <div className="space-y-2">
            <Label htmlFor="reportedCases" className="text-sm font-semibold text-gray-700">Reported Cases <span className="text-red-600">*</span></Label>
            <Input
              id="reportedCases"
              type="number"
              min="0"
              step="1"
              value={reportedCases}
              onChange={(e) => setReportedCases(e.target.value)}
              placeholder="e.g., 5"
              className="border-gray-300"
            />
          </div>
          
          {/* Water Source Type */}
          <div className="space-y-2">
            <Label htmlFor="waterSourceType" className="text-sm font-semibold text-gray-700">Water Source Type <span className="text-red-600">*</span></Label>
            <Select value={waterSourceType} onValueChange={setWaterSourceType}>
              <SelectTrigger id="waterSourceType" className="border-gray-300">
                <SelectValue placeholder="Select Water Source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Municipal">Municipal</SelectItem>
                <SelectItem value="Borewell">Borewell</SelectItem>
                <SelectItem value="River">River</SelectItem>
                <SelectItem value="Lake">Lake</SelectItem>
                <SelectItem value="Mixed">Mixed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Chlorination Status */}
          <div className="space-y-2">
            <Label htmlFor="chlorinationStatus" className="text-sm font-semibold text-gray-700">Chlorination Status</Label>
            <div className="flex items-center space-x-3 pt-2">
              <Switch
                id="chlorinationStatus"
                checked={chlorinationStatus}
                onCheckedChange={setChlorinationStatus}
              />
              <span className="text-sm text-gray-600">{chlorinationStatus ? 'Active' : 'Inactive'}</span>
            </div>
          </div>
          
          {/* PHC Capacity */}
          <div className="space-y-2">
            <Label htmlFor="phcCapacity" className="text-sm font-semibold text-gray-700">PHC Capacity <span className="text-red-600">*</span></Label>
            <Select value={phcCapacity} onValueChange={setPhcCapacity}>
              <SelectTrigger id="phcCapacity" className="border-gray-300">
                <SelectValue placeholder="Select PHC Capacity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Low">Low (0-30%)</SelectItem>
                <SelectItem value="Medium">Medium (31-70%)</SelectItem>
                <SelectItem value="High">High (71-100%)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Emergency Response Status */}
          <div className="space-y-2">
            <Label htmlFor="emergencyResponseStatus" className="text-sm font-semibold text-gray-700">Emergency Response Status <span className="text-red-600">*</span></Label>
            <Select value={emergencyResponseStatus} onValueChange={setEmergencyResponseStatus}>
              <SelectTrigger id="emergencyResponseStatus" className="border-gray-300">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Ready">Ready</SelectItem>
                <SelectItem value="Standby">Standby</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Overwhelmed">Overwhelmed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-4 pt-4 border-t border-gray-200">
          <Button
            onClick={handleUpdateAndRecalculate}
            disabled={isCalculating || isFetching}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
          >
            {isCalculating ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Calculating...
              </>
            ) : (
              <>
                <Calculator className="w-5 h-5 mr-2" />
                Update & Recalculate Risk
              </>
            )}
          </Button>
          
          <Button
            onClick={handleSendAlertManually}
            disabled={isSendingEmail || !ward}
            variant="outline"
            className="flex-1 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold py-3 rounded-lg transition-colors"
          >
            {isSendingEmail ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Mail className="w-5 h-5 mr-2" />
                Send Alert Email
              </>
            )}
          </Button>
        </div>
        
        {/* Info Note */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
          <p className="font-semibold mb-1">📧 Email Alert Policy:</p>
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li>Automatic email alerts are sent when risk exceeds 70% (High Risk)</li>
            <li>Use "Send Alert Email" button to manually send alerts for any risk level</li>
            <li>All alerts are logged in the Alert History with email status</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
