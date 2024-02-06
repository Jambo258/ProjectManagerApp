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
import { DeleteEventModal } from "./DeleteEventModal";

interface Event {
  id: string;
  projectid: number;
  pageid: number;
  day: Date;
  eventTitle: string;
  edit: boolean;
}
interface Props {
  events: Event[];
  currentMonth: string;
  projectid: number;
  pageid: number;
  day: Date;
  setEvents: ([{ id, projectid, pageid, day, eventTitle, edit }]: {
    id: string;
    projectid: number;
    pageid: number;
    day: Date;
    eventTitle: string;
    edit: boolean;
  }[]) => void;
}

const CalendarEventModal = ({
  events,
  currentMonth,
  projectid,
  pageid,
  day,
  setEvents,
}: Props) => {
  const [newEventTitle, setNewEventTitle] = useState("");
  const [eventTitle, setEventTitle] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDate, setNewDate] = useState(day);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const deleteEvent = (eventid: string) => {
    const index = events.findIndex((event) => event.id === eventid);
    setEvents([...events.slice(0, index), ...events.slice(index + 1)]);
  };

  const setEdit = (eventid: string, setEdit: boolean) => {
    const test = events.map((event) => {
      if (event.id === eventid) {
        return { ...event, edit: setEdit };
      } else {
        return event;
      }
    });
    setEvents(test);
  };

  const editEvent = (eventid: string, testString: string, newDay: Date) => {
    const test = events.map((event) => {
      if (event.id === eventid) {
        return { ...event, eventTitle: testString, day: newDay, edit: false };
      } else {
        return event;
      }
    });

    setEvents(test);
  };

  const createEventTest = (eventTitle: string) => {
    setEvents([
      ...events,
      {
        id: nanoid(),
        projectid: projectid,
        pageid: pageid,
        day: newDate,
        eventTitle: eventTitle,
        edit: false,
      },
    ]);
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

  return (
    <>
      <div
        onClick={() => openModal()}
        className={`cursor-pointer rounded-none bg-grayscale-200 justify-start h-full w-full max-h-64 group outline outline-1 outline-grayscale-400 hover:bg-primary-200 ${
          isSameMonth(day, currentMonth)
            ? "text-dark-font"
            : "text-grayscale-400"
        }
          ${isToday(day) && " border-4 border-primary-200"}
        `}
      >
        <ul className="overflow-x-none whitespace-nowrap max-h-10">
          <li className="btn-text-lg p-2">{format(day, "d")}</li>
          {events.map(
            (event) =>
              isEqual(getMonth(event.day), getMonth(day)) &&
              isEqual(getDate(event.day), getDate(day)) &&
              isEqual(getYear(event.day), getYear(day)) &&
              projectid === event.projectid && (
                <li key={event.id} className="ml-1">
                  {format(event.day, "HH:mm ")}
                  {event.eventTitle}
                </li>
              )
          )}
        </ul>
      </div>
      <div
        onClick={() => closeModal()}
        className={`fixed flex justify-center inset-0 z-30 items-center transition-colors ${
          isModalOpen ? "visible bg-dark-blue-100/40" : "invisible"
        }`}
      >
        <dialog
          onClick={(e) => e.stopPropagation()}
          className="fixed w-full h-full sm:h-fit sm:w-4/12 sm:min-w-max sm:max-w-prose p-2 pb-4 flex flex-col inset-0 z-30 sm:justify-center items-left overflow-x-hidden overflow-y-auto outline-none sm:rounded focus:outline-none shadow transition-all"
        >
          <header className="w-full flex flex-col mb-2 place-items-end">
            <button
              onClick={() => closeModal()}
              className="p-1 text-dark-font bg-grayscale-0 hover:bg-grayscale-0"
            >
              <X className="mb-4" size={20} />
            </button>
            <h3 className="place-self-start -mt-3 mx-2 heading-md text-dark-font">
              {format(day, "iiii")} {format(day, "dd.M.yyyy")}
            </h3>
          </header>
          <main className="w-full mx-auto px-2">
            <div>
              <div>
                {events.map(
                  (event) =>
                    projectid === event.projectid &&
                    isEqual(getMonth(event.day), getMonth(day)) &&
                    isEqual(getDate(event.day), getDate(day)) &&
                    isEqual(getYear(event.day), getYear(day)) && (
                      <div key={event.id}>
                        <div
                          className=" flex justify-between mb-2 cursor-pointer"
                          key={event.id}
                        >
                          {event.edit ? (
                            <div>
                              <input
                                type="time"
                                defaultValue={"12:00"}
                                onChange={(e) => setTime(day, e.target.value)}
                              />
                              <input
                                onChange={(e) =>
                                  setNewEventTitle(e.target.value)
                                }
                                placeholder={"Event title"}
                              />
                              <button
                                onClick={() =>
                                  editEvent(event.id, newEventTitle, newDate)
                                }
                              >
                                Update event
                              </button>
                            </div>
                          ) : (
                            <div onClick={() => setEdit(event.id, true)}>
                              {format(event.day, "HH:mm")}
                              {" " + event.eventTitle}
                            </div>
                          )}
                          <DeleteEventModal
                            deleteEvent={deleteEvent}
                            eventId={event.id}
                          />
                        </div>
                      </div>
                    )
                )}
              </div>
              <div className="flex justify-center">
                <form>
                  <input
                    className="mx-2"
                    type="time"
                    defaultValue={format(newDate, "hh:mm")}
                    onChange={(e) => setTime(day, e.target.value)}
                  />
                  <input
                    className="mr-2"
                    onChange={(e) => setEventTitle(e.target.value)}
                    placeholder={"Add new event"}
                  />
                </form>
                <button onClick={() => createEventTest(eventTitle)}>
                  Confirm
                </button>
              </div>
            </div>
          </main>
        </dialog>
      </div>
    </>
  );
};

export default CalendarEventModal;
