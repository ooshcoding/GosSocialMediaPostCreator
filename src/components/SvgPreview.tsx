import { useEffect, useRef, useState, useCallback } from 'react';
import { TemplateType } from '@/types/template';
import { templateConfigs } from '@/config/templates';

interface DetectedElement {
  id: string;
  type: 'image' | 'text';
  label: string;
  originalContent?: string;
}

interface SvgPreviewProps {
  templateType: TemplateType;
  fieldValues: Record<string, string>;
  zoneImages: Record<string, string>;
  onSvgReady?: (svg: SVGSVGElement) => void;
  onElementsDetected?: (elements: DetectedElement[]) => void;
}

export function SvgPreview({ 
  templateType, 
  fieldValues, 
  zoneImages, 
  onSvgReady,
  onElementsDetected 
}: SvgPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [detectedElements, setDetectedElements] = useState<DetectedElement[]>([]);

  const config = templateConfigs.find((t) => t.id === templateType);

  // Load SVG file
  useEffect(() => {
    if (!config) return;

    setLoading(true);
    setError(null);
    setDetectedElements([]);
    
    fetch(config.svgPath)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load SVG: ${res.status}`);
        return res.text();
      })
      .then((svg) => {
        setSvgContent(svg);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load SVG:', err);
        setError(err.message);
        setLoading(false);
      });
  }, [config?.svgPath, templateType]);

  // Parse SVG and detect editable elements (only on initial load)
  useEffect(() => {
    if (!svgContent || detectedElements.length > 0) return;

    // Parse SVG to detect elements
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgContent, 'image/svg+xml');
    const svg = doc.querySelector('svg');
    if (!svg) return;

    const elements: DetectedElement[] = [];
    
    // Find all image elements
    const imageElements = svg.querySelectorAll('image');
    imageElements.forEach((img, index) => {
      const id = `image-${index}`;
      elements.push({
        id,
        type: 'image',
        label: `Image ${index + 1}`,
      });
    });

    // Find all text and tspan elements with substantial content
    const textElements = svg.querySelectorAll('text, tspan');
    const processedContents = new Set<string>();
    
    textElements.forEach((text, index) => {
      let content = text.textContent?.trim() || '';
      
      // Only include elements with meaningful text that hasn't been processed
      if (content.length > 1 && content.length < 200 && !processedContents.has(content)) {
        processedContents.add(content);
        const id = `text-${index}`;
        elements.push({
          id,
          type: 'text',
          label: content.length > 25 ? `${content.substring(0, 25)}...` : content,
          originalContent: content,
        });
      }
    });

    setDetectedElements(elements);
    if (onElementsDetected) {
      onElementsDetected(elements);
    }
  }, [svgContent, onElementsDetected, detectedElements.length]);

  // Update SVG display when values change
  useEffect(() => {
    if (!containerRef.current || !svgContent) return;

    const container = containerRef.current;
    container.innerHTML = svgContent;

    const svg = container.querySelector('svg');
    if (!svg) return;

    // Make SVG responsive
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', 'auto');
    svg.style.display = 'block';

    // Update image elements by index
    const imageElements = svg.querySelectorAll('image');
    imageElements.forEach((img, index) => {
      const id = `image-${index}`;
      const imageUrl = zoneImages[id];
      if (imageUrl) {
        img.setAttribute('href', imageUrl);
        img.setAttribute('xlink:href', imageUrl);
      }
    });

    // Update text elements
    const textElements = svg.querySelectorAll('text, tspan');
    const processedContents = new Set<string>();
    
    textElements.forEach((text, index) => {
      const content = text.textContent?.trim() || '';
      if (content.length > 1 && content.length < 200 && !processedContents.has(content)) {
        processedContents.add(content);
        const id = `text-${index}`;
        if (fieldValues[id] !== undefined && fieldValues[id] !== '') {
          text.textContent = fieldValues[id];
        }
      }
    });

    // Notify parent that SVG is ready for export
    if (onSvgReady) {
      onSvgReady(svg);
    }
  }, [svgContent, fieldValues, zoneImages, onSvgReady]);

  if (loading) {
    return (
      <div className="relative rounded-xl overflow-hidden shadow-lg border border-border bg-card flex items-center justify-center h-[500px]">
        <div className="text-muted-foreground">Loading template...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative rounded-xl overflow-hidden shadow-lg border border-border bg-card flex items-center justify-center h-[500px]">
        <div className="text-destructive text-center p-4">
          <p>Error loading template</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative rounded-xl overflow-hidden shadow-lg border border-border bg-card">
      <div 
        ref={containerRef}
        className="w-full [&>svg]:w-full [&>svg]:h-auto"
      />
      <div className="absolute top-3 left-3 px-3 py-1.5 bg-steel-dark/80 backdrop-blur-sm rounded-md">
        <span className="text-xs font-semibold text-white/80">LIVE PREVIEW</span>
      </div>
    </div>
  );
}

export type { DetectedElement };
