import * as yup from "yup";

export const createLabelSchema = yup.object().shape({
  name: yup
    .string()
    .trim()
    .min(2, "Must be at least 2 characters long")
    .max(15, "Must be less than 15 characters long")
    .required("Label name is required"),
  color: yup.string().trim().required("Color is required"),
});

export type createLabelSchemaType = yup.InferType<typeof createLabelSchema>;
