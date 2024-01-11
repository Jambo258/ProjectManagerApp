import * as React from "react";
import { X } from "react-feather";
interface propTypes {
  confirmDeleteEdit: boolean;
  setConfirmDeleteEdit: React.Dispatch<React.SetStateAction<boolean>>;
  handleSubmitForModal: () => void;
  deleteModalText: string;
}
export const DeleteModal: React.FunctionComponent<propTypes> = ({
  confirmDeleteEdit,
  setConfirmDeleteEdit,
  handleSubmitForModal,
  deleteModalText,
}) => {
  return (
    <div
      className={`flex justify-center items-center fixed inset-0 transition-colors rounded-lg ${
        confirmDeleteEdit ? "visible bg-dark-blue-100/40" : "invisible"}`}
      onClick={() => setConfirmDeleteEdit(!confirmDeleteEdit)}
    >
      <div
        className={`rounded-lg shadow p-2 transition-all bg-grayscale-100  ${
          confirmDeleteEdit ? "scale-100 opacity-100" : "scale-110 opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-end">
          <button
            className="w-12 bg-grayscale-0 px-2 py-2 hover:bg-grayscale-0"
            onClick={() => setConfirmDeleteEdit(!confirmDeleteEdit)}
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-8">
          <p>{deleteModalText}</p>
          <section className="flex">
            <button
              onClick={() => {
                handleSubmitForModal();
                setConfirmDeleteEdit(!confirmDeleteEdit);
              }}
              className="w-full me-2 my-4 btn-text-xs py-1.5 outline-none focus:outline focus:outline-caution-100 bg-caution-100 hover:bg-caution-200"
            >
            Yes, I am sure
            </button>
            <button
              onClick={() => setConfirmDeleteEdit(!confirmDeleteEdit)}
              className="w-full ms-2 my-4 btn-text-xs py-1.5 outline-none focus:outline focus:outline-primary-200"
            >
            Cancel
            </button>
          </section>
        </div>
      </div>
    </div>
  );
};
