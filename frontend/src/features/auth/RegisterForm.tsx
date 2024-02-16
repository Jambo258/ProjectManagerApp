import { useState } from "react";

// Redux Toolkit
import { useRegisterUserMutation } from "../api/apiSlice";

// React Router
import { Link, useNavigate } from "react-router-dom";

// Hook Form and Yup
import { FieldErrors, useForm } from "react-hook-form";
import { registerUserSchema } from "./authValidation";
import { yupResolver } from "@hookform/resolvers/yup";

// Components
import { Eye, EyeOff } from "react-feather";

// Interfaces
interface RegisterFormValues {
  email: string;
  name: string;
  password: string;
  passwordConf: string;
}

export const RegisterForm = () => {
  const [registerUser, { isLoading }] = useRegisterUserMutation();
  const {
    formState: { isDirty, isSubmitting, errors },
    handleSubmit,
    register,
    reset,
  } = useForm<RegisterFormValues>({
    defaultValues: {
      email: "",
      name: "",
      password: "",
      passwordConf: "",
    },
    resolver: yupResolver(registerUserSchema),
  });
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConf, setShowPasswordConf] = useState(false);
  const [formError, setFormError] = useState<null | string>(null);
  const redirectLinkText = "Login";

  const canSave = isDirty && !isLoading;

  const onHandleSubmit = async (formData: RegisterFormValues) => {
    if (canSave) {
      try {
        await registerUser({
          email: formData.email,
          name: formData.name,
          password: formData.password,
        }).unwrap();
        reset();
        setFormError(null);
        navigate("/");
      } catch (err) {
        onError;
        console.error("Failed to save the user", err);
        if (
          err &&
          typeof err === "object" &&
          "data" in err &&
          err.data &&
          typeof err.data === "object"
        ) {
          const errorMessage = Object.values(err.data);
          setFormError(errorMessage.toString());
        }
      }
    }
  };

  const onError = (errors: FieldErrors<RegisterFormValues>) => {
    console.error("Form field errors:", errors);
  };

  return (
    <section className="w-fit mt-14 mx-auto">

      <h2 className="font-sans heading-xl text-dark-font uppercase leading-none w-fit mx-auto mb-6">
        Create <br /> your account
      </h2>
      <form onSubmit={handleSubmit(onHandleSubmit, onError)} noValidate>

        <label className="body-text-sm text-dark-font block mb-3">
          Email:
          <input
            type="email"
            {...register("email")}
            autoComplete="username"
            placeholder="e.g. john.doe@mail.com"
            className="body-text-md py-1.5 px-4 mt-1 w-full block focus:outline-none focus:ring focus:ring-dark-blue-50"
          />
          <p className="text-center body-text-xs text-caution-200 mt-1">
            {errors.email?.message}
          </p>
        </label>

        <label className="body-text-sm text-dark-font block mb-3">
          Full name:
          <input
            type="text"
            {...register("name")}
            placeholder="e.g. John Doe"
            autoComplete="name"
            className="body-text-md py-1.5 px-4 mt-1 w-full block focus:outline-none focus:ring focus:ring-dark-blue-50"
          />
          <p className="text-center body-text-xs text-caution-200 mt-1">
            {errors.name?.message}
          </p>
        </label>

        <label className="body-text-sm text-dark-font mb-3 block">
          Password:
          <section className="mx-auto mt-1 relative">
            <input
              type={showPassword ? "text" : "password"}
              {...register("password")}
              autoComplete="new-password"
              className="body-text-md py-1.5 px-4 w-full inline-block focus:outline-none focus:ring focus:ring-dark-blue-50"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="bg-grayscale-0 px-2 py-2.5 rounded-l-none absolute right-0 align-middle focus:outline-none focus:ring focus:ring-dark-blue-50">
              {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
          </section>
          <p className="text-center body-text-xs text-caution-200 mt-1">
            {errors.password?.message}
          </p>
        </label>

        <label className="body-text-sm text-dark-font mb-8 block">
          Confirm Password:
          <section className="mx-auto mt-1 relative">
            <input
              type={showPasswordConf ? "text" : "password"}
              {...register("passwordConf")}
              autoComplete="new-password"
              className="body-text-md py-1.5 px-4 w-full inline-block focus:outline-none focus:ring focus:ring-dark-blue-50"
            />
            <button
              type="button"
              onClick={() => setShowPasswordConf(!showPasswordConf)}
              className="bg-grayscale-0 px-2 py-2.5 rounded-l-none absolute right-0 align-middle focus:outline-none focus:ring focus:ring-dark-blue-50">
              {showPasswordConf ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
          </section>
          <p className="text-center body-text-xs text-caution-200 mt-1">
            {errors.passwordConf?.message}
          </p>
          <p className="text-center body-text-xs text-caution-200 mt-1">
            {formError}
          </p>
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full btn-text-md focus:outline-none focus:ring focus:ring-dark-blue-50">
          Register
        </button>
      </form>

      <p className="body-text-sm text-dark-font mt-3 mb-1 text-center">
        Already have an account?
      </p>
      <Link
        to="/login"
        className="block body-text-md underline text-center text-dark-font hover:text-dark-blue-50 focus:outline-none focus:ring-0 focus:text-caution-100">
        {redirectLinkText}
      </Link>
    </section>
  );
};
