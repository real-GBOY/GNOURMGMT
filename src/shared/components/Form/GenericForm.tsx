/** @format */

import { useState } from "react";
import { useForm, FieldPath, FieldValues } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { AnyObjectSchema } from "yup";
import { motion } from "framer-motion";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";

// Define schema field type for better typing
interface SchemaField {
	type?: string;
	required?: boolean;
	oneOf?: string[];
	tests?: Array<{
		OPTIONS?: {
			name?: string;
		};
	}>;
	// Additional properties for better enum detection
	_whitelist?: Set<string>;
	spec?: {
		oneOf?: string[];
	};
}

type GenericFormProps<T extends FieldValues> = {
	schema: AnyObjectSchema;
	defaultValues?: Partial<T>;
	onSubmit: (data: T) => void | Promise<void>;
	submitButtonText?: string;
	className?: string;
	selectOptions?: Record<string, { value: string; label: string }[]>;
	context?: Record<string, any>;
	fieldGroups?: Array<{
		title?: string;
		description?: string;
		fields: string[];
	}>;
	// Using broad types to avoid generic conflicts with react-hook-form external consumers
	customRenderers?: Record<
		string,
		(args: {
			register: any;
			setValue: any;
			watch: any;
			errors: Record<string, unknown>;
			theme: string;
		}) => JSX.Element
	>;
	fieldItemClassName?: Record<string, string>;
};

function getInputType(
	fieldSchema: SchemaField,
	key: string,
	selectOptions?: Record<string, { value: string; label: string }[]>
): string {
	if (
		key === "image" ||
		key === "file" ||
		key === "certificateFile" ||
		key === "achievementPhoto" ||
		key === "supportingDocuments"
	)
		return "file";
	if (key === "videoFile") return "video";
	if (key === "pdfFile") return "pdf";

	// Special case: treat confirmPassword as password input, not select
	if (
		key.toLowerCase().includes("confirmpassword") ||
		key.toLowerCase() === "confirm_password"
	) {
		return "password";
	}

	// Check if selectOptions are provided for this field
	if (selectOptions && selectOptions[key] && selectOptions[key].length > 0) {
		return "select";
	}

	// Enhanced enum detection - check multiple possible sources
	// Only treat as select if there are valid string enum values
	const enumValues = getEnumValues(fieldSchema);
	if (enumValues.length > 0) return "select";

	// Enhanced enum detection - check multiple possible sources
	const hasEnumValues =
		(Array.isArray(fieldSchema?.oneOf) && fieldSchema.oneOf.length > 0) ||
		(Array.isArray(fieldSchema?.spec?.oneOf) &&
			fieldSchema.spec.oneOf.length > 0) ||
		(fieldSchema?._whitelist && fieldSchema._whitelist.size > 0);

	if (hasEnumValues) return "select";

	const type = fieldSchema?.type;
	const isEmail = fieldSchema?.tests?.some(
		(t: { OPTIONS?: { name?: string } }) => t?.OPTIONS?.name === "email"
	);

	if (isEmail) return "email";

	// Check if field is password related
	if (key.toLowerCase().includes("password")) return "password";

	// Check if field is datetime related
	if (
		key.toLowerCase().includes("time") ||
		key.toLowerCase().includes("date")
	) {
		// Use date type for dateOfBirth and similar fields, datetime-local for others
		if (
			key.toLowerCase().includes("birth") ||
			key.toLowerCase().includes("dateofbirth")
		) {
			return "date";
		}
		return "datetime-local";
	}

	// Common enum field name patterns (fallback detection)
	const enumPatterns = [
		"status",
		"type",
		"category",
		"priority",
		"state",
		"role",
		"mode",
	];
	if (
		enumPatterns.some((pattern) => key.toLowerCase().includes(pattern)) &&
		type === "string"
	) {
		return "select";
	}

	switch (type) {
		case "string":
			return "text";
		case "number":
			return "number";
		case "boolean":
			return "checkbox";
		case "date":
			return "date";
		default:
			return "text";
	}
}

function formatLabel(key: string): string {
	if (key === "bio") return "Bio - Field of specialization";
	if (key === "file") return "Profile Picture";
	return key
		.split(/(?=[A-Z])/)
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
}

/**
 * Extracts enum values from different possible sources in Yup schema
 * Supports .oneOf() arrays and other Yup enum patterns
 * Filters out Yup ref objects which are used for validation, not options
 */
