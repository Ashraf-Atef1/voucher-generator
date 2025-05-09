"use client";

import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react"; // Changed icon to Printer
import { useToast } from "@/hooks/use-toast";
import type { VoucherData } from "@/types/voucher"; // Kept for potential future use or consistency
import { useState } from "react";

interface PdfDownloadButtonProps {
	voucherData: VoucherData; // Kept for potential future use, e.g. toast message content
}

export const PdfDownloadButton: React.FC<PdfDownloadButtonProps> = ({
	voucherData,
}) => {
	const { toast } = useToast();
	const [isPrinting, setIsPrinting] = useState(false);

	const handlePrint = () => {
		setIsPrinting(true); // Indicate that the print process has started

		// Brief delay to allow UI update before print dialog blocks main thread
		setTimeout(() => {
			try {
				window.print();
				toast({
					title: "Print Dialog Opened",
					description:
						"Please use your browser's print options, typically including 'Save as PDF'.",
				});
			} catch (error) {
				console.error("Error opening print dialog:", error);
				toast({
					title: "Error Opening Print Dialog",
					description: "An unexpected error occurred. Please try again.",
					variant: "destructive",
				});
			} finally {
				// Note: setIsPrinting(false) will be called immediately after window.print()
				// The actual printing/saving is asynchronous from the browser's perspective.
				// If more precise control is needed (e.g. after print dialog closes),
				// onafterprint event listener would be required, which is more complex.
				setIsPrinting(false);
			}
		}, 100); // 100ms delay
	};

	return (
		<Button
			onClick={handlePrint}
			className="w-full mt-6 pdf-download-button-container not-printable"
			disabled={isPrinting}
		>
			<Printer className="mr-2 h-4 w-4" />
			{isPrinting ? "Preparing to Print..." : "Print / Save Voucher as PDF"}
		</Button>
	);
};
