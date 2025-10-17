/** @format */

import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import { useTheme } from "../../shared/contexts/ThemeContext";

import { BoxReveal } from "../../components/magicui/box-reveal";
import { GenericForm } from "../../shared/components/Form/GenericForm";
import { applicationYupSchema } from "../../shared/schemas/ApplicationSchema";
import * as yup from "yup";
import Modal from "../../shared/components/Modal";
import { useSubmitApplication } from "../../shared/services/applicationService";

const Home: React.FC = () => {
	const { theme } = useTheme();

	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
				delayChildren: 0.2,
			},
		},
	};

	const itemVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: { opacity: 1, y: 0 },
	};

	return (
		<motion.main
			className='relative z-10 max-w-6xl mx-auto px-4 sm:px-8 pt-16 sm:pt-24 pb-16 sm:pb-24'
			variants={containerVariants}
			initial='hidden'
			animate='visible'>
			<div className='text-center'>
				{/* Badge */}
				<motion.div
					className={`inline-flex items-center space-x-2 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 mb-6 sm:mb-8 border transition-colors duration-300 ${
						theme === "dark"
							? "bg-gray-900 border-gray-800"
							: "bg-gray-50 border-gray-200"
					}`}
					variants={itemVariants}>
					<div className='w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full'></div>
					<span
						className={`text-xs sm:text-sm font-medium transition-colors duration-300 ${
							theme === "dark" ? "text-gray-400" : "text-gray-600"
						}`}>
						Now Open to All Members
					</span>
					<ExternalLink
						size={12}
						className={`transition-colors duration-300 ${
							theme === "dark" ? "text-gray-500" : "text-gray-400"
						}`}
					/>
				</motion.div>

				{/* Main Heading */}
				<BoxReveal boxColor={"#06b6d4"} duration={0.5}>
					<motion.h1
						className='text-3xl sm:text-5xl md:text-7xl font-bold mb-4 sm:mb-6 leading-[1.1] tracking-tight'
						variants={itemVariants}>
						Enactus Menoufia
						<br />
						<span
							className={`bg-gradient-to-r bg-clip-text text-transparent transition-all duration-300 ${
								theme === "dark"
									? "from-gray-100 via-white to-gray-300"
									: "from-gray-900 via-black to-gray-700"
							}`}>
							Management System
						</span>
					</motion.h1>
				</BoxReveal>

				{/* Subtext */}
				<BoxReveal boxColor={"#06b6d4"} duration={0.5}>
					<motion.p
						className={`text-base sm:text-xl mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed font-medium transition-colors duration-300 ${
							theme === "dark" ? "text-gray-400" : "text-gray-600"
						}`}
						variants={itemVariants}>
						comprehensive platform designed to streamline the management of
						Enactus Menoufia’s social impact projects.{" "}
					</motion.p>
				</BoxReveal>

				{/* Buttons */}
				<BoxReveal boxColor={"#06b6d4"} duration={0.5}>
					<motion.div
						className='flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-12 sm:mb-16'
						variants={itemVariants}>
						<Link
							to='/developers'
							className={`px-4 sm:px-6 py-2.5 sm:py-3 font-medium rounded-md transition-all duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base ${
								theme === "dark"
									? "bg-white text-black hover:bg-gray-200"
									: "bg-black text-white hover:bg-gray-800"
							}`}>
							Developers
						</Link>
					</motion.div>
				</BoxReveal>
			</div>

			{/* Application Form */}
			<BoxReveal boxColor={"#06b6d4"} duration={0.5}>
				<motion.section
					className={`mt-8 sm:mt-12 p-4 sm:p-6 rounded-2xl border transition-colors duration-300 ${
						theme === "dark"
							? "bg-slate-900/40 border-slate-800"
							: "bg-white/70 border-slate-200"
					}`}
					variants={itemVariants}>
					<motion.h2
						className={`text-xl sm:text-2xl font-semibold mb-4 ${
							theme === "dark" ? "text-slate-100" : "text-slate-900"
						}`}
						variants={itemVariants}>
						Join Us – Application Form
					</motion.h2>

					<ApplicationForm />
				</motion.section>
			</BoxReveal>
		</motion.main>
	);
};

