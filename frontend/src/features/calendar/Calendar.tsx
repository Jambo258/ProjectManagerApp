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
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "react-feather";
import * as Y from "yjs";
import CalendarEventModal from "./CalendarEventModal";

export interface Event {
  id: string;
  day: string;
  eventTitle: string;
}

const Calendar = ({yevents}: {yevents: Y.Array<Event> }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [currentMonth, setcurrentMonth] = useState(startOfToday());
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

  useEffect(() => {
    setEvents(yevents.toArray());
    yevents.observe(() => {
      setEvents(yevents.toArray());
    });
  },[yevents]);

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
  const firstDayOfMonth = parse(format(currentMonth, "MMM-yyyy"), "MMM-yyyy", new Date());
  const daysInMonth = eachDayOfInterval({
    start: startOfWeek(firstDayOfMonth, { weekStartsOn: 1 }),
    end: endOfWeek(endOfMonth(firstDayOfMonth), { weekStartsOn: 1 }),
  });
  const getNextMonth = () => {
    const firstDayOfNextMonth = add(firstDayOfMonth, { months: 1 });
    setcurrentMonth(firstDayOfNextMonth);
  };

  const getPrevMonth = () => {
    const firstDayOfPrevMonth = add(firstDayOfMonth, { months: -1 });
    setcurrentMonth(firstDayOfPrevMonth);
  };

  return (
    <>
      <div className="flex w-full h-fit">
        <div className="w-full h-full">
          <header className="flex items-center rounded-t bg-primary-200 justify-center -m-px">
            <ChevronLeft
              className="cursor-pointer mr-6"
              size={24}
              onClick={() => getPrevMonth()}
            />
            <div
              className="grid col-span-1 py-2 cursor-pointer heading-xs md:heading-sm lg:heading-md"
              onClick={() => setShowMonthSelect(!showMonthSelect)}
            >
              {format(currentMonth, "MMM yyyy")}
              {showMonthSelect && (
                <div className="fixed z-10 flex flex-col">
                  <dialog className="h-[200px] relative mt-10 lg:mt-14 w-fit lg:w-[170px] flex flex-col z-30 border-grayscale-200 shadow-md rounded overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
                    <section className="grid grid-cols-1 divide-y divide-grayscale-200 overflow-auto">
                      {monthSelect.map((month, index) => {
                        return (
                          <section
                            key={index}
                            className="py-0 ps-1 pe-4 heading-xs text-dark-font bg-grayscale-0 hover:bg-grayscale-300"
                            onClick={() =>
                              setcurrentMonth(month)
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
              onClick={() => getNextMonth()}
            />
          </header>

          <section className="grid grid-cols-7 py-1 place-items-center -m-px border-t border-x border-grayscale-400 body-text-sm md:body-text-md">
            {days.map((day, id) => (
              <div key={id}>{day}</div>
            ))}
          </section>

          <section className="grid w-full h-full grid-cols-7">
            {daysInMonth.map((day) => (
              <div
                key={day.toDateString()}
                className={colStartClasses[getDay(day)]}
              >
                <CalendarEventModal
                  events={events}
                  currentMonth={currentMonth}
                  day={day}
                  yevents={yevents}
                />
              </div>
            ))}
          </section>
        </div>
      </div>
    </>
  );
};

export default Calendar;
