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
  
  // 15 input fields as per Version 17
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
  const [chlorinationStatus, setChlorinationStatus] = useState('');
  const [phcCapacity, setPhcCapacity] = useState('');
  const [emergencyResponseStatus, setEmergencyResponseStatus] = useState('');
  
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [recipientEmail, setRecipientEmail] = useState('health.authority@example.com');
  
  const [isLoading, setIsLoading] = useState(false);
  const [environmentalHistory, setEnvironmentalHistory] = useState<EnvironmentalInput[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('environmental_history');
    if (stored) {
      try {
        setEnvironmentalHistory(JSON.parse(stored));
      } catch (e) {
        console.error('[GovernmentDataPanel] Error parsing environmental history:', e);
      }
    }
  }, []);

  const calculate7DayAverage = (history: EnvironmentalInput[], currentValue: number, field: keyof EnvironmentalInput): number => {
    if (history.length === 0) return currentValue;
    
    const values = history.slice(0, 6).map(h => typeof h[field] === 'number' ? h[field] as number : 0);
    values.push(currentValue);
    
    const sum = values.reduce((acc, val) => acc + val, 0);
    return sum / values.length;
  };

  const handleUpdateRisk = async () => {
    if (!ward || !rainfall || !humidity || !turbidity || !bacteriaIndex) {
      toast.error('Missing Required Fields', {
        description: 'Please fill in Ward, Rainfall, Humidity, Turbidity, and Bacteria Index.'
      });
      return;
    }

    if (!actor) {
      toast.error('Backend Not Available', {
        description: 'Backend connection not available. Please refresh the page.'
      });
      return;
    }

    setIsLoading(true);

    try {
      const rainfallNum = parseFloat(rainfall);
      const humidityNum = parseFloat(humidity);
      const turbidityNum = parseFloat(turbidity);
      const bacteriaNum = parseFloat(bacteriaIndex);

      // Update environmental history
      const newInput: EnvironmentalInput = {
        timestamp: new Date().toISOString(),
        rainfall: rainfallNum,
        humidity: humidityNum,
        turbidity: turbidityNum,
        bacteriaIndex: bacteriaNum
      };
      
      const updatedHistory = [newInput, ...environmentalHistory].slice(0, 7);
      setEnvironmentalHistory(updatedHistory);
      localStorage.setItem('environmental_history', JSON.stringify(updatedHistory));

      // Calculate 7-day averages
      const avg7DayRainfall = calculate7DayAverage(environmentalHistory, rainfallNum, 'rainfall');
      const avg7DayHumidity = calculate7DayAverage(environmentalHistory, humidityNum, 'humidity');
      const avg7DayTurbidity = calculate7DayAverage(environmentalHistory, turbidityNum, 'turbidity');
      const avg7DayBacteria = calculate7DayAverage(environmentalHistory, bacteriaNum, 'bacteriaIndex');

      console.log('[GovernmentDataPanel] 7-day averages:', {
        rainfall: avg7DayRainfall,
        humidity: avg7DayHumidity,
        turbidity: avg7DayTurbidity,
        bacteria: avg7DayBacteria
      });

      // Call backend with 7-day averages
      const wardNumber = parseInt(ward);
      const result = await actor.calculateAndPersistRisk(
        BigInt(wardNumber),
        avg7DayRainfall,
        avg7DayHumidity,
        avg7DayTurbidity,
        avg7DayBacteria
      );

      if (!result) {
        throw new Error('Backend returned null response');
      }

      console.log('[GovernmentDataPanel] Backend risk calculation result:', result);

      // Calculate disease probability using Version 17 formula
      const normalizedRainfall = rainfallNum / 200;
      const normalizedHumidity = humidityNum / 100;
      const normalizedTurbidity = turbidityNum / 50;
      const normalizedBacteria = bacteriaNum / 1000;

      const choleraProb = (normalizedRainfall * 0.3 + normalizedTurbidity * 0.3 + normalizedBacteria * 0.4) * 100;
      const typhoidProb = (normalizedBacteria * 0.4 + normalizedTurbidity * 0.3 + normalizedHumidity * 0.3) * 100;
      const dysenteryProb = (normalizedBacteria * 0.5 + normalizedTurbidity * 0.3 + normalizedRainfall * 0.2) * 100;
      const hepatitisProb = (normalizedTurbidity * 0.4 + normalizedBacteria * 0.3 + normalizedRainfall * 0.3) * 100;

      const diseases = [
        { name: 'Cholera', prob: choleraProb },
        { name: 'Typhoid', prob: typhoidProb },
        { name: 'Dysentery', prob: dysenteryProb },
        { name: 'Hepatitis A', prob: hepatitisProb }
      ];

      const highestDisease = diseases.reduce((max, disease) => 
        disease.prob > max.prob ? disease : max
      );

      // Store complete ward data in localStorage
      const wardData = {
        ward: `Ward ${wardNumber}`,
        rainfall: rainfallNum,
        humidity: humidityNum,
        turbidity: turbidityNum,
        bacteriaLevel: bacteriaNum,
        sanitationCoverage: parseFloat(sanitationCoverage) || 0,
        waterTreatmentCoverage: parseFloat(waterTreatmentCoverage) || 0,
        populationDensity: parseFloat(populationDensity) || 0,
        reportedCases: parseFloat(reportedCases) || 0,
        waterSourceType: waterSourceType || 'Unknown',
        chlorinationStatus: chlorinationStatus || 'Unknown',
        phcCapacity: parseFloat(phcCapacity) || 0,
        emergencyResponseStatus: emergencyResponseStatus || 'Unknown',
        riskPercentage: result.riskPercentage,
        riskCategory: result.riskCategory,
        diseasePrediction: highestDisease.name,
        timestamp: new Date().toISOString()
      };

      localStorage.setItem(`ward_${wardNumber}_data`, JSON.stringify(wardData));

      // Dispatch event for real-time updates
      window.dispatchEvent(new CustomEvent('ward-data-updated', {
        detail: {
          wardId: wardNumber,
          riskPercentage: result.riskPercentage,
          riskCategory: result.riskCategory
        }
      }));

      // Store alert in history if MEDIUM or HIGH
      if (result.riskPercentage >= 30) {
        const priorityScore = result.riskPercentage * 
          (1 + (100 - (parseFloat(sanitationCoverage) || 50)) / 100) *
          (1 + (100 - (parseFloat(waterTreatmentCoverage) || 50)) / 100);

        const alert = {
          timestamp: new Date().toISOString(),
          ward: `Ward ${wardNumber}`,
          rainfall: rainfallNum,
          avg7DayRainfall: avg7DayRainfall,
          humidity: humidityNum,
          avg7DayHumidity: avg7DayHumidity,
          turbidity: turbidityNum,
          avg7DayTurbidity: avg7DayTurbidity,
          bacteria: bacteriaNum,
          avg7DayBacteria: avg7DayBacteria,
          sanitationCoverage: parseFloat(sanitationCoverage) || 0,
          waterTreatmentCoverage: parseFloat(waterTreatmentCoverage) || 0,
          riskLevel: result.riskCategory,
          riskPercentage: result.riskPercentage,
          diseaseMostLikely: highestDisease.name,
          priorityScore: priorityScore,
          emailSent: 'No',
          recommendedAction: result.riskPercentage >= 70 
            ? 'Immediate intervention required. Deploy emergency response teams.'
            : 'Monitor closely. Prepare preventive measures.',
          populationDensity: parseFloat(populationDensity) || 0,
          reportedCases: parseFloat(reportedCases) || 0
        };
        
        const existingAlerts = JSON.parse(localStorage.getItem('cholera_alerts') || '[]');
        existingAlerts.unshift(alert);
        localStorage.setItem('cholera_alerts', JSON.stringify(existingAlerts.slice(0, 100)));

        // Send email alert if enabled
        if (emailAlerts && result.riskPercentage >= 30) {
          try {
            await sendAlertEmail({
              ward: `Ward ${wardNumber}`,
              risk_level: result.riskCategory,
              risk_percentage: result.riskPercentage,
              time: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
              rainfall: rainfallNum,
              humidity: humidityNum,
              turbidity: turbidityNum,
              bacteria: bacteriaNum,
              priority_score: priorityScore
            });

            alert.emailSent = 'Yes';
            existingAlerts[0] = alert;
            localStorage.setItem('cholera_alerts', JSON.stringify(existingAlerts));

            toast.success('Alert Sent Successfully', {
              description: `Email notification sent to ${recipientEmail}`
            });
          } catch (emailError) {
            console.error('[GovernmentDataPanel] Email send failed:', emailError);
            toast.warning('Risk Calculated, Email Failed', {
              description: emailError instanceof Error ? emailError.message : 'Failed to send email alert'
            });
          }
        }
      }

      toast.success('Risk Calculated Successfully', {
        description: `${result.riskCategory}: ${result.riskPercentage.toFixed(1)}% | Disease: ${highestDisease.name}`
      });

    } catch (err) {
      console.error('[GovernmentDataPanel] Error:', err);
      toast.error('Calculation Failed', {
        description: err instanceof Error ? err.message : 'An unexpected error occurred'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-white border-gray-200 shadow-md rounded-lg">
      <CardHeader className="p-6 bg-blue-50 border-b border-gray-200">
        <CardTitle className="text-2xl text-blue-600 font-bold">Government Data Entry Panel</CardTitle>
        <p className="text-sm text-gray-600 mt-1">Enter ward-specific environmental and infrastructure data (15 fields)</p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Ward Selection */}
        <div className="space-y-2">
          <Label htmlFor="ward" className="text-sm font-semibold text-gray-700">
            Ward <span className="text-red-600">*</span>
          </Label>
          <Select value={ward} onValueChange={setWard}>
            <SelectTrigger id="ward" className="border-gray-300">
              <SelectValue placeholder="Select ward" />
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
            <Label htmlFor="rainfall" className="text-sm font-semibold text-gray-700">
              Rainfall (mm) <span className="text-red-600">*</span>
            </Label>
            <Input
              id="rainfall"
              type="number"
              step="0.1"
              value={rainfall}
              onChange={(e) => setRainfall(e.target.value)}
              placeholder="0.0"
              className="border-gray-300"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="humidity" className="text-sm font-semibold text-gray-700">
              Humidity (%) <span className="text-red-600">*</span>
            </Label>
            <Input
              id="humidity"
              type="number"
              step="0.1"
              value={humidity}
              onChange={(e) => setHumidity(e.target.value)}
              placeholder="0-100"
              className="border-gray-300"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="turbidity" className="text-sm font-semibold text-gray-700">
              Turbidity (NTU) <span className="text-red-600">*</span>
            </Label>
            <Input
              id="turbidity"
              type="number"
              step="0.1"
              value={turbidity}
              onChange={(e) => setTurbidity(e.target.value)}
              placeholder="0.0"
              className="border-gray-300"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bacteriaIndex" className="text-sm font-semibold text-gray-700">
              Bacteria Index <span className="text-red-600">*</span>
            </Label>
            <Input
              id="bacteriaIndex"
              type="number"
              step="0.1"
              value={bacteriaIndex}
              onChange={(e) => setBacteriaIndex(e.target.value)}
              placeholder="0.0"
              className="border-gray-300"
            />
          </div>
        </div>

        {/* Infrastructure Data */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="sanitationCoverage" className="text-sm font-semibold text-gray-700">
              Sanitation Coverage (%)
            </Label>
            <Input
              id="sanitationCoverage"
              type="number"
              step="0.1"
              value={sanitationCoverage}
              onChange={(e) => setSanitationCoverage(e.target.value)}
              placeholder="0-100"
              className="border-gray-300"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="waterTreatmentCoverage" className="text-sm font-semibold text-gray-700">
              Water Treatment Coverage (%)
            </Label>
            <Input
              id="waterTreatmentCoverage"
              type="number"
              step="0.1"
              value={waterTreatmentCoverage}
              onChange={(e) => setWaterTreatmentCoverage(e.target.value)}
              placeholder="0-100"
              className="border-gray-300"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="populationDensity" className="text-sm font-semibold text-gray-700">
              Population Density (per sq km)
            </Label>
            <Input
              id="populationDensity"
              type="number"
              step="1"
              value={populationDensity}
              onChange={(e) => setPopulationDensity(e.target.value)}
              placeholder="0"
              className="border-gray-300"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reportedCases" className="text-sm font-semibold text-gray-700">
              Reported Cases
            </Label>
            <Input
              id="reportedCases"
              type="number"
              step="1"
              value={reportedCases}
              onChange={(e) => setReportedCases(e.target.value)}
              placeholder="0"
              className="border-gray-300"
            />
          </div>
        </div>

        {/* Additional Infrastructure Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="waterSourceType" className="text-sm font-semibold text-gray-700">
              Water Source Type
            </Label>
            <Select value={waterSourceType} onValueChange={setWaterSourceType}>
              <SelectTrigger id="waterSourceType" className="border-gray-300">
                <SelectValue placeholder="Select source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Municipal">Municipal</SelectItem>
                <SelectItem value="Well">Well</SelectItem>
                <SelectItem value="River">River</SelectItem>
                <SelectItem value="Borewell">Borewell</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="chlorinationStatus" className="text-sm font-semibold text-gray-700">
              Chlorination Status
            </Label>
            <Select value={chlorinationStatus} onValueChange={setChlorinationStatus}>
              <SelectTrigger id="chlorinationStatus" className="border-gray-300">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
                <SelectItem value="Partial">Partial</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phcCapacity" className="text-sm font-semibold text-gray-700">
              PHC Capacity (beds)
            </Label>
            <Input
              id="phcCapacity"
              type="number"
              step="1"
              value={phcCapacity}
              onChange={(e) => setPhcCapacity(e.target.value)}
              placeholder="0"
              className="border-gray-300"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="emergencyResponseStatus" className="text-sm font-semibold text-gray-700">
              Emergency Response Status
            </Label>
            <Select value={emergencyResponseStatus} onValueChange={setEmergencyResponseStatus}>
              <SelectTrigger id="emergencyResponseStatus" className="border-gray-300">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Ready">Ready</SelectItem>
                <SelectItem value="Standby">Standby</SelectItem>
                <SelectItem value="Deployed">Deployed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Email Alert Settings */}
        <div className="border-t border-gray-200 pt-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="emailAlerts" className="text-sm font-semibold text-gray-700">
                Email Alerts
              </Label>
              <p className="text-xs text-gray-500">Send email notifications for medium/high risk</p>
            </div>
            <Switch
              id="emailAlerts"
              checked={emailAlerts}
              onCheckedChange={setEmailAlerts}
            />
          </div>

          {emailAlerts && (
            <div className="space-y-2">
              <Label htmlFor="recipientEmail" className="text-sm font-semibold text-gray-700">
                Recipient Email
              </Label>
              <Input
                id="recipientEmail"
                type="email"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                placeholder="email@example.com"
                className="border-gray-300"
              />
            </div>
          )}
        </div>

        {/* Action Button */}
        <Button
          onClick={handleUpdateRisk}
          disabled={isLoading || isFetching}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Calculating...
            </>
          ) : (
            <>
              <Calculator className="mr-2 h-5 w-5" />
              Update & Recalculate Risk
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
