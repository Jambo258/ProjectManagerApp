import { useState} from "react";
import { X } from "react-feather";

export const RenameProjectModal = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <button type="button" className="heading-xs bg-grayscale-0 p-2 hover:bg-grayscale-0 min-w-max"
        onClick={openModal}>
        Rename project
      </button>
      {isModalOpen ? (
        <dialog className="min-w-fit flex flex-col justify-center items-left overflow-x-hidden overflow-y-auto fixed inset-0 z-30 outline-none rounded focus:outline-none">
          <section className="flex w-full justify-end">
            <button
              onClick={() => setIsModalOpen(false)}
              className="bg-grayscale-0 p-2 hover:bg-grayscale-0 text-dark-font">
              <X size={20}/>
            </button>
          </section>
          <section className="grid-cols-1">
            <p>Modal content goes here</p>
          </section>
        </dialog>) : null
      }
    </>
  );
};
