"use client";

import { useState, useEffect } from "react";
import type { VoucherData, VoucherTemplateId } from "@/types/voucher";
// import { initialVoucherData } from "@/types/voucher";
import useLocalStorage from "@/hooks/useLocalStorage";
import { VoucherForm } from "@/components/voucher/VoucherForm";
import { VoucherPreview } from "@/components/voucher/VoucherPreview";
import { TemplateSelector } from "@/components/voucher/TemplateSelector";
import { PdfDownloadButton } from "@/components/voucher/PdfDownloadButton";
import { ALL_TEMPLATES } from "@/lib/templateRegistry";
import { Toaster } from "@/components/ui/toaster";
import { Separator } from "@/components/ui/separator";
import { Zap } from "lucide-react";
import { format } from "date-fns"; // For date formatting if needed, though templates handle it

// Function to generate a unique voucher code (client-side)
const generateVoucherCode = (): string => {
	return `VCHR-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
};

export default function HomePage() {
	// Get default values from localStorage or use static initial data.
	// `initialVoucherData` is stable, preventing `useLocalStorage` from re-running due to its `initialValue` prop changing.
	const [defaultValuesFromStorage, setDefaultValuesInStorage] =
		useLocalStorage();
	console.log("defaultValuesFromStorage", defaultValuesFromStorage);
	// State to hold data once fully initialized on the client
	const [clientInitializedData, setClientInitializedData] =
		useState<VoucherData>(defaultValuesFromStorage);

	const [liveVoucherData, setLiveVoucherData] = useState<VoucherData>(
		defaultValuesFromStorage
	);
	const [selectedTemplateId, setSelectedTemplateId] =
		useState<VoucherTemplateId>("default");

	// Effect for client-side initialization
	useEffect(() => {
		// Start with data from localStorage (via defaultValuesFromStorage) or the static initialVoucherData.
		// Dates from localStorage will be strings if stored, so parse them.
		// If dates are null (from initialVoucherData if LS was empty), they'll be initialized.
		const currentDefaults: VoucherData = {
			...defaultValuesFromStorage,
			issueDate: defaultValuesFromStorage.issueDate
				? new Date(defaultValuesFromStorage.issueDate)
				: null,
			expirationDate: defaultValuesFromStorage.expirationDate
				? new Date(defaultValuesFromStorage.expirationDate)
				: null,
		};

		let finalCode = currentDefaults.voucherCode;
		let finalIssueDate = currentDefaults.issueDate;
		let finalExpirationDate = currentDefaults.expirationDate;
		let valuesWereInitialized = false;

		// Generate voucher code if missing or is the placeholder from initialVoucherData
		if (!finalCode || finalCode === defaultValuesFromStorage.voucherCode) {
			finalCode = generateVoucherCode();
			valuesWereInitialized = true;
		}

		// Initialize issueDate if it's null (it would be if from initialVoucherData because LS was empty)
		if (finalIssueDate === null) {
			finalIssueDate = new Date();
			valuesWereInitialized = true;
		}

		// Initialize expirationDate if it's null
		if (finalIssueDate && finalExpirationDate === null) {
			// Base expiration on the (potentially newly set) finalIssueDate
			finalExpirationDate = new Date(
				new Date(finalIssueDate).setDate(finalIssueDate.getDate() + 90)
			);
			valuesWereInitialized = true;
		}

		const fullyInitializedData: VoucherData = {
			...currentDefaults,
			voucherCode: finalCode,
			issueDate: finalIssueDate,
			expirationDate: finalExpirationDate,
		};

		setClientInitializedData(fullyInitializedData);
		setLiveVoucherData(fullyInitializedData);

		// If any value was initialized/generated, update localStorage via useLocalStorage's setter
		// if (valuesWereInitialized) {
		// 	setDefaultValuesInStorage(fullyInitializedData);
		// }
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []); // Runs once on client mount. defaultValuesFromStorage is stable initially.

	// Effect to synchronize liveVoucherData and clientInitializedData when defaults in storage change
	// This happens if user clicks "Save Current Values as Default"
	useEffect(() => {
		// Only run if client-side initialization is complete
		if (clientInitializedData) {
			const newDefaults: VoucherData = {
				...defaultValuesFromStorage,
				issueDate: defaultValuesFromStorage.issueDate
					? new Date(defaultValuesFromStorage.issueDate)
					: new Date(), // Ensure Date objects
				expirationDate: defaultValuesFromStorage.expirationDate
					? new Date(defaultValuesFromStorage.expirationDate)
					: null,
			};
			setLiveVoucherData(newDefaults);
			setClientInitializedData(newDefaults); // Keep form defaults in sync
		}
		// clientInitializedData is included to re-run this if it's reset by some other means,
		// though primarily this syncs changes from defaultValuesFromStorage.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [defaultValuesFromStorage]);

	const handleFormChange = (newData: VoucherData) => {
		setLiveVoucherData(newData);
	};

	const handleSaveDefaults = (newData: VoucherData) => {
		setDefaultValuesInStorage(newData); // This will trigger the useEffect above
	};

	if (!clientInitializedData) {
		// Render loading state until client-side initialization is complete
		return (
			<div className="flex items-center justify-center min-h-screen">
				<Zap className="w-12 h-12 animate-pulse text-primary" />
			</div>
		);
	}

	return (
		<>
			<main className="container mx-auto px-4 py-8 md:px-6 md:py-12">
				<header className="mb-10 text-center not-printable">
					<h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-primary">
						Voucher Generator <span className="text-yellow-400">Pro</span>
					</h1>
					<p className="mt-3 text-lg text-muted-foreground md:text-xl">
						Create, customize, and download professional vouchers in minutes.
					</p>
				</header>

				<div className="grid lg:grid-cols-12 gap-8 items-start">
					<div className="lg:col-span-5 xl:col-span-4 space-y-8 not-printable">
						<VoucherForm
							defaultValues={clientInitializedData} // Use the fully initialized data for the form
							onFormChange={handleFormChange}
							onSaveDefaults={handleSaveDefaults}
						/>
						<TemplateSelector
							templates={ALL_TEMPLATES}
							selectedTemplateId={selectedTemplateId}
							onSelectTemplate={setSelectedTemplateId}
						/>
					</div>

					<div className="lg:col-span-7 xl:col-span-8 md:sticky md:top-8 self-start space-y-6">
						<VoucherPreview
							data={liveVoucherData}
							templateId={selectedTemplateId}
						/>
						<PdfDownloadButton voucherData={liveVoucherData} />
					</div>
				</div>

				<Separator className="my-12 not-printable" />

				<footer className="text-center text-muted-foreground text-sm not-printable">
					<p>
						&copy; {new Date().getFullYear()} Voucher Generator Pro. Built with
						Ashraf Atef.
					</p>
				</footer>
			</main>
			<Toaster />
		</>
	);
}
