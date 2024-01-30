import * as React from "react";
import { X } from "react-feather";

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
  return (
    <div
      className={`fixed z-50 flex inset-0 justify-center items-center transition-colors rounded ${
        confirmDeleteEdit ? "visible bg-dark-blue-100/40" : "invisible"}`}
      onClick={() => setConfirmDeleteEdit(!confirmDeleteEdit)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`sm:min-w-max min-w-full max-w-full h-full sm:h-fit p-2 pb-4 flex flex-col inset-0 sm:justify-center items-left overflow-x-hidden overflow-y-auto outline-none rounded focus:outline-none shadow transition-all bg-grayscale-100 ${
          confirmDeleteEdit ? "scale-100 opacity-100" : "scale-110 opacity-0"
        }`}
      >
        <div className="w-full flex flex-col place-items-end">
          <button
            onClick={() => setConfirmDeleteEdit(!confirmDeleteEdit)}
            className="p-1 text-dark-font bg-grayscale-0 hover:bg-grayscale-0"
          >
            <X size={20} />
          </button>
        </div>

        <main className="w-min mx-auto px-2">
          {deleteModalTitle &&
          <p className="w-max px-2 mx-auto mb-2 heading-sm text-center">
            {deleteModalTitle}
          </p>
          }
          <p className="w-11/12 mx-auto mb-6 body-text-md text-center">{deleteModalText}</p>

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

      </div>
    </div>
  );
};
