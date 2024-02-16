import { useState, useEffect } from "react";
import { nanoid } from "@reduxjs/toolkit";
import {
  add,
  format,
  isSameMonth,
  isToday,
} from "date-fns";
import { X } from "react-feather";
import * as Y from "yjs";
import { DeleteEventModal } from "./DeleteEventModal";
import useScreenDimensions from "../../utils/screenDimensions";
import type { Event } from "./Calendar";

interface Props {
  events: Event[];
  currentMonth: Date;
  day: Date;
  yevents: Y.Map<Event>;
}

const CalendarEventModal = ({ events, currentMonth, day, yevents }: Props) => {
  const [newEventTitle, setNewEventTitle] = useState("");
  const [eventTitle, setEventTitle] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [newDate, setNewDate] = useState(day);
  const [newDateOnCreate, setNewDateOnCreate] = useState(day);
  const [activeEdit, setActiveEdit] = useState<string>("");

  const handleCreateEventChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if(e.target.value.trim() !== ""){
      setEventTitle(e.target.value);
    }
    else {
      setEventTitle("");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setNewEventTitle("");
    setActiveEdit("");
  };

  const deleteEvent = (eventId: string) => {
    yevents.delete(eventId);
  };

  const editEvent = (eventId: string, newTitle: string, newDay: Date) => {
    const editedEvent = {
      id: eventId,
      eventTitle: newTitle,
      day: newDay.toISOString(),
    };
    yevents.set(eventId, editedEvent);

    setNewEventTitle("");
    setActiveEdit("");
  };

  const createEvent = (e: React.FormEvent, eventTitle: string) => {
    e.preventDefault();
    const uuid = nanoid();
    const newEvent = {
      id: uuid,
      day: newDateOnCreate.toISOString(),
      eventTitle,
    };
    yevents.set(uuid, newEvent);

    const newDate = new Date(day);
    newDate.setHours(0,0,0,0);
    setNewDateOnCreate(newDate);
    setEventTitle("");
  };

  const setTime = (date: Date, eventDate: string) => {
    const tempArr = eventDate.split(":");
    const timeToBeAdded = {
      hours: parseInt(tempArr[0]),
      minutes: parseInt(tempArr[1]),
    };
    const updatedDate = add(date, timeToBeAdded);
    setNewDate(updatedDate);
  };

  const setTimeOnCreate = (date: Date, eventDate: string) => {
    const tempArr = eventDate.split(":");
    const timeToBeAdded = {
      hours: parseInt(tempArr[0]),
      minutes: parseInt(tempArr[1]),
    };
    const updatedDate = add(date, timeToBeAdded);
    setNewDateOnCreate(updatedDate);
  };

  const screenDimensions = useScreenDimensions();

  const hasEvent = () => {
    return events.length > 0;
  };

  useEffect(() => {
    const closeOnEscapePressed = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeModal();
      }
    };
    document.addEventListener("keydown", closeOnEscapePressed);
    return () =>
      document.removeEventListener("keydown", closeOnEscapePressed);
  }, []);

  return (
    <>
      <section
        tabIndex={0}
        onClick={() => setIsModalOpen(true)}
        onKeyDown={(e) => {
          if (e.key !== "Enter") return;
          setIsModalOpen(true);
        }}
        className={`aspect-square cursor-pointer rounded-none bg-grayscale-200 justify-start
        border-b border-r border-grayscale-300 focus:bg-grayscale-300/50 focus:outline-none
        hover:bg-primary-200 overflow-hidden inline-block w-full h-full
        ${isSameMonth(day, currentMonth)
      ? (hasEvent() && screenDimensions.width < 768 ? "text-primary-300" : "text-dark-font")
      : "text-grayscale-400"}

        ${isToday(day)
      ? "bg-primary-100"
      : ""}`}
      >
        <ul className="flex flex-col items-center md:items-start h-full whitespace-nowrap relative">
          <li
            className="my-auto md:my-0 h-fit w-fit md:text-left text btn-text-md p-2"
          >
            {format(day, "d")}
          </li>
          {events.map((event) =>
            <li
              key={event.id}
              className="ml-1 hidden md:block body-text-sm"
            >
              {format(event.day, "HH:mm ")}
              {event.eventTitle.length > 10
                ? event.eventTitle.slice(0, 7) + "..."
                : event.eventTitle}
            </li>
          )}
        </ul>
      </section>
      {isModalOpen &&
      <div
        onClick={closeModal}
        className="fixed flex justify-center inset-0 z-30 items-center transition-colors bg-dark-blue-100/40">
        <dialog
          onClick={(e) => e.stopPropagation()}
          className={`fixed p-2 pb-4 flex flex-col inset-0 z-30 max-h-screen sm:justify-start items-left overflow-x-hidden overflow-y-auto
            outline-none sm:rounded focus:outline-none shadow transition-all
            ${screenDimensions.height < 500 ? "min-h-screen w-full" : "w-full h-full sm:h-fit sm:w-fit sm:max-w-2xl"}`}>
          <header className="flex flex-col mb-2 place-items-end">
            <button
              onClick={closeModal}
              className="p-1 text-dark-font bg-grayscale-0 hover:bg-grayscale-0">
              <X size={20} />
            </button>
            <h3 className="place-self-start -mt-3 mx-2 heading-md text-dark-font">
              {format(day, "iiii")} {format(day, "d.M.yyyy")}
            </h3>
          </header>
          <main className="w-full mx-auto px-2 text-dark-font">
            {hasEvent()
              ? <div>
                {events.map((event) => (
                  <div
                    className="flex flex-row items-center justify-between cursor-pointer border-b-2 border-grayscale-200 focus:outline-none focus:ring focus:ring-dark-blue-50 rounded"
                    key={event.id}
                  >
                    {event.id === activeEdit ? (
                      <section className="flex flex-col sm:flex-row w-full my-2">
                        <div className="inline-flex items-center gap-2">
                          <input
                            type="time"
                            autoFocus
                            aria-label="Time of the event"
                            defaultValue={format(event.day, "HH:mm")}
                            onChange={(e) => setTime(day, e.target.value)}
                            className="py-[5px] px-3 h-fit body-text-md" />
                          <input
                            maxLength={32}
                            onChange={(e) => setNewEventTitle(e.target.value)}
                            defaultValue={event.eventTitle}
                            aria-label="Event name"
                            className="flex-1 py-1.5 h-fit px-3 body-text-md" />
                          <button
                            onClick={() =>
                              editEvent(
                                event.id,
                                newEventTitle.trim() !== ""
                                  ? newEventTitle
                                  : event.eventTitle,
                                newDate
                              )
                            }
                            className="py-1.5 btn-text-sm min-w-fit">
                              Update event
                          </button>
                        </div>
                      </section>
                    ) : (
                      <section
                        onClick={() => setActiveEdit(event.id)}
                        className="w-full body-text-md my-2 focus:outline-none focus:ring focus:ring-dark-blue-50 rounded"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key !== "Enter") return;
                          setActiveEdit(event.id);
                        }}>
                        {format(event.day, "HH:mm")}
                        <p className="body-text-lg">{event.eventTitle}</p>
                      </section>
                    )}
                    {event.id !== activeEdit && (
                      <DeleteEventModal
                        deleteEvent={deleteEvent}
                        eventId={event.id}
                      />
                    )}
                  </div>
                )
                )}
              </div>
              : <p className="body-text-lg">No events yet.</p>
            }
            <section className="justify-center">
              <h4 className="heading-sm mt-5 mb-2">Add new event</h4>
              <div className="flex flex-col sm:flex-row gap-2 w-full">
                <form
                  onSubmit={(e) => createEvent(e, eventTitle)}
                  className="flex flex-col sm:flex-row gap-2 w-full">
                  <input
                    type="time"
                    value={format(newDateOnCreate, "HH:mm")}
                    required
                    onChange={(e) => {
                      if(e.target.value){
                        setTimeOnCreate(day, e.target.value);
                      }}}
                    aria-label="Time of the event"
                    className="px-3 py-[5px] body-text-md" />
                  <input
                    maxLength={32}
                    required
                    value={eventTitle}
                    onChange={(e) => handleCreateEventChange(e)}
                    placeholder={"Add new event"}
                    aria-label="Event name"
                    className="px-3 py-1.5 body-text-md flex-1"/>
                  <button type="submit" className="btn-text-sm py-1.5">
                    Confirm
                  </button>
                </form>
              </div>
            </section>
          </main>
        </dialog>
      </div>
      }
    </>
  );
};

export default CalendarEventModal;
