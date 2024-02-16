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
  isSameDay,
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

const Calendar = ({ yevents }: { yevents: Y.Map<Event>; }) => {
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
    setEvents(Array.from(yevents.values()));
    yevents.observe(() => {
      setEvents(Array.from(yevents.values()));
    });
  }, [yevents]);

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
          <header className="relative flex py-2 items-center text-dark-font justify-center rounded-t border-x border-t border-grayscale-300 bg-primary-200">
            <ChevronLeft
              className="cursor-pointer mr-6 focus:outline-none focus:ring focus:ring-dark-blue-50 rounded"
              size={24}
              onClick={getPrevMonth}
              onKeyDown={(e) => {
                if (e.key !== "Enter") return;
                getPrevMonth();
              }}
              tabIndex={0}
            />
            <div
              tabIndex={0}
              className="grid col-span-1 cursor-pointer heading-xs md:heading-sm lg:heading-md focus:outline-none focus:ring focus:ring-dark-blue-50 rounded"
              onClick={() => setShowMonthSelect(!showMonthSelect)}
              onKeyDown={(e) => {
                if (e.key !== "Enter") return;
                setShowMonthSelect(!showMonthSelect);
              }}
            >
              <div
                className="min-w-24 text-center">
                {format(currentMonth, "MMM yyyy")}
              </div>
              {showMonthSelect && (
                <div className="absolute z-10 flex flex-col">
                  <dialog className="h-[200px] relative w-fit mt-8 md:mt-10 lg:mt-11 flex flex-col z-30 border-grayscale-200 shadow-md rounded overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
                    <section className="grid grid-cols-1 divide-y divide-grayscale-200 overflow-auto">
                      {monthSelect.map(month => {
                        return (
                          <section
                            key={month.toISOString()}
                            className="py-0 ps-1 pe-4 heading-xs text-dark-font bg-grayscale-0 hover:bg-grayscale-300"
                            onClick={() => setcurrentMonth(month)}
                            onKeyDown={(e) => {
                              if (e.key !== "Enter") return;
                              setcurrentMonth(month);
                            }}
                            tabIndex={0}
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
              className="cursor-pointer ml-6 focus:outline-none focus:ring focus:ring-dark-blue-50 rounded"
              onClick={getNextMonth}
              onKeyDown={(e) => {
                if (e.key !== "Enter") return;
                getNextMonth();
              }}
              tabIndex={0}
            />
          </header>

          <section className="grid grid-cols-7 py-1 place-items-center text-dark-font border-t border-x border-grayscale-300 body-text-sm md:body-text-md">
            {days.map(day => (
              <div key={day}>{day}</div>
            ))}
          </section>

          <section className="grid h-full grid-cols-7 [&>*:nth-child(7n+1)]:border-l [&>*:nth-child(7n+1)]:border-grayscale-300
        [&>*:nth-child(-n+7)]:border-t [&>*:nth-child(-n+7)]:border-grayscale-300">
            {daysInMonth.map(day => (
              <div
                key={day.toISOString()}
                className={colStartClasses[getDay(day)]}
              >
                <CalendarEventModal
                  events={events.filter(event => isSameDay(day, event.day)).sort((a, b) => new Date(a.day).getTime() - new Date(b.day).getTime())}
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
