import { NavLink } from "react-router-dom";
<<<<<<< HEAD:frontend/src/pages/components/NavBar.tsx
=======
import { useAppSelector } from "../../app/hooks";
import { useLogoutMutation } from "../api/apiSlice";
>>>>>>> 1f12b5fc145874227a98ff0b829f0c921e75b9c6:frontend/src/features/frontpage/NavBar.tsx

export const NavBar = () => {
  return (
    <div className="w-full h-fit bg-dark-blue-300 grid grid-flow-col items-center px-6 py-4 drop-shadow-md">
      <div className="heading-lg text-light-font leading-tight outline-none focus:outline focus:outline-primary-200">
        <NavLink to="/">
          Project <br />
          Management App
        </NavLink>
      </div>
      <div className="text-right pr-6">
        <>
          <NavLink to="register">
            <button className="btn-text-xs px-4 py-1.5 mr-2 outline-none focus:outline focus:outline-primary-200">
              Register
            </button>
          </NavLink>
          <NavLink to="login">
            <button className="btn-text-xs px-4 py-1.5 outline-none focus:outline focus:outline-primary-200">
              Login
            </button>
          </NavLink>
        </>
      </div>
    </div>
  );
};
