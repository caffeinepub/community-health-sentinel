export default function DataFreshnessFooter() {
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const formattedTime = currentDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  return (
    <div className="text-medical-grey text-sm space-y-1">
      <p>
        <span className="font-medium">Last Updated:</span> {formattedDate} at {formattedTime}
      </p>
      <p>
        <span className="font-medium">Data Sources:</span> Environmental Monitoring Systems and Community Reports (Simulated)
      </p>
    </div>
  );
}
