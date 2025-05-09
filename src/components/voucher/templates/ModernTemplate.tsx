"use client";

import type { TemplateProps } from "@/types/voucher";
import { Card, CardContent } from "@/components/ui/card";
import {
	QrCode,
	Bed,
	Users2,
	ShieldCheck,
	CalendarDays,
	User,
	Building2,
	Phone,
	Mail,
	Globe,
	MapPin,
} from "lucide-react";
import { format } from "date-fns";
import Image from "next/image";

export const ModernTemplate: React.FC<TemplateProps> = ({ data, id }) => {
	const formattedAmount = data.amount
		? parseFloat(data.amount)?.toFixed(2)
		: "0.00";
	const hasMonetaryValue = parseFloat(formattedAmount) > 0;

	return (
		<Card
			id={id}
			className="w-[600px] h-auto shadow-xl rounded-xl border border-border bg-card overflow-hidden flex flex-col"
		>
			<header className="p-6 bg-foreground text-background flex justify-between items-center">
				<div>
					{data.logoUrl ? (
						<Image
							src={data.logoUrl}
							alt={`${data.hotelName || "Hotel"} Logo`}
							width={100}
							height={50}
							className="object-contain max-h-[50px] mb-2 rounded p-0.5" /* Removed border and border-background/20 */
							data-ai-hint="modern hotel logo"
						/>
					) : (
						<div className="w-[100px] h-[50px] flex justify-center items-center bg-background/10 rounded mb-2 border border-dashed border-background/30">
							<Building2
								className="w-8 h-8 text-background/70"
								data-ai-hint="contemporary building"
							/>
						</div>
					)}
					<h3 className="text-xl font-semibold tracking-tight">
						{data.hotelName || "STAY VOUCHER"}
					</h3>
					<p className="text-xs text-background/70 uppercase tracking-wider">
						CONFIRMATION VOUCHER
					</p>
				</div>
				<QrCode className="w-12 h-12 text-background/80" />
			</header>

			<CardContent className="p-6 space-y-5 flex-grow">
				<section>
					<Label className="text-xs uppercase text-muted-foreground tracking-wider flex items-center gap-1">
						<Users2 size={14} /> Guest Information
					</Label>
					<div className="mt-1 p-3 bg-muted/30 rounded-md space-y-1">
						<RowItem
							label="Guest Name"
							value={data.recipientName || "Valued Individual"}
						/>
						<RowItem
							label="Client Representative"
							value={`${data.clientRepresentativeTitle}. ${
								data.clientRepresentativeName || "N/A"
							}`}
							icon={<User size={14} className="text-primary" />}
						/>
					</div>
				</section>

				<section>
					<Label className="text-xs uppercase text-muted-foreground tracking-wider flex items-center gap-1">
						<Bed size={14} /> Stay Details
					</Label>
					<div className="mt-1 p-3 bg-muted/30 rounded-md grid grid-cols-2 gap-x-4 gap-y-2">
						<RowItem label="Room" value={data.roomName || "N/A"} />
						<RowItem
							label="Board/Package"
							value={data.boardName || "N/A"}
							icon={<ShieldCheck size={14} className="text-primary" />}
						/>
						<RowItem
							label="Occupancy"
							value={`${data.numberOfAdults} Adult(s)${
								data.numberOfChildren && data.numberOfChildren > 0
									? `, ${data.numberOfChildren} Child(ren)`
									: ""
							}`}
						/>
					</div>
				</section>

				{hasMonetaryValue && (
					<section>
						<Label className="text-xs uppercase text-muted-foreground tracking-wider">
							Credit / Value
						</Label>
						<div className="mt-1 p-3 bg-primary/10 rounded-md text-center">
							<p className="text-3xl font-bold text-primary">
								${formattedAmount}
							</p>
						</div>
					</section>
				)}

				{data.message && (
					<section>
						<Label className="text-xs uppercase text-muted-foreground tracking-wider">
							Message / Conditions
						</Label>
						<div className="mt-1 p-3 bg-muted/30 rounded-md">
							<p className="text-sm text-foreground whitespace-pre-line">
								{data.message}
							</p>
						</div>
					</section>
				)}
			</CardContent>

			<footer className="px-6 py-4 border-t border-border bg-muted/20 text-xs text-muted-foreground space-y-2">
				<div className="grid grid-cols-2 gap-x-4 gap-y-1">
					<RowItemCompact
						label="Voucher Code:"
						value={data.voucherCode || "N/A"}
						valueClassName="font-mono"
					/>
					<RowItemCompact
						label="Issued by:"
						value={data.issuerName || "Reservations"}
					/>
					<RowItemCompact
						label="Issue Date:"
						value={
							data.issueDate
								? format(new Date(data.issueDate), "yyyy-MM-dd")
								: "N/A"
						}
						icon={<CalendarDays size={12} />}
					/>
					{data.expirationDate && (
						<RowItemCompact
							label="Expires:"
							value={format(new Date(data.expirationDate), "yyyy-MM-dd")}
							icon={<CalendarDays size={12} />}
						/>
					)}
				</div>
				<div className="pt-2 border-t border-border/50">
					{data.hotelAddress && (
						<p className="flex items-center gap-1 text-xs mb-0.5">
							<MapPin size={12} /> {data.hotelAddress}
						</p>
					)}
					<div className="flex flex-wrap gap-x-3 gap-y-0.5">
						{data.hotelPhoneNumber && (
							<p className="flex items-center gap-1">
								<Phone size={12} /> {data.hotelPhoneNumber}
							</p>
						)}
						{data.hotelEmail && (
							<p className="flex items-center gap-1">
								<Mail size={12} /> {data.hotelEmail}
							</p>
						)}
						{data.websiteUrl && (
							<p className="flex items-center gap-1">
								<Globe size={12} />{" "}
								<a
									href={data.websiteUrl}
									target="_blank"
									rel="noopener noreferrer"
									className="text-primary hover:underline"
								>
									{data.websiteUrl.replace(/^https?:\/\//, "")}
								</a>
							</p>
						)}
					</div>
				</div>
				<p className="text-center text-[9px] text-muted-foreground/80 pt-2">
					Present this voucher upon check-in. Subject to hotel's standard terms,
					conditions, and availability.
				</p>
			</footer>
		</Card>
	);
};

// Helper components for consistent row styling in ModernTemplate
interface LabelProps {
	children: React.ReactNode;
	className?: string;
}
const Label: React.FC<LabelProps> = ({ children, className }) => (
	<h4
		className={cn(
			"text-xs font-medium uppercase text-muted-foreground tracking-wider mb-1",
			className
		)}
	>
		{children}
	</h4>
);

interface RowItemProps {
	label: string;
	value: string | number;
	icon?: React.ReactNode;
}
const RowItem: React.FC<RowItemProps> = ({ label, value, icon }) => (
	<div>
		<p className="text-xs text-muted-foreground flex items-center gap-1">
			{icon} {label}
		</p>
		<p className="text-sm text-foreground font-medium">{value}</p>
	</div>
);

interface RowItemCompactProps {
	label: string;
	value: string | number;
	icon?: React.ReactNode;
	valueClassName?: string;
}
const RowItemCompact: React.FC<RowItemCompactProps> = ({
	label,
	value,
	icon,
	valueClassName,
}) => (
	<div className="flex justify-between items-center">
		<span className="flex items-center gap-1">
			{icon}
			{label}
		</span>
		<span className={cn("text-foreground", valueClassName)}>{value}</span>
	</div>
);

// CN function for utility if not globally available in this file scope (usually it is via imports)
const cn = (...classes: (string | undefined | null | false)[]) =>
	classes.filter(Boolean).join(" ");
