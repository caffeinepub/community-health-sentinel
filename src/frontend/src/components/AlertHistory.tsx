import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Alert {
  timestamp: string;
  ward: string;
  rainfall: number;
  avg7DayRainfall?: number;
  humidity: number;
  avg7DayHumidity?: number;
  turbidity: number;
  avg7DayTurbidity?: number;
  bacteria: number;
  avg7DayBacteria?: number;
  sanitationCoverage: number;
  waterTreatmentCoverage: number;
  riskLevel: string;
  riskPercentage: number;
  diseaseMostLikely: string;
  priorityScore: number;
  emailSent: string;
  recommendedAction: string;
}

export default function AlertHistory() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [filterWard, setFilterWard] = useState<string>('all');
  const [filterRisk, setFilterRisk] = useState<string>('all');

  useEffect(() => {
    const loadAlerts = () => {
      const stored = localStorage.getItem('cholera_alerts');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setAlerts(parsed);
        } catch (e) {
          console.error('[AlertHistory] Error parsing alerts:', e);
        }
      }
    };

    loadAlerts();
    const interval = setInterval(loadAlerts, 5000);
    return () => clearInterval(interval);
  }, []);

  const filteredAlerts = alerts.filter(alert => {
    if (filterWard !== 'all' && alert.ward !== filterWard) return false;
    if (filterRisk !== 'all') {
      if (filterRisk === 'high' && !alert.riskLevel.includes('High')) return false;
      if (filterRisk === 'medium' && !alert.riskLevel.includes('Medium')) return false;
      if (filterRisk === 'low' && !alert.riskLevel.includes('Low')) return false;
    }
    return true;
  });

  const getRiskBadgeVariant = (riskLevel: string): 'default' | 'secondary' | 'destructive' => {
    if (riskLevel.includes('High')) return 'destructive';
    if (riskLevel.includes('Medium')) return 'secondary';
    return 'default';
  };

  const uniqueWards = Array.from(new Set(alerts.map(a => a.ward))).sort();

  return (
    <Card className="bg-white border-gray-200 shadow-md rounded-lg">
      <CardHeader className="p-6">
        <CardTitle className="text-2xl text-blue-600 font-bold">Alert History & Audit Log</CardTitle>
        <p className="text-sm text-gray-600 mt-1">Complete record of all risk assessments and alerts (13 columns)</p>
      </CardHeader>
      <CardContent className="p-6 pt-0 space-y-4">
        {/* Filters */}
        <div className="flex gap-4">
          <div className="flex-1">
            <Select value={filterWard} onValueChange={setFilterWard}>
              <SelectTrigger className="border-gray-300">
                <SelectValue placeholder="Filter by ward" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Wards</SelectItem>
                {uniqueWards.map(ward => (
                  <SelectItem key={ward} value={ward}>{ward}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <Select value={filterRisk} onValueChange={setFilterRisk}>
              <SelectTrigger className="border-gray-300">
                <SelectValue placeholder="Filter by risk" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Risk Levels</SelectItem>
                <SelectItem value="high">High Risk</SelectItem>
                <SelectItem value="medium">Medium Risk</SelectItem>
                <SelectItem value="low">Low Risk</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table */}
        <ScrollArea className="h-[500px] rounded-md border border-gray-200">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold text-gray-700">Date & Time</TableHead>
                <TableHead className="font-semibold text-gray-700">Ward</TableHead>
                <TableHead className="font-semibold text-gray-700">Rainfall</TableHead>
                <TableHead className="font-semibold text-gray-700">Humidity</TableHead>
                <TableHead className="font-semibold text-gray-700">Turbidity</TableHead>
                <TableHead className="font-semibold text-gray-700">Bacteria</TableHead>
                <TableHead className="font-semibold text-gray-700">Sanitation %</TableHead>
                <TableHead className="font-semibold text-gray-700">Water Treatment %</TableHead>
                <TableHead className="font-semibold text-gray-700">Risk Level</TableHead>
                <TableHead className="font-semibold text-gray-700">Risk %</TableHead>
                <TableHead className="font-semibold text-gray-700">Disease Most Likely</TableHead>
                <TableHead className="font-semibold text-gray-700">Priority Score</TableHead>
                <TableHead className="font-semibold text-gray-700">Email Sent</TableHead>
                <TableHead className="font-semibold text-gray-700">Recommended Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAlerts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={14} className="text-center text-gray-500 py-8">
                    No alerts recorded yet
                  </TableCell>
                </TableRow>
              ) : (
                filteredAlerts.map((alert, index) => (
                  <TableRow key={index} className="hover:bg-gray-50">
                    <TableCell className="text-sm">
                      {new Date(alert.timestamp).toLocaleString('en-IN', { 
                        timeZone: 'Asia/Kolkata',
                        dateStyle: 'short',
                        timeStyle: 'short'
                      })}
                    </TableCell>
                    <TableCell className="text-sm font-medium">{alert.ward}</TableCell>
                    <TableCell className="text-sm">{alert.rainfall.toFixed(1)} mm</TableCell>
                    <TableCell className="text-sm">{alert.humidity.toFixed(1)}%</TableCell>
                    <TableCell className="text-sm">{alert.turbidity.toFixed(1)} NTU</TableCell>
                    <TableCell className="text-sm">{alert.bacteria.toFixed(1)}</TableCell>
                    <TableCell className="text-sm">{alert.sanitationCoverage.toFixed(0)}%</TableCell>
                    <TableCell className="text-sm">{alert.waterTreatmentCoverage.toFixed(0)}%</TableCell>
                    <TableCell>
                      <Badge variant={getRiskBadgeVariant(alert.riskLevel)}>
                        {alert.riskLevel}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm font-semibold">{alert.riskPercentage.toFixed(1)}%</TableCell>
                    <TableCell className="text-sm font-medium">{alert.diseaseMostLikely}</TableCell>
                    <TableCell className="text-sm">{alert.priorityScore.toFixed(1)}</TableCell>
                    <TableCell className="text-sm">{alert.emailSent}</TableCell>
                    <TableCell className="text-sm max-w-xs truncate" title={alert.recommendedAction}>
                      {alert.recommendedAction}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </ScrollArea>

        <div className="text-sm text-gray-600">
          Showing {filteredAlerts.length} of {alerts.length} alerts
        </div>
      </CardContent>
    </Card>
  );
}
