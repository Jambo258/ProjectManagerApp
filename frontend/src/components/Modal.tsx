import { type ReactElement, useState, createContext, useEffect, useRef } from "react";
import { X } from "react-feather";
import useScreenDimensions from "../utils/screenDimensions";

interface ModalContextType {
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

export const ModalContext = createContext<ModalContextType>(null!);

interface ModalProps {
  btnText: string | ReactElement;
  btnIcon?: ReactElement;
  btnStyling: string;
  modalTitle: string | null;
  children: ReactElement;
}

export const Modal = ({
  btnText,
  btnStyling,
  btnIcon,
  modalTitle,
  children
}: ModalProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const screenDimensions = useScreenDimensions();
  const modalRef = useRef(null as HTMLDialogElement | null);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (isModalOpen) {
      const modalElement = modalRef.current;
      const focusableElements = modalElement!.querySelectorAll(
        "button, input, select, textarea, [tabindex]:not([tabindex=\"-1\"])"
      );

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      const handleTabKeyPress = (event: KeyboardEvent) => {
        if (event.key === "Tab") {
          if (event.shiftKey && document.activeElement === firstElement) {
            event.preventDefault();
            (lastElement as HTMLDialogElement).focus();
          } else if (
            !event.shiftKey &&
            document.activeElement === lastElement
          ) {
            event.preventDefault();
            (firstElement as HTMLDialogElement).focus();
          }
        }
      };

      const closeOnEscapePressed = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          closeModal();
        }
      };
      document.addEventListener("keydown", closeOnEscapePressed);
      modalElement?.addEventListener("keydown", handleTabKeyPress);
      return () => {

        document.removeEventListener("keydown", closeOnEscapePressed);
        modalElement?.removeEventListener("keydown", handleTabKeyPress);
      };
    }
  }, [isModalOpen]);

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        className={btnStyling}>
        <div className="flex flex-row gap-2">
          { btnIcon }
          { btnText }
        </div>
      </button>

      {isModalOpen &&
      <div
        onMouseDown={closeModal}
        className="fixed flex justify-center inset-0 z-30 items-center transition-colors bg-dark-blue-100/40"
      >
        <dialog
          tabIndex={-1}
          ref={modalRef}
          onMouseDown={(e) => e.stopPropagation()}
          className={`fixed p-2 pb-4 flex flex-col inset-0 z-30 max-h-screen sm:justify-start items-left overflow-x-hidden overflow-y-auto sm:rounded shadow transition-all
          ${screenDimensions.height < 500 ? "min-h-screen w-full" : "w-full h-full sm:h-fit sm:w-fit sm:max-w-2xl"}`}>
          <header className="w-full flex flex-col mb-2 place-items-end">
            <button
              onClick={closeModal}
              aria-label="Close modal"
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
