import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useDeletePageMutation } from "../api/apiSlice";
import { useState } from "react";
import { DeleteModal } from "../../components/DeleteModal";

interface SortableItem {
  id: number;
  children?: React.ReactNode;
}

export const SortableItem = ({ children, id }: SortableItem) => {
  const [deletePage] = useDeletePageMutation();
  const [confirmDeleteEdit, setConfirmDeleteEdit] = useState(false);
  const deleteModalText = "Are you sure you wanna delete page?";
  console.log(confirmDeleteEdit);
  const handleSubmitForModali = async (id?: number) => {
    try {
      const deletedPage = await deletePage(id!).unwrap();
      console.log("Page deleted:", deletedPage);
    } catch (err) {
      console.error("Failed to delete page", err);
    }
  };
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id,
    });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  // Design here the Card component inside
  console.log(id);
  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <div className="border border-green-300 bg-dark-blue-300 text-yellow-200">
        {children}
        <button
          className="mt-4 rounded-lg shadow-lg bg-black flex justify-center
                      text-sm
                      items-center py-2 text-slate-300 font-semibold"
          onClick={() => {
            setConfirmDeleteEdit(!confirmDeleteEdit);
            console.log(id);
          }}
        >
          Delete!
        </button>
        {confirmDeleteEdit && (
          <DeleteModal
            setConfirmDeleteEdit={setConfirmDeleteEdit}
            confirmDeleteEdit={confirmDeleteEdit}
            handleSubmitForModal={handleSubmitForModali}
            deleteModalText={deleteModalText}
          ></DeleteModal>
        )}
      </div>
    </div>
  );
};
