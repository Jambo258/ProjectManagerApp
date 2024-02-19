import * as React from "react";
import { X } from "react-feather";
import useScreenDimensions from "../utils/screenDimensions";

interface propTypes {
  confirmDeleteEdit: boolean;
  setConfirmDeleteEdit: React.Dispatch<React.SetStateAction<boolean>>;
  handleSubmitForModal: () => void;
  deleteModalTitle?: string;
  deleteModalText: string;
}

export const DeleteModal: React.FunctionComponent<propTypes> = ({
  confirmDeleteEdit,
  setConfirmDeleteEdit,
  handleSubmitForModal,
  deleteModalTitle,
  deleteModalText,
}) => {
  const screenDimensions = useScreenDimensions();
  const modalRef = React.useRef(null as HTMLDialogElement | null);

  React.useEffect(() => {
    if (confirmDeleteEdit) {
      const modalElement = modalRef.current;
      const focusableElements = modalElement!.querySelectorAll(
        "button, [tabindex]:not([tabindex=\"-1\"])"
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
          setConfirmDeleteEdit(false);
        }
      };
      document.addEventListener("keydown", closeOnEscapePressed);
      modalElement?.addEventListener("keydown", handleTabKeyPress);
      return () => {

        document.removeEventListener("keydown", closeOnEscapePressed);
        modalElement?.removeEventListener("keydown", handleTabKeyPress);
      };
    }
  }, [confirmDeleteEdit, setConfirmDeleteEdit]);

  return (
    <div
      className={`fixed z-50 flex inset-0 justify-center items-center transition-colors rounded ${
        confirmDeleteEdit ? "visible bg-dark-blue-100/40" : "invisible"}`}
      onMouseDown={() => setConfirmDeleteEdit(!confirmDeleteEdit)}
    >
      <dialog
        tabIndex={-1}
        ref={modalRef}
        onMouseDown={(e) => e.stopPropagation()}
        className={`p-2 pb-4 flex flex-col inset-0 sm:justify-start items-left overflow-x-hidden overflow-y-auto outline-none rounded focus:outline-none shadow transition-all bg-grayscale-100 ${
          confirmDeleteEdit ? "scale-100 opacity-100" : "scale-110 opacity-0"}
          ${screenDimensions.height < 400 ? "min-h-screen max-h-screen w-full" : "w-full h-full sm:h-fit sm:w-fit sm:max-w-2xl"}
    }`}
      >
        <div className="w-full flex flex-col place-items-end">
          <button
            aria-label="Close modal"
            onClick={() => setConfirmDeleteEdit(!confirmDeleteEdit)}
            className="p-1 text-dark-font bg-grayscale-0 hover:bg-grayscale-0"
          >
            <X size={20} />
          </button>
        </div>

        <main className="w-full sm:w-min mx-auto px-2">
          {deleteModalTitle &&
          <p className="w-full sm:w-max px-2 mx-auto mb-2 heading-sm text-center">
            {deleteModalTitle}
          </p>
          }
          <p className="sm:w-11/12 mx-auto mb-6 body-text-md text-center">{deleteModalText}</p>

          <section className="w-full min-w-max mx-auto grid grid-cols-2 gap-6">
            <button
              type="button"
              onClick={() => {
                handleSubmitForModal();
                setConfirmDeleteEdit(!confirmDeleteEdit);
              }}
              className="w-full py-2 btn-text-sm bg-caution-100 hover:bg-caution-200">
            Yes, I am sure
            </button>
            <button
              type="reset"
              onClick={() => setConfirmDeleteEdit(!confirmDeleteEdit)}
              className="w-full py-2 btn-text-sm bg-primary-100 hover:bg-primary-200">
            Cancel
            </button>
          </section>
        </main>

      </dialog>
    </div>
  );
};
