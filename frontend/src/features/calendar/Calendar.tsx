import {
  add,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  getDay,
  parse,
  startOfToday,
  startOfWeek,
  addMonths,
  subMonths,
} from "date-fns";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "react-feather";
import { useParams } from "react-router-dom";
import CalendarEventModal from "./CalendarEventModal";

interface Event {
  id: string;
  projectid: number;
  pageid: number;
  day: Date;
  eventTitle: string;
  edit: boolean;
}

const CalendarModal = () => {
  const projectid = parseInt(useParams().projectId!);
  const pageid = parseInt(useParams().pageId!);
  const [events, setEvents] = useState<Event[]>([]);
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
  const [currentMonth, setcurrentMonth] = useState(format(today, "MMM-yyyy"));
  const firstDayOfMonth = parse(currentMonth, "MMM-yyyy", new Date());
  const daysInMonth = eachDayOfInterval({
    start: startOfWeek(firstDayOfMonth, { weekStartsOn: 1 }),
    end: endOfWeek(endOfMonth(firstDayOfMonth), { weekStartsOn: 1 }),
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
  const [monthSelect] = useState<Date[]>(() => {
    const tempMonths: Date[] = [];

    for (let i = 0; i < 12; i++) {
      tempMonths.push(addMonths(new Date(), i));
    }

    for (let i = 1; i < 12; i++) {
      tempMonths.unshift(subMonths(new Date(), i));
    }

    return tempMonths;
  });

  return (
    <>
      <div className="flex w-full h-fit border">
        <div className="w-full h-full">
          <div className="flex items-center rounded-t-lg bg-primary-200 justify-center m-[-1px]">
            <ChevronLeft
              className="cursor-pointer mr-6"
              size={32}
              onClick={() => getPrevMonth()}
            />
            <div
              className="grid col-span-1 py-2 cursor-pointer heading-xl"
              onClick={() => setShowMonthSelect(!showMonthSelect)}
            >
              {format(currentMonth, "MMM yyyy")}
              {showMonthSelect && (
                <div className="fixed z-10 flex flex-col">
                  <dialog className="h-[200px] relative w-fit flex flex-col z-30 border-grayscale-200 shadow-md rounded overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
                    <section className="grid grid-cols-1 divide-y divide-grayscale-200 overflow-auto">
                      {monthSelect.map((month, index) => {
                        return (
                          <section
                            key={index}
                            className="py-0 ps-1 pe-4 heading-xs text-dark-font bg-grayscale-0 hover:bg-grayscale-0"
                            onClick={() =>
                              setcurrentMonth(format(month, "MMM-yyyy"))
                            }
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

          <div className="grid grid-cols-7 place-items-center m-[-1px] border-t border-x border-grayscale-400 heading-xs">
            {days.map((day, id) => (
              <div key={id}>{day}</div>
            ))}
          </div>

          <div className="grid w-full h-full grid-cols-7">
            {daysInMonth.map((day) => (
              <div
                key={day.toDateString()}
                className={colStartClasses[getDay(day)]}
              >
                <CalendarEventModal
                  key={day.toDateString()}
                  events={events}
                  currentMonth={currentMonth}
                  projectid={projectid}
                  pageid={pageid}
                  day={day}
                  setEvents={setEvents}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default CalendarModal;
