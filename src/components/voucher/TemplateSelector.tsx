
"use client";

import type { VoucherTemplate, VoucherTemplateId } from '@/types/voucher';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import { Palette } from 'lucide-react';
import { cn } from '@/lib/utils'; // Import cn from lib/utils

interface TemplateSelectorProps {
  templates: VoucherTemplate[];
  selectedTemplateId: VoucherTemplateId;
  onSelectTemplate: (id: VoucherTemplateId) => void;
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({ templates, selectedTemplateId, onSelectTemplate }) => {
  return (
    <Card className="shadow-sm bg-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="w-6 h-6 text-primary" />
          Choose a Template
        </CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={selectedTemplateId}
          onValueChange={(id) => onSelectTemplate(id as VoucherTemplateId)}
          className="space-y-4"
        >
          {templates.map((template) => (
            <Label
              key={template.id}
              htmlFor={template.id}
              className={cn(
                "flex flex-col items-center p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md",
                selectedTemplateId === template.id ? "border-primary ring-2 ring-primary shadow-lg" : "border-border"
              )}
            >
              <RadioGroupItem value={template.id} id={template.id} className="sr-only" />
              <Image
                src={template.previewImageUrl}
                alt={`${template.name} Preview`}
                width={150}
                height={100}
                className="rounded-md mb-2 object-cover border"
                data-ai-hint={template.previewImageHint}
              />
              <span className="text-sm font-medium text-foreground">{template.name}</span>
            </Label>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );
};

// Removed local cn definition, now imported from @/lib/utils
