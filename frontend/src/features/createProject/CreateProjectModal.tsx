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

  // const afterOpenModal = () => {
  //   console.log("test");
  // };

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
    <div>
      <button onClick={openModal}>Open Modal</button>
      <Modal
        isOpen={modalIsOpen}
        //onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Create new project modal"
      >
        <input
          type="text"
          defaultValue={"Project name"}
          required={true}
          onChange={(e) => setInputName(e.target.value)}
        />

        <button onClick={() => newProject}>Create new project</button>
        <button onClick={closeModal}>close</button>
      </Modal>
    </div>
  );
};

export default CreateProjectModal;
