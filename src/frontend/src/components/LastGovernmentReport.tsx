import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock } from 'lucide-react';
import { useEffect, useState } from 'react';

interface GovernmentReportData {
  timestamp: string;
  ward: string;
  waterQualityIndex: number;
  bacteriaLevel: number;
  turbidity: number;
  rainfall: number;
  humidity: number;
  sanitationCoverage: number;
  waterTreatmentCoverage: number;
  riskLevel: string;
}

export default function LastGovernmentReport() {
  const [reportData, setReportData] = useState<GovernmentReportData | null>(null);

  useEffect(() => {
    const storedReport = localStorage.getItem('last_government_report');
    if (storedReport) {
      setReportData(JSON.parse(storedReport));
    } else {
      // Default placeholder data
      setReportData({
        timestamp: new Date().toISOString(),
        ward: 'District-Wide',
        waterQualityIndex: 72,
        bacteriaLevel: 45,
        turbidity: 12,
        rainfall: 25,
        humidity: 68,
        sanitationCoverage: 65,
        waterTreatmentCoverage: 70,
        riskLevel: 'Medium (Yellow/Amber)'
      });
    }
  }, []);

  if (!reportData) return null;

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className="bg-white border-gray-200 shadow-md rounded-lg">
      <CardHeader className="p-6 bg-blue-600 text-white rounded-t-lg">
        <CardTitle className="text-2xl font-bold flex items-center gap-3">
          <Clock className="w-6 h-6" />
          Last Government Inspection Report
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <p className="text-sm font-semibold text-blue-800 mb-1">Last Updated</p>
          <p className="text-lg font-bold text-blue-900">{formatDate(reportData.timestamp)}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="border-l-4 border-blue-600 pl-4">
            <p className="text-sm text-gray-600 font-medium">Ward</p>
            <p className="text-lg font-semibold text-gray-900">{reportData.ward}</p>
          </div>

          <div className="border-l-4 border-blue-600 pl-4">
            <p className="text-sm text-gray-600 font-medium">Water Quality Index</p>
            <p className="text-lg font-semibold text-gray-900">{reportData.waterQualityIndex}</p>
          </div>

          <div className="border-l-4 border-blue-600 pl-4">
            <p className="text-sm text-gray-600 font-medium">Bacteria Level</p>
            <p className="text-lg font-semibold text-gray-900">{reportData.bacteriaLevel} CFU/100ml</p>
          </div>

          <div className="border-l-4 border-blue-600 pl-4">
            <p className="text-sm text-gray-600 font-medium">Turbidity</p>
            <p className="text-lg font-semibold text-gray-900">{reportData.turbidity} NTU</p>
          </div>

          <div className="border-l-4 border-blue-600 pl-4">
            <p className="text-sm text-gray-600 font-medium">Rainfall</p>
            <p className="text-lg font-semibold text-gray-900">{reportData.rainfall} mm</p>
          </div>

          <div className="border-l-4 border-blue-600 pl-4">
            <p className="text-sm text-gray-600 font-medium">Humidity</p>
            <p className="text-lg font-semibold text-gray-900">{reportData.humidity}%</p>
          </div>

          <div className="border-l-4 border-blue-600 pl-4">
            <p className="text-sm text-gray-600 font-medium">Sanitation Coverage</p>
            <p className="text-lg font-semibold text-gray-900">{reportData.sanitationCoverage}%</p>
          </div>

          <div className="border-l-4 border-blue-600 pl-4">
            <p className="text-sm text-gray-600 font-medium">Water Treatment Coverage</p>
            <p className="text-lg font-semibold text-gray-900">{reportData.waterTreatmentCoverage}%</p>
          </div>

          <div className="border-l-4 border-blue-600 pl-4 col-span-2">
            <p className="text-sm text-gray-600 font-medium">Risk Level</p>
            <p className="text-lg font-semibold text-gray-900">{reportData.riskLevel}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
