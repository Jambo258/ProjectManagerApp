import { useState } from "react";
import { useAddNewProjectMutation } from "../../features/api/apiSlice";

const CreateProjectModal = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [inputName, setInputName] = useState("");
  const [addNewProject, { isSuccess }] = useAddNewProjectMutation();

  const newProject = async () => {
    try {
      const project = await addNewProject(inputName);
      console.log(project);
      if (isSuccess) closeModal();
    } catch (error) {
      console.log(error);
    }
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setInputName("");
  };

  return (
    <>
      <button
        className="btn-text-xs px-4 py-1.5 outline-none focus:outline focus:outline-primary-200"
        type="button"
        onClick={() => setModalIsOpen(true)}
      >
        Create new project
      </button>
      {modalIsOpen ? (
        <div
          onClick={() => closeModal()}
          className={`flex justify-center fixed inset-0 z-50 items-center transition-colors ${
            modalIsOpen ? "visible bg-dark-blue-100/20" : "invisible"
          }`}
        >
          <div className="relative w-[500px] h-[300px] my-6 mx-auto">
            <div
              onClick={(e) => e.stopPropagation()}
              className={`rounded-lg shadow p-2 transition-all bg-grayscale-100  ${
                modalIsOpen ? "scale-100 opacity-100" : "scale-110 opacity-0"
              }`}
            >
              <div className="flex flex-col px-4 ">
                <div className="flex justify-end">
                  <button
                    className="flex justify-end w-12 bg-grayscale-0 px-2 py-2 hover:bg-grayscale-0"
                    onClick={() => closeModal()}
                  >
                    x
                  </button>
                </div>

                <h1 className="heading-xl pb-4"> Create new project</h1>
                <label className="heading-sm ">Project name </label>
                <input
                  type="text"
                  placeholder="Give a project name!"
                  value={inputName}
                  onChange={(e) => setInputName(e.target.value)}
                />

                <div className="my-4 flex justify-between">
                  <button
                    className="btn-text-md bg-success-100 w-48 hover:bg-success-200"
                    onClick={() => newProject()}
                  >
                    Add Project
                  </button>
                  <button
                    className="btn-text-md  w-48 "
                    onClick={() => closeModal()}
                  >
                    cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default CreateProjectModal;
