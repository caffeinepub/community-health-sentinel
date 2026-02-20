export default function DataFreshnessFooter() {
  const lastUpdated = new Date().toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="text-center py-6 text-gray-400 text-sm space-y-1">
      <div>
        <span className="font-medium">Last Data Updated:</span> {lastUpdated}
      </div>
      <div>
        <span className="font-medium">Data Sources:</span> IMD Rainfall API, Water Quality Sensors, PHC Surveillance Reports
      </div>
    </div>
  );
}
