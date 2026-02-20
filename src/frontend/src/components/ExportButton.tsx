import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { getAllWardsData } from '@/utils/wardDataGenerator';

interface ExportButtonProps {
  overallRisk: number;
}

export default function ExportButton({ overallRisk }: ExportButtonProps) {
  const adjustmentFactors = [0.85, 1.15, 0.95, 1.10, 0.90, 1.05, 1.12, 0.88, 1.08];

  const handleExport = () => {
    const wardsData = getAllWardsData();
    
    const csvData = wardsData.map((ward, index) => {
      const outbreakProbability = Math.min(100, Math.max(0, overallRisk * adjustmentFactors[index]));
      
      let vulnerabilityWeight = 1;
      if (ward.sanitationCoverage < 50) vulnerabilityWeight += 1;
      if (ward.waterTreatmentCoverage < 60) vulnerabilityWeight += 1;
      if (ward.populationDensity > 2000) vulnerabilityWeight += 1;
      
      const priorityScore = outbreakProbability * vulnerabilityWeight;
      
      const riskLevel = outbreakProbability < 30 ? 'LOW' : outbreakProbability < 70 ? 'MEDIUM' : 'HIGH';
      
      return {
        wardName: `Ward ${index + 1}`,
        outbreakProbability: outbreakProbability.toFixed(1),
        riskLevel,
        vulnerabilityWeight,
        priorityScore: priorityScore.toFixed(1),
        sanitationCoverage: ward.sanitationCoverage.toFixed(1),
        waterTreatmentCoverage: ward.waterTreatmentCoverage.toFixed(1),
        populationDensity: ward.populationDensity.toFixed(0)
      };
    });

    // Create CSV content
    const headers = [
      'Ward Name',
      'Outbreak Probability',
      'Risk Level',
      'Vulnerability Weight',
      'Priority Score',
      'Sanitation Coverage',
      'Water Treatment Coverage',
      'Population Density'
    ];
    
    const csvRows = [
      headers.join(','),
      ...csvData.map(row => [
        row.wardName,
        row.outbreakProbability,
        row.riskLevel,
        row.vulnerabilityWeight,
        row.priorityScore,
        row.sanitationCoverage,
        row.waterTreatmentCoverage,
        row.populationDensity
      ].join(','))
    ];
    
    const csvContent = csvRows.join('\n');
    
    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    const today = new Date();
    const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    
    link.setAttribute('href', url);
    link.setAttribute('download', `coimbatore-district-risk-analysis-${dateStr}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex justify-end">
      <Button
        onClick={handleExport}
        className="bg-medical-blue hover:bg-medical-blue-soft text-white rounded-lg"
      >
        <Download className="w-4 h-4 mr-2" />
        Export to CSV
      </Button>
    </div>
  );
}
