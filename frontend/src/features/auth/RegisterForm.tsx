import {useState} from "react";

// Redux Toolkit
import { useRegisterUserMutation } from "../api/apiSlice";

// React Router
import { Link } from "react-router-dom";

// Hook Form and Yup
import { useForm } from "react-hook-form";
import { registerUserSchema } from "./authValidation";
import { yupResolver } from "@hookform/resolvers/yup";
import { DevTool } from "@hookform/devtools";

// Components
import { Eye, EyeOff } from "react-feather";

// Interfaces
interface FormValues {
  email: string;
  name: string;
  password: string;
}

export const RegisterForm = () => {
  const [registerUser, { isLoading }] = useRegisterUserMutation();
  const { control, formState: {errors}, handleSubmit, register } = useForm<FormValues>({
    defaultValues: {
      email: "",
      name: "",
      password: "",
    }
  });
  const [isVisible, setIsVisible] = useState(false);

  const onHandleSubmit = (formData: FormValues) => {
    console.log("Register form submitted", formData);
  };

  // const [email, setEmail] = useState("");
  // const [name, setName] = useState("");
  // const [password, setPassword] = useState("");


  // const canSave = [email, name, password].every(Boolean) && !isLoading;

  // const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   console.log("Email:", email);
  //   console.log("Name:", name);
  //   console.log("Password:", password);

  //   if (canSave) {
  //     try {
  //       const user = await registerUser({ email, name, password }).unwrap();
  //       console.log("user:", user);
  //       setEmail("");
  //       setName("");
  //       setPassword("");
  //     } catch (err) {
  //       console.error("Failed to save the user: ", err);
  //     }
  //   }
  //   // To do
  //   // input validation
  //   // error handling / message
  //   // if registration is successfull, log the user in and redirect user to the "user's homepage"
  // };

  return (
    <section className="w-fit mt-14 mx-auto">
      <h2 className="font-sans heading-xl text-dark-font uppercase leading-none w-fit mx-auto mb-6">
        Create <br /> your account
      </h2>
      <form
        onSubmit={handleSubmit(onHandleSubmit)} noValidate>

        <label
          className="body-text-sm text-dark-font block mb-3">
            Email:
          <input
            type="text"
            {...register("email")}
            placeholder="john.doe@mail.com"
            className="body-text-md py-1.5 px-4 mt-1 w-full block focus:outline-none focus:ring focus:ring-dark-blue-50" />
          <p className="text-center body-text-xs text-caution-200">{errors.email?.message}</p>
        </label>

        <label
          className="body-text-sm text-dark-font block mb-3">
            Full name:
          <input
            type="text"
            {...register("name")}
            placeholder="John Doe"
            className="body-text-md py-1.5 px-4 mt-1 w-full block focus:outline-none focus:ring focus:ring-dark-blue-50"/>
          <p className="text-center body-text-xs text-caution-200">{errors.name?.message}</p>
        </label>

        <label
          className="body-text-sm text-dark-font mb-8 block">
            Password:
          <section className="mx-auto mt-1 relative">
            <input
              type={isVisible ? "text" : "password"}
              {...register("password")}
              className="body-text-md py-1.5 px-4 w-full inline-block focus:outline-none focus:ring focus:ring-dark-blue-50"/>
            <button
              onClick={() => setIsVisible(!isVisible)}
              className="bg-grayscale-0 px-2 py-2.5 rounded-l-none absolute right-0 align-middle focus:outline-none focus:ring focus:ring-dark-blue-50">
              {isVisible ? <Eye size={18}/> : <EyeOff size={18}/>}
            </button>
          </section>
          <p className="text-center body-text-xs text-caution-200">{errors.password?.message}</p>
        </label>

        <button type="submit" className="w-full btn-text-md focus:outline-none focus:ring focus:ring-dark-blue-50">Register</button>
      </form>

      {/* For development only */}
      <DevTool control={control}/>

      <p className="body-text-sm text-dark-font mt-3 mb-1 text-center">Already have an account?</p>
      <Link to="/login" className="focus:outline-dark-blue-50">
        <p className="body-text-md text-dark-font underline text-center">Login</p>
      </Link>

    </section>
  );
};

// RegisterForm.action = registerAction;
