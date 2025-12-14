import { useState, useCallback, useRef } from 'react';
import { TemplateType, GeneratedGraphic } from '@/types/template';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '@/config/templates';

export function useGraphicsGenerator() {
  const [generatedGraphics, setGeneratedGraphics] = useState<GeneratedGraphic[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const svgRef = useRef<SVGSVGElement | null>(null);

  const setSvgElement = useCallback((svg: SVGSVGElement | null) => {
    svgRef.current = svg;
  }, []);

  const generateGraphic = useCallback(
    async (
      templateType: TemplateType,
      filename: string
    ): Promise<GeneratedGraphic | null> => {
      const svgElement = svgRef.current;
      if (!svgElement) {
        console.error('No SVG element available');
        return null;
      }

      setIsGenerating(true);

      try {
        // Clone the SVG to avoid modifying the original
        const clonedSvg = svgElement.cloneNode(true) as SVGSVGElement;
        
        // Ensure proper dimensions for export
        clonedSvg.setAttribute('width', String(CANVAS_WIDTH));
        clonedSvg.setAttribute('height', String(CANVAS_HEIGHT));

        // Serialize SVG to string
        const serializer = new XMLSerializer();
        const svgString = serializer.serializeToString(clonedSvg);
        
        // Create a blob from the SVG
        const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
        const svgUrl = URL.createObjectURL(svgBlob);

        // Create an image from the SVG
        const img = new Image();
        img.width = CANVAS_WIDTH;
        img.height = CANVAS_HEIGHT;

        return new Promise((resolve) => {
          img.onload = () => {
            // Create canvas and draw the image
            const canvas = document.createElement('canvas');
            canvas.width = CANVAS_WIDTH;
            canvas.height = CANVAS_HEIGHT;
            const ctx = canvas.getContext('2d');
            
            if (!ctx) {
              URL.revokeObjectURL(svgUrl);
              setIsGenerating(false);
              resolve(null);
              return;
            }

            // Draw white background
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            
            // Draw the SVG image
            ctx.drawImage(img, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

            // Convert to PNG
            const imageUrl = canvas.toDataURL('image/png');
            URL.revokeObjectURL(svgUrl);

            const graphic: GeneratedGraphic = {
              id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              templateType,
              imageUrl,
              timestamp: new Date(),
              filename: filename || `${templateType}-${Date.now()}.png`,
            };

            setGeneratedGraphics((prev) => [graphic, ...prev]);
            setIsGenerating(false);
            resolve(graphic);
          };

          img.onerror = () => {
            console.error('Failed to load SVG as image');
            URL.revokeObjectURL(svgUrl);
            setIsGenerating(false);
            resolve(null);
          };

          img.src = svgUrl;
        });
      } catch (error) {
        console.error('Error generating graphic:', error);
        setIsGenerating(false);
        return null;
      }
    },
    []
  );

  const downloadGraphic = useCallback((graphic: GeneratedGraphic) => {
    const link = document.createElement('a');
    link.href = graphic.imageUrl;
    link.download = graphic.filename.endsWith('.png') ? graphic.filename : `${graphic.filename}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  const clearGraphics = useCallback(() => {
    setGeneratedGraphics([]);
  }, []);

  return {
    generatedGraphics,
    isGenerating,
    generateGraphic,
    downloadGraphic,
    clearGraphics,
    setSvgElement,
  };
}
