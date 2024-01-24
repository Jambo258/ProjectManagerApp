import { type ReactElement, useState, createContext } from "react";
import { X } from "react-feather";

interface ModalContextType {
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

export const ModalContext = createContext<ModalContextType>(null!);

interface ModalProps {
  btnText: string | ReactElement;
  btnStyling: string;
  modalTitle: string | null;
  children: ReactElement;
}

export const Modal = ({
  btnText,
  btnStyling,
  modalTitle,
  children
}: ModalProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
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
        { btnText }
      </button>

      {isModalOpen &&
      <div
        onClick={closeModal}
        className={`fixed flex justify-center inset-0 z-30 items-center transition-colors ${isModalOpen ? "visible bg-dark-blue-100/40" : "invisible"}`}>
        <dialog
          onClick={(e) => e.stopPropagation()}
          // The sizing of the modal (w, min-w and max-w) might need to be modified
          className="fixed w-full h-full sm:h-fit sm:w-4/12 sm:min-w-max sm:max-w-prose p-2 pb-4 flex flex-col inset-0 z-30 sm:justify-center items-left overflow-x-hidden overflow-y-auto outline-none rounded focus:outline-none shadow transition-all">
          <header className="w-full flex flex-col mb-2 place-items-end">
            <button
              onClick={closeModal}
              className="p-1 text-dark-font bg-grayscale-0 hover:bg-grayscale-0">
              <X size={20}/>
            </button>
            <h3 className="place-self-start -mt-3 mx-2 heading-md text-dark-font">
              { modalTitle }
            </h3>
          </header>
          <main className="w-full mx-auto px-2">
            <ModalContext.Provider value={{isModalOpen,  openModal, closeModal}}>
              {children}
            </ModalContext.Provider>
          </main>
        </dialog>
      </div>
      }
    </>
  );
};
