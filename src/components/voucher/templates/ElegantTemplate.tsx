"use client";

import type { TemplateProps } from "@/types/voucher";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
	Award,
	Hotel,
	Users,
	CalendarCheck2,
	KeyRound,
	Briefcase,
	Building2,
	Phone,
	Mail,
	Globe,
	MapPin,
} from "lucide-react";
import { format } from "date-fns";
import Image from "next/image";

export const ElegantTemplate: React.FC<TemplateProps> = ({ data, id }) => {
	const formattedAmount = data.amount
		? parseFloat(data.amount)?.toFixed(2)
		: "0.00";
	const hasMonetaryValue = parseFloat(formattedAmount) > 0;

	return (
		<Card
			id={id}
			className="w-[600px] h-auto shadow-2xl rounded-lg border-2 border-accent/50 bg-background overflow-hidden font-serif"
		>
			<div className="p-8 bg-gradient-to-br from-accent/70 via-accent/80 to-accent/70 text-center border-b-2 border-accent">
				{data.logoUrl ? (
					<Image
						src={data.logoUrl}
						alt={`${data.hotelName || "Hotel"} Logo`}
						width={140}
						height={70}
						className="object-contain max-h-[70px] mx-auto mb-3 rounded p-1" /* Removed border and border-accent-foreground/20 */
						data-ai-hint="luxury hotel logo"
					/>
				) : (
					<div className="w-[140px] h-[70px] flex justify-center items-center bg-accent/10 rounded border border-dashed border-accent-foreground/30 mx-auto mb-3">
						<Building2
							className="w-12 h-12 text-accent-foreground/70"
							data-ai-hint="grand hotel"
						/>
					</div>
				)}
				<h2 className="text-3xl font-bold text-accent-foreground">
					{data.hotelName || "Luxury Stay Voucher"}
				</h2>
				<p className="text-accent-foreground/80 text-sm uppercase tracking-wider mt-1">
					An Exclusive Invitation
				</p>
			</div>
			<CardContent className="p-8 space-y-6 bg-card">
				<div className="text-center">
					<p className="text-md text-muted-foreground uppercase tracking-widest">
						Presented To
					</p>
					<p className="text-2xl font-medium text-foreground tracking-wide">
						{data.recipientName || "Our Esteemed Guest"}
					</p>
				</div>

				<Separator className="my-4 border-accent/40" />

				<div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
					<div className="flex items-start space-x-2">
						<Briefcase
							size={18}
							className="mt-1 text-yellow-400 flex-shrink-0"
						/>
						<div>
							<span className="font-semibold text-muted-foreground">
								Client Representative:
							</span>
							<p className="text-foreground">
								{data.clientRepresentativeTitle}.{" "}
								{data.clientRepresentativeName || "N/A"}
							</p>
						</div>
					</div>
					<div className="flex items-start space-x-2">
						<KeyRound
							size={18}
							className="mt-1 text-yellow-400 flex-shrink-0"
						/>
						<div>
							<span className="font-semibold text-muted-foreground">
								Accommodation:
							</span>
							<p className="text-foreground">{data.roomName || "N/A"}</p>
						</div>
					</div>
					<div className="flex items-start space-x-2">
						<Award size={18} className="mt-1 text-yellow-400 flex-shrink-0" />
						<div>
							<span className="font-semibold text-muted-foreground">
								Package/Board:
							</span>
							<p className="text-foreground">{data.boardName || "N/A"}</p>
						</div>
					</div>
					<div className="flex items-start space-x-2">
						<Users size={18} className="mt-1 text-yellow-400 flex-shrink-0" />
						<div>
							<span className="font-semibold text-muted-foreground">
								Guests:
							</span>
							<p className="text-foreground">
								{data.numberOfAdults} Adult(s)
								{data.numberOfChildren && data.numberOfChildren > 0
									? `, ${data.numberOfChildren} Child(ren)`
									: ""}
							</p>
						</div>
					</div>
				</div>

				{hasMonetaryValue && (
					<>
						<Separator className="my-4 border-accent/40" />
						<div className="text-center py-3">
							<p className="text-md text-muted-foreground uppercase tracking-widest">
								Credit Value
							</p>
							<p className="text-4xl font-bold text-accent">
								${formattedAmount}
							</p>
						</div>
					</>
				)}

				{data.message && (
					<div className="text-center p-4 border border-dashed border-accent/50 rounded-md bg-accent/5">
						<p className="italic text-accent-foreground/90 text-sm whitespace-pre-line">
							{data.message}
						</p>
					</div>
				)}

				<Separator className="my-4 border-yellow-400/40" />

				<div className="text-xs text-muted-foreground space-y-2">
					<div className="grid grid-cols-2 gap-4 items-start">
						<div>
							<p>
								<strong className="text-foreground/80">Issued by:</strong>{" "}
								{data.issuerName || "Hotel Management"}
							</p>
							<p>
								<strong className="text-foreground/80">Voucher ID:</strong>{" "}
								<span className="tracking-wider">
									{data.voucherCode || "N/A"}
								</span>
							</p>
						</div>
						<div className="text-right">
							<p className="flex items-center justify-end gap-1">
								<CalendarCheck2 size={14} />{" "}
								<strong className="text-foreground/80">Issued:</strong>{" "}
								{data.issueDate
									? format(new Date(data.issueDate), "do MMM yyyy")
									: "N/A"}
							</p>
							{data.expirationDate && (
								<p className="flex items-center justify-end gap-1">
									<CalendarCheck2 size={14} />{" "}
									<strong className="text-foreground/80">Valid Until:</strong>{" "}
									{format(new Date(data.expirationDate), "do MMMM yyyy")}
								</p>
							)}
						</div>
					</div>
				</div>

				<div className="mt-6 pt-4 border-t border-accent/30 text-center text-xs text-muted-foreground space-y-1">
					{data.hotelAddress && (
						<p className="flex items-center justify-center gap-1">
							<MapPin size={12} /> {data.hotelAddress}
						</p>
					)}
					<div className="flex justify-center items-center gap-x-3 gap-y-1 flex-wrap">
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
									className="text-accent-foreground hover:underline"
								>
									{data.websiteUrl.replace(/^https?:\/\//, "")}
								</a>
							</p>
						)}
					</div>
				</div>
				<p className="text-center text-[10px] text-muted-foreground/70 mt-4">
					This voucher is non-transferable and subject to availability. Standard
					booking terms and conditions apply.
				</p>
			</CardContent>
		</Card>
	);
};
