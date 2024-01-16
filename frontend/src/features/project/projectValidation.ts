import * as yup from "yup";

export const projectNameSchema = yup.object().shape({
  projectName: yup
    .string()
    .trim()
    .min(2, "Must be at least 2 characters long")
    .max(50, "Must be less than 50 characters long")
    .required("Project name is required"),
});

export type projectNameSchemaType = yup.InferType<typeof projectNameSchema>;
