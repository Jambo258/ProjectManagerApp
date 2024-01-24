import {
  add,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  getDay,
  isSameMonth,
  isToday,
  parse,
  startOfToday,
  startOfWeek,
} from "date-fns";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "react-feather";
import { Modal } from "../../components/Modal";
import { useParams } from "react-router-dom";

const CalendarModal = () => {
  const projectid = parseInt(useParams().projectId!);
  const pageid = parseInt(useParams().pageId!);
  const [events, setEvents] = useState([
    { idx: 0, projectid: 0, pageid: 0, day: new Date(), eventTitle: "" },
  ]);
  const [eventTitle, setEventTitle] = useState("");

  const today = startOfToday();
  const days = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
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

  const createEvent = (idx: number, day: Date) => {
    setEvents([
      ...events,
      {
        idx: idx,
        projectid: projectid,
        pageid: pageid,
        day: day,
        eventTitle: "event",
      },
    ]);

    console.log(events);
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
                  <p
                    className={`cursor-pointer flex items-center justify-center h-28 w-28 mt-1 ${
                      isSameMonth(day, today)
                        ? "text-dark-font"
                        : "text-grayscale-400"
                    }  
                  ${!isToday(day) && "hover:bg-success-200 "} 
                  ${isToday(day) && "bg-caution-100"}`}
                  >
                    {format(day, "d")}
                  </p>
                  {events.map(
                    (event) =>
                      isToday(event.day) && (
                        <div key={idx}>{event.eventTitle}</div>
                      )
                  )}

                  <Modal
                    btnText={"Add event"}
                    btnStyling={
                      "min-w-max w-full p-1.5 pe-4 text-left heading-xs bg-grayscale-0 hover:bg-grayscale-0 focus:ring-0 focus:text-caution-100"
                    }
                    modalTitle={"Add event"}
                  >
                    <div>
                      {eventTitle}
                      <div className="flex justify-center">
                        <p>{format(day, "d")}</p>
                        <form>
                          <input
                            onChange={(e) => setEventTitle(e.target.value)}
                            placeholder={"Event title"}
                          />
                        </form>
                        <button onClick={() => createEvent(1, day)}>
                          Confirm
                        </button>
                        <button>Cancel</button>
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
