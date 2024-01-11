import { useState } from "react";
import { useAddNewProjectMutation } from "../../features/api/apiSlice";
import { Plus, X } from "react-feather";

const CreateProjectModal = () => {
  const [showModal, setShowModal] = useState(false);
  const [inputName, setInputName] = useState("");
  const [addNewProject] = useAddNewProjectMutation();

  const newProject = async () => {
    try {
      const project = await addNewProject(inputName).unwrap();

      if (project) closeModal();
    } catch (err) {
      console.error("failed to create project", err);
    }
  };

  const openModal = () => {
    setInputName("");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setInputName("");
  };

  return (
    <>
      <button className="p-1.5 rounded-full heading-md" onClick={() => openModal()}>
        <Plus size={16} />
      </button>
      {showModal &&
        <div
          onClick={() => closeModal()}
          className={`fixed flex inset-0 z-50 justify-center items-center transition-colors ${
            showModal ? "visible bg-dark-blue-100/40" : "invisible"
          }`}
        >
          <div className="relative w-[500px] h-[300px] my-6 mx-auto text-dark-font text-left">
            <div
              onClick={(e) => e.stopPropagation()}
              className={`p-2 rounded-lg shadow transition-all bg-grayscale-100  ${
                showModal ? "scale-100 opacity-100" : "scale-110 opacity-0"
              }`}
            >
              <div className="flex justify-end">
                <button
                  className="text-right bg-grayscale-0 p-2 hover:bg-grayscale-0"
                  onClick={() => closeModal()}
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex flex-col m-4">
                <h1 className="pb-4 heading-md"> Create new project</h1>
                <label className="heading-xs block">
                  Project name
                  <input
                    type="text"
                    placeholder="Give a project name!"
                    value={inputName}
                    onChange={(e) => setInputName(e.target.value)}
                    className="block w-full py-1.5 px-4 mt-1 body-text-md focus:outline-none focus:ring focus:ring-dark-blue-50"
                  />
                </label>

                <div className="flex my-4 justify-between">
                  <button
                    className="btn-text-md w-48 bg-success-100 hover:bg-success-200"
                    onClick={() => newProject()}
                  >
                    Add Project
                  </button>
                  <button
                    className="btn-text-md w-48 bg-caution-100 hover:bg-caution-200"
                    onClick={() => closeModal()}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    </>
  );
};

export default CreateProjectModal;
