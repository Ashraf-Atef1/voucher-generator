"use client";

import type { VoucherData } from "@/types/voucher";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	CalendarIcon,
	Save,
	Globe,
	Image as ImageIcon,
	Phone,
	Mail,
	MapPin,
	Trash2,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { Separator } from "@/components/ui/separator";
import Image from "next/image"; // Added for logo preview

const voucherSchema = z.object({
	recipientName: z.string().min(1, "Recipient name is required"),
	amount: z
		.string()
		.refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, {
			message: "Amount must be a non-negative number",
		}),
	message: z
		.string()
		.max(300, "Message can be up to 300 characters")
		.optional(),
	expirationDate: z.date().nullable(),
	voucherCode: z.string().min(1, "Voucher code is required"),
	hotelName: z.string().min(1, "Hotel name is required"),
	clientRepresentativeTitle: z.enum(["Mr", "Ms"], {
		required_error: "Title for client representative is required",
	}),
	clientRepresentativeName: z
		.string()
		.min(1, "Client representative name is required"),
	roomName: z.string().min(1, "Room name is required"),
	boardName: z.string().min(1, "Board name is required"),
	numberOfAdults: z.coerce
		.number()
		.int()
		.min(0, "Number of adults must be a non-negative integer"),
	numberOfChildren: z.coerce
		.number()
		.int()
		.min(0, "Number of children must be a non-negative integer"),
	issuerName: z.string().min(1, "Issuer name is required"),
	issueDate: z.date({ required_error: "Issue date is required" }),

	logoUrl: z
		.string()
		.url()
		.or(z.string().startsWith("data:image"))
		.or(z.literal(""))
		.optional(), // Changed to accept data URI or empty string
	hotelAddress: z.string().min(1, "Hotel address is required"),
	hotelPhoneNumber: z.string().min(1, "Hotel phone number is required"),
	hotelEmail: z
		.string()
		.email({ message: "Invalid email address." })
		.min(1, "Hotel email is required"),
	websiteUrl: z
		.string()
		.url({ message: "Please enter a valid URL for the website." })
		.optional()
		.or(z.literal("")),
});

interface VoucherFormProps {
	defaultValues: VoucherData;
	onFormChange: (data: VoucherData) => void;
	onSaveDefaults: (data: VoucherData) => void;
}

