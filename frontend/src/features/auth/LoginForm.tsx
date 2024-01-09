import React, {useState} from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "react-feather";

export const LoginForm = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Email:", email);
    console.log("Password:", password);

    // To do
    // input validation
    // error handling / message
    // if login is successfull redirect user to the "user's homepage"
  };

  return (
    <section className="w-fit mt-14 mx-auto">

      <h2 className="font-sans heading-xl text-dark-font uppercase leading-none w-fit mx-auto mb-6">
        Login to <br /> your account
      </h2>
      <form
        onSubmit={handleSubmit}>

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
          className="body-text-md py-1.5 px-4 mb-3 w-full block focus:outline-none focus:ring focus:ring-dark-blue-50" />

        <label
          htmlFor="passwordInput"
          className="body-text-sm text-dark-font block mb-1">Password:</label>
        <section className="mx-auto relative">
          <input
            id="passwordInput"
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

        <button type="submit" className="w-full btn-text-md focus:outline-none focus:ring focus:ring-dark-blue-50">Login</button>
      </form>

      <Link to="/register" className="focus:outline-dark-blue-50">
        <p className="body-text-md text-dark-font underline text-center mt-3">Create account</p>
      </Link>

    </section>
  );
};
