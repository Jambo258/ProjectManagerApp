import {useState} from "react";

// Redux Toolkit
import { useLoginUserMutation } from "../api/apiSlice";

// React Router
import { Link, useNavigate } from "react-router-dom";

// Hook Form and Yup
import { FieldErrors, useForm } from "react-hook-form";
import { loginUserSchema } from "./authValidation";
import { yupResolver } from "@hookform/resolvers/yup";
import { DevTool } from "@hookform/devtools";

// Components
import { Eye, EyeOff } from "react-feather";

interface LoginFormValues {
  email: string;
  password: string;
}

export const LoginForm = () => {
  const [loginUser, { isLoading }] = useLoginUserMutation();
  const {
    control,
    formState: {isDirty, isSubmitting, isSubmitSuccessful, errors},
    handleSubmit,
    register,
    reset
  } = useForm<LoginFormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: yupResolver(loginUserSchema),
  });
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<null | string>(null);

  const canSubmit = isDirty && !isLoading;

  const onHandleSubmit = async (formData: LoginFormValues) => {
    if (canSubmit) {
      try {
        const user = await loginUser({ ...formData }).unwrap();
        console.log("Login form submitted");
        console.log("User:", user);
        if (isSubmitSuccessful) {
          reset();
          setFormError(null);
          // TO DO: Fix path to user home page
          navigate("/");
        }
      } catch (err) {
        onError;
        console.error("Failed to save the user", err);
        // TO DO: Refactor this
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

  const onError = (errors: FieldErrors<LoginFormValues>) => {
    console.log("Form field errors:", errors);
  };

  return (
    <section className="w-fit mt-14 mx-auto">

      <h2 className="font-sans heading-xl text-dark-font uppercase leading-none w-fit mx-auto mb-6">
        Login to <br /> your account
      </h2>
      <form
        onSubmit={handleSubmit(onHandleSubmit, onError)} noValidate>

        <label
          className="body-text-sm text-dark-font block mb-3">
            Email:
          <input
            type="text"
            {...register("email")}
            placeholder="e.g. john.doe@mail.com"
            className="body-text-md py-1.5 px-4 mt-1 w-full block focus:outline-none focus:ring focus:ring-dark-blue-50" />
          <p className="text-center body-text-xs text-caution-200 mt-1">{errors.email?.message}</p>
        </label>

        <label
          className="body-text-sm text-dark-font block mb-8">
            Password:
          <section className="mx-auto mt-1 relative">
            <input
              type={showPassword ? "text" : "password"}
              {...register("password")}
              className="body-text-md py-1.5 px-4 w-full inline-block focus:outline-none focus:ring focus:ring-dark-blue-50"/>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="bg-grayscale-0 px-2 py-2.5 rounded-l-none absolute right-0 align-middle focus:outline-none focus:ring focus:ring-dark-blue-50">
              {showPassword ? <Eye size={18}/> : <EyeOff size={18}/>}
            </button>
          </section>
          <p className="text-center body-text-xs text-caution-200 mt-1">{errors.password?.message}</p>
          <p className="text-center body-text-xs text-caution-200 mt-1">{formError}</p>
        </label>

        <button type="submit" disabled={isSubmitting} className="w-full btn-text-md focus:outline-none focus:ring focus:ring-dark-blue-50">Login</button>
      </form>

      {/* For development only */}
      <DevTool control={control}/>

      <Link to="/register" className="focus:outline-dark-blue-50">
        <p className="body-text-md text-dark-font underline text-center mt-3">Create account</p>
      </Link>

    </section>
  );
};
