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
      <button className="rounded-full p-1.5 heading-md" onClick={() => openModal()}>
        <Plus size={16} />
      </button>
      {showModal ? (
        <div
          onClick={() => closeModal()}
          className={`flex justify-center fixed inset-0 z-50 items-center transition-colors ${
            showModal ? "visible bg-dark-blue-100/40" : "invisible"
          }`}
        >
          <div className="relative w-[500px] h-[300px] my-6 mx-auto text-dark-font text-left">
            <div
              onClick={(e) => e.stopPropagation()}
              className={`rounded-lg shadow p-2 transition-all bg-grayscale-100  ${
                showModal ? "scale-100 opacity-100" : "scale-110 opacity-0"
              }`}
            >
              <div className="flex flex-col px-4 ">
                <div className="flex justify-end">
                  <button
                    className="bg-grayscale-0 p-2 hover:bg-grayscale-0 text-right"
                    onClick={() => closeModal()}
                  >                  
                    <X size={20} />
                  </button>
                </div>

                <h1 className="heading-xl pb-4"> Create new project</h1>
                <label className="heading-sm ">Project name</label>
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
                    Cancel
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
