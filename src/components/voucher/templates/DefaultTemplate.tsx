"use client";

import type { TemplateProps } from "@/types/voucher";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
	BedDouble,
	UserCheck,
	Users,
	CalendarDays,
	Tag,
	Building,
	Building2,
	Phone,
	Mail,
	Globe,
	MapPin,
} from "lucide-react";
import { format } from "date-fns";
import Image from "next/image";

export const DefaultTemplate: React.FC<TemplateProps> = ({ data, id }) => {
	const formattedAmount = data.amount
		? parseFloat(data.amount)?.toFixed(2)
		: "0.00";
	const hasMonetaryValue = parseFloat(formattedAmount) > 0;

	return (
		<Card
			id={id}
			className="w-[600px] h-auto shadow-xl rounded-lg border-2 border-primary/20 bg-card"
		>
			<CardHeader className="p-6 bg-muted/30 border-b border-primary/20">
				<div className="flex justify-between items-start">
					<div>
						{data.logoUrl ? (
							<Image
								src={data.logoUrl}
								alt={`${data.hotelName || "Hotel"} Logo`}
								width={120}
								height={60}
								className="object-contain max-h-[60px] rounded p-1" /* Removed border */
								data-ai-hint="company logo"
							/>
						) : (
							<div className="w-[120px] h-[60px] flex justify-center items-center bg-muted rounded border border-dashed">
								<Building2
									className="w-10 h-10 text-muted-foreground"
									data-ai-hint="hotel building"
								/>
							</div>
						)}
						<h2 className="text-2xl font-bold text-primary mt-2">
							{data.hotelName || "Hotel Voucher"}
						</h2>
						<p className="text-sm text-muted-foreground">
							Accommodation Voucher
						</p>
					</div>
					<div className="text-right text-xs text-muted-foreground space-y-0.5 max-w-[220px]">
						{data.hotelAddress && (
							<p className="flex items-center justify-end gap-1">
								<MapPin size={12} /> {data.hotelAddress}
							</p>
						)}
						{data.hotelPhoneNumber && (
							<p className="flex items-center justify-end gap-1">
								<Phone size={12} /> {data.hotelPhoneNumber}
							</p>
						)}
						{data.hotelEmail && (
							<p className="flex items-center justify-end gap-1">
								<Mail size={12} /> {data.hotelEmail}
							</p>
						)}
						{data.websiteUrl && (
							<p className="flex items-center justify-end gap-1">
								<Globe size={12} />{" "}
								<a
									href={data.websiteUrl}
									target="_blank"
									rel="noopener noreferrer"
									className="text-primary hover:underline truncate"
								>
									{data.websiteUrl.replace(/^https?:\/\//, "")}
								</a>
							</p>
						)}
					</div>
				</div>
			</CardHeader>

			<CardContent className="p-6 space-y-4">
				<div className="grid grid-cols-2 gap-x-6 gap-y-4">
					<div>
						<p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
							Guest Name
						</p>
						<p className="text-lg font-medium text-foreground">
							{data.recipientName || "Valued Guest"}
						</p>
					</div>
					<div>
						<p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
							Client Representative
						</p>
						<p className="text-sm text-foreground">
							{data.clientRepresentativeTitle}.{" "}
							{data.clientRepresentativeName || "N/A"}
						</p>
					</div>
					<div>
						<p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
							Accommodation
						</p>
						<p className="text-sm text-foreground">{data.roomName || "N/A"}</p>
					</div>
					<div>
						<p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
							Board / Package
						</p>
						<p className="text-sm text-foreground">{data.boardName || "N/A"}</p>
					</div>
					<div>
						<p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
							Guests
						</p>
						<p className="text-sm text-foreground">
							{data.numberOfAdults} Adult(s)
							{data.numberOfChildren && data.numberOfChildren > 0
								? `, ${data.numberOfChildren} Child(ren)`
								: ""}
						</p>
					</div>
				</div>

				{hasMonetaryValue && (
					<>
						<Separator className="my-4" />
						<div className="text-center p-3 bg-accent/10 rounded-md border border-accent/30">
							<p className="text-sm text-accent-foreground/80 uppercase tracking-wider">
								Voucher Value / Credit
							</p>
							<p className="text-3xl font-bold text-accent-foreground">
								${formattedAmount}
							</p>
						</div>
					</>
				)}

				{data.message && (
					<div className="mt-4 p-3 bg-secondary/10 rounded-md border border-secondary/20">
						<p className="text-xs text-muted-foreground uppercase tracking-wider">
							Message / Conditions:
						</p>
						<p className="text-sm text-neutral-950 whitespace-pre-line">
							{data.message}
						</p>
					</div>
				)}

				<Separator className="my-4" />

				<div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs text-muted-foreground">
					<div>
						<p className="font-semibold">Issued by:</p>
						<p>{data.issuerName || "Hotel Management"}</p>
					</div>
					<div>
						<p className="font-semibold">Voucher Code:</p>
						<p className="font-mono bg-muted px-1.5 py-0.5 rounded text-sm text-foreground">
							{data.voucherCode || "N/A"}
						</p>
					</div>
					<div>
						<p className="font-semibold flex items-center gap-1">
							<CalendarDays size={14} /> Issued Date:
						</p>
						<p>
							{data.issueDate
								? format(new Date(data.issueDate), "MMMM dd, yyyy")
								: "N/A"}
						</p>
					</div>
					{data.expirationDate && (
						<div>
							<p className="font-semibold flex items-center gap-1">
								<CalendarDays size={14} /> Expiration Date:
							</p>
							<p>{format(new Date(data.expirationDate), "MMMM dd, yyyy")}</p>
						</div>
					)}
				</div>
				<p className="text-center text-[10px] text-muted-foreground/70 mt-4">
					Please present this voucher upon arrival. Terms and conditions apply.
				</p>
			</CardContent>
		</Card>
	);
};
