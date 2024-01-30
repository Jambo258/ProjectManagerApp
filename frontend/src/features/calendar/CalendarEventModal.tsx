/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { nanoid } from "@reduxjs/toolkit";
import {
  addHours,
  addMinutes,
  format,
  isEqual,
  isSameMonth,
  isToday,
} from "date-fns";

import { useState } from "react";
import { Trash2, X } from "react-feather";
interface Props {
  events: {
    id: string;
    projectid: number;
    pageid: number;
    day: Date;
    eventTitle: string;
    edit: boolean;
  }[];
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
  }[]) => any;
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
  const [hoursToAdd, sethoursToAdd] = useState(5);
  const [minutesToAdd, setMinutesToAdd] = useState(23);

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

  const checkEventDay = (day: Date) => {
    const test = events.find((event) => isEqual(event.day, day));

    if (test) {
      return true;
    } else {
      return false;
    }
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

  const editEvent = (eventid: string, testString: string) => {
    const test = events.map((event) => {
      if (event.id === eventid) {
        return { ...event, eventTitle: testString, edit: false };
      } else {
        return event;
      }
    });

    setEvents(test);
  };

  const createEventTest = (day: Date, eventTitle: string) => {
    day = setTime(day.toString());
    setEvents([
      ...events,
      {
        id: nanoid(),
        projectid: projectid,
        pageid: pageid,
        day: day,
        eventTitle: eventTitle,
        edit: false,
      },
    ]);
  };

  const setTime = (eventDate: string) => {
    const testasd = eventDate.split(":");
    sethoursToAdd(parseInt(testasd[0]));
    setMinutesToAdd(parseInt(testasd[1]));
    console.log(hoursToAdd, minutesToAdd);
    let test = addHours(eventDate, hoursToAdd);
    test = addMinutes(test, minutesToAdd);
    console.log(test);
    return test;
  };

  return (
    <>
      <div
        onClick={() => openModal()}
        className={`cursor-pointer rounded-none bg-grayscale-200 flex justify-start h-full w-full group border border-collapse ${
          isSameMonth(day, currentMonth)
            ? "text-dark-font"
            : "text-grayscale-400"
        }
                    ${checkEventDay(day) && "bg-primary-200 "}
                    ${!isToday(day) && "hover:bg-primary-200 "}
                    ${isToday(day) && "border-4 border-primary-200 "}`}
      >
        <ul className="overflow-hidden">
          <li>{format(day, "d")}</li>
          {events.map(
            (event) =>
              isEqual(event.day, day) && (
                <li key={event.id}>
                  {format(day, "hh:mm ")}
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
              <X size={20} />
            </button>
            <h3 className="place-self-start -mt-3 mx-2 heading-md text-dark-font">
              Events {format(day, "d")}
            </h3>
          </header>
          <main className="w-full mx-auto px-2">
            <div>
              <div>
                {events.map(
                  (event) =>
                    projectid === event.projectid &&
                    isEqual(event.day, day) && (
                      <div key={event.id}>
                        <div
                          className=" flex justify-between mb-2 cursor-pointer "
                          key={event.id}
                        >
                          {event.edit ? (
                            <div>
                              <input
                                onChange={(e) =>
                                  setNewEventTitle(e.target.value)
                                }
                                placeholder={"edit event"}
                              />
                              <button
                                onClick={() =>
                                  editEvent(event.id, newEventTitle)
                                }
                              >
                                Update event
                              </button>
                            </div>
                          ) : (
                            <div onClick={() => setEdit(event.id, true)}>
                              {format(day, "hh:mm ")}
                              {event.eventTitle}
                            </div>
                          )}
                          <Trash2
                            className="grid  cursor-pointer"
                            onClick={() => deleteEvent(event.id)}
                          />
                        </div>
                      </div>
                    )
                )}
              </div>
              <div className="flex justify-center">
                <form>
                  <input
                    type="time"
                    onChange={(e) => setTime(e.target.value)}
                  />
                  <input
                    onChange={(e) => setEventTitle(e.target.value)}
                    placeholder={"Add new event"}
                  />
                </form>
                <button onClick={() => createEventTest(day, eventTitle)}>
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
