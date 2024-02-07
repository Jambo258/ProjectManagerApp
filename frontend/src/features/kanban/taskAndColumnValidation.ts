import * as yup from "yup";

export const columnSchema = yup.object().shape({
  title: yup
    .string()
    .trim()
    .min(2, "Must be at least 2 characters long")
    .max(15, "Must be less than 15 characters long")
    .required("Column title is required"),
});

export const taskTitleSchema = yup.object().shape({
  title: yup
    .string()
    // .trim()
    .min(2, "Must be at least 2 characters long")
    .max(15, "Must be less than 15 characters long")
    .required("Task title is required"),
});

export const taskContentSchema = yup.object().shape({
  content: yup
    .string()
    // .trim()
    // .min(2, "Must be at least 2 characters long")
    .max(150, "Must be less than 150 characters long")
    // .required("Task content is required"),
});

export type columnSchemaType = yup.InferType<typeof columnSchema>;
export type taskTitleSchemaType = yup.InferType<typeof taskTitleSchema>;
export type taskContentSchemaType = yup.InferType<typeof taskContentSchema>;
