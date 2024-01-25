import {
  add,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  getDay,
  isEqual,
  isSameMonth,
  isToday,
  parse,
  startOfToday,
  startOfWeek,
} from "date-fns";
import { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "react-feather";
import { Modal } from "../../components/Modal";
import { useParams } from "react-router-dom";
import { nanoid } from "@reduxjs/toolkit";

const CalendarModal = () => {
  const projectid = parseInt(useParams().projectId!);
  const pageid = parseInt(useParams().pageId!);
  const [events, setEvents] = useState([
    {
      id: "",
      projectid: 0,
      pageid: 0,
      day: new Date(),
      eventTitle: "",
      edit: false,
    },
  ]);
  const [eventTitle, setEventTitle] = useState("");
  const [newEventTitle, setNewEventTitle] = useState("");
  const today = startOfToday();
  const days = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  const colStartClasses = [
    "",
    "col-start-2",
    "col-start-3",
    "col-start-4",
    "col-start-5",
    "col-start-6",
    "col-start-7",
  ];
  const [currentMonth, setcurrentMonth] = useState(() =>
    format(today, "MMM-yyyy")
  );
  const firstDayOfMonth = parse(currentMonth, "MMM-yyyy", new Date());

  const daysInMonth = eachDayOfInterval({
    start: startOfWeek(firstDayOfMonth),
    end: endOfWeek(endOfMonth(firstDayOfMonth)),
  });

  const getNextMonth = () => {
    const firstDayOfNextMonth = add(firstDayOfMonth, { months: 1 });
    setcurrentMonth(format(firstDayOfNextMonth, "MMM-yyyy"));
  };

  const getPrevMonth = () => {
    const firstDayOfPrevMonth = add(firstDayOfMonth, { months: -1 });
    setcurrentMonth(format(firstDayOfPrevMonth, "MMM-yyyy"));
  };

  const clearEvents = () => {
    setEvents([
      {
        id: nanoid(),
        projectid: 0,
        pageid: 0,
        day: new Date(),
        eventTitle: "",
        edit: false,
      },
    ]);
  };

  const createEvent = (day: Date, eventTitle: string) => {
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
    setEventTitle("");
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

  const deleteEvent = (eventid: string) => {
    const index = events.findIndex((event) => event.id === eventid);
    setEvents([...events.slice(0, index), ...events.slice(index + 1)]);
  };

  return (
    <>
      <div className="flex w-screen h-screen ">
        <div className="w-auto h-auto m-20 border-2">
          <div className="flex imems-center  justify-center">
            <ChevronLeft
              className="cursor-pointer mr-6"
              size={32}
              onClick={() => getPrevMonth()}
            />
            <p className="grid col-span-1 ">
              {format(firstDayOfMonth, "MMMM yyyy")}
            </p>
            <ChevronRight
              className="cursor-pointer ml-6"
              size={32}
              onClick={() => getNextMonth()}
            />
          </div>
          <div className="grid grid-cols-7 border-b-2 border-t-2 place-items-center">
            {days.map((day, id) => {
              return <div key={id}>{day}</div>;
            })}
          </div>
          <div className="grid grid-cols-7 place-items-center">
            {daysInMonth.map((day, idx) => {
              return (
                <div key={idx} className={colStartClasses[getDay(day)]}>
                  <Modal
                    btnText={format(day, "d")}
                    btnStyling={`cursor-pointer bg-grayscale-200 flex items-center justify-center h-28 w-28 mt-1 mx-1 ${
                      isSameMonth(day, today)
                        ? "text-dark-font"
                        : "text-grayscale-400"
                    }
                    ${checkEventDay(day) && "bg-success-200 "}
                    ${!isToday(day) && "hover:bg-success-200 "}
                    ${isToday(day) && "border-2"}`}
                    modalTitle={"Events"}
                  >
                    <div>
                      <div>
                        {events.map((event) => {
                          return (
                            projectid === event.projectid &&
                            isEqual(event.day, day) && (
                              <div className="cursor-pointer" key={event.id}>
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
                                    {event.eventTitle}
                                  </div>
                                )}
                                <X
                                  className="cursor-pointer"
                                  onClick={() => deleteEvent(event.id)}
                                />
                              </div>
                            )
                          );
                        })}
                      </div>
                      <div className="flex justify-center">
                        <form>
                          <input
                            onChange={(e) => setEventTitle(e.target.value)}
                            placeholder={"Add new event"}
                          />
                        </form>
                        <button onClick={() => createEvent(day, eventTitle)}>
                          Confirm
                        </button>
                      </div>
                    </div>
                  </Modal>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <button onClick={() => clearEvents()}></button>
    </>
  );
};

export default CalendarModal;
