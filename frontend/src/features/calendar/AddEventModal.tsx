import { useState } from "react";

const AddEventModal = () => {
  const [eventTitle, setEventTitle] = useState("");

  const createNewEvent = (eventTitle, date, users) => {
    return;
  };
  return (
    <div className="flex justify-center">
      <form>
        <input
          onChange={(e) => setEventTitle(e.target.value)}
          placeholder={"Event title"}
        />
      </form>
      <button onClick={() => createNewEvent(eventTitle)}>Confirm</button>
      <button>Cancel</button>
    </div>
  );
};

export default AddEventModal;
