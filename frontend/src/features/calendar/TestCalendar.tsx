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

function App() {
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

  const getPrevMonth = (event: React.MouseEvent<SVGSVGElement>) => {
    event.preventDefault();
    const firstDayOfPrevMonth = add(firstDayOfMonth, { months: -1 });
    setcurrentMonth(format(firstDayOfPrevMonth, "MMM-yyyy"));
  };

  const getNextMonth = (event: React.MouseEvent<SVGSVGElement>) => {
    event.preventDefault();
    const firstDayOfNextMonth = add(firstDayOfMonth, { months: 1 });
    setcurrentMonth(format(firstDayOfNextMonth, "MMM-yyyy"));
  };

  return (
    <div className="p-8 w-screen h-screen flex">
      <div className="w-[900px] h-[600px]">
        <div className="flex items-center justify-center">
          <div className="flex items-center gap-6 sm:gap-12">
            <ChevronLeft
              className="w-6 h-6 cursor-pointer"
              onClick={getPrevMonth}
            />
            <p className="font-semibold text-xl">
              {format(firstDayOfMonth, "MMMM yyyy")}
            </p>
            <ChevronRight
              className="w-6 h-6 cursor-pointer"
              onClick={getNextMonth}
            />
          </div>
        </div>
        <hr className="my-6" />
        <div className="grid grid-cols-7 gap-6 sm:gap-12 place-items-center">
          {days.map((day, idx) => {
            return (
              <div key={idx} className="font-semibold">
                {day}
              </div>
            );
          })}
        </div>
        <div className="grid grid-cols-7 gap-6 sm:gap-12 mt-8 place-items-center">
          {daysInMonth.map((day, idx) => {
            return (
              <div key={idx} className={colStartClasses[getDay(day)]}>
                <p
                  className={`cursor-pointer flex items-center justify-center font-semibold h-8 w-8 rounded-full  hover:text-white ${
                    isSameMonth(day, today) ? "text-gray-900" : "text-gray-400"
                  } ${!isToday(day) && "hover:bg-blue-500"} ${
                    isToday(day) && "bg-red-500 text-white"
                  }`}
                >
                  {format(day, "d")}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default App;
