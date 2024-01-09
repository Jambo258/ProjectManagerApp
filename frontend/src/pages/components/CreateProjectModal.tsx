import { useState } from "react";

const CreateProjectModal = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [inputName, setInputName] = useState("Give a project name!");

  const newProject = () => {
    //add functionality to create a new project here
    setModalIsOpen(false);
  };

  return (
    <>
      <button
        className="btn-text-xs px-4 py-1.5 outline-none focus:outline focus:outline-primary-200"
        type="button"
        onClick={() => setModalIsOpen(!modalIsOpen)}
      >
        Create new project
      </button>
      {modalIsOpen ? (
        <div
          onClick={() => setModalIsOpen(!modalIsOpen)}
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
                    onClick={() => setModalIsOpen(false)}
                  >
                    x
                  </button>
                </div>

                <h1 className="heading-xl pb-4"> Create new project</h1>
                <label className="heading-sm ">Project name </label>
                <input
                  type="text"
                  value={inputName}
                  onChange={(e) => setInputName(e.target.value)}
                />

                <div className="my-4 flex justify-between">
                  <button
                    className="btn-text-md bg-success-100 w-48"
                    onClick={() => newProject()}
                  >
                    Add Project
                  </button>
                  <button
                    className="btn-text-md w-18 bg-grayscale-300 w-48 "
                    onClick={() => setModalIsOpen(false)}
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
