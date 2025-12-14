import { useRef } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Upload, X, ImageIcon } from 'lucide-react';

interface DynamicImageUploaderProps {
  imageElements: { id: string; label: string }[];
  images: Record<string, string>;
  onImageChange: (id: string, imageUrl: string | null) => void;
}

export function DynamicImageUploader({ imageElements, images, onImageChange }: DynamicImageUploaderProps) {
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const handleFileChange = (id: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onImageChange(id, e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemove = (id: string) => {
    onImageChange(id, null);
    if (inputRefs.current[id]) {
      inputRefs.current[id]!.value = '';
    }
  };

  if (imageElements.length === 0) {
    return (
      <div className="text-muted-foreground text-sm py-4 text-center">
        No image placeholders detected in this template
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {imageElements.map((element) => (
          <div key={element.id} className="space-y-2">
            <Label className="text-xs font-medium text-foreground flex items-center gap-1.5">
              <ImageIcon className="w-3 h-3" />
              {element.label}
            </Label>
            
            {images[element.id] ? (
              <div className="relative inline-block">
                <div 
                  className="overflow-hidden border-2 border-border rounded-lg"
                  style={{ width: 80, height: 80 }}
                >
                  <img
                    src={images[element.id]}
                    alt={element.label}
                    className="w-full h-full object-cover"
                  />
                </div>
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute -top-2 -right-2 w-5 h-5"
                  onClick={() => handleRemove(element.id)}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ) : (
              <div
                onClick={() => inputRefs.current[element.id]?.click()}
                className="cursor-pointer border-2 border-dashed border-border hover:border-accent transition-colors flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-accent rounded-lg"
                style={{ width: 80, height: 80 }}
              >
                <Upload className="w-4 h-4" />
                <span className="text-[10px]">Upload</span>
              </div>
            )}
            
            <input
              ref={(el) => (inputRefs.current[element.id] = el)}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileChange(element.id, e)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
