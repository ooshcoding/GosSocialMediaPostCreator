import { TemplateType } from '@/types/template';
import { templateConfigs } from '@/config/templates';
import { cn } from '@/lib/utils';
import { Bot, Users, UserCircle, Lightbulb, Award } from 'lucide-react';

interface TemplateSelectorProps {
  selected: TemplateType;
  onSelect: (type: TemplateType) => void;
}

const templateIcons: Record<TemplateType, React.ReactNode> = {
  'robot-update': <Bot className="w-6 h-6" />,
  'subteam-week': <Users className="w-6 h-6" />,
  'meet-mentor': <UserCircle className="w-6 h-6" />,
  'fun-fact': <Lightbulb className="w-6 h-6" />,
  'crew-week': <Award className="w-6 h-6" />,
};

export function TemplateSelector({ selected, onSelect }: TemplateSelectorProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {templateConfigs.map((template) => (
        <button
          key={template.id}
          onClick={() => onSelect(template.id)}
          className={cn(
            'group relative p-4 rounded-xl border-2 transition-all duration-300 text-left',
            'hover:shadow-lg hover:-translate-y-1',
            selected === template.id
              ? 'border-accent bg-accent/5 shadow-accent-glow'
              : 'border-border bg-card hover:border-accent/50'
          )}
        >
          <div className="flex items-start gap-3">
            <div
              className={cn(
                'inline-flex items-center justify-center w-10 h-10 rounded-lg transition-colors flex-shrink-0',
                selected === template.id
                  ? 'bg-accent text-accent-foreground'
                  : 'bg-muted text-muted-foreground group-hover:bg-accent/20 group-hover:text-accent'
              )}
            >
              {templateIcons[template.id]}
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-foreground mb-0.5 truncate">{template.name}</h3>
              <p className="text-xs text-muted-foreground line-clamp-2">{template.description}</p>
            </div>
          </div>
          {selected === template.id && (
            <div className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-accent animate-pulse-soft" />
          )}
        </button>
      ))}
    </div>
  );
}
