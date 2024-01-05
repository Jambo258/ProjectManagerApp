import React, {useState} from "react";
import { Link, Form, ActionFunctionArgs } from "react-router-dom";
import { registerUserSchema } from "./authValidation";
import { Eye, EyeOff } from "react-feather";
import { useRegisterUserMutation } from "../api/apiSlice";

const registerAction = async ({ request }: ActionFunctionArgs) => {
  const data = await request.formData();

  const submission = {
    email: data.get("email"),
    name: data.get("name"),
    password: data.get("password")
  };
  console.log(submission);

  // const isValid = await registerUserSchema.isValid(submission);
  // const emailIsValid = await registerUserSchema.isValid(submission.email);
  // const nameIsValid = await registerUserSchema.isValid(submission.name);
  const isValid = await registerUserSchema.validate(submission);




  console.log(isValid);

  return null;
};

export const RegisterForm = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [registerUser, { isLoading }] = useRegisterUserMutation();

  const canSave = [email, name, password].every(Boolean) && !isLoading;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Email:", email);
    console.log("Name:", name);
    console.log("Password:", password);

    if (canSave) {
      try {
        const user = await registerUser({ email, name, password }).unwrap();
        console.log("user:", user);
        setEmail("");
        setName("");
        setPassword("");
      } catch (err) {
        console.error("Failed to save the user: ", err);
      }
    }
    // To do
    // input validation
    // error handling / message
    // if registration is successfull, log the user in and redirect user to the "user's homepage"
  };

  return (
    <section className="w-fit mt-14 mx-auto">
      <h2 className="font-sans heading-xl text-dark-font uppercase leading-none w-fit mx-auto mb-6">
        Create <br /> your account
      </h2>
      <Form
        method="post"
        action="/register">

        <label
          className="body-text-sm text-dark-font block mb-1">
            Email:
          <input
            name="email"
            type="text"
            placeholder="john.doe@mail.com"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            required
            className="body-text-md py-1.5 px-4 mb-3 w-full block focus:outline-none focus:ring focus:ring-dark-blue-50" />
        </label>

        <label
          className="body-text-sm text-dark-font block mb-1">
            Full name:
          <input
            name="name"
            type="text"
            placeholder="John Doe"
            value={name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
            required
            className="body-text-md py-1.5 px-4 mb-3 w-full block focus:outline-none focus:ring focus:ring-dark-blue-50"/>
        </label>

        <label
          className="body-text-sm text-dark-font block mb-1">
            Password:
          <section className="mx-auto relative">
            <input
              name="password"
              type={isVisible ? "text" : "password"}
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              required
              className="body-text-md py-1.5 px-4 mb-8 w-full inline-block focus:outline-none focus:ring focus:ring-dark-blue-50"/>
            <button
              onClick={() => setIsVisible(!isVisible)}
              className="bg-grayscale-0 px-2 py-2.5 rounded-l-none absolute right-0 align-middle focus:outline-none focus:ring focus:ring-dark-blue-50">
              {isVisible ? <Eye size={18}/> : <EyeOff size={18}/>}
            </button>
          </section>
        </label>

        <button type="submit" className="w-full btn-text-md focus:outline-none focus:ring focus:ring-dark-blue-50">Register</button>
      </Form>

      <p className="body-text-sm text-dark-font mt-3 mb-1 text-center">Already have an account?</p>
      <Link to="/login" className="focus:outline-dark-blue-50">
        <p className="body-text-md text-dark-font underline text-center">Login</p>
      </Link>

    </section>
  );
};

RegisterForm.action = registerAction;