export default Home;

function ApplicationForm() {
	const { mutateAsync, isPending } = useSubmitApplication();
	const [isSuccessOpen, setIsSuccessOpen] = React.useState(false);

	const selectOptions = {
		gender: [
			{ value: "Male", label: "Male" },
			{ value: "Female", label: "Female" },
			{ value: "Prefer not to say", label: "Prefer not to say" },
		],
		academicYear: [
			{ value: "1st Year", label: "1st Year" },
			{ value: "2nd Year", label: "2nd Year" },
			{ value: "3rd Year", label: "3rd Year" },
			{ value: "4th Year", label: "4th Year" },
			{ value: "5th Year", label: "5th Year" },
		],
		selectedTeam: [
			{ value: "Project", label: "Project" },
			{ value: "Presentation", label: "Presentation" },
			{ value: "Digital Marketing", label: "Digital Marketing" },
			{ value: "HR", label: "HR" },
			{ value: "Logistics", label: "Logistics" },
			{ value: "PR-FR", label: "PR-FR" },
			{ value: "Graphic Design", label: "Graphic Design" },
			{ value: "Video Editing", label: "Video Editing" },
		],
	} as const;

	// Default values aligned with Yup schema
	const defaultValues = {
		firstName: "",
		lastName: "",
		email: "",
		phone: "",
		gender: "Male",
		faculty: "",
		academicYear: "1st Year",
		selectedTeam: "Project",
		skills: [],
		relevantExperience: "",
		facebook: "",
		linkedin: "",
		instagram: "",
		dateOfBirth: "",
		acceptedTerms: false,
	} as const;

	// Adapter: GenericForm doesn't support dynamic arrays natively;
	// we'll serialize comma-separated skills and map in submit.
	const schemaWithAdapters = applicationYupSchema.shape({
		facebook: yup
			.string()
			.trim()
			.url("Invalid URL. Include http(s) e.g., https://facebook.com/...")
			.optional()
			.default(""),
		linkedin: yup
			.string()
			.trim()
			.url("Invalid URL. Include http(s) e.g., https://linkedin.com/in/...")
			.optional()
			.default(""),
		instagram: yup
			.string()
			.trim()
			.url("Invalid URL. Include http(s) e.g., https://instagram.com/...")
			.optional()
			.default(""),
	}) as unknown as typeof applicationYupSchema;

	const onSubmit = async (data: Record<string, unknown>) => {
		const skills = (data["skills"] as unknown as string[]) || [];

		const socialLinks = [
			(data["facebook"] as string) || "",
			(data["linkedin"] as string) || "",
			(data["instagram"] as string) || "",
		]
			.map((url) => url.trim())
			.filter((url) => url.length > 0);

		const payload = {
			...data,
			skills,
			socialLinks,
		} as unknown as Parameters<typeof mutateAsync>[0];

		await mutateAsync(payload);
		// Show success modal when done
		setIsSuccessOpen(true);
	};

	// Render form by projecting array fields to text
	const projectedDefaults = {
		...defaultValues,
	} as unknown as typeof defaultValues;

	return (
		<>
			<GenericForm
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				schema={schemaWithAdapters as any}
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				defaultValues={projectedDefaults as any}
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				onSubmit={onSubmit as any}
				submitButtonText={isPending ? "Submitting..." : "Submit Application"}
				selectOptions={selectOptions as any}
				className='mt-4'
				fieldGroups={[
					{
						title: "Personal Information",
						fields: [
							"firstName",
							"lastName",
							"email",
							"phone",
							"dateOfBirth",
							"gender",
						],
					},
					{
						title: "Education",
						fields: ["faculty", "academicYear"],
					},
					{
						title: "Team Preferences",
						fields: ["selectedTeam"],
					},
					{
						title: "Experience & Skills",
						fields: ["skills", "relevantExperience"],
					},
					{
						title: "Social Links",
						fields: ["facebook", "linkedin", "instagram"],
					},
					{
						title: "Terms and Conditions",
						fields: ["acceptedTerms"],
					},
				]}
				customRenderers={{
					skills: ({ setValue, watch, theme }) => {
						const options = [
							{
								key: "Leadership",
								icon: (
									<svg
										className='w-5 h-5'
										viewBox='0 0 24 24'
										fill='none'
										stroke='currentColor'>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth='2'
											d='M12 4.5l3 6 6 .5-4.5 4 1.5 6-6-3.5L6 21l1.5-6L3 11l6-.5 3-6z'
										/>
									</svg>
								),
							},
							{
								key: "Communication",
								icon: (
									<svg
										className='w-5 h-5'
										viewBox='0 0 24 24'
										fill='none'
										stroke='currentColor'>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth='2'
											d='M8 10h8M8 14h5M21 12c0 4.418-4.477 8-10 8-1.347 0-2.63-.22-3.8-.62L3 21l1.64-3.28C3.62 16.45 3 14.79 3 13c0-4.418 4.477-8 10-8s10 3.582 10 8z'
										/>
									</svg>
								),
							},
							{
								key: "Project Management",
								icon: (
									<svg
										className='w-5 h-5'
										viewBox='0 0 24 24'
										fill='none'
										stroke='currentColor'>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth='2'
											d='M6 7h12M6 12h12M6 17h12'
										/>
									</svg>
								),
							},
							{
								key: "Marketing",
								icon: (
									<svg
										className='w-5 h-5'
										viewBox='0 0 24 24'
										fill='none'
										stroke='currentColor'>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth='2'
											d='M3 11l18-8-4 14-6-3-8 5 4-8z'
										/>
									</svg>
								),
							},
							{
								key: "Entrepreneurship",
								icon: (
									<svg
										className='w-5 h-5'
										viewBox='0 0 24 24'
										fill='none'
										stroke='currentColor'>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth='2'
											d='M12 8V4M6 8V4m12 4V4M4 10h16v10H4z'
										/>
									</svg>
								),
							},
							{
								key: "Sustainability",
								icon: (
									<svg
										className='w-5 h-5'
										viewBox='0 0 24 24'
										fill='none'
										stroke='currentColor'>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth='2'
											d='M12 6c-3 4-6 4-6 8a6 6 0 0012 0c0-4-3-4-6-8z'
										/>
									</svg>
								),
							},
							{
								key: "Innovation",
								icon: (
									<svg
										className='w-5 h-5'
										viewBox='0 0 24 24'
										fill='none'
										stroke='currentColor'>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth='2'
											d='M12 3v4m0 10v4m9-9h-4M7 12H3m12.95 4.95l-2.83-2.83M8.88 8.88L6.05 6.05m10.1 0l-2.83 2.83M8.88 15.12l-2.83 2.83'
										/>
									</svg>
								),
							},
							{
								key: "Programming",
								icon: (
									<svg
										className='w-5 h-5'
										viewBox='0 0 24 24'
										fill='none'
										stroke='currentColor'>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth='2'
											d='M7 8l-4 4 4 4m10-8l4 4-4 4'
										/>
									</svg>
								),
							},
							{
								key: "Financial Literacy",
								icon: (
									<svg
										className='w-5 h-5'
										viewBox='0 0 24 24'
										fill='none'
										stroke='currentColor'>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth='2'
											d='M12 8c-3.866 0-7 1.79-7 4s3.134 4 7 4 7-1.79 7-4-3.134-4-7-4zm0 0V4m0 12v4'
										/>
									</svg>
								),
							},
							{
								key: "Strategic Planning",
								icon: (
									<svg
										className='w-5 h-5'
										viewBox='0 0 24 24'
										fill='none'
										stroke='currentColor'>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth='2'
											d='M4 6h16M4 12h10M4 18h6'
										/>
									</svg>
								),
							},
						];
						const selected: string[] =
							(watch("skills") as unknown as string[]) || [];
						const toggle = (key: string) => {
							const next = selected.includes(key)
								? selected.filter((k) => k !== key)
								: [...selected, key];
							setValue("skills" as never, next as never, {
								shouldValidate: true,
								shouldDirty: true,
							});
						};
						return (
							<div>
								<label
									className={`block text-sm font-medium mb-2 ${
										theme === "dark" ? "text-slate-200" : "text-slate-700"
									}`}>
									Skills
								</label>
								<div className='grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4'>
									{options.map((opt) => {
										const active = selected.includes(opt.key);
										return (
											<button
												type='button'
												onClick={() => toggle(opt.key)}
												key={opt.key}
												className={`flex items-center gap-3 w-full text-left px-5 py-4 rounded-2xl border transition-all ${
													theme === "dark"
														? active
															? "bg-blue-600/20 border-blue-500/50 text-slate-100"
															: "bg-slate-900/40 border-slate-700 text-slate-200 hover:border-slate-500"
														: active
														? "bg-blue-50 border-blue-400 text-slate-900"
														: "bg-white border-slate-200 text-slate-800 hover:border-slate-300"
												}`}>
												<span className='shrink-0'>{opt.icon}</span>
												<span className='font-medium'>{opt.key}</span>
											</button>
										);
									})}
								</div>
							</div>
						);
					},
					relevantExperience: ({ register, theme }) => {
						return (
							<div>
								<label
									className={`block text-sm font-medium mb-2 ${
										theme === "dark" ? "text-slate-200" : "text-slate-700"
									}`}>
									Relevant Experience
								</label>
								<textarea
									{...register("relevantExperience" as never)}
									rows={5}
									placeholder='Describe your relevant experience...'
									className={`w-full px-4 py-4 border rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-sm font-medium backdrop-blur-md shadow-sm hover:shadow-md ${
										theme === "dark"
											? "bg-slate-900/70 text-slate-100 border-slate-600/50 hover:border-slate-500/70 placeholder-slate-400"
											: "bg-white/70 text-slate-900 border-slate-300/50 hover:border-slate-400/70 placeholder-slate-500"
									}`}
								/>
							</div>
						);
					},
					acceptedTerms: ({ register, theme }) => {
						return (
							<div className='space-y-4'>
								<div
									className={`p-4 rounded-2xl border ${
										theme === "dark"
											? "bg-slate-900/40 border-slate-800"
											: "bg-white/70 border-slate-200"
									}`}>
									<ul
										className={`list-disc pl-6 space-y-2 text-sm ${
											theme === "dark" ? "text-slate-300" : "text-slate-700"
										}`}>
										<li>
											I confirm that all information provided is accurate and
											complete.
										</li>
										<li>
											I understand that providing false information may result
											in disqualification.
										</li>
										<li>
											I consent to Enactus Menoufia processing my personal data
											for recruitment purposes.
										</li>
									</ul>
								</div>
								<label className='flex items-center gap-3 text-sm'>
									<input
										type='checkbox'
										{...register("acceptedTerms" as never)}
										className={`w-5 h-5 rounded-lg border-2 transition-all duration-300 focus:ring-2 focus:ring-blue-500/20 ${
											theme === "dark"
												? "bg-transparent border-slate-600/50 text-blue-500 accent-blue-500 checked:bg-transparent checked:border-blue-500"
												: "bg-white/70 border-slate-300/50 text-blue-600 accent-blue-600 checked:bg-blue-600 checked:border-blue-600"
										}`}
									/>
									<span
										className={`${
											theme === "dark" ? "text-slate-200" : "text-slate-800"
										}`}>
										I agree to the terms and conditions *
									</span>
								</label>
							</div>
						);
					},
				}}
				fieldItemClassName={{
					skills: "md:col-span-2",
					relevantExperience: "col-span-1 md:col-span-2",
					acceptedTerms: "md:col-span-2",
				}}
			/>
			<Modal
				isOpen={isSuccessOpen}
				onClose={() => setIsSuccessOpen(false)}
				title='Application Submitted'
				size='md'>
				<div className='space-y-4'>
					<p className='text-sm'>
						Your application has been submitted successfully. We will get back
						to you soon.
					</p>
					<div className='flex justify-end'>
						<button
							onClick={() => setIsSuccessOpen(false)}
							className='px-4 py-2 rounded-xl text-sm font-medium border transition-colors duration-200 bg-blue-600 text-white hover:bg-blue-700'>
							Close
						</button>
					</div>
				</div>
			</Modal>
		</>
	);
}
