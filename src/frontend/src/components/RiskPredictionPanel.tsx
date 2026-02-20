import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useActor } from '@/hooks/useActor';
import { Loader2, AlertCircle, RefreshCw, Mail } from 'lucide-react';
import RiskGauge from './RiskGauge';
import RiskComponentBreakdown from './RiskComponentBreakdown';
import { sendAlertEmail } from '@/services/EmailAlertService';
import type { UserRole } from '../App';

interface RiskPredictionPanelProps {
  onPredictionComplete: (data: {
    riskPercentage: number;
    riskCategory: string;
    inputs: { rainfall: number; humidity: number; turbidity: number; bacteriaIndex: number };
  }) => void;
  userRole?: UserRole;
  selectedWard?: string;
}

interface ValidationErrors {
  rainfall?: string;
  humidity?: string;
  turbidity?: string;
  bacteriaIndex?: string;
  reportedCases?: string;
  sanitationCoverage?: string;
  waterTreatmentCoverage?: string;
  populationDensity?: string;
}

export default function RiskPredictionPanel({ onPredictionComplete, userRole, selectedWard }: RiskPredictionPanelProps) {
  const { actor, isFetching } = useActor();
  const [rainfall, setRainfall] = useState('');
  const [humidity, setHumidity] = useState('');
  const [turbidity, setTurbidity] = useState('');
  const [bacteriaIndex, setBacteriaIndex] = useState('');
  
  // Hospital/PHC specific fields
  const [reportedCases, setReportedCases] = useState('');
  const [sanitationCoverage, setSanitationCoverage] = useState('');
  const [waterTreatmentCoverage, setWaterTreatmentCoverage] = useState('');
  const [populationDensity, setPopulationDensity] = useState('');
  
  const [riskResult, setRiskResult] = useState<{ percentage: number; category: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  
  // Email alert state
  const [emailStatus, setEmailStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [emailMessage, setEmailMessage] = useState('');

  const validateInputs = (): boolean => {
    const errors: ValidationErrors = {};
    let isValid = true;

    const rainfallNum = parseFloat(rainfall);
    if (rainfall === '' || isNaN(rainfallNum)) {
      errors.rainfall = 'Rainfall is required';
      isValid = false;
    } else if (rainfallNum < 0) {
      errors.rainfall = 'Rainfall must be ≥ 0 mm';
      isValid = false;
    }

    const humidityNum = parseFloat(humidity);
    if (humidity === '' || isNaN(humidityNum)) {
      errors.humidity = 'Humidity is required';
      isValid = false;
    } else if (humidityNum < 0 || humidityNum > 100) {
      errors.humidity = 'Humidity must be between 0-100%';
      isValid = false;
    }

    const turbidityNum = parseFloat(turbidity);
    if (turbidity === '' || isNaN(turbidityNum)) {
      errors.turbidity = 'Turbidity is required';
      isValid = false;
    } else if (turbidityNum < 0) {
      errors.turbidity = 'Turbidity must be ≥ 0 NTU';
      isValid = false;
    }

    const bacteriaNum = parseFloat(bacteriaIndex);
    if (bacteriaIndex === '' || isNaN(bacteriaNum)) {
      errors.bacteriaIndex = 'Bacteria index is required';
      isValid = false;
    } else if (bacteriaNum < 0) {
      errors.bacteriaIndex = 'Bacteria index must be ≥ 0';
      isValid = false;
    }

    // Validate Hospital/PHC specific fields
    if (userRole === 'healthcare') {
      const casesNum = parseFloat(reportedCases);
      if (reportedCases === '' || isNaN(casesNum)) {
        errors.reportedCases = 'Reported cases is required';
        isValid = false;
      } else if (casesNum < 0) {
        errors.reportedCases = 'Cases must be ≥ 0';
        isValid = false;
      }

      const sanitationNum = parseFloat(sanitationCoverage);
      if (sanitationCoverage === '' || isNaN(sanitationNum)) {
        errors.sanitationCoverage = 'Sanitation coverage is required';
        isValid = false;
      } else if (sanitationNum < 0 || sanitationNum > 100) {
        errors.sanitationCoverage = 'Must be between 0-100%';
        isValid = false;
      }

      const waterNum = parseFloat(waterTreatmentCoverage);
      if (waterTreatmentCoverage === '' || isNaN(waterNum)) {
        errors.waterTreatmentCoverage = 'Water treatment coverage is required';
        isValid = false;
      } else if (waterNum < 0 || waterNum > 100) {
        errors.waterTreatmentCoverage = 'Must be between 0-100%';
        isValid = false;
      }

      const densityNum = parseFloat(populationDensity);
      if (populationDensity === '' || isNaN(densityNum)) {
        errors.populationDensity = 'Population density is required';
        isValid = false;
      } else if (densityNum < 0) {
        errors.populationDensity = 'Density must be ≥ 0';
        isValid = false;
      }
    }

    setValidationErrors(errors);
    return isValid;
  };

  const handleInputChange = (field: keyof ValidationErrors, value: string) => {
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
    if (error) {
      setError(null);
    }

    switch (field) {
      case 'rainfall':
        setRainfall(value);
        break;
      case 'humidity':
        setHumidity(value);
        break;
      case 'turbidity':
        setTurbidity(value);
        break;
      case 'bacteriaIndex':
        setBacteriaIndex(value);
        break;
      case 'reportedCases':
        setReportedCases(value);
        break;
      case 'sanitationCoverage':
        setSanitationCoverage(value);
        break;
      case 'waterTreatmentCoverage':
        setWaterTreatmentCoverage(value);
        break;
      case 'populationDensity':
        setPopulationDensity(value);
        break;
    }
  };

  const getRiskCategory = (risk: number): string => {
    if (risk < 30) return 'LOW';
    if (risk < 70) return 'MEDIUM';
    return 'HIGH';
  };

  const handlePredict = async () => {
    setError(null);
    setValidationErrors({});

    if (!validateInputs()) {
      return;
    }

    if (!actor) {
      setError('Backend connection not available. Please refresh the page and try again.');
      return;
    }

    const rainfallNum = parseFloat(rainfall);
    const humidityNum = parseFloat(humidity);
    const turbidityNum = parseFloat(turbidity);
    const bacteriaNum = parseFloat(bacteriaIndex);

    setIsLoading(true);

    try {
      const result = await actor.predictOutbreakRisk(rainfallNum, humidityNum, turbidityNum, bacteriaNum);
      
      if (typeof result.riskPercentage !== 'number' || isNaN(result.riskPercentage)) {
        throw new Error('Invalid response from backend: risk percentage is not a valid number');
      }

      const category = getRiskCategory(result.riskPercentage);
      setRiskResult({ percentage: result.riskPercentage, category });
      onPredictionComplete({
        riskPercentage: result.riskPercentage,
        riskCategory: category,
        inputs: { rainfall: rainfallNum, humidity: humidityNum, turbidity: turbidityNum, bacteriaIndex: bacteriaNum }
      });
      setError(null);

      // Store alert in history if MEDIUM or HIGH
      if (result.riskPercentage >= 30) {
        const alert = {
          timestamp: new Date().toISOString(),
          ward: selectedWard || 'Unknown',
          riskLevel: category,
          probability: result.riskPercentage,
          actionRecommended: result.riskPercentage >= 70 
            ? 'Immediate intervention required. Deploy emergency response teams.'
            : 'Monitor closely. Prepare preventive measures.'
        };
        
        const existingAlerts = JSON.parse(localStorage.getItem('alertHistory') || '[]');
        existingAlerts.unshift(alert);
        localStorage.setItem('alertHistory', JSON.stringify(existingAlerts.slice(0, 100)));
      }

      // Auto-send email if HIGH risk
      if (result.riskPercentage > 70) {
        handleSendEmail(result.riskPercentage, category, rainfallNum, humidityNum, turbidityNum, bacteriaNum);
      }
    } catch (err) {
      console.error('Prediction error:', err);
      
      let errorMessage = 'Failed to calculate risk. ';
      
      if (err instanceof Error) {
        if (err.message.includes('network') || err.message.includes('fetch')) {
          errorMessage += 'Network connection issue detected. Please check your internet connection.';
        } else if (err.message.includes('Invalid response')) {
          errorMessage += 'Received invalid data from the backend. Please try again.';
        } else if (err.message.includes('timeout')) {
          errorMessage += 'Request timed out. The server may be busy.';
        } else {
          errorMessage += err.message || 'An unexpected error occurred.';
        }
      } else {
        errorMessage += 'An unexpected error occurred. Please verify your inputs and try again.';
      }
      
      setError(errorMessage);
      setRiskResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendEmail = async (
    riskPercentage?: number,
    riskCategory?: string,
    rainfallVal?: number,
    humidityVal?: number,
    turbidityVal?: number,
    bacteriaVal?: number
  ) => {
    const risk = riskPercentage || riskResult?.percentage || 0;
    const category = riskCategory || riskResult?.category || 'UNKNOWN';
    
    if (risk < 30) {
      setEmailMessage('Email alerts are only sent for MEDIUM or HIGH risk levels.');
      setEmailStatus('error');
      setTimeout(() => {
        setEmailStatus('idle');
        setEmailMessage('');
      }, 3000);
      return;
    }

    setEmailStatus('sending');
    setEmailMessage('');

    try {
      await sendAlertEmail({
        risk_level: category,
        risk_percentage: risk,
        time: new Date().toLocaleString(),
        rainfall: rainfallVal || parseFloat(rainfall),
        humidity: humidityVal || parseFloat(humidity),
        turbidity: turbidityVal || parseFloat(turbidity),
        bacteria: bacteriaVal || parseFloat(bacteriaIndex),
        ward: selectedWard || 'Unknown'
      });

      setEmailStatus('success');
      setEmailMessage('Alert Email Sent Successfully');
      setTimeout(() => {
        setEmailStatus('idle');
        setEmailMessage('');
      }, 5000);
    } catch (err) {
      console.error('Email send error:', err);
      setEmailStatus('error');
      setEmailMessage('Failed to send alert email. Please try again.');
      setTimeout(() => {
        setEmailStatus('idle');
        setEmailMessage('');
      }, 5000);
    }
  };

  const handleRetry = () => {
    setError(null);
    handlePredict();
  };

  const isFormValid = () => {
    if (userRole === 'healthcare') {
      return (
        rainfall !== '' &&
        humidity !== '' &&
        turbidity !== '' &&
        bacteriaIndex !== '' &&
        reportedCases !== '' &&
        sanitationCoverage !== '' &&
        waterTreatmentCoverage !== '' &&
        populationDensity !== '' &&
        Object.keys(validationErrors).length === 0
      );
    }
    return (
      rainfall !== '' &&
      humidity !== '' &&
      turbidity !== '' &&
      bacteriaIndex !== '' &&
      Object.keys(validationErrors).length === 0
    );
  };

  return (
    <Card className="bg-white border-medical-border shadow-medical rounded-xl">
      <CardHeader className="p-6">
        <CardTitle className="text-2xl text-medical-slate">Interactive Risk Prediction</CardTitle>
        <CardDescription className="text-medical-grey">
          Enter environmental parameters to predict 14-day outbreak risk
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 p-6 pt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="rainfall" className="text-medical-slate">
              Rainfall (mm)
            </Label>
            <Input
              id="rainfall"
              type="number"
              placeholder="0-500"
              value={rainfall}
              onChange={(e) => handleInputChange('rainfall', e.target.value)}
              className={`bg-white border-medical-border text-medical-slate placeholder:text-medical-grey focus:ring-medical-blue focus:border-medical-blue rounded-lg ${
                validationErrors.rainfall ? 'border-medical-red focus:ring-medical-red focus:border-medical-red' : ''
              }`}
              min="0"
              step="0.1"
            />
            {validationErrors.rainfall && (
              <p className="text-sm text-medical-red flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {validationErrors.rainfall}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="humidity" className="text-medical-slate">
              Humidity (%)
            </Label>
            <Input
              id="humidity"
              type="number"
              placeholder="0-100"
              value={humidity}
              onChange={(e) => handleInputChange('humidity', e.target.value)}
              className={`bg-white border-medical-border text-medical-slate placeholder:text-medical-grey focus:ring-medical-blue focus:border-medical-blue rounded-lg ${
                validationErrors.humidity ? 'border-medical-red focus:ring-medical-red focus:border-medical-red' : ''
              }`}
              min="0"
              max="100"
              step="0.1"
            />
            {validationErrors.humidity && (
              <p className="text-sm text-medical-red flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {validationErrors.humidity}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="turbidity" className="text-medical-slate">
              Turbidity (NTU)
            </Label>
            <Input
              id="turbidity"
              type="number"
              placeholder="0-50"
              value={turbidity}
              onChange={(e) => handleInputChange('turbidity', e.target.value)}
              className={`bg-white border-medical-border text-medical-slate placeholder:text-medical-grey focus:ring-medical-blue focus:border-medical-blue rounded-lg ${
                validationErrors.turbidity ? 'border-medical-red focus:ring-medical-red focus:border-medical-red' : ''
              }`}
              min="0"
              step="0.1"
            />
            {validationErrors.turbidity && (
              <p className="text-sm text-medical-red flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {validationErrors.turbidity}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="bacteriaIndex" className="text-medical-slate">
              Bacteria Index
            </Label>
            <Input
              id="bacteriaIndex"
              type="number"
              placeholder="0-1000"
              value={bacteriaIndex}
              onChange={(e) => handleInputChange('bacteriaIndex', e.target.value)}
              className={`bg-white border-medical-border text-medical-slate placeholder:text-medical-grey focus:ring-medical-blue focus:border-medical-blue rounded-lg ${
                validationErrors.bacteriaIndex ? 'border-medical-red focus:ring-medical-red focus:border-medical-red' : ''
              }`}
              min="0"
              step="1"
            />
            {validationErrors.bacteriaIndex && (
              <p className="text-sm text-medical-red flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {validationErrors.bacteriaIndex}
              </p>
            )}
          </div>
        </div>

        {/* Hospital/PHC Specific Fields */}
        {userRole === 'healthcare' && (
          <div className="border-t border-medical-border pt-6">
            <h3 className="text-lg font-semibold text-medical-slate mb-4">Ward-Specific Data</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="reportedCases" className="text-medical-slate">
                  Number of Reported Cases
                </Label>
                <Input
                  id="reportedCases"
                  type="number"
                  placeholder="0"
                  value={reportedCases}
                  onChange={(e) => handleInputChange('reportedCases', e.target.value)}
                  className={`bg-white border-medical-border text-medical-slate placeholder:text-medical-grey focus:ring-medical-blue focus:border-medical-blue rounded-lg ${
                    validationErrors.reportedCases ? 'border-medical-red focus:ring-medical-red focus:border-medical-red' : ''
                  }`}
                  min="0"
                  step="1"
                />
                {validationErrors.reportedCases && (
                  <p className="text-sm text-medical-red flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {validationErrors.reportedCases}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="sanitationCoverage" className="text-medical-slate">
                  Sanitation Coverage %
                </Label>
                <Input
                  id="sanitationCoverage"
                  type="number"
                  placeholder="0-100"
                  value={sanitationCoverage}
                  onChange={(e) => handleInputChange('sanitationCoverage', e.target.value)}
                  className={`bg-white border-medical-border text-medical-slate placeholder:text-medical-grey focus:ring-medical-blue focus:border-medical-blue rounded-lg ${
                    validationErrors.sanitationCoverage ? 'border-medical-red focus:ring-medical-red focus:border-medical-red' : ''
                  }`}
                  min="0"
                  max="100"
                  step="0.1"
                />
                {validationErrors.sanitationCoverage && (
                  <p className="text-sm text-medical-red flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {validationErrors.sanitationCoverage}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="waterTreatmentCoverage" className="text-medical-slate">
                  Water Treatment Coverage %
                </Label>
                <Input
                  id="waterTreatmentCoverage"
                  type="number"
                  placeholder="0-100"
                  value={waterTreatmentCoverage}
                  onChange={(e) => handleInputChange('waterTreatmentCoverage', e.target.value)}
                  className={`bg-white border-medical-border text-medical-slate placeholder:text-medical-grey focus:ring-medical-blue focus:border-medical-blue rounded-lg ${
                    validationErrors.waterTreatmentCoverage ? 'border-medical-red focus:ring-medical-red focus:border-medical-red' : ''
                  }`}
                  min="0"
                  max="100"
                  step="0.1"
                />
                {validationErrors.waterTreatmentCoverage && (
                  <p className="text-sm text-medical-red flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {validationErrors.waterTreatmentCoverage}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="populationDensity" className="text-medical-slate">
                  Population Density
                </Label>
                <Input
                  id="populationDensity"
                  type="number"
                  placeholder="0"
                  value={populationDensity}
                  onChange={(e) => handleInputChange('populationDensity', e.target.value)}
                  className={`bg-white border-medical-border text-medical-slate placeholder:text-medical-grey focus:ring-medical-blue focus:border-medical-blue rounded-lg ${
                    validationErrors.populationDensity ? 'border-medical-red focus:ring-medical-red focus:border-medical-red' : ''
                  }`}
                  min="0"
                  step="1"
                />
                {validationErrors.populationDensity && (
                  <p className="text-sm text-medical-red flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {validationErrors.populationDensity}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-medical-red rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-medical-red shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-medical-red">{error}</p>
              <Button
                onClick={handleRetry}
                variant="outline"
                size="sm"
                className="mt-2 text-medical-red border-medical-red hover:bg-red-50"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Retry
              </Button>
            </div>
          </div>
        )}

        <div className="flex gap-4">
          <Button
            onClick={handlePredict}
            disabled={!isFormValid() || isLoading || isFetching}
            className="flex-1 bg-medical-blue hover:bg-medical-blue-soft text-white rounded-lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Calculating...
              </>
            ) : (
              'Predict Risk'
            )}
          </Button>

          {userRole === 'healthcare' && riskResult && riskResult.percentage >= 30 && (
            <Button
              onClick={() => handleSendEmail()}
              disabled={emailStatus === 'sending'}
              className="bg-medical-orange hover:bg-orange-600 text-white rounded-lg"
            >
              {emailStatus === 'sending' ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4 mr-2" />
                  Send Alert Email
                </>
              )}
            </Button>
          )}
        </div>

        {emailMessage && (
          <div className={`rounded-lg p-3 text-sm ${
            emailStatus === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {emailMessage}
          </div>
        )}

        {riskResult && (
          <div className="space-y-6 pt-6 border-t border-medical-border">
            <RiskComponentBreakdown 
              rainfall={parseFloat(rainfall)}
              humidity={parseFloat(humidity)}
              turbidity={parseFloat(turbidity)}
              bacteriaIndex={parseFloat(bacteriaIndex)}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
