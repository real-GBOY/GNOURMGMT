/** @format */

import * as yup from "yup";

export const signupPhase2Schema = yup.object().shape({
	email: yup.string().email("Invalid email").required("Email is required"),
	password: yup
		.string()
		.min(8, "Password must be at least 8 characters")
		.required("Password is required"),
	phoneNumber: yup.string().required("Phone number is required"),
	team: yup.string().required("Team selection is required"),
});
