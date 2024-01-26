import * as yup from "yup";

export const registerUserSchema = yup.object().shape({
  email: yup.string().email("Must be a valid email").required("Email is required"),
  name: yup.string().trim().min(2, "Must be at least 2 characters long").max(50, "Must be less than 50 characters long").required("Full name is required"),
  password: yup.string().min(6, "Must be at least 6 characters long").required("Password is required"),
  passwordConf: yup.string().oneOf([yup.ref("password")], "Passwords must match").required("Confirm password is required")
});

export const loginUserSchema = yup.object().shape({
  email: yup.string().email("Must be a valid email").required("Email is required"),
  password: yup.string().min(6, "Must be at least 6 characters long").required("Password is required")
});

export const changeNameSchema = yup.object().shape({
  name: yup
    .string()
    .trim()
    .min(2, "Must be at least 2 characters long")
    .max(50, "Must be less than 50 characters long")
    .required("Full name is required")
});

export const changeEmailSchema = yup.object().shape({
  email: yup
    .string()
    .email("Must be a valid email")
    .required("Email is required")
});

export const changePasswordSchema = yup.object().shape({
  password: yup
    .string()
    .min(6, "Must be at least 6 characters long")
    .required("Password is required")
});

export const inviteUserSchema = yup.object().shape({
  email: yup.string().email("Must be a valid email").required("Email is required"),
  role: yup.string().required("Role is required")
});

export type registerUserSchemaType = yup.InferType<typeof registerUserSchema>;
export type changeNameSchemaType = yup.InferType<typeof changeNameSchema>;
export type changeEmailSchemaType = yup.InferType<typeof changeEmailSchema>;
export type changePasswordSchemaType = yup.InferType<typeof changePasswordSchema>;
