/** @format */

import * as yup from "yup";

export const signupSchema = yup.object().shape({
	firstName: yup.string().required("First name is required"),
	lastName: yup.string().required("Last name is required"),
	nationalID: yup.string().required("National ID is required"),
	dateOfBirth: yup
		.date()
		.required("Date of birth is required")
		.max(new Date(), "Date of birth cannot be in the future")
		.test(
			"age-validation",
			"You must be at least 13 years old",
			function (value) {
				if (!value) return false;
				const today = new Date();
				const birthDate = new Date(value);
				const age = today.getFullYear() - birthDate.getFullYear();
				const monthDiff = today.getMonth() - birthDate.getMonth();

				if (
					monthDiff < 0 ||
					(monthDiff === 0 && today.getDate() < birthDate.getDate())
				) {
					return age - 1 >= 13;
				}
				return age >= 13;
			}
		),
	email: yup.string().email("Invalid email").required("Email is required"),
	password: yup
		.string()
		.min(8, "Password must be at least 8 characters")
		.required("Password is required"),
	phoneNumber: yup.string().required("Phone number is required"),
	file: yup.mixed().required("Profile Picture is required"),
	team: yup.string().required("Team selection is required"),
});
