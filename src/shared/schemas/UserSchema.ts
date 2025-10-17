import * as yup from "yup";

export const verifyUserSchema = yup.object().shape({
  isVerified: yup.boolean().required("Verification status is required"),
  roleId: yup.string().optional(),
});

export const assignRoleSchema = yup.object().shape({
  roleId: yup.string().required("Role ID is required"),
}); 