function getEnumValues(fieldSchema: SchemaField): string[] {
	// Helper function to check if a value is a Yup ref object
	const isYupRef = (value: unknown): boolean => {
		return (
			value !== null &&
			typeof value === "object" &&
			("key" in value || "isContext" in value || "getter" in value)
		);
	};

	// Helper function to filter out non-string values and Yup refs
	const filterValidOptions = (values: unknown[]): string[] => {
		return values.filter(
			(value): value is string => typeof value === "string" && !isYupRef(value)
		);
	};

	// Check oneOf array (most common for Yup schemas)
	if (Array.isArray(fieldSchema?.oneOf) && fieldSchema.oneOf.length > 0) {
		const validOptions = filterValidOptions(fieldSchema.oneOf);
		if (validOptions.length > 0) {
			return validOptions;
		}
	}

	// Check spec.oneOf (alternative Yup structure)
	if (
		Array.isArray(fieldSchema?.spec?.oneOf) &&
		fieldSchema.spec.oneOf.length > 0
	) {
		const validOptions = filterValidOptions(fieldSchema.spec.oneOf);
		if (validOptions.length > 0) {
			return validOptions;
		}
	}

	// Check _whitelist (Yup internal structure)
	if (fieldSchema?._whitelist && fieldSchema._whitelist.size > 0) {
		const whitelistArray = Array.from(fieldSchema._whitelist);
		const validOptions = filterValidOptions(whitelistArray);
		if (validOptions.length > 0) {
			return validOptions;
		}
	}

	return [];
}

/**
 * Automatically formats enum values for display in select options
 * Converts kebab-case, snake_case, and other patterns to proper Title Case
 * Examples: "in-progress" → "In Progress", "user_admin" → "User Admin"
 */
function formatSelectOption(value: string): string {
	// Handle empty or invalid values
	if (!value || typeof value !== "string") return value;

	// Generic enum formatting logic
	return value
		.split("-") // Split on hyphens (e.g., "in-progress")
		.map((word) => word.split("_")) // Split on underscores (e.g., "status_active")
		.flat() // Flatten the array
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize each word
		.join(" "); // Join with spaces
}

