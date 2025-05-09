
import type { VoucherTemplate, VoucherTemplateId, TemplateProps } from '@/types/voucher';
import { DefaultTemplate } from '@/components/voucher/templates/DefaultTemplate';
import { ElegantTemplate } from '@/components/voucher/templates/ElegantTemplate';
import { ModernTemplate } from '@/components/voucher/templates/ModernTemplate';

export const TEMPLATE_PREVIEW_ELEMENT_ID = "voucher-preview-area";

export const ALL_TEMPLATES: VoucherTemplate[] = [
  {
    id: 'default',
    name: 'Default Friendly',
    component: (props: TemplateProps) => <DefaultTemplate {...props} />,
    previewImageUrl: `https://picsum.photos/seed/defaultVoucher/150/100`,
    previewImageHint: 'voucher friendly'
  },
  {
    id: 'elegant',
    name: 'Elegant Gold',
    component: (props: TemplateProps) => <ElegantTemplate {...props} />,
    previewImageUrl: `https://picsum.photos/seed/elegantVoucher/150/100`,
    previewImageHint: 'voucher gold'
  },
  {
    id: 'modern',
    name: 'Modern Minimal',
    component: (props: TemplateProps) => <ModernTemplate {...props} />,
    previewImageUrl: `https://picsum.photos/seed/modernVoucher/150/100`,
    previewImageHint: 'voucher minimal'
  },
];

export const getTemplateById = (id: VoucherTemplateId): VoucherTemplate | undefined => {
  return ALL_TEMPLATES.find(t => t.id === id);
};
