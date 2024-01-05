import * as yup from "yup";

export const registerUserSchema = yup.object().shape({
  email: yup.string().email("Must be valid email").required(),
  name: yup.string().trim().min(2, "Must be at least 2 characters long").max(50).required(),
  password: yup.string().min(6, "Must be at least 6 characters long").required(),
});

export type registerUserSchemaType = yup.InferType<typeof registerUserSchema>;
