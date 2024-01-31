import { type ReactElement, useState, createContext } from "react";
import { X } from "react-feather";
import { ChevronLeft } from "react-feather";
import { type IconType, IconButton } from "./IconButton";

interface ModalContextType {
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  closeAllModals: () => void;
  openAllModals: () => void;
}

export const SubModalContext = createContext<ModalContextType>(null!);

interface ModalProps {
  iconName: IconType;
  btnText?: string;
  modalTitle: string | null;
  children: ReactElement;
  setIsModalsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isModalsOpen: boolean;
}

export const SubModal = ({
  iconName,
  btnText,
  modalTitle,
  children,
  setIsModalsOpen,
  isModalsOpen
}: ModalProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const closeAllModals = () => {
    setIsModalsOpen(false);
  };

  const openAllModals = () => {
    console.log(isModalsOpen);
    setIsModalsOpen(true);
  };

  return (
    <>
      <IconButton
        iconName={iconName}
        btnText={btnText}
        handleOnClick={() => {
          openModal();
          openAllModals();
        }}
      />
      {isModalOpen && isModalsOpen && (
        <div
          onClick={closeModal}
          className={`fixed flex justify-center inset-0 z-30 items-center transition-colors ${
            isModalOpen ? "visible bg-dark-blue-100/40" : "invisible"
          }`}
        >
          <dialog
            onClick={(e) => e.stopPropagation()}
            // The sizing of the modal (w, min-w and max-w) might need to be modified
            className="fixed w-full h-full sm:h-fit sm:w-4/12 sm:min-w-max sm:max-w-prose p-2 pb-4 flex flex-col inset-0 z-30 sm:justify-center items-left overflow-x-hidden overflow-y-auto outline-none sm:rounded focus:outline-none shadow transition-all"
          >
            <header className="w-full flex flex-row justify-between items-center mb-4">
              <button
                onClick={closeModal}
                className="p-1 h-fit text-dark-font bg-grayscale-0 hover:bg-grayscale-0"
              >
                <ChevronLeft size={24} />
              </button>
              <h4 className="place-self-center heading-sm text-dark-font">
                {modalTitle}
              </h4>
              <button
                onClick={() => {closeAllModals();closeModal();}}
                className="p-1 h-fit text-dark-font bg-grayscale-0 hover:bg-grayscale-0"
              >
                <X size={24} />
              </button>
            </header>

            <main className="w-full mx-auto px-[10px]">
              <SubModalContext.Provider
                value={{ isModalOpen, openModal, closeModal, closeAllModals, openAllModals }}
              >
                {children}
              </SubModalContext.Provider>
            </main>
          </dialog>
        </div>
      )}
    </>
  );
};
