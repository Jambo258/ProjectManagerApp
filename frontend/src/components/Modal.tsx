import { type ReactNode, useState, } from "react";
import { X } from "react-feather";

interface ModalProps {
    btnText: string;
    btnStyling: string;
    modalTitle: string | null;
    children: ReactNode;
}

export const Modal = ({
  btnText,
  btnStyling,
  modalTitle,
  children
}: ModalProps) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };


  return (
    <>
      <button
        type="button"
        onClick={openModal}
        className={btnStyling}>
        {btnText}
      </button>

      {isModalOpen &&
      <section
        onClick={closeModal}
        className={`fixed flex justify-center inset-0 z-30 items-center transition-colors ${isModalOpen ? "visible bg-dark-blue-100/40" : "invisible"}`}>
        <dialog
          onClick={(e) => e.stopPropagation()}
          className="fixed w-4/12 min-w-max max-w-prose flex flex-col p-2 pb-4 inset-0 z-30 justify-center items-left overflow-x-hidden overflow-y-auto outline-none rounded focus:outline-none">
          <header className="w-full flex flex-col mb-2 place-items-end">
            <button
              onClick={closeModal}
              className="p-1 text-dark-font bg-grayscale-0 hover:bg-grayscale-0">
              <X size={20}/>
            </button>
            <h3 className="place-self-start -mt-3 mx-2 heading-md text-dark-font">
              {modalTitle}
            </h3>
          </header>
          <main className="w-full mx-auto px-2">
            {children}
          </main>
        </dialog>
      </section>
      }
    </>
  );
};
