import { NavLink } from "react-router-dom";

export const NavBar = () => {
  return (
    <div className="w-screen h-fit bg-dark-blue-300 grid grid-flow-col items-center px-6 py-4 drop-shadow-md">
      <div className="heading-lg text-light-font leading-tight outline-none focus:outline focus:outline-primary-200">
        <NavLink to="/">
          Project <br />
          Management App
        </NavLink>
      </div>

      <div className="text-right pr-6">
        <NavLink to="login">
          <button className="btn-text-xs px-4 py-1.5  outline-none focus:outline focus:outline-primary-200">
            Login
          </button>
        </NavLink>
      </div>
    </div>
  );
};
