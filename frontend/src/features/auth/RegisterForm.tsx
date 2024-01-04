import React, {useState} from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "react-feather";

export const RegisterForm = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Email:", email);
    console.log("Name:", name);
    console.log("Password:", password);

    // To do
    // input validation
    // error handling / message
    // if registration is successfull, log the user in and redirect user to the "user's homepage"
  };

  return (
    <section className="my-8 w-fit mx-auto">
      <h2 className="font-sans heading-xl text-dark-font uppercase leading-none w-fit mx-auto mb-6">Create <br /> your account</h2>
      <form
        onSubmit={handleSubmit}
        className="mx-auto relative">

        <label
          htmlFor="emailInput"
          className="body-text-sm text-dark-font block mb-1">Email:</label>
        <input
          id="emailInput"
          type="text"
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          placeholder="john.doe@mail.com"
          required
          className="body-text-md py-1.5 px-4 mb-3 w-full block focus:outline-none focus:ring focus:ring-primary-200" />

        <label
          htmlFor="nameInput"
          className="body-text-sm text-dark-font block mb-1">Full name:</label>
        <input
          id="nameInput"
          type="text"
          value={name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
          placeholder="John Doe"
          required
          className="body-text-md py-1.5 px-4 mb-3 w-full block focus:outline-none focus:ring focus:ring-primary-200"/>

        <label
          htmlFor="passwordInput"
          className="body-text-sm text-dark-font block mb-1">Password:</label>
        <input
          id="passwordInput"
          type={isVisible ? "text" : "password"}
          value={password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
          required
          className="body-text-md py-1.5 px-4 mb-8 w-full inline-block focus:outline-none focus:ring focus:ring-primary-200"/>
        <button
          onClick={() => setIsVisible(!isVisible)}
          className="bg-grayscale-0 px-2 py-2.5 rounded-l-none absolute right-0 align-middle focus:outline-none focus:ring focus:ring-primary-200 ">
          {isVisible ? <Eye size={18}/> : <EyeOff size={18}/>}
        </button>

        <button type="submit" className="w-full btn-text-md focus:outline-none focus:ring focus:ring-primary-200">Register</button>
      </form>
      <p className="body-text-sm text-dark-font mt-3 mb-1 text-center">Already have an account?</p>
      <Link to="/login" className="focus:outline-primary-200"><p className="body-text-md text-dark-font underline text-center">Login</p></Link>
    </section>
  );
};