export function GenericForm<T extends FieldValues>({
	schema,
	defaultValues,
	onSubmit,
	submitButtonText = "Submit",
	className = "",
	selectOptions = {},
	context = {},
	fieldGroups,
	customRenderers = {},
	fieldItemClassName = {},
}: GenericFormProps<T>) {
	// State for password visibility per field
	const [passwordVisibility, setPasswordVisibility] = useState<
		Record<string, boolean>
	>({});
	const { theme } = useTheme();

	const {
		register,
		handleSubmit,
		setValue,
		watch,
		formState: { errors, isSubmitting },
	} = useForm<T>({
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		resolver: yupResolver(schema) as any,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		defaultValues: defaultValues as any,
		context: context,
	});

	const fields = Object.entries(schema.fields) as [string, SchemaField][];

	// Quick lookup for schema by field key
	const schemaByKey: Record<string, SchemaField> = Object.fromEntries(fields);

	const togglePasswordVisibility = (fieldKey: string) => {
		setPasswordVisibility((prev) => ({
			...prev,
			[fieldKey]: !prev[fieldKey],
		}));
	};

	// Wrapper function to handle the form submission with mutation
	const handleFormSubmit = (data: T) => {
		onSubmit(data);
	};

	// Renders a single field by key using existing rendering logic
	const renderField = (key: string) => {
		// Custom renderer override
		if (customRenderers[key]) {
			return (
				<div key={key} className={`space-y-3 ${fieldItemClassName[key] ?? ""}`}>
					{customRenderers[key]!({
						register,
						setValue,
						watch,
						errors: errors as unknown as Record<string, unknown>,
						theme,
					})}
				</div>
			);
		}
		const fieldSchema = schemaByKey[key];
		if (!fieldSchema) return null;
		const inputType = getInputType(fieldSchema, key, selectOptions);
		const label = formatLabel(key);
		const hasError = !!errors[key as FieldPath<T>];
		const isPasswordField = inputType === "password";
		const isPasswordVisible = passwordVisibility[key] || false;
		const actualInputType =
			isPasswordField && isPasswordVisible ? "text" : inputType;

		return (
			<motion.div
				key={key}
				initial={{ opacity: 0, x: -20 }}
				animate={{ opacity: 1, x: 0 }}
				transition={{ duration: 0.4 }}
				className='space-y-3'>
				<label
					className={`block text-sm font-medium tracking-wide transition-colors duration-300 ${
						theme === "dark" ? "text-slate-200" : "text-slate-700"
					}`}>
					{label}
					{fieldSchema.required && <span className='text-red-500 ml-1'>*</span>}
				</label>

				{inputType === "select" ? (
					<div className='relative'>
						<select
							{...register(key as FieldPath<T>)}
							disabled={context?.teamsLoading && key === "team"}
							className={`w-full px-4 py-4 border rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 appearance-none text-sm font-medium backdrop-blur-md shadow-sm hover:shadow-md ${
								theme === "dark"
									? "bg-slate-900/70 text-slate-100 border-slate-600/50 hover:border-slate-500/70 focus:ring-blue-400/20 hover:bg-slate-800/80"
									: "bg-white/70 text-slate-900 border-slate-300/50 hover:border-slate-400/70 focus:ring-blue-500/20 hover:bg-gray-50/80"
							} ${hasError ? "border-red-400 focus:ring-red-400/20" : ""} ${
								context?.teamsLoading && key === "team"
									? "opacity-50 cursor-not-allowed"
									: ""
							}`}>
							<option value=''>
								{context?.teamsLoading && key === "team"
									? "Loading teams..."
									: `Select ${label.toLowerCase()}...`}
							</option>
							{selectOptions[key]
								? selectOptions[key]!.map((opt) => (
										<option key={opt.value} value={opt.value}>
											{opt.label}
										</option>
								  ))
								: getEnumValues(fieldSchema).map((opt: string) => (
										<option key={opt} value={opt}>
											{formatSelectOption(opt)}
										</option>
								  ))}
						</select>
						<div
							className={`absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none ${
								theme === "dark" ? "text-slate-400" : "text-slate-500"
							}`}>
							<svg
								className='w-4 h-4'
								fill='none'
								stroke='currentColor'
								viewBox='0 0 24 24'>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M19 9l-7 7-7-7'
								/>
							</svg>
						</div>
					</div>
				) : inputType === "checkbox" ? (
					<div className='flex items-center space-x-3'>
						<div className='relative'>
							<input
								type='checkbox'
								{...register(key as FieldPath<T>)}
								className={`w-5 h-5 rounded-lg border-2 transition-all duration-300 focus:ring-2 focus:ring-blue-500/20 backdrop-blur-sm shadow-sm hover:shadow-md ${
									theme === "dark"
										? "bg-slate-900/70 border-slate-600/50 text-blue-500 focus:ring-blue-400/20 hover:bg-slate-800/80 accent-blue-500 checked:bg-blue-500 checked:border-blue-500"
										: "bg-white/70 border-slate-300/50 text-blue-600 focus:ring-blue-500/20 hover:bg-gray-50/80 accent-blue-600 checked:bg-blue-600 checked:border-blue-600"
								}`}
							/>
						</div>
						<span
							className={`text-sm font-medium transition-colors duration-300 ${
								theme === "dark" ? "text-slate-200" : "text-slate-700"
							}`}>
							{label}
						</span>
					</div>
				) : inputType === "date" ? (
					<div className='relative'>
						{(() => {
							const inputId = `date-${key}`;
							return (
								<>
									<input
										id={inputId}
										type='date'
										{...register(key as FieldPath<T>)}
										max={new Date().toISOString().split("T")[0]}
										className={`w-full px-4 py-4 pr-12 border rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-sm font-medium backdrop-blur-md shadow-sm hover:shadow-md ${
											theme === "dark"
												? "bg-slate-900/70 text-slate-100 border-slate-600/50 hover:border-slate-500/70 focus:ring-blue-400/20 placeholder-slate-400 hover:bg-slate-800/80"
												: "bg-white/70 text-slate-900 border-slate-300/50 hover:border-slate-400/70 focus:ring-blue-500/20 placeholder-slate-500 hover:bg-gray-50/80"
										} ${
											hasError ? "border-red-400 focus:ring-red-400/20" : ""
										} appearance-none [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:pointer-events-none`}
									/>
									<button
										type='button'
										onClick={() => {
											const el = document.getElementById(
												inputId
											) as HTMLInputElement | null;
											(
												el as unknown as { showPicker?: () => void }
											)?.showPicker?.();
											el?.focus();
										}}
										className={`absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer hover:bg-opacity-10 rounded-r-2xl transition-all duration-200 ${
											theme === "dark"
												? "text-slate-400 hover:text-slate-300 hover:bg-slate-800/50"
												: "text-slate-500 hover:text-slate-600 hover:bg-slate-100/80"
										}`}>
										<svg
											className='w-5 h-5'
											fill='none'
											stroke='currentColor'
											viewBox='0 0 24 24'>
											<path
												strokeLinecap='round'
												strokeLinejoin='round'
												strokeWidth={2}
												d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
											/>
										</svg>
									</button>
								</>
							);
						})()}
					</div>
				) : (
					<div className='relative'>
						<input
							type={actualInputType}
							{...register(key as FieldPath<T>)}
							className={`w-full px-4 py-4 border rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-sm font-medium backdrop-blur-md shadow-sm hover:shadow-md ${
								isPasswordField ? "pr-12" : ""
							} ${
								theme === "dark"
									? "bg-slate-900/70 text-slate-100 border-slate-600/50 hover:border-slate-500/70 focus:ring-blue-400/20 placeholder-slate-400 hover:bg-slate-800/80"
									: "bg-white/70 text-slate-900 border-slate-300/50 hover:border-slate-400/70 focus:ring-blue-500/20 placeholder-slate-500 hover:bg-gray-50/80"
							} ${hasError ? "border-red-400 focus:ring-red-400/20" : ""}`}
							placeholder={`Enter ${label.toLowerCase()}`}
						/>
						{isPasswordField && (
							<button
								type='button'
								onClick={() => togglePasswordVisibility(key)}
								className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1.5 rounded-lg transition-all duration-200 hover:bg-opacity-10 ${
									theme === "dark"
										? "text-slate-400 hover:text-slate-300 hover:bg-slate-800/50"
										: "text-slate-400 hover:text-slate-600 hover:bg-slate-100/80"
								}`}>
								{isPasswordVisible ? (
									<EyeOff className='w-5 h-5' />
								) : (
									<Eye className='w-5 h-5' />
								)}
							</button>
						)}
					</div>
				)}

				{hasError && (
					<motion.div
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						className='flex items-center space-x-2 text-sm text-red-400'>
						<AlertCircle className='w-4 h-4 flex-shrink-0' />
						<span>{errors[key as FieldPath<T>]?.message as string}</span>
					</motion.div>
				)}
			</motion.div>
		);
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.6 }}
			className={`w-full ${className}`}>
			<form onSubmit={handleSubmit(handleFormSubmit)} className='space-y-8'>
				{fieldGroups && fieldGroups.length > 0 ? (
					<div className='space-y-8'>
						{fieldGroups.map((group, index) => (
							<section
								key={index}
								className={`p-4 rounded-2xl border ${
									theme === "dark"
										? "bg-slate-900/40 border-slate-800"
										: "bg-white/70 border-slate-200"
								}`}>
								{group.title && (
									<h3
										className={`text-lg font-semibold mb-4 ${
											theme === "dark" ? "text-slate-100" : "text-slate-900"
										}`}>
										{group.title}
									</h3>
								)}
								{group.description && (
									<p
										className={`text-sm mb-4 ${
											theme === "dark" ? "text-slate-400" : "text-slate-600"
										}`}>
										{group.description}
									</p>
								)}
								<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
									{group.fields.map((key) => renderField(key))}
								</div>
							</section>
						))}
					</div>
				) : (
					fields.map(([key, fieldSchema]) => {
						const inputType = getInputType(fieldSchema, key, selectOptions);
						const label = formatLabel(key);
						const hasError = !!errors[key as FieldPath<T>];
						const isPasswordField = inputType === "password";
						const isPasswordVisible = passwordVisibility[key] || false;
						const actualInputType =
							isPasswordField && isPasswordVisible ? "text" : inputType;

						return (
							<motion.div
								key={key}
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{
									duration: 0.4,
									delay: fields.indexOf([key, fieldSchema]) * 0.1,
								}}
								className='space-y-3'>
								<label
									className={`block text-sm font-medium tracking-wide transition-colors duration-300 ${
										theme === "dark" ? "text-slate-200" : "text-slate-700"
									}`}>
									{label}
									{fieldSchema.required && (
										<span className='text-red-500 ml-1'>*</span>
									)}
								</label>

								{inputType === "select" ? (
									<div className='relative'>
										<select
											{...register(key as FieldPath<T>)}
											disabled={context?.teamsLoading && key === "team"}
											className={`w-full px-4 py-4 border rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 appearance-none text-sm font-medium backdrop-blur-md shadow-sm hover:shadow-md ${
												theme === "dark"
													? "bg-slate-900/70 text-slate-100 border-slate-600/50 hover:border-slate-500/70 focus:ring-blue-400/20 hover:bg-slate-800/80"
													: "bg-white/70 text-slate-900 border-slate-300/50 hover:border-slate-400/70 focus:ring-blue-500/20 hover:bg-gray-50/80"
											} ${
												hasError ? "border-red-400 focus:ring-red-400/20" : ""
											} ${
												context?.teamsLoading && key === "team"
													? "opacity-50 cursor-not-allowed"
													: ""
											}`}>
											<option value=''>
												{context?.teamsLoading && key === "team"
													? "Loading teams..."
													: `Select ${label.toLowerCase()}...`}
											</option>
											{selectOptions[key]
												? selectOptions[key]!.map((opt) => (
														<option key={opt.value} value={opt.value}>
															{opt.label}
														</option>
												  ))
												: getEnumValues(fieldSchema).map((opt: string) => (
														<option key={opt} value={opt}>
															{formatSelectOption(opt)}
														</option>
												  ))}
										</select>
										<div
											className={`absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none ${
												theme === "dark" ? "text-slate-400" : "text-slate-500"
											}`}>
											<svg
												className='w-4 h-4'
												fill='none'
												stroke='currentColor'
												viewBox='0 0 24 24'>
												<path
													strokeLinecap='round'
													strokeLinejoin='round'
													strokeWidth={2}
													d='M19 9l-7 7-7-7'
												/>
											</svg>
										</div>
									</div>
								) : inputType === "checkbox" ? (
									<div className='flex items-center space-x-3'>
										<div className='relative'>
											<input
												type='checkbox'
												{...register(key as FieldPath<T>)}
												className={`w-5 h-5 rounded-lg border-2 transition-all duration-300 focus:ring-2 focus:ring-blue-500/20 backdrop-blur-sm shadow-sm hover:shadow-md ${
													theme === "dark"
														? "bg-slate-900/70 border-slate-600/50 text-blue-500 focus:ring-blue-400/20 hover:bg-slate-800/80"
														: "bg-white/70 border-slate-300/50 text-blue-600 focus:ring-blue-500/20 hover:bg-gray-50/80"
												}`}
											/>
										</div>
										<span
											className={`text-sm font-medium transition-colors duration-300 ${
												theme === "dark" ? "text-slate-200" : "text-slate-700"
											}`}>
											{label}
										</span>
									</div>
								) : inputType === "file" ? (
									<div className='relative'>
										<input
											name={key}
											type={key === "supportingDocuments" ? "file" : "file"}
											multiple={key === "supportingDocuments"}
											accept='.pdf,.doc,.docx,.png,.jpg,.jpeg,.gif,.svg,image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document'
											onChange={(e) => {
												if (key === "supportingDocuments") {
													const files = Array.from(e.target.files || []);
													setValue(key as FieldPath<T>, files as any);
												} else {
													const file = e.target.files?.[0];
													if (file) {
														setValue(key as FieldPath<T>, file as any);
													}
												}
											}}
											className={`w-full px-4 py-4 border rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-medium text-sm backdrop-blur-md shadow-sm hover:shadow-md ${
												theme === "dark"
													? "bg-slate-900/70 text-slate-100 border-slate-600/50 hover:border-slate-500/70 focus:ring-blue-400/20 file:bg-slate-800/70 file:text-slate-200 hover:file:bg-slate-700/80 hover:bg-slate-800/80"
													: "bg-white/70 text-slate-900 border-slate-300/50 hover:border-slate-400/70 focus:ring-blue-500/20 file:bg-slate-100/70 file:text-slate-700 hover:file:bg-slate-200/80 hover:bg-gray-50/80"
											} ${
												hasError ? "border-red-400 focus:ring-red-400/20" : ""
											}`}
										/>
										<p
											className={`text-xs mt-2 transition-colors duration-300 ${
												theme === "dark" ? "text-slate-400" : "text-slate-500"
											}`}>
											Accepted formats: PDF, DOC, DOCX, PNG, JPG, JPEG, GIF, SVG
										</p>

										{/* File Preview */}
										{watch(key as FieldPath<T>) && (
											<div className='space-y-2'>
												{key === "supportingDocuments" &&
												Array.isArray(watch(key as FieldPath<T>)) ? (
													// Multiple files preview for supportingDocuments
													(watch(key as FieldPath<T>) as File[]).map(
														(file, index) => (
															<div
																key={index}
																className={`p-3 rounded-lg border transition-all duration-300 ${
																	theme === "dark"
																		? "bg-slate-800/50 border-slate-600/50"
																		: "bg-slate-50/80 border-slate-200/60"
																}`}>
																<div className='flex items-center space-x-3'>
																	<div
																		className={`p-2 rounded-lg ${
																			theme === "dark"
																				? "bg-slate-700/50"
																				: "bg-slate-200/60"
																		}`}>
																		<svg
																			className='w-5 h-5 text-slate-500'
																			fill='none'
																			stroke='currentColor'
																			viewBox='0 0 24 24'>
																			<path
																				strokeLinecap='round'
																				strokeLinejoin='round'
																				strokeWidth={2}
																				d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
																			/>
																		</svg>
																	</div>
																	<div className='flex-1 min-w-0'>
																		<p
																			className={`text-sm font-medium transition-colors duration-300 ${
																				theme === "dark"
																					? "text-slate-200"
																					: "text-slate-700"
																			}`}>
																			{file.name}
																		</p>
																		<p
																			className={`text-xs transition-colors duration-300 ${
																				theme === "dark"
																					? "text-slate-400"
																					: "text-slate-500"
																			}`}>
																			{(file.size / 1024 / 1024).toFixed(2)} MB
																		</p>
																	</div>
																	<button
																		type='button'
																		onClick={() => {
																			const currentFiles = watch(
																				key as FieldPath<T>
																			) as File[];
																			const updatedFiles = currentFiles.filter(
																				(_, i) => i !== index
																			);
																			setValue(
																				key as FieldPath<T>,
																				updatedFiles as any
																			);
																		}}
																		className={`p-1 rounded-lg transition-all duration-200 hover:bg-opacity-80 ${
																			theme === "dark"
																				? "text-slate-400 hover:text-slate-200 hover:bg-slate-700/50"
																				: "text-slate-500 hover:text-slate-700 hover:bg-slate-300/60"
																		}`}>
																		<svg
																			className='w-4 h-4'
																			fill='none'
																			stroke='currentColor'
																			viewBox='0 0 24 24'>
																			<path
																				strokeLinecap='round'
																				strokeLinejoin='round'
																				strokeWidth={2}
																				d='M6 18L18 6M6 6l12 12'
																			/>
																		</svg>
																	</button>
																</div>
															</div>
														)
													)
												) : (
													// Single file preview for other file fields
													<div
														className={`p-3 rounded-lg border transition-all duration-300 ${
															theme === "dark"
																? "bg-slate-800/50 border-slate-600/50"
																: "bg-slate-50/80 border-slate-200/60"
														}`}>
														<div className='flex items-center space-x-3'>
															<div
																className={`p-2 rounded-lg ${
																	theme === "dark"
																		? "bg-slate-700/50"
																		: "bg-slate-200/60"
																}`}>
																<svg
																	className='w-5 h-5 text-slate-500'
																	fill='none'
																	stroke='currentColor'
																	viewBox='0 0 24 24'>
																	<path
																		strokeLinecap='round'
																		strokeLinejoin='round'
																		strokeWidth={2}
																		d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
																	/>
																</svg>
															</div>
															<div className='flex-1 min-w-0'>
																<p
																	className={`text-sm font-medium transition-colors duration-300 ${
																		theme === "dark"
																			? "text-slate-200"
																			: "bg-slate-700"
																	}`}>
																	{(watch(key as FieldPath<T>) as File)?.name}
																</p>
																<p
																	className={`text-xs transition-colors duration-300 ${
																		theme === "dark"
																			? "text-slate-400"
																			: "text-slate-500"
																	}`}>
																	{(
																		(watch(key as FieldPath<T>) as File)?.size /
																		1024 /
																		1024
																	).toFixed(2)}{" "}
																	MB
																</p>
															</div>
															<button
																type='button'
																onClick={() =>
																	setValue(
																		key as FieldPath<T>,
																		undefined as any
																	)
																}
																className={`p-1 rounded-lg transition-all duration-200 hover:bg-opacity-80 ${
																	theme === "dark"
																		? "text-slate-400 hover:text-slate-200 hover:bg-slate-700/50"
																		: "text-slate-500 hover:text-slate-700 hover:bg-slate-300/60"
																}`}>
																<svg
																	className='w-4 h-4'
																	fill='none'
																	stroke='currentColor'
																	viewBox='0 0 24 300'>
																	<path
																		strokeLinecap='round'
																		strokeLinejoin='round'
																		strokeWidth={2}
																		d='M6 18L18 6M6 6l12 12'
																	/>
																</svg>
															</button>
														</div>
													</div>
												)}
											</div>
										)}
									</div>
								) : inputType === "video" ? (
									<div className='relative'>
										<input
											name={key}
											type='file'
											accept='video/*'
											onChange={(e) => {
												const file = e.target.files?.[0];
												if (file) {
													setValue(key as FieldPath<T>, file as any);
												}
											}}
											className={`w-full px-4 py-4 border rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-medium text-sm backdrop-blur-md shadow-sm hover:shadow-md ${
												theme === "dark"
													? "bg-slate-900/70 text-slate-100 border-slate-600/50 hover:border-slate-500/70 focus:ring-blue-400/20 file:bg-slate-800/70 file:text-slate-200 hover:file:bg-slate-700/80 hover:bg-slate-800/80"
													: "bg-white/70 text-slate-900 border-slate-300/50 hover:border-slate-400/70 focus:ring-blue-500/20 file:bg-slate-100/70 file:text-slate-700 hover:file:bg-slate-200/80 hover:bg-gray-50/80"
											} ${
												hasError ? "border-red-400 focus:ring-red-400/20" : ""
											}`}
										/>
									</div>
								) : inputType === "pdf" ? (
									<div className='relative'>
										<input
											name={key}
											type='file'
											accept='.pdf,application/pdf'
											onChange={(e) => {
												const file = e.target.files?.[0];
												if (file) {
													setValue(key as FieldPath<T>, file as any);
												}
											}}
											className={`w-full px-4 py-4 border rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-medium text-sm backdrop-blur-md shadow-sm hover:shadow-md ${
												theme === "dark"
													? "bg-slate-900/70 text-slate-100 border-slate-600/50 hover:border-slate-500/70 focus:ring-blue-400/20 file:bg-slate-800/70 file:text-slate-200 hover:file:bg-slate-700/80 hover:bg-slate-800/80"
													: "bg-white/70 text-slate-900 border-slate-300/50 hover:border-slate-400/70 focus:ring-blue-500/20 file:bg-slate-100/70 file:text-slate-700 hover:file:bg-slate-200/80 hover:bg-gray-50/80"
											} ${
												hasError ? "border-red-400 focus:ring-red-400/20" : ""
											}`}
										/>
									</div>
								) : inputType === "date" ? (
									<div className='relative'>
										{(() => {
											const inputId = `date-${key}`;
											return (
												<>
													<input
														id={inputId}
														type='date'
														{...register(key as FieldPath<T>)}
														max={new Date().toISOString().split("T")[0]}
														placeholder='Select your date of birth'
														className={`w-full px-4 py-4 pr-12 border rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-sm font-medium backdrop-blur-md shadow-sm hover:shadow-md ${
															theme === "dark"
																? "bg-slate-900/70 text-slate-100 border-slate-600/50 hover:border-slate-500/70 focus:ring-blue-400/20 placeholder-slate-400 hover:bg-slate-800/80"
																: "bg-white/70 text-slate-900 border-slate-300/50 hover:border-slate-400/70 focus:ring-blue-500/20 placeholder-slate-500 hover:bg-gray-50/80"
														} ${
															hasError
																? "border-red-400 focus:ring-red-400/20"
																: ""
														} appearance-none [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:pointer-events-none`}
													/>
													<button
														type='button'
														onClick={() => {
															const el = document.getElementById(
																inputId
															) as HTMLInputElement | null;
															(
																el as unknown as { showPicker?: () => void }
															)?.showPicker?.();
															el?.focus();
														}}
														className={`absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer hover:bg-opacity-10 rounded-r-2xl transition-all duration-200 ${
															theme === "dark"
																? "text-slate-400 hover:text-slate-300 hover:bg-slate-800/50"
																: "text-slate-500 hover:text-slate-600 hover:bg-slate-100/80"
														}`}>
														<svg
															className='w-5 h-5'
															fill='none'
															stroke='currentColor'
															viewBox='0 0 24 24'>
															<path
																strokeLinecap='round'
																strokeLinejoin='round'
																strokeWidth={2}
																d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
															/>
														</svg>
													</button>
												</>
											);
										})()}
									</div>
								) : inputType === "datetime-local" ? (
									<div className='relative'>
										<input
											type='datetime-local'
											{...register(key as FieldPath<T>)}
											min={new Date().toISOString().slice(0, 16)}
											className={`w-full px-4 py-4 border rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-sm font-medium backdrop-blur-md shadow-sm hover:shadow-md ${
												theme === "dark"
													? "bg-slate-900/70 text-slate-100 border-slate-600/50 hover:border-slate-500/70 focus:ring-blue-400/20 hover:bg-slate-800/80"
													: "bg-white/70 text-slate-900 border-slate-300/50 hover:border-slate-400/70 focus:ring-blue-500/20 hover:bg-gray-50/80"
											} ${
												hasError ? "border-red-400 focus:ring-red-400/20" : ""
											} [&::-webkit-calendar-picker-indicator]:opacity-100 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:rounded-lg [&::-webkit-calendar-picker-indicator]:p-1 ${
												theme === "dark"
													? "[&::-webkit-calendar-picker-indicator]:bg-slate-800/70 [&::-webkit-calendar-picker-indicator]:hover:bg-slate-700/80"
													: "[&::-webkit-calendar-picker-indicator]:bg-slate-100/70 [&::-webkit-calendar-picker-indicator]:hover:bg-slate-200/80"
											}`}
										/>
									</div>
								) : (
									<div className='relative'>
										<input
											type={actualInputType}
											{...register(key as FieldPath<T>)}
											className={`w-full px-4 py-4 border rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-sm font-medium backdrop-blur-md shadow-sm hover:shadow-md ${
												isPasswordField ? "pr-12" : ""
											} ${
												theme === "dark"
													? "bg-slate-900/70 text-slate-100 border-slate-600/50 hover:border-slate-500/70 focus:ring-blue-400/20 placeholder-slate-400 hover:bg-slate-800/80"
													: "bg-white/70 text-slate-900 border-slate-300/50 hover:border-slate-400/70 focus:ring-blue-500/20 placeholder-slate-500 hover:bg-gray-50/80"
											} ${
												hasError ? "border-red-400 focus:ring-red-400/20" : ""
											}`}
											placeholder={`Enter ${label.toLowerCase()}`}
										/>
										{isPasswordField && (
											<button
												type='button'
												onClick={() => togglePasswordVisibility(key)}
												className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1.5 rounded-lg transition-all duration-200 hover:bg-opacity-10 ${
													theme === "dark"
														? "text-slate-400 hover:text-slate-300 hover:bg-slate-800/50"
														: "text-slate-400 hover:text-slate-600 hover:bg-slate-100/80"
												}`}>
												{isPasswordVisible ? (
													<EyeOff className='w-5 h-5' />
												) : (
													<Eye className='w-5 h-5' />
												)}
											</button>
										)}
									</div>
								)}

								{hasError && (
									<motion.div
										initial={{ opacity: 0, y: -10 }}
										animate={{ opacity: 1, y: 0 }}
										className='flex items-center space-x-2 text-sm text-red-400'>
										<AlertCircle className='w-4 h-4 flex-shrink-0' />
										<span>
											{errors[key as FieldPath<T>]?.message as string}
										</span>
									</motion.div>
								)}
							</motion.div>
						);
					})
				)}

				<motion.button
					whileHover={{ scale: 1.02 }}
					whileTap={{ scale: 0.98 }}
					type='submit'
					disabled={isSubmitting}
					className={`w-full font-semibold py-5 px-6 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed text-sm backdrop-blur-md border ${
						theme === "dark"
							? "bg-gradient-to-r from-blue-600/90 to-purple-600/90 text-white hover:from-blue-700/95 hover:to-purple-700/95 active:from-blue-800 active:to-purple-800 border-blue-500/30 hover:border-blue-400/50"
							: "bg-gradient-to-r from-blue-500/90 to-purple-500/90 text-white hover:from-blue-600/95 hover:to-purple-600/95 active:from-blue-700 active:to-purple-700 border-blue-400/30 hover:border-blue-300/50"
					} ${isSubmitting ? "animate-pulse" : ""}`}>
					{isSubmitting ? (
						<div className='flex items-center justify-center space-x-2'>
							<svg
								className='animate-spin h-5 w-5'
								xmlns='http://www.w3.org/2000/svg'
								fill='none'
								viewBox='0 0 24 24'>
								<circle
									className='opacity-25'
									cx='12'
									cy='12'
									r='10'
									stroke='currentColor'
									strokeWidth='4'></circle>
								<path
									className='opacity-75'
									fill='currentColor'
									d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
							</svg>
							<span>Processing...</span>
						</div>
					) : (
						submitButtonText
					)}
				</motion.button>
			</form>
		</motion.div>
	);
}
