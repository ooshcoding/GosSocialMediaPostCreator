export type TemplateType = 'robot-update' | 'subteam-week' | 'meet-mentor' | 'fun-fact' | 'crew-week';

export interface SvgTextField {
  id: string;
  label: string;
  placeholder: string;
  svgSelector: string; // CSS selector to find the text element in SVG
  multiline?: boolean;
}

export interface SvgImageZone {
  id: string;
  label: string;
  svgSelector: string; // CSS selector to find the image element in SVG
  shape?: 'rectangle' | 'circle'; // For UI preview only
}

export interface TemplateConfig {
  id: TemplateType;
  name: string;
  description: string;
  svgPath: string;
  fields: SvgTextField[];
  imageZones?: SvgImageZone[];
}

export interface GeneratedGraphic {
  id: string;
  templateType: TemplateType;
  imageUrl: string;
  timestamp: Date;
  filename: string;
}
