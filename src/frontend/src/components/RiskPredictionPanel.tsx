import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useActor } from '@/hooks/useActor';
import { Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
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
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

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

  const getRiskCategory = (risk: number): string => {
    if (risk < 30) return 'Low (Green)';
    if (risk < 70) return 'Medium (Yellow/Amber)';
    return 'High (Red)';
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
      // Extract ward number from selectedWard (e.g., "Ward 5" -> 5)
      // Default to ward 1 if not available (for citizen view)
      let wardNumber = 1;
      if (selectedWard && selectedWard.startsWith('Ward ')) {
        const wardNum = parseInt(selectedWard.replace('Ward ', ''));
        if (!isNaN(wardNum) && wardNum >= 1 && wardNum <= 9) {
          wardNumber = wardNum;
        }
      }

      // Call backend calculateAndPersistRisk
      // Note: This will calculate risk but won't overwrite government data
      // since Hospital/PHC users typically assess without persisting official records
      const result = await actor.calculateAndPersistRisk(
        BigInt(wardNumber),
        rainfallNum,
        humidityNum,
        turbidityNum,
        bacteriaNum
      );
      
      if (!result) {
        throw new Error('Backend returned null response. Please try again.');
      }

      if (typeof result.riskPercentage !== 'number' || isNaN(result.riskPercentage)) {
        throw new Error('Invalid response from backend: risk percentage is not a valid number');
      }

      const category = getRiskCategory(result.riskPercentage);
      onPredictionComplete({
        riskPercentage: result.riskPercentage,
        riskCategory: category,
        inputs: { rainfall: rainfallNum, humidity: humidityNum, turbidity: turbidityNum, bacteriaIndex: bacteriaNum }
      });
      setError(null);

      // Dispatch disease-classification-updated event with environmental parameters
      console.log('[RiskPredictionPanel] Dispatching disease-classification-updated event');
      window.dispatchEvent(new CustomEvent('disease-classification-updated', {
        detail: {
          rainfall: rainfallNum,
          humidity: humidityNum,
          turbidity: turbidityNum,
          bacteriaIndex: bacteriaNum
        }
      }));

      // Store alert in history if MEDIUM or HIGH (for Hospital/PHC)
      if (result.riskPercentage >= 30 && userRole === 'healthcare') {
        const alert = {
          timestamp: new Date().toISOString(),
          ward: selectedWard || 'Unknown',
          rainfall: rainfallNum,
          humidity: humidityNum,
          turbidity: turbidityNum,
          bacteria: bacteriaNum,
          sanitationCoverage: parseFloat(sanitationCoverage) || 0,
          waterTreatmentCoverage: parseFloat(waterTreatmentCoverage) || 0,
          riskLevel: category,
          riskPercentage: result.riskPercentage,
          diseaseMostLikely: result.riskPercentage >= 70 ? 'Cholera' : result.riskPercentage >= 30 ? 'Typhoid' : 'Dysentery',
          priorityScore: 0,
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
      }

      toast.success('Risk Calculated Successfully', {
        description: `${category}: ${result.riskPercentage.toFixed(1)}%`
      });

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      toast.error('Calculation Failed', {
        description: errorMessage
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-white border-gray-200 shadow-md rounded-lg">
      <CardHeader className="p-6">
        <CardTitle className="text-2xl text-blue-600 font-bold">
          {userRole === 'healthcare' ? 'Ward Risk Assessment' : 'Environmental Risk Prediction'}
        </CardTitle>
        <CardDescription className="text-gray-600">
          {userRole === 'healthcare' 
            ? `Enter environmental and health data for ${selectedWard || 'selected ward'}`
            : 'Enter environmental parameters to calculate outbreak risk'}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 pt-0 space-y-6">
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
              className={validationErrors.rainfall ? 'border-red-500' : 'border-gray-300'}
            />
            {validationErrors.rainfall && (
              <p className="text-xs text-red-600">{validationErrors.rainfall}</p>
            )}
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
              className={validationErrors.humidity ? 'border-red-500' : 'border-gray-300'}
            />
            {validationErrors.humidity && (
              <p className="text-xs text-red-600">{validationErrors.humidity}</p>
            )}
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
              className={validationErrors.turbidity ? 'border-red-500' : 'border-gray-300'}
            />
            {validationErrors.turbidity && (
              <p className="text-xs text-red-600">{validationErrors.turbidity}</p>
            )}
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
              className={validationErrors.bacteriaIndex ? 'border-red-500' : 'border-gray-300'}
            />
            {validationErrors.bacteriaIndex && (
              <p className="text-xs text-red-600">{validationErrors.bacteriaIndex}</p>
            )}
          </div>

          {/* Hospital/PHC specific fields */}
          {userRole === 'healthcare' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="reportedCases" className="text-sm font-semibold text-gray-700">
                  Reported Cases (7-day) <span className="text-red-600">*</span>
                </Label>
                <Input
                  id="reportedCases"
                  type="number"
                  value={reportedCases}
                  onChange={(e) => setReportedCases(e.target.value)}
                  placeholder="0"
                  className={validationErrors.reportedCases ? 'border-red-500' : 'border-gray-300'}
                />
                {validationErrors.reportedCases && (
                  <p className="text-xs text-red-600">{validationErrors.reportedCases}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="sanitationCoverage" className="text-sm font-semibold text-gray-700">
                  Sanitation Coverage (%) <span className="text-red-600">*</span>
                </Label>
                <Input
                  id="sanitationCoverage"
                  type="number"
                  step="0.1"
                  value={sanitationCoverage}
                  onChange={(e) => setSanitationCoverage(e.target.value)}
                  placeholder="0-100"
                  className={validationErrors.sanitationCoverage ? 'border-red-500' : 'border-gray-300'}
                />
                {validationErrors.sanitationCoverage && (
                  <p className="text-xs text-red-600">{validationErrors.sanitationCoverage}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="waterTreatmentCoverage" className="text-sm font-semibold text-gray-700">
                  Water Treatment Coverage (%) <span className="text-red-600">*</span>
                </Label>
                <Input
                  id="waterTreatmentCoverage"
                  type="number"
                  step="0.1"
                  value={waterTreatmentCoverage}
                  onChange={(e) => setWaterTreatmentCoverage(e.target.value)}
                  placeholder="0-100"
                  className={validationErrors.waterTreatmentCoverage ? 'border-red-500' : 'border-gray-300'}
                />
                {validationErrors.waterTreatmentCoverage && (
                  <p className="text-xs text-red-600">{validationErrors.waterTreatmentCoverage}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="populationDensity" className="text-sm font-semibold text-gray-700">
                  Population Density <span className="text-red-600">*</span>
                </Label>
                <Input
                  id="populationDensity"
                  type="number"
                  value={populationDensity}
                  onChange={(e) => setPopulationDensity(e.target.value)}
                  placeholder="per sq km"
                  className={validationErrors.populationDensity ? 'border-red-500' : 'border-gray-300'}
                />
                {validationErrors.populationDensity && (
                  <p className="text-xs text-red-600">{validationErrors.populationDensity}</p>
                )}
              </div>
            </>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <Button
          onClick={handlePredict}
          disabled={isLoading || isFetching}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Calculating Risk...
            </>
          ) : (
            'Predict Risk'
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
