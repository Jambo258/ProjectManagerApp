// React
import { useState } from "react";

// Components
import { DeleteModal } from "../../components/DeleteModal";
import { Trash2 } from "react-feather";

interface Props {
  deleteEvent: (eventId: string) => void;
  eventId: string;
}

export const DeleteEventModal = ({ deleteEvent, eventId }: Props) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const deleteConfirmationTitle = "Are you sure you want to delete this event?";
  const deleteConfirmationTtext =
    "Event will be removed permanently from all the project members.";

  const openModal = () => {
    setIsDeleteModalOpen(true);
  };

  const closeModal = () => {
    setIsDeleteModalOpen(false);
  };

  const handleDeleteEvent = () => {
    try {
      deleteEvent(eventId);
      closeModal();
    } catch (err) {
      console.error("Failed to delete the event", err);
      if (
        err &&
        typeof err === "object" &&
        "data" in err &&
        err.data &&
        typeof err.data === "object"
      ) {
        const errorMessage = Object.values(err.data);
        console.error(errorMessage);
      }
    }
  };

  return (
    <>
      <Trash2
        className="grid cursor-pointer text-caution-100"
        onClick={() => openModal()}
      />

      {isDeleteModalOpen && (
        <DeleteModal
          setConfirmDeleteEdit={setIsDeleteModalOpen}
          confirmDeleteEdit={isDeleteModalOpen}
          handleSubmitForModal={handleDeleteEvent}
          deleteModalTitle={deleteConfirmationTitle}
          deleteModalText={deleteConfirmationTtext}
        />
      )}
    </>
  );
};
