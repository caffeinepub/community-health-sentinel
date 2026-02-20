import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface AlertRecord {
  timestamp: string;
  ward: string;
  rainfall: number;
  humidity: number;
  turbidity: number;
  bacteria: number;
  sanitationCoverage: number;
  waterTreatmentCoverage: number;
  riskLevel: string;
  riskPercentage: number;
  diseaseMostLikely: string;
  priorityScore: number;
  emailSent: string;
  recommendedAction: string;
}

interface AlertHistoryProps {
  filterWard?: string;
}

export default function AlertHistory({ filterWard }: AlertHistoryProps) {
  const [alerts, setAlerts] = useState<AlertRecord[]>([]);
  const [wardFilter, setWardFilter] = useState<string>(filterWard || 'all');
  const [riskFilter, setRiskFilter] = useState<string>('all');

  useEffect(() => {
    loadAlerts();
    
    const handleUpdate = () => loadAlerts();
    window.addEventListener('risk-data-updated', handleUpdate);
    
    return () => window.removeEventListener('risk-data-updated', handleUpdate);
  }, []);

  useEffect(() => {
    if (filterWard) {
      setWardFilter(filterWard);
    }
  }, [filterWard]);

  const loadAlerts = () => {
    const storedAlerts = localStorage.getItem('cholera_alerts');
    if (storedAlerts) {
      setAlerts(JSON.parse(storedAlerts));
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    const wardMatch = wardFilter === 'all' || alert.ward.includes(wardFilter);
    const riskMatch = riskFilter === 'all' || alert.riskLevel.toLowerCase().includes(riskFilter.toLowerCase());
    return wardMatch && riskMatch;
  });

  const getRiskBadgeColor = (riskLevel: string) => {
    if (riskLevel.toLowerCase().includes('high') || riskLevel.toLowerCase().includes('red')) {
      return 'bg-red-600 text-white';
    } else if (riskLevel.toLowerCase().includes('medium') || riskLevel.toLowerCase().includes('yellow') || riskLevel.toLowerCase().includes('amber')) {
      return 'bg-yellow-500 text-white';
    } else {
      return 'bg-green-600 text-white';
    }
  };

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
    <Card className="bg-white shadow-md rounded-lg border-gray-200">
      <CardHeader className="p-6">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl text-blue-600 font-bold">Alert History</CardTitle>
          <div className="flex gap-3">
            <Select value={wardFilter} onValueChange={setWardFilter}>
              <SelectTrigger className="w-40 border-gray-300">
                <SelectValue placeholder="Filter by ward" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Wards</SelectItem>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(w => (
                  <SelectItem key={w} value={w.toString()}>Ward {w}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={riskFilter} onValueChange={setRiskFilter}>
              <SelectTrigger className="w-40 border-gray-300">
                <SelectValue placeholder="Filter by risk" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Risks</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        {filteredAlerts.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg">No alerts recorded yet</p>
            <p className="text-sm mt-2">Alerts will appear here after risk calculations</p>
          </div>
        ) : (
          <ScrollArea className="h-[600px]">
            <div className="overflow-x-auto">
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
                  {filteredAlerts.map((alert, index) => (
                    <TableRow key={index} className="hover:bg-gray-50">
                      <TableCell className="whitespace-nowrap">{formatDate(alert.timestamp)}</TableCell>
                      <TableCell className="font-medium">{alert.ward}</TableCell>
                      <TableCell>{alert.rainfall?.toFixed(1) || 'N/A'} mm</TableCell>
                      <TableCell>{alert.humidity?.toFixed(1) || 'N/A'}%</TableCell>
                      <TableCell>{alert.turbidity?.toFixed(1) || 'N/A'} NTU</TableCell>
                      <TableCell>{alert.bacteria?.toFixed(1) || 'N/A'}</TableCell>
                      <TableCell>{alert.sanitationCoverage?.toFixed(1) || 'N/A'}%</TableCell>
                      <TableCell>{alert.waterTreatmentCoverage?.toFixed(1) || 'N/A'}%</TableCell>
                      <TableCell>
                        <Badge className={getRiskBadgeColor(alert.riskLevel)}>
                          {alert.riskLevel}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-semibold">{alert.riskPercentage?.toFixed(1) || 'N/A'}%</TableCell>
                      <TableCell className="font-medium text-red-600">{alert.diseaseMostLikely || 'N/A'}</TableCell>
                      <TableCell className="font-semibold">{alert.priorityScore?.toFixed(1) || 'N/A'}</TableCell>
                      <TableCell>
                        <Badge className={alert.emailSent === 'Yes' ? 'bg-green-600 text-white' : 'bg-gray-400 text-white'}>
                          {alert.emailSent || 'No'}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-xs">{alert.recommendedAction || 'N/A'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
