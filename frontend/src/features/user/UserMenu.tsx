import { useEffect, useRef, useState } from "react";
import { userColor } from "./UserColor";
import { ProfileModal } from "./ProfileModal";
import { useLogoutMutation } from "../api/apiSlice";
import { useNavigate } from "react-router-dom";
import { Modal } from "../../components/Modal";

interface UserMenuProps {
  id: number,
  name: string
}

export const UserMenu = ({id, name}: UserMenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [openMenu, setOpenMenu] = useState<boolean>(false);
  const [userLogout] = useLogoutMutation();
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await userLogout();
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };
  
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside, true);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const bgColor: string = userColor(id).bg + " hover:" + userColor(id).bg;

  return (        
    <section ref={menuRef} className="w-full px-4 sm:px-2 py-3.5 sm:py-4 sm:bg-dark-blue-100">

      <button
        onClick={() => setOpenMenu(!openMenu)} 
        className={`rounded-full m-0 p-0 w-8 h-8 ${userColor(id).textColor} text-center heading-xs leading-8 ${bgColor} cursor-pointer`}>
        {name[0].toUpperCase()}
      </button>  

      {openMenu &&
      <section 
        className="flex flex-col bg-grayscale-100 fixed w-fit z-20 sm:left-14 sm:bottom-2 sm:top-auto right-2 top-12 border-2 border-grayscale-200 shadow-md rounded divide-y divide-grayscale-200">
        <Modal 
          btnText={"Account settings"} 
          btnStyling="min-w-max w-full py-1.5 px-3 pe-4 text-left heading-xs bg-grayscale-0 hover:bg-grayscale-0 focus:ring-0 focus:text-caution-100"
          modalTitle={"Account settings"} >
          <ProfileModal />
        </Modal>
        <button 
          onClick={() => logout()}
          className="min-w-max w-full py-1.5 px-3 pe-4 text-left heading-xs bg-grayscale-0 hover:bg-grayscale-0 focus:ring-0 focus:text-caution-100">
            Logout
        </button>   
      </section>
      }

    </section>
  );
};
