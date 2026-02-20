import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface WardSelectorProps {
  selectedWard: string;
  onWardChange: (ward: string) => void;
}

export default function WardSelector({ selectedWard, onWardChange }: WardSelectorProps) {
  return (
    <div className="bg-white border border-medical-border rounded-xl p-6 shadow-medical">
      <Label htmlFor="ward-select" className="text-medical-slate text-lg font-semibold mb-2 block">
        Select Ward <span className="text-medical-red">*</span> (Required)
      </Label>
      <Select value={selectedWard} onValueChange={onWardChange}>
        <SelectTrigger 
          id="ward-select"
          className="bg-white border-medical-border text-medical-slate focus:ring-medical-blue focus:border-medical-blue"
        >
          <SelectValue placeholder="Select a ward..." />
        </SelectTrigger>
        <SelectContent>
          {Array.from({ length: 9 }, (_, i) => (
            <SelectItem key={i + 1} value={`Ward ${i + 1}`}>
              Ward {i + 1}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
