import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface AlertRecord {
  timestamp: string;
  ward: string;
  riskLevel: string;
  probability: number;
  actionRecommended: string;
}

interface AlertHistoryProps {
  filterWard?: string;
}

export default function AlertHistory({ filterWard }: AlertHistoryProps) {
  const [alerts, setAlerts] = useState<AlertRecord[]>([]);
  const [wardFilter, setWardFilter] = useState<string>('All');
  const [riskFilter, setRiskFilter] = useState<string>('All');

  useEffect(() => {
    // Load alerts from localStorage
    const storedAlerts = JSON.parse(localStorage.getItem('alertHistory') || '[]');
    setAlerts(storedAlerts);
  }, []);

  const filteredAlerts = alerts.filter(alert => {
    if (filterWard && alert.ward !== filterWard) return false;
    if (wardFilter !== 'All' && alert.ward !== wardFilter) return false;
    if (riskFilter !== 'All' && alert.riskLevel !== riskFilter) return false;
    return true;
  });

  const getRiskBadgeColor = (riskLevel: string) => {
    if (riskLevel === 'HIGH') return 'bg-medical-red text-white';
    if (riskLevel === 'MEDIUM') return 'bg-medical-orange text-white';
    return 'bg-medical-green text-white';
  };

  return (
    <Card className="bg-white border-medical-border shadow-medical rounded-xl">
      <CardHeader className="p-6">
        <CardTitle className="text-2xl text-medical-slate">Alert History</CardTitle>
      </CardHeader>
      <CardContent className="p-6 pt-0 space-y-4">
        {/* Filters */}
        {!filterWard && (
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-sm text-medical-grey mb-2 block">Filter by Ward</label>
              <Select value={wardFilter} onValueChange={setWardFilter}>
                <SelectTrigger className="bg-white border-medical-border">
                  <SelectValue placeholder="All Wards" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Wards</SelectItem>
                  {Array.from({ length: 9 }, (_, i) => (
                    <SelectItem key={i + 1} value={`Ward ${i + 1}`}>Ward {i + 1}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <label className="text-sm text-medical-grey mb-2 block">Filter by Risk Level</label>
              <Select value={riskFilter} onValueChange={setRiskFilter}>
                <SelectTrigger className="bg-white border-medical-border">
                  <SelectValue placeholder="All Levels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Levels</SelectItem>
                  <SelectItem value="HIGH">HIGH</SelectItem>
                  <SelectItem value="MEDIUM">MEDIUM</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* Alerts Table */}
        <div className="overflow-x-auto">
          {filteredAlerts.length === 0 ? (
            <div className="text-center py-8 text-medical-grey">
              No alerts recorded yet. Alerts will appear here when risk levels reach MEDIUM or HIGH.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-medical-slate font-semibold">Date & Time</TableHead>
                  <TableHead className="text-medical-slate font-semibold">Ward</TableHead>
                  <TableHead className="text-medical-slate font-semibold">Risk Level</TableHead>
                  <TableHead className="text-medical-slate font-semibold">Probability</TableHead>
                  <TableHead className="text-medical-slate font-semibold">Action Recommended</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAlerts.map((alert, index) => (
                  <TableRow key={index}>
                    <TableCell className="text-medical-grey">
                      {new Date(alert.timestamp).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-medical-grey">{alert.ward}</TableCell>
                    <TableCell>
                      <Badge className={getRiskBadgeColor(alert.riskLevel)}>
                        {alert.riskLevel}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-medical-grey">{alert.probability.toFixed(1)}%</TableCell>
                    <TableCell className="text-medical-grey">{alert.actionRecommended}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
