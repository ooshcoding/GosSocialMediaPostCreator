import { GeneratedGraphic } from '@/types/template';
import { Button } from '@/components/ui/button';
import { Download, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface OutputSectionProps {
  graphics: GeneratedGraphic[];
  onDownload: (graphic: GeneratedGraphic) => void;
}

export function OutputSection({ graphics, onDownload }: OutputSectionProps) {
  if (graphics.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {graphics.map((graphic) => (
          <div
            key={graphic.id}
            className="group relative rounded-lg overflow-hidden border border-border bg-card hover:shadow-md transition-shadow"
          >
            <img
              src={graphic.imageUrl}
              alt={graphic.filename}
              className="w-full aspect-square object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-steel-dark/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="text-white font-medium text-sm truncate mb-1">{graphic.filename}</p>
                <div className="flex items-center gap-1 text-white/60 text-xs mb-3">
                  <Clock className="w-3 h-3" />
                  {formatDistanceToNow(graphic.timestamp, { addSuffix: true })}
                </div>
                <Button
                  size="sm"
                  className="w-full"
                  onClick={() => onDownload(graphic)}
                >
                  <Download className="w-4 h-4 mr-1" />
                  Download PNG
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
