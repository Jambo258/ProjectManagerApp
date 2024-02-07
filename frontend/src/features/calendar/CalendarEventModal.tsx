import { nanoid } from "@reduxjs/toolkit";
import {
  add,
  format,
  getDate,
  getMonth,
  getYear,
  isEqual,
  isSameMonth,
  isToday,
} from "date-fns";
import { useState } from "react";
import { X } from "react-feather";
import * as Y from "yjs";
import { DeleteEventModal } from "./DeleteEventModal";
import useScreenDimensions from "../../utils/screenDimensions";
import type { Event } from "./Calendar";

interface Props {
  events: Event[];
  currentMonth: Date;
  day: Date;
  yevents: Y.Array<Event>;
}

const CalendarEventModal = ({
  events,
  currentMonth,
  day,
  yevents,
}: Props) => {
  const [newEventTitle, setNewEventTitle] = useState("");
  const [eventTitle, setEventTitle] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [newDate, setNewDate] = useState(day);
  const [activeEdit, setActiveEdit] = useState<string>("");

  const closeModal = () => {
    setIsModalOpen(false);
    setNewEventTitle("");
    setActiveEdit("");
  };

  const deleteEvent = (eventId: string) => {
    const currEvents = yevents.toArray();
    const index = currEvents.findIndex((event) => event.id === eventId);
    if (index !== -1) {
      yevents.delete(index);
    }
  };

  const editEvent = (eventId: string, newTitle: string, newDay: Date) => {
    const currEvents = yevents.toArray();
    const index = currEvents.findIndex((event) => event.id === eventId);
    if (index !== -1) {
      yevents.doc?.transact(() => {
        yevents.delete(index);
        yevents.insert(index, [{ ...currEvents[index], eventTitle: newTitle, day: newDay.toISOString() }]);
      });
    }

    setNewEventTitle("");
    setActiveEdit("");
  };

  const createEvent = (eventTitle: string) => {
    yevents.push([{
      id: nanoid(),
      day: newDate.toISOString(),
      eventTitle,
    }]);
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

  const screenDimensions = useScreenDimensions();

  return (
    <>
      <section
        onClick={() => setIsModalOpen(true)}
        className={`aspect-square cursor-pointer rounded-none bg-grayscale-200 justify-start
        outline outline-1 outline-grayscale-400 hover:bg-primary-200
        ${isSameMonth(day, currentMonth) ? "text-dark-font" : "text-grayscale-400"}
          ${isToday(day) && " border-4 border-primary-200"}`}
      >
        <ul className="flex flex-col items-center md:items-start h-full overflow-x-none whitespace-nowrap">
          <li className={`my-auto md:my-0 h-fit w-fit md:text-left text btn-text-md ${isToday(day) ? "pt-1 pl-1 p-2" : "p-2"}`}>
            {format(day, "d")}
          </li>
          {events.map(
            (event) =>
              isEqual(getMonth(event.day), getMonth(day)) &&
              isEqual(getDate(event.day), getDate(day)) &&
              isEqual(getYear(event.day), getYear(day)) &&
              (
                <li key={event.id} className="ml-1 hidden md:block body-text-sm">
                  {format(event.day, "HH:mm ")}
                  {event.eventTitle.length > 10 ? event.eventTitle.slice(0, 10) + "..." : event.eventTitle}
                </li>
              )
          )}
        </ul>
      </section>
      <div
        onClick={() => closeModal()}
        className={`fixed flex justify-center inset-0 z-30 items-center transition-colors
         ${isModalOpen ? "visible bg-dark-blue-100/40" : "invisible"}`}
      >
        <dialog
          onClick={(e) => e.stopPropagation()}
          className={`fixed p-2 pb-4 flex flex-col inset-0 z-30 max-h-screen sm:justify-start items-left overflow-x-hidden overflow-y-auto
           outline-none sm:rounded focus:outline-none shadow transition-all
          ${screenDimensions.height < 500 ? "min-h-screen w-full" : "w-full h-full sm:h-fit sm:w-fit sm:max-w-2xl"}`} >
          <header className="w-full flex flex-col mb-2 place-items-end">
            <button
              onClick={() => closeModal()}
              className="p-1 text-dark-font bg-grayscale-0 hover:bg-grayscale-0"
            >
              <X className="mb-4" size={20} />
            </button>
            <h3 className="place-self-start -mt-3 mx-2 heading-md text-dark-font">
              {format(day, "iiii")} {format(day, "d.M.yyyy")}
            </h3>
          </header>
          <main className="w-full mx-auto px-2">
            <div>
              {events.map(
                (event) =>
                  isEqual(getMonth(event.day), getMonth(day)) &&
                  isEqual(getDate(event.day), getDate(day)) &&
                  isEqual(getYear(event.day), getYear(day)) && (
                    <div key={event.id}>
                      <div
                        className="flex flex-row items-center justify-between cursor-pointer border-b-2 border-grayscale-200"
                        key={event.id}
                      >
                        {event.id === activeEdit ? (
                          <section className="flex flex-col sm:flex-row w-full my-2">
                            <div className="flex flex-row w-full gap-2">
                              <input
                                type="time"
                                defaultValue={format(event.day, "HH:mm")}
                                onChange={(e) => setTime(day, e.target.value)}
                                className="px-3 body-text-md"
                              />
                              <input
                                onChange={(e) =>
                                  setNewEventTitle(e.target.value)
                                }
                                defaultValue={event.eventTitle}
                                className="flex-1 body-text-md"
                              />
                              <button
                                onClick={() =>
                                  editEvent(
                                    event.id,
                                    newEventTitle !== ""
                                      ? newEventTitle
                                      : event.eventTitle,
                                    newDate
                                  )
                                }
                                className="btn-text-sm mt-2 sm:mt-0 sm:ml-2 min-w-fit"
                              >
                                Update event
                              </button>
                            </div>
                          </section>
                        ) : (
                          <section onClick={() => setActiveEdit(event.id)}
                            className="w-full body-text-md my-2">
                            {format(event.day, "HH:mm")}
                            <p className="body-text-lg">{event.eventTitle}</p>
                          </section>
                        )}
                        {event.id !== activeEdit &&
                          <DeleteEventModal
                            deleteEvent={deleteEvent}
                            eventId={event.id}
                          />
                        }
                      </div>
                    </div>
                  )
              )}
            </div>
            <section className="justify-center">
              <h4 className="heading-sm mt-5 mb-2">Add new event</h4>
              <div className="flex flex-col sm:flex-row gap-2 w-full">
                <form className="flex-1 flex flex-row gap-2">
                  <input
                    type="time"
                    defaultValue={format(newDate, "HH:mm")}
                    onChange={(e) => setTime(day, e.target.value)}
                    className="px-3 body-text-md"
                  />

                  <input
                    onChange={(e) => setEventTitle(e.target.value)}
                    placeholder={"Add new event"}
                    className="px-3 body-text-md flex-1"
                  />
                </form>
                <button onClick={() => createEvent(eventTitle)} className="btn-text-sm">Confirm</button>
              </div>
            </section>
          </main>
        </dialog>
      </div>
    </>
  );
};

export default CalendarEventModal;
