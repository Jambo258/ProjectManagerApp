import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Menu, Plus, X } from "react-feather";
import { ProjectNavItem } from "./ProjectNavItem";
import CreateProjectModal from "../project/CreateProjectModal";
import {
  useGetProjectsQuery,
  useLogoutMutation,
} from "../../features/api/apiSlice";
import { useNavigate } from "react-router-dom";
import { Modal } from "../../components/Modal";
import { ProfileModal } from "./ProfileModal";
import { UserMenu } from "./UserMenu";
import { userColor } from "./UserColor";
import { useAppSelector } from "../../app/hooks";

export const DashboardNav = () => {
  const [logout] = useLogoutMutation();
  const navigate = useNavigate();

  const [width, setWidth]  = useState(window.innerWidth);
  const [openNav, setOpenNav] = useState<boolean>(width > 640 ? true : false);

  const { data: projects = [] } = useGetProjectsQuery();
  const user = useAppSelector((state) => state.auth.user);

  const updateDimensions = () => {
    setWidth(window.innerWidth);
  };
  
  useEffect(() => {
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const Logout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  if(!user) {
    return null;
  }

  return (
    <nav
      className={`bg-dark-blue-300 text-light-font w-full sm:min-h-screen flex-shrink-0 ${openNav ? "sm:w-72 h-full fixed sm:relative z-40" : "sm:w-12 h-14"}`}>
      <div className={`sm:min-h-[calc(100vh-4rem)] sm:h-[calc(100vh-4rem)] overflow-y-auto ${openNav ? "min-h-[calc(100vh-4rem)] h-[calc(100vh-4rem)]" : "h-fit"}`}>
        <div className="sm:sticky top-0 grid grid-flow-col sm:justify-end bg-dark-blue-300">
          <button
            className="w-fit p-4 heading-sm text-light-font hover:text-primary-200 bg-grayscale-0 hover:bg-grayscale-0 focus:ring-0 focus:text-caution-100"
            onClick={() => setOpenNav(!openNav)}
          >
            
            {width > 640 ?
              openNav ? (
                <ChevronLeft size={20} />
              ) : (
                <ChevronRight size={20} />
              )
              : openNav ? (
                <X size={20} />
              ) : (
                <Menu size={20} />
              )}
          </button>
        </div>

        {openNav && (
          <section>
            <h4 className="px-6 mb-6 heading-sm">
              Project <br /> Management App
            </h4>

            <div className="grid grid-flow-col px-6 py-4 items-center border-b border-solid border-dark-blue-100">
              <div className="heading-sm">My projects</div>
              <div className="text-right">
                <Modal
                  btnText={<Plus size={16} />}
                  btnStyling={"p-1.5 rounded-full heading-sm"}
                  modalTitle={"Create new project"}>
                  <CreateProjectModal />
                </Modal>
              </div>
            </div>

            {projects.map((project) => (
              <div key={project.id}>
                <ProjectNavItem project={project} />
              </div>
            ))}
          </section>
        )}
      </div>

      {openNav
        ?
        <section className="grid grid-flow-col h-16 py-2 px-4 items-center bg-dark-blue-100 w-full">
          <Modal
            btnText={user.name[0]}
            btnStyling={`rounded-full m-0 p-0 w-8 h-8 ${userColor(user.id).textColor} text-center heading-xs leading-8 ${userColor(user.id).bg} cursor-pointer`}
            modalTitle={"Account settings"} >
            <ProfileModal />
          </Modal>
          <div>
            <button
              onClick={() => Logout()}
              className="float-right w-fit p-2 heading-xs text-light-font bg-grayscale-0 hover:text-primary-200 hover:bg-grayscale-0"
            >
              <p>Log out</p>
            </button>
          </div>
        </section>
        :
        <section className="absolute top-0 right-0 z-10 -mt-1 sm:block sm:mt-0 sm:top-auto sm:right-auto"><UserMenu name={user.name} id={user.id} /></section>
      }
    </nav>
  );
};
