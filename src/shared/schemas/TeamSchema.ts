import * as yup from "yup";

export const teamSchema = yup.object().shape({
    name: yup.string().required("Team name is required").min(2, "Team name must be at least 2 characters"),
    description: yup.string().required("Description is required").min(10, "Description must be at least 10 characters"),
});

export const updateTeamSchema = yup.object().shape({
    name: yup.string().min(2, "Team name must be at least 2 characters"),
    description: yup.string().min(10, "Description must be at least 10 characters"),
}); 