import { type ReactElement, useState, useEffect, useCallback, createContext, useRef } from "react";
import { ChevronLeft, X } from "react-feather";
import { type IconType, IconButton } from "./IconButton";
import useScreenDimensions from "../../utils/screenDimensions";

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
  chevronShown?: boolean;
  children: ReactElement;
  setIsModalsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isModalsOpen: boolean;
}

export const SubModal = ({
  iconName,
  btnText,
  modalTitle,
  chevronShown = true,
  children,
  setIsModalsOpen,
  isModalsOpen
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

  const closeAllModals = useCallback(() => {
    closeModal();
    setIsModalsOpen(false);
  }, [setIsModalsOpen]);

  const openAllModals = () => {
    setIsModalsOpen(true);
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
          closeAllModals();
        }
      };
      document.addEventListener("keydown", closeOnEscapePressed);
      modalElement?.addEventListener("keydown", handleTabKeyPress);
      return () => {

        document.removeEventListener("keydown", closeOnEscapePressed);
        modalElement?.removeEventListener("keydown", handleTabKeyPress);
      };
    }
  }, [isModalOpen, closeAllModals]);

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
          onMouseDown={closeModal}
          className={`fixed flex justify-center inset-0 z-30 items-center transition-colors ${
            isModalOpen ? "visible bg-dark-blue-100/40" : "invisible"
          }`}
        >
          <dialog
            tabIndex={-1}
            ref={modalRef}
            onMouseDown={(e) => e.stopPropagation()}
            className={`max-h-screen fixed p-2 pb-4 flex flex-col inset-0 z-30 sm:justify-start items-left overflow-x-hidden outline-none sm:rounded shadow transition-all
            ${screenDimensions.height < 500 ? "min-h-screen overflow-y-auto w-full" : "overflow-y-hidden w-full h-full sm:h-fit sm:min-w-[400px] sm:w-4/12 sm:max-w-prose"}`}
          >
            <header className="w-full flex flex-row justify-between items-center mb-4">
              {chevronShown ? <button
                onClick={closeModal}
                aria-label="Go back"
                className="p-1 h-fit text-dark-font bg-grayscale-0 hover:bg-grayscale-0"
              >
                <ChevronLeft size={24} />
              </button> : <div className="w-6"></div>}
              <h4 className="place-self-center heading-sm text-dark-font">
                {modalTitle}
              </h4>
              <button
                onClick={closeAllModals}
                aria-label="Go back to task"
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
