"use client";

import type { VoucherData, VoucherTemplateId } from "@/types/voucher";
import {
	getTemplateById,
	TEMPLATE_PREVIEW_ELEMENT_ID,
} from "@/lib/templateRegistry";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye } from "lucide-react";

interface VoucherPreviewProps {
	data: VoucherData;
	templateId: VoucherTemplateId;
}

export const VoucherPreview: React.FC<VoucherPreviewProps> = ({
	data,
	templateId,
}) => {
	const selectedTemplate = getTemplateById(templateId);

	if (!selectedTemplate) {
		return (
			<Card className="shadow-lg">
				<CardHeader>
					<CardTitle>Error</CardTitle>
				</CardHeader>
				<CardContent>
					<p>Template not found. Please select a valid template.</p>
				</CardContent>
			</Card>
		);
	}

	const TemplateComponent = selectedTemplate.component;

	return (
		<div className="p-4 border rounded-lg shadow-sm bg-muted/30">
			<h3 className="text-lg font-semibold mb-4 text-foreground flex items-center gap-2 not-printable">
				<Eye className="w-5 h-5 text-primary" />
				Live Preview
			</h3>
			<div
				className="flex justify-center items-start overflow-auto"
				style={{
					maxWidth: "calc(100vw - 64px)",
				}}
			>
				{/* The TemplateComponent will render the actual voucher with id={TEMPLATE_PREVIEW_ELEMENT_ID} */}
				<TemplateComponent data={data} id={TEMPLATE_PREVIEW_ELEMENT_ID} />
			</div>
		</div>
	);
};
