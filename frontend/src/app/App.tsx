import { NavLink, Outlet } from "react-router-dom";
import CreateProjectModal from "../features/createProject/CreateProjectModal";

const App = () => {
  return (
    <>
      <NavLink to="/" className="mr-5 text-dark-font text-4xl">
        Project Management App
      </NavLink>
      <NavLink to="login" className="mr-5 hover:font-bold">
        Login
      </NavLink>
      <NavLink to="register" className="hover:font-bold">
        Register
      </NavLink>

      <Outlet />

      <CreateProjectModal />
    </>
  );
};

export default App;
