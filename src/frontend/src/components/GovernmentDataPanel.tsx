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
  
  const parseCanisterError = (error: any): { title: string; description: string } => {
    const errorString = error?.toString() || '';
    const errorMessage = error?.message || errorString;
    
    console.error('[GovernmentDataPanel] Full error object:', error);
    console.error('[GovernmentDataPanel] Error string:', errorString);
    console.error('[GovernmentDataPanel] Error message:', errorMessage);
    
    // Check for IC0508 canister stopped error
    if (errorString.includes('IC0508') || errorMessage.includes('IC0508')) {
      return {
        title: 'Backend Service Unavailable',
        description: 'The backend canister is currently stopped. Please contact the system administrator to restart the canister using "dfx canister start backend".'
      };
    }
    
    // Check for canister stopped in body
    if (errorString.includes('is stopped') || errorMessage.includes('is stopped')) {
      return {
        title: 'Backend Service Stopped',
        description: 'The backend service is not running. Please restart the canister to continue.'
      };
    }
    
    // Check for reject_code 5 (canister error)
    if (errorString.includes('reject_code 5') || errorString.includes('reject code 5')) {
      return {
        title: 'Canister Execution Error',
        description: 'The backend canister encountered an error during execution. Please check the canister logs.'
      };
    }
    
    // Check for network/connection errors
    if (errorString.includes('fetch') || errorString.includes('network') || errorMessage.includes('Failed to fetch')) {
      return {
        title: 'Network Connection Error',
        description: 'Unable to connect to the backend service. Please check your internet connection and try again.'
      };
    }
    
    // Check for authentication errors
    if (errorString.includes('Unauthorized') || errorString.includes('authentication')) {
      return {
        title: 'Authentication Error',
        description: 'You are not authorized to perform this action. Please log in again.'
      };
    }
    
    // Check for validation errors
    if (errorString.includes('Invalid') || errorString.includes('validation')) {
      return {
        title: 'Invalid Input Parameters',
        description: 'One or more input parameters are invalid. Please check your values and try again.'
      };
    }
    
    // Generic error
    return {
      title: 'Risk Calculation Failed',
      description: errorMessage || 'An unexpected error occurred. Please try again or contact support.'
    };
  };
  
  const handleUpdateAndRecalculate = async () => {
    if (!validateForm()) return;
    
    if (!actor) {
      toast.error('Backend Connection Not Available', {
        description: 'The backend actor is not initialized. Please refresh the page and try again.',
        duration: 5000
      });
      return;
    }
    
    if (isFetching) {
      toast.error('Backend Initializing', {
        description: 'Please wait for the backend connection to complete initialization.',
        duration: 5000
      });
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
      const wardId = parseInt(ward);
      
      console.log(`[GovernmentDataPanel] Starting risk update for ward ${wardId}`);
      console.log('[GovernmentDataPanel] Selected ward number:', wardId);
      
      // Call backend to calculate and persist risk
      console.log('[GovernmentDataPanel] Calling backend calculateAndPersistRisk with:', { 
        wardKey: wardId,
        rainfall: rainfallNum, 
        humidity: humidityNum, 
        turbidity: turbidityNum, 
        bacteriaIndex: bacteriaNum
      });
      
      const result = await actor.calculateAndPersistRisk(
        BigInt(wardId),
        rainfallNum,
        humidityNum,
        turbidityNum,
        bacteriaNum
      );
      
      console.log('[GovernmentDataPanel] Backend response received:', result);
      
      // Validate backend response
      if (!result) {
        throw new Error('Backend returned null response. Ward key may be out of range (1-9).');
      }
      
      const riskPercentage = result.riskPercentage;
      const riskCategory = result.riskCategory;
      
      console.log('[GovernmentDataPanel] Risk calculation successful:', { riskPercentage, riskCategory });
      
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
      
      // Store complete ward-specific data with risk prediction for heatmap
      const wardData = {
        wardId: wardId,
        rainfall: rainfallNum,
        humidity: humidityNum,
        turbidity: turbidityNum,
        bacteriaIndex: bacteriaNum,
        sanitationCoverage: sanitationNum,
        waterTreatmentCoverage: waterNum,
        populationDensity: densityNum,
        riskPrediction: {
          riskPercentage: riskPercentage,
          riskCategory: riskCategory
        },
        timestamp: new Date().toISOString()
      };
      
      const storageKey = `ward_${wardId}_data`;
      console.log(`[GovernmentDataPanel] Writing to localStorage key: ${storageKey}`);
      console.log('[GovernmentDataPanel] Complete data object being saved:', wardData);
      localStorage.setItem(storageKey, JSON.stringify(wardData));
      console.log('[GovernmentDataPanel] localStorage write complete');
      
      // Update last government report
      localStorage.setItem('last_government_report', JSON.stringify({
        timestamp: new Date().toISOString(),
        ward: `Ward ${wardId}`,
        waterQualityIndex: Math.round(100 - riskPercentage),
        bacteriaLevel: bacteriaNum,
        turbidity: turbidityNum,
        rainfall: rainfallNum,
        humidity: humidityNum,
        sanitationCoverage: sanitationNum,
        waterTreatmentCoverage: waterNum,
        riskLevel: riskCategory
      }));
      
      // Dispatch disease-classification-updated event with environmental parameters
      console.log('[GovernmentDataPanel] Dispatching disease-classification-updated event');
      window.dispatchEvent(new CustomEvent('disease-classification-updated', {
        detail: {
          rainfall: rainfallNum,
          humidity: humidityNum,
          turbidity: turbidityNum,
          bacteriaIndex: bacteriaNum
        }
      }));
      
      // Determine if email should be sent automatically for high risk
      const shouldSendEmail = riskPercentage >= 70;
      
      // Store alert in history
      const alert = {
        timestamp: new Date().toISOString(),
        ward: `Ward ${wardId}`,
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
        emailSent: shouldSendEmail ? 'Yes' : 'No',
        recommendedAction: getRecommendedAction(riskPercentage),
        populationDensity: densityNum,
        reportedCases: casesNum
      };
      
      const existingAlerts = JSON.parse(localStorage.getItem('cholera_alerts') || '[]');
      existingAlerts.unshift(alert);
      localStorage.setItem('cholera_alerts', JSON.stringify(existingAlerts.slice(0, 100)));
      
      // Dispatch events for other components
      console.log('[GovernmentDataPanel] Dispatching ward-data-updated event for ward:', wardId);
      window.dispatchEvent(new CustomEvent('ward-data-updated', {
        detail: { wardId, riskPercentage, riskCategory }
      }));
      
      window.dispatchEvent(new CustomEvent('risk-data-updated', {
        detail: { riskPercentage, riskCategory }
      }));
      
      // Send email if high risk
      if (shouldSendEmail) {
        setIsSendingEmail(true);
        try {
          await sendAlertEmail({
            ward: `Ward ${wardId}`,
            risk_level: riskCategory,
            risk_percentage: riskPercentage,
            rainfall: rainfallNum,
            humidity: humidityNum,
            turbidity: turbidityNum,
            bacteria: bacteriaNum,
            time: new Date().toLocaleString('en-IN', {
              timeZone: 'Asia/Kolkata',
              dateStyle: 'medium',
              timeStyle: 'medium'
            }),
            priority_score: priorityScore
          });
          
          toast.success('High Risk Alert Sent', {
            description: `Email notification sent for Ward ${wardId} (${riskPercentage.toFixed(1)}% risk)`,
            duration: 5000
          });
        } catch (emailError) {
          console.error('[GovernmentDataPanel] Email send failed:', emailError);
          toast.error('Email Alert Failed', {
            description: 'Risk data saved but email notification could not be sent.',
            duration: 5000
          });
        } finally {
          setIsSendingEmail(false);
        }
      }
      
      toast.success('Risk Data Updated Successfully', {
        description: `Ward ${wardId}: ${riskCategory} (${riskPercentage.toFixed(1)}%)`,
        duration: 5000
      });
      
    } catch (error) {
      console.error('[GovernmentDataPanel] Risk calculation error:', error);
      const { title, description } = parseCanisterError(error);
      toast.error(title, {
        description,
        duration: 7000
      });
    } finally {
      setIsCalculating(false);
    }
  };
  
  return (
    <Card className="bg-white border-medical-border shadow-medical rounded-xl">
      <CardHeader className="p-6 bg-medical-blue text-white rounded-t-xl">
        <CardTitle className="text-2xl">Government Data Entry & Risk Calculation</CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Ward Selection */}
        <div className="space-y-2">
          <Label htmlFor="ward" className="text-sm font-semibold text-medical-slate">
            Select Ward <span className="text-medical-red">*</span>
          </Label>
          <Select value={ward} onValueChange={setWard}>
            <SelectTrigger id="ward" className="border-medical-border">
              <SelectValue placeholder="Choose ward..." />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((w) => (
                <SelectItem key={w} value={w.toString()}>
                  Ward {w}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Environmental Parameters */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="rainfall" className="text-sm font-semibold text-medical-slate">
              Rainfall (mm) <span className="text-medical-red">*</span>
            </Label>
            <Input
              id="rainfall"
              type="number"
              step="0.1"
              value={rainfall}
              onChange={(e) => setRainfall(e.target.value)}
              placeholder="0.0"
              className="border-medical-border"
            />
            {avg7DayRainfall > 0 && (
              <p className="text-xs text-medical-grey">7-day avg: {avg7DayRainfall.toFixed(1)} mm</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="humidity" className="text-sm font-semibold text-medical-slate">
              Humidity (%) <span className="text-medical-red">*</span>
            </Label>
            <Input
              id="humidity"
              type="number"
              step="0.1"
              value={humidity}
              onChange={(e) => setHumidity(e.target.value)}
              placeholder="0-100"
              className="border-medical-border"
            />
            {avg7DayHumidity > 0 && (
              <p className="text-xs text-medical-grey">7-day avg: {avg7DayHumidity.toFixed(1)}%</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="turbidity" className="text-sm font-semibold text-medical-slate">
              Turbidity (NTU) <span className="text-medical-red">*</span>
            </Label>
            <Input
              id="turbidity"
              type="number"
              step="0.1"
              value={turbidity}
              onChange={(e) => setTurbidity(e.target.value)}
              placeholder="0.0"
              className="border-medical-border"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bacteriaIndex" className="text-sm font-semibold text-medical-slate">
              Bacteria Index <span className="text-medical-red">*</span>
            </Label>
            <Input
              id="bacteriaIndex"
              type="number"
              step="0.1"
              value={bacteriaIndex}
              onChange={(e) => setBacteriaIndex(e.target.value)}
              placeholder="0.0"
              className="border-medical-border"
            />
          </div>
        </div>

        {/* Infrastructure & Health Data */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="sanitationCoverage" className="text-sm font-semibold text-medical-slate">
              Sanitation Coverage (%) <span className="text-medical-red">*</span>
            </Label>
            <Input
              id="sanitationCoverage"
              type="number"
              step="0.1"
              value={sanitationCoverage}
              onChange={(e) => setSanitationCoverage(e.target.value)}
              placeholder="0-100"
              className="border-medical-border"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="waterTreatmentCoverage" className="text-sm font-semibold text-medical-slate">
              Water Treatment Coverage (%) <span className="text-medical-red">*</span>
            </Label>
            <Input
              id="waterTreatmentCoverage"
              type="number"
              step="0.1"
              value={waterTreatmentCoverage}
              onChange={(e) => setWaterTreatmentCoverage(e.target.value)}
              placeholder="0-100"
              className="border-medical-border"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="populationDensity" className="text-sm font-semibold text-medical-slate">
              Population Density <span className="text-medical-red">*</span>
            </Label>
            <Input
              id="populationDensity"
              type="number"
              value={populationDensity}
              onChange={(e) => setPopulationDensity(e.target.value)}
              placeholder="per sq km"
              className="border-medical-border"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reportedCases" className="text-sm font-semibold text-medical-slate">
              Reported Cases (7-day) <span className="text-medical-red">*</span>
            </Label>
            <Input
              id="reportedCases"
              type="number"
              value={reportedCases}
              onChange={(e) => setReportedCases(e.target.value)}
              placeholder="0"
              className="border-medical-border"
            />
          </div>
        </div>

        {/* Water Source & Infrastructure */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="waterSourceType" className="text-sm font-semibold text-medical-slate">
              Water Source Type <span className="text-medical-red">*</span>
            </Label>
            <Select value={waterSourceType} onValueChange={setWaterSourceType}>
              <SelectTrigger id="waterSourceType" className="border-medical-border">
                <SelectValue placeholder="Select source..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="municipal">Municipal Supply</SelectItem>
                <SelectItem value="borewell">Borewell</SelectItem>
                <SelectItem value="river">River/Stream</SelectItem>
                <SelectItem value="well">Open Well</SelectItem>
                <SelectItem value="tanker">Water Tanker</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phcCapacity" className="text-sm font-semibold text-medical-slate">
              PHC Capacity <span className="text-medical-red">*</span>
            </Label>
            <Select value={phcCapacity} onValueChange={setPhcCapacity}>
              <SelectTrigger id="phcCapacity" className="border-medical-border">
                <SelectValue placeholder="Select capacity..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="adequate">Adequate</SelectItem>
                <SelectItem value="moderate">Moderate</SelectItem>
                <SelectItem value="limited">Limited</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Chlorination & Emergency Response */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="chlorinationStatus" className="text-sm font-semibold text-medical-slate">
              Chlorination Active
            </Label>
            <div className="flex items-center space-x-2 pt-2">
              <Switch
                id="chlorinationStatus"
                checked={chlorinationStatus}
                onCheckedChange={setChlorinationStatus}
              />
              <span className="text-sm text-medical-grey">
                {chlorinationStatus ? 'Yes' : 'No'}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="emergencyResponseStatus" className="text-sm font-semibold text-medical-slate">
              Emergency Response Status <span className="text-medical-red">*</span>
            </Label>
            <Select value={emergencyResponseStatus} onValueChange={setEmergencyResponseStatus}>
              <SelectTrigger id="emergencyResponseStatus" className="border-medical-border">
                <SelectValue placeholder="Select status..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ready">Ready</SelectItem>
                <SelectItem value="standby">Standby</SelectItem>
                <SelectItem value="deployed">Deployed</SelectItem>
                <SelectItem value="unavailable">Unavailable</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4">
          <Button
            onClick={handleUpdateAndRecalculate}
            disabled={isCalculating || isSendingEmail || isFetching}
            className="flex-1 bg-medical-blue hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
          >
            {isCalculating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Calculating Risk...
              </>
            ) : isSendingEmail ? (
              <>
                <Mail className="w-4 h-4 mr-2" />
                Sending Alert...
              </>
            ) : (
              <>
                <Calculator className="w-4 h-4 mr-2" />
                Update & Calculate Risk
              </>
            )}
          </Button>
        </div>

        <p className="text-xs text-medical-grey text-center">
          High risk alerts (≥70%) will automatically trigger email notifications to health authorities.
        </p>
      </CardContent>
    </Card>
  );
}
