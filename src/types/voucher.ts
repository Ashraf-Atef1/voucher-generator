import type { ComponentType } from "react";

export interface VoucherData {
	// Existing fields
	recipientName?: string; // Guest name
	amount?: string; // Monetary value, might be less relevant or represent a discount/credit
	message?: string; // General message
	expirationDate?: Date | null; // When the voucher expires
	voucherCode?: string; // Unique code for the voucher

	// New fields for hotel voucher
	hotelName?: string;
	clientRepresentativeTitle?: "Mr" | "Ms";
	clientRepresentativeName?: string;
	roomName?: string;
	boardName?: string; // e.g., Full Board, Half Board, Bed & Breakfast
	numberOfAdults?: number;
	numberOfChildren?: number;
	issuerName?: string; // Person or company issuing the voucher
	issueDate?: Date | null; // Date the voucher was issued

	// Fields for logo and contact information
	logoUrl?: string; // Can be a web URL or a data URI for uploaded logos
	hotelAddress?: string;
	hotelPhoneNumber?: string;
	hotelEmail?: string;
	websiteUrl?: string;
}

export type VoucherTemplateId = "default" | "elegant" | "modern";

export interface TemplateProps {
	data: VoucherData;
	id: string; // For PDF generation targeting
}

export interface VoucherTemplate {
	id: VoucherTemplateId;
	name: string;
	component: ComponentType<TemplateProps>;
	previewImageUrl: string;
	previewImageHint: string;
}

// export const initialVoucherData: VoucherData = {
// 	// Existing fields
// 	recipientName: "",
// 	amount: "0.00",
// 	message: "Enjoy your stay! Please present this voucher upon arrival.",
// 	expirationDate: null,
// 	voucherCode: "",

// 	// Hotel specific fields
// 	hotelName: "The Grand Resort & Spa",
// 	clientRepresentativeTitle: "Mr",
// 	clientRepresentativeName: "",
// 	roomName: "Deluxe King Room",
// 	boardName: "Bed & Breakfast",
// 	numberOfAdults: 2,
// 	numberOfChildren: 0,
// 	issuerName: "Hotel Reservations Department",
// 	issueDate: null,

// 	// New contact and logo fields
// 	logoUrl: "", // Will store data URI for uploaded logos, or can be a web URL
// 	hotelAddress: "123 Luxury Lane, Paradise City",
// 	hotelPhoneNumber: "(123) 456-7890",
// 	hotelEmail: "reservations@grandresort.com",
// 	websiteUrl: "https://www.grandresortexample.com",
// };