export const VoucherForm: React.FC<VoucherFormProps> = ({
	defaultValues,
	onFormChange,
	onSaveDefaults,
}) => {
	const form = useForm<VoucherData>({
		resolver: zodResolver(voucherSchema) as unknown as any,
		defaultValues,
	});

	useEffect(() => {
		form.reset(defaultValues);
	}, [defaultValues, form.reset]);

	useEffect(() => {
		const subscription = form.watch((values) => {
			const completeValues: VoucherData = {
				recipientName: values.recipientName || "",
				amount: values.amount || "0",
				message: values.message || "",
				expirationDate:
					values.expirationDate !== undefined ? values.expirationDate : null,
				voucherCode: values.voucherCode || "",
				hotelName: values.hotelName || "",
				clientRepresentativeTitle: values.clientRepresentativeTitle || "Mr",
				clientRepresentativeName: values.clientRepresentativeName || "",
				roomName: values.roomName || "",
				boardName: values.boardName || "",
				numberOfAdults:
					typeof values.numberOfAdults === "number" ? values.numberOfAdults : 0,
				numberOfChildren:
					typeof values.numberOfChildren === "number"
						? values.numberOfChildren
						: 0,
				issuerName: values.issuerName || "",
				issueDate: values.issueDate || new Date(),
				logoUrl: values.logoUrl || "",
				hotelAddress: values.hotelAddress || "",
				hotelPhoneNumber: values.hotelPhoneNumber || "",
				hotelEmail: values.hotelEmail || "",
				websiteUrl: values.websiteUrl || "",
			};
			onFormChange(completeValues);
		});
		return () => subscription.unsubscribe();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [form.watch, onFormChange]);

	const handleSaveDefaults = () => {
		onSaveDefaults(form.getValues());
	};

	return (
		<form className="space-y-6 p-6 border rounded-lg shadow-sm bg-card">
			<h3 className="text-lg font-semibold text-primary border-b pb-2">
				Hotel & Contact Details
			</h3>
			<div>
				<Label htmlFor="hotelName" className="flex items-center">
					<MapPin size={14} className="mr-1 text-muted-foreground" />
					Hotel Name
				</Label>
				<Input
					id="hotelName"
					{...form.register("hotelName")}
					placeholder="e.g., The Grand Plaza"
				/>
				{form.formState.errors.hotelName && (
					<p className="text-sm text-destructive mt-1">
						{form.formState.errors.hotelName.message}
					</p>
				)}
			</div>

			<div>
				<Label htmlFor="logoFile" className="flex items-center">
					<ImageIcon size={14} className="mr-1 text-muted-foreground" />
					Upload Logo (Optional)
				</Label>
				<Input
					id="logoFile"
					type="file"
					accept="image/*"
					onChange={(e) => {
						const file = e.target.files?.[0];
						if (file) {
							const reader = new FileReader();
							reader.onloadend = () => {
								form.setValue("logoUrl", reader.result as string, {
									shouldValidate: true,
									shouldDirty: true,
								});
							};
							reader.readAsDataURL(file);
						} else {
							form.setValue("logoUrl", "", {
								shouldValidate: true,
								shouldDirty: true,
							});
						}
					}}
					className="mt-1"
				/>
				{form.watch("logoUrl") && (
					<div className="mt-2 p-2 border rounded-md bg-muted/50">
						<p className="text-xs text-muted-foreground mb-1">Logo Preview:</p>
						<Image
							src={form.watch("logoUrl")!}
							alt="Logo Preview"
							width={120}
							height={60}
							className="object-contain border rounded"
							data-ai-hint="logo preview"
						/>
						<Button
							variant="outline"
							size="sm"
							className="mt-2 text-xs"
							onClick={() => {
								form.setValue("logoUrl", "", {
									shouldValidate: true,
									shouldDirty: true,
								});
								const fileInput = document.getElementById(
									"logoFile"
								) as HTMLInputElement;
								if (fileInput) fileInput.value = "";
							}}
						>
							<Trash2 size={12} className="mr-1" /> Clear Logo
						</Button>
					</div>
				)}
				{form.formState.errors.logoUrl && (
					<p className="text-sm text-destructive mt-1">
						{form.formState.errors.logoUrl.message}
					</p>
				)}
			</div>

			<div>
				<Label htmlFor="hotelAddress" className="flex items-center">
					<MapPin size={14} className="mr-1 text-muted-foreground" />
					Hotel Address
				</Label>
				<Input
					id="hotelAddress"
					{...form.register("hotelAddress")}
					placeholder="123 Main St, City, Country"
				/>
				{form.formState.errors.hotelAddress && (
					<p className="text-sm text-destructive mt-1">
						{form.formState.errors.hotelAddress.message}
					</p>
				)}
			</div>
			<div className="grid grid-cols-2 gap-4">
				<div>
					<Label htmlFor="hotelPhoneNumber" className="flex items-center">
						<Phone size={14} className="mr-1 text-muted-foreground" />
						Hotel Phone
					</Label>
					<Input
						id="hotelPhoneNumber"
						{...form.register("hotelPhoneNumber")}
						placeholder="(555) 123-4567"
					/>
					{form.formState.errors.hotelPhoneNumber && (
						<p className="text-sm text-destructive mt-1">
							{form.formState.errors.hotelPhoneNumber.message}
						</p>
					)}
				</div>
				<div>
					<Label htmlFor="hotelEmail" className="flex items-center">
						<Mail size={14} className="mr-1 text-muted-foreground" />
						Hotel Email
					</Label>
					<Input
						id="hotelEmail"
						type="email"
						{...form.register("hotelEmail")}
						placeholder="info@example.com"
					/>
					{form.formState.errors.hotelEmail && (
						<p className="text-sm text-destructive mt-1">
							{form.formState.errors.hotelEmail.message}
						</p>
					)}
				</div>
			</div>
			<div>
				<Label htmlFor="websiteUrl" className="flex items-center">
					<Globe size={14} className="mr-1 text-muted-foreground" />
					Website URL (Optional)
				</Label>
				<Input
					id="websiteUrl"
					{...form.register("websiteUrl")}
					placeholder="https://example.com"
				/>
				{form.formState.errors.websiteUrl && (
					<p className="text-sm text-destructive mt-1">
						{form.formState.errors.websiteUrl.message}
					</p>
				)}
			</div>

			<Separator />
			<h3 className="text-lg font-semibold text-primary border-b pb-2">
				Voucher Recipient & Stay Details
			</h3>

			<div>
				<Label htmlFor="recipientName">Guest Name (Recipient)</Label>
				<Input
					id="recipientName"
					{...form.register("recipientName")}
					placeholder="e.g., Jane Doe"
				/>
				{form.formState.errors.recipientName && (
					<p className="text-sm text-destructive mt-1">
						{form.formState.errors.recipientName.message}
					</p>
				)}
			</div>

			<div className="grid grid-cols-3 gap-4">
				<div className="col-span-1">
					<Label htmlFor="clientRepresentativeTitle">Rep. Title</Label>
					<Controller
						name="clientRepresentativeTitle"
						control={form.control}
						render={({ field }) => (
							<Select onValueChange={field.onChange} defaultValue={field.value}>
								<SelectTrigger id="clientRepresentativeTitle">
									<SelectValue placeholder="Title" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="Mr">Mr.</SelectItem>
									<SelectItem value="Ms">Ms.</SelectItem>
								</SelectContent>
							</Select>
						)}
					/>
					{form.formState.errors.clientRepresentativeTitle && (
						<p className="text-sm text-destructive mt-1">
							{form.formState.errors.clientRepresentativeTitle.message}
						</p>
					)}
				</div>
				<div className="col-span-2">
					<Label htmlFor="clientRepresentativeName">
						Client Representative Name
					</Label>
					<Input
						id="clientRepresentativeName"
						{...form.register("clientRepresentativeName")}
						placeholder="e.g., John Smith (Travel Agent)"
					/>
					{form.formState.errors.clientRepresentativeName && (
						<p className="text-sm text-destructive mt-1">
							{form.formState.errors.clientRepresentativeName.message}
						</p>
					)}
				</div>
			</div>

			<div>
				<Label htmlFor="roomName">Room Name/Type</Label>
				<Input
					id="roomName"
					{...form.register("roomName")}
					placeholder="e.g., Deluxe King Suite"
				/>
				{form.formState.errors.roomName && (
					<p className="text-sm text-destructive mt-1">
						{form.formState.errors.roomName.message}
					</p>
				)}
			</div>

			<div>
				<Label htmlFor="boardName">Board/Package Name</Label>
				<Input
					id="boardName"
					{...form.register("boardName")}
					placeholder="e.g., All-Inclusive, Bed & Breakfast"
				/>
				{form.formState.errors.boardName && (
					<p className="text-sm text-destructive mt-1">
						{form.formState.errors.boardName.message}
					</p>
				)}
			</div>

			<div className="grid grid-cols-2 gap-4">
				<div>
					<Label htmlFor="numberOfAdults">Number of Adults</Label>
					<Input
						id="numberOfAdults"
						type="number"
						{...form.register("numberOfAdults")}
						placeholder="e.g., 2"
					/>
					{form.formState.errors.numberOfAdults && (
						<p className="text-sm text-destructive mt-1">
							{form.formState.errors.numberOfAdults.message}
						</p>
					)}
				</div>
				<div>
					<Label htmlFor="numberOfChildren">Number of Children</Label>
					<Input
						id="numberOfChildren"
						type="number"
						{...form.register("numberOfChildren")}
						placeholder="e.g., 0"
					/>
					{form.formState.errors.numberOfChildren && (
						<p className="text-sm text-destructive mt-1">
							{form.formState.errors.numberOfChildren.message}
						</p>
					)}
				</div>
			</div>

			<Separator />
			<h3 className="text-lg font-semibold text-primary border-b pb-2">
				Voucher Offer & Terms
			</h3>

			<div>
				<Label htmlFor="amount">Monetary Value/Discount ($)</Label>
				<Input
					id="amount"
					type="number"
					step="0.01"
					{...form.register("amount")}
					placeholder="e.g., 50.00 or 0.00 if not applicable"
				/>
				{form.formState.errors.amount && (
					<p className="text-sm text-destructive mt-1">
						{form.formState.errors.amount.message}
					</p>
				)}
			</div>

			<div>
				<Label htmlFor="message">Message / Special Conditions (Optional)</Label>
				<Textarea
					id="message"
					{...form.register("message")}
					placeholder="e.g., Enjoy your complimentary stay! Subject to availability. Non-transferable."
				/>
				{form.formState.errors.message && (
					<p className="text-sm text-destructive mt-1">
						{form.formState.errors.message.message}
					</p>
				)}
			</div>

			<div className="grid grid-cols-2 lg:grid-cols-1 2xl:grid-cols-2 gap-4">
				<div>
					<Label htmlFor="issueDate">Issue Date</Label>
					<Controller
						name="issueDate"
						control={form.control}
						render={({ field }) => (
							<Popover>
								<PopoverTrigger asChild>
									<Button
										variant={"outline"}
										className={cn(
											"w-full justify-start text-left font-normal",
											!field.value && "text-muted-foreground"
										)}
									>
										<CalendarIcon className="mr-2 h-4 w-4" />
										{field.value ? (
											format(new Date(field.value), "PPP")
										) : (
											<span>Pick a date</span>
										)}
									</Button>
								</PopoverTrigger>
								<PopoverContent className="w-auto p-0">
									<Calendar
										mode="single"
										selected={field.value ? new Date(field.value) : undefined}
										onSelect={(date) => field.onChange(date || new Date())}
										initialFocus
									/>
								</PopoverContent>
							</Popover>
						)}
					/>
					{form.formState.errors.issueDate && (
						<p className="text-sm text-destructive mt-1">
							{form.formState.errors.issueDate.message}
						</p>
					)}
				</div>
				<div>
					<Label htmlFor="expirationDate">Expiration Date (Optional)</Label>
					<Controller
						name="expirationDate"
						control={form.control}
						render={({ field }) => (
							<Popover>
								<PopoverTrigger asChild>
									<Button
										variant={"outline"}
										className={cn(
											"w-full justify-start text-left font-normal",
											!field.value && "text-muted-foreground"
										)}
									>
										<CalendarIcon className="mr-2 h-4 w-4" />
										{field.value ? (
											format(new Date(field.value), "PPP")
										) : (
											<span>Pick a date</span>
										)}
									</Button>
								</PopoverTrigger>
								<PopoverContent className="w-auto p-0">
									<Calendar
										mode="single"
										selected={field.value ? new Date(field.value) : undefined}
										onSelect={(date) => field.onChange(date || null)}
										initialFocus
									/>
								</PopoverContent>
							</Popover>
						)}
					/>
					{form.formState.errors.expirationDate && (
						<p className="text-sm text-destructive mt-1">
							{form.formState.errors.expirationDate.message}
						</p>
					)}
				</div>
			</div>

			<div>
				<Label htmlFor="issuerName">Issuer Name/Department</Label>
				<Input
					id="issuerName"
					{...form.register("issuerName")}
					placeholder="e.g., Hotel Reservations Dept."
				/>
				{form.formState.errors.issuerName && (
					<p className="text-sm text-destructive mt-1">
						{form.formState.errors.issuerName.message}
					</p>
				)}
			</div>

			<div>
				<Label htmlFor="voucherCode">Voucher Code</Label>
				<Input
					id="voucherCode"
					{...form.register("voucherCode")}
					placeholder="e.g., HOTELSTAY24"
				/>
				{form.formState.errors.voucherCode && (
					<p className="text-sm text-destructive mt-1">
						{form.formState.errors.voucherCode.message}
					</p>
				)}
			</div>

			<Button
				type="button"
				onClick={handleSaveDefaults}
				variant="outline"
				className="w-full"
			>
				<Save className="mr-2 h-4 w-4" />
				Save Current Values as Default
			</Button>
		</form>
	);
};
