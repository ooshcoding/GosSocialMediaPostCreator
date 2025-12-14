import { useState, useCallback } from 'react';
import { TemplateType } from '@/types/template';
import { templateConfigs } from '@/config/templates';
import { TemplateSelector } from '@/components/TemplateSelector';
import { DynamicImageUploader } from '@/components/DynamicImageUploader';
import { DynamicTextForm } from '@/components/DynamicTextForm';
import { SvgPreview, DetectedElement } from '@/components/SvgPreview';
import { OutputSection } from '@/components/OutputSection';
import { useGraphicsGenerator } from '@/hooks/useGraphicsGenerator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Download, Loader2, Image, Type } from 'lucide-react';
import { toast } from 'sonner';

export default function Index() {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>('robot-update');
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const [zoneImages, setZoneImages] = useState<Record<string, string>>({});
  const [filename, setFilename] = useState('');
  const [detectedElements, setDetectedElements] = useState<DetectedElement[]>([]);

  const { generateGraphic, downloadGraphic, isGenerating, generatedGraphics, setSvgElement } = useGraphicsGenerator();

  const config = templateConfigs.find((t) => t.id === selectedTemplate);

  const imageElements = detectedElements.filter(el => el.type === 'image');
  const textElements = detectedElements.filter(el => el.type === 'text');

  const handleTemplateChange = (template: TemplateType) => {
    setSelectedTemplate(template);
    setFieldValues({});
    setZoneImages({});
    setDetectedElements([]);
  };

  const handleFieldChange = (fieldId: string, value: string) => {
    setFieldValues((prev) => ({ ...prev, [fieldId]: value }));
  };

  const handleZoneImageChange = (zoneId: string, imageUrl: string | null) => {
    setZoneImages((prev) => {
      if (imageUrl === null) {
        const { [zoneId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [zoneId]: imageUrl };
    });
  };

  const handleSvgReady = useCallback((svg: SVGSVGElement) => {
    setSvgElement(svg);
  }, [setSvgElement]);

  const handleElementsDetected = useCallback((elements: DetectedElement[]) => {
    setDetectedElements(elements);
  }, []);

  const handleGenerate = async () => {
    const graphic = await generateGraphic(
      selectedTemplate,
      filename || `${selectedTemplate}-${Date.now()}`
    );

    if (graphic) {
      toast.success('Graphic generated successfully!');
      downloadGraphic(graphic);
    } else {
      toast.error('Failed to generate graphic');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
              <span className="text-accent-foreground font-black text-lg">GS</span>
            </div>
            <div>
              <h1 className="text-xl font-black text-foreground">Girls of Steel Graphics</h1>
              <p className="text-xs text-muted-foreground">Automated Media Graphics System</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <section>
              <h2 className="text-lg font-bold text-foreground mb-4">1. Select Template</h2>
              <TemplateSelector selected={selectedTemplate} onSelect={handleTemplateChange} />
            </section>

            {imageElements.length > 0 && (
              <section>
                <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                  <Image className="w-5 h-5" />
                  2. Upload Photos
                  <span className="text-sm font-normal text-muted-foreground">
                    ({imageElements.length} found)
                  </span>
                </h2>
                <div className="bg-card rounded-xl border border-border p-5">
                  <DynamicImageUploader
                    imageElements={imageElements}
                    images={zoneImages}
                    onImageChange={handleZoneImageChange}
                  />
                </div>
              </section>
            )}

            {textElements.length > 0 && (
              <section>
                <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                  <Type className="w-5 h-5" />
                  {imageElements.length > 0 ? '3.' : '2.'} Enter Content
                  <span className="text-sm font-normal text-muted-foreground">
                    ({textElements.length} found)
                  </span>
                </h2>
                <div className="bg-card rounded-xl border border-border p-5">
                  <DynamicTextForm
                    textElements={textElements}
                    values={fieldValues}
                    onChange={handleFieldChange}
                  />
                </div>
              </section>
            )}

            <section>
              <h2 className="text-lg font-bold text-foreground mb-4">
                {imageElements.length > 0 && textElements.length > 0 ? '4.' : 
                 imageElements.length > 0 || textElements.length > 0 ? '3.' : '2.'} Generate
              </h2>
              <div className="bg-card rounded-xl border border-border p-5 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="filename" className="text-sm font-medium">Output Filename</Label>
                  <Input
                    id="filename"
                    type="text"
                    placeholder="my-graphic"
                    value={filename}
                    onChange={(e) => setFilename(e.target.value)}
                    className="bg-background"
                  />
                  <p className="text-xs text-muted-foreground">.png will be added automatically</p>
                </div>

                <Button onClick={handleGenerate} disabled={isGenerating} className="w-full" size="lg">
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 mr-2" />
                      Generate & Download
                    </>
                  )}
                </Button>
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <section>
              <h2 className="text-lg font-bold text-foreground mb-4">Live Preview</h2>
              <SvgPreview 
                templateType={selectedTemplate} 
                fieldValues={fieldValues} 
                zoneImages={zoneImages}
                onSvgReady={handleSvgReady}
                onElementsDetected={handleElementsDetected}
              />
              {detectedElements.length > 0 && (
                <p className="text-xs text-muted-foreground mt-2">
                  Detected: {imageElements.length} image(s), {textElements.length} text element(s)
                </p>
              )}
            </section>

            {generatedGraphics.length > 0 && (
              <section>
                <h2 className="text-lg font-bold text-foreground mb-4">Generated Graphics</h2>
                <OutputSection graphics={generatedGraphics} onDownload={downloadGraphic} />
              </section>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
