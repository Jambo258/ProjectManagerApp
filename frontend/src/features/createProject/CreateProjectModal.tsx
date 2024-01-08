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
        show modal
      </button>
      {modalIsOpen ? (
        <div className="flex justify-center inset-0 z-50 items-center ">
          <div className="relative w-[500px] h-[300px] my-6 mx-auto">
            <div className="border-0 rounded-lg shadow-lg relative w-full h-full bg-white outline-none focus:outline-none">
              <div className="flex flex-col px-4 ">
                <h1 className="heading-xl py-6"> Create new project</h1>
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
