import Modal from "react-modal";
import { useState } from "react";
import projectServices from "./projectServices";

Modal.setAppElement("#root");

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

const CreateProjectModal = () => {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [inputName, setInputName] = useState("default");

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const newProject = () => {
    const content = [{}];
    const createdProject = projectServices.createNewProject(inputName);
    const createdPage = projectServices.newPage("new page", 6666, content);
    console.log(createdProject, createdPage);
    closeModal();
  };

  return (
    <>
      <button className="" onClick={openModal}>
        Open Modal
      </button>

      <div className="">
        <Modal
          className={""}
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          style={customStyles}
        >
          <div>
            <input
              type="text"
              defaultValue={"Project name"}
              required={true}
              onChange={(e) => setInputName(e.target.value)}
            />
          </div>

          <button className="" onClick={() => newProject}>
            Add project
          </button>
          <button onClick={closeModal}>Cancel</button>
        </Modal>
      </div>
    </>
  );
};

export default CreateProjectModal;
