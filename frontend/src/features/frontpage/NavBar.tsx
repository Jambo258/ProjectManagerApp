import { useEffect, useState } from "react";
import { Menu } from "react-feather";
import { NavLink } from "react-router-dom";

export const NavBar = () => {
  const [width, setWidth]  = useState(window.innerWidth);
  const [openMenu, setOpenMenu] = useState<boolean>(width > 640 ? true : false);
  
  const updateDimensions = () => {
    setWidth(window.innerWidth);
  };
  
  useEffect(() => {
    setOpenMenu(false);
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);


  return (
    <header className="grid grid-flow-row md:grid-flow-col min-h-24 w-full-fit md:bg-dark-blue-300 bg-dark-blue-100 drop-shadow-md">
      <section className="grid grid-flow-col w-full h-24 items-center px-6 py-4 bg-dark-blue-300">
        <h1 
          className="heading-sm sm:heading-md md:heading-  text-light-font leading-tight text-left outline-none focus:outline focus:outline-primary-200"
          onClick={() => setOpenMenu(false)}>
          <NavLink to="/">
          Project <br />
          Management App
          </NavLink>
        </h1>

        <section className="flex w-full align-middle justify-end h-full md:hidden">
          <button className="w-fit bg-grayscale-0 p-2 m-0 hover:bg-grayscale-0 text-light-font" onClick={() => setOpenMenu(!openMenu)}>
            <Menu size={28} />
          </button>
        </section>
      </section>     

      {(width > 768 || openMenu) &&
      <nav className="grid grid-flow-col content-center items-center justify-end text-right gap-4  p-4">
        <NavLink to="register">
          <button className="btn-text-xs w-full px-4 py-1.5 outline-none focus:outline focus:outline-primary-200" onClick={() => setOpenMenu(false)}>
            Register
          </button>
        </NavLink>
        <NavLink to="login">
          <button className="btn-text-xs w-full px-4 py-1.5 outline-none focus:outline focus:outline-primary-200" onClick={() => setOpenMenu(false)}>
            Login
          </button>
        </NavLink>
      </nav>
      }
    </header>
  );
};
