import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Type } from 'lucide-react';

interface DynamicTextFormProps {
  textElements: { id: string; label: string; originalContent?: string }[];
  values: Record<string, string>;
  onChange: (id: string, value: string) => void;
}

export function DynamicTextForm({ textElements, values, onChange }: DynamicTextFormProps) {
  if (textElements.length === 0) {
    return (
      <div className="text-muted-foreground text-sm py-4 text-center">
        No editable text detected in this template
      </div>
    );
  }

  return (
    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
      {textElements.map((element) => {
        const isLongText = (element.originalContent?.length || 0) > 50;
        
        return (
          <div key={element.id} className="space-y-1.5">
            <Label htmlFor={element.id} className="text-xs font-medium text-foreground flex items-center gap-1.5">
              <Type className="w-3 h-3" />
              {element.label}
            </Label>
            {isLongText ? (
              <Textarea
                id={element.id}
                placeholder={element.originalContent || 'Enter text...'}
                value={values[element.id] || ''}
                onChange={(e) => onChange(element.id, e.target.value)}
                className="bg-background border-border min-h-[80px] text-sm"
              />
            ) : (
              <Input
                id={element.id}
                type="text"
                placeholder={element.originalContent || 'Enter text...'}
                value={values[element.id] || ''}
                onChange={(e) => onChange(element.id, e.target.value)}
                className="bg-background border-border text-sm"
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
