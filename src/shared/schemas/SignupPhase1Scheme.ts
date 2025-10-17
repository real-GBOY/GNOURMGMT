/** @format */

import * as yup from "yup";

export const signupPhase1Schema = yup.object().shape({
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
	file: yup
		.mixed()
		.test("file-required", "Profile Picture is required", function (value) {
			return value instanceof File;
		}),
});
