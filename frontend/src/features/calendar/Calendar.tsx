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
  addMonths,
  subMonths,
} from "date-fns";
import { useEffect, useState } from "react";
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
  const days = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
  const colStartClasses = [
    "",
    "col-start-1",
    "col-start-2",
    "col-start-3",
    "col-start-4",
    "col-start-5",
    "col-start-6",
  ];
  const [currentMonth, setcurrentMonth] = useState(() =>
    format(today, "MMM-yyyy")
  );
  let firstDayOfMonth = parse(currentMonth, "MMM-yyyy", new Date());

  const daysInMonth = eachDayOfInterval({
    start: startOfWeek(firstDayOfMonth, { weekStartsOn: 1 }),
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

  const [showMonthSelect, setShowMonthSelect] = useState(false);
  const [monthSelect, setMonthSelect] = useState([new Date()]);

  const getSelectableMonths = () => {
    const tempMonths: Date[] = [];

    for (let i = 0; i < 5; i++) {
      tempMonths.push(addMonths(new Date(), i));
    }

    for (let i = 1; i < 6; i++) {
      tempMonths.unshift(subMonths(new Date(), i));
    }

    setMonthSelect(tempMonths);
  };

  const setNewMonth = (month: Date) => {
    setcurrentMonth(format(month, "MMM yyyy"));
    firstDayOfMonth = parse(currentMonth, "MMM-yyyy", new Date());
    setShowMonthSelect(!showMonthSelect);
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

  useEffect(() => {
    getSelectableMonths();
  }, []);

  return (
    <>
      <div className="flex w-screen h-screen ">
        <div className="w-auto h-auto m-20 border-2">
          <div className="flex items-center  justify-between">
            <ChevronLeft
              className="cursor-pointer mr-6"
              size={32}
              onClick={() => getPrevMonth()}
            />
            <div
              className="grid col-span-1 cursor-pointer"
              onClick={() => setShowMonthSelect(!showMonthSelect)}
            >
              {format(currentMonth, "MMM yyyy")}
              {showMonthSelect && (
                <div className="fixed z-10  flex flex-col ">
                  <dialog className="relative w-fit flex flex-col z-30 border-2 border-grayscale-200 shadow-md rounded overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
                    <section className="grid grid-cols-1 divide-y divide-grayscale-200">
                      {monthSelect.map((month, index) => {
                        return (
                          <section
                            key={index}
                            className="py-0 ps-1 pe-4 heading-xs text-dark-font bg-grayscale-0 hover:bg-grayscale-0"
                            onClick={() => setNewMonth(month)}
                          >
                            {format(month, "MMM yyyy")}
                          </section>
                        );
                      })}
                    </section>
                  </dialog>
                </div>
              )}
            </div>
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
                      isSameMonth(day, currentMonth)
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
                        {events.map(
                          (event) =>
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
                        )}
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
    </>
  );
};

export default CalendarModal;
