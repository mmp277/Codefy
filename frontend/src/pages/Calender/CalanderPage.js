import React, { useState } from "react";
import DatesMatrix from "./DatesMatrix.js";
import CalenderHeader from "./CalenderHeader.js";
import Weeks from "./Weeks.js";
import Contests from "./Contests.js";
import Navbar2 from "../../components/Navbar2.js";
import "./calendar.css";

const generateDates = () => {
  const calender = [[]];
  const date = new Date();
  const year = date.getFullYear();

  const firstDay = new Date(year, date.getMonth(), 1);
  const lastDay = new Date(year, date.getMonth() + 1, 0);
  let week = 0;

  for (let i = 0; i < firstDay.getDay(); i++) {
    calender[week].push(null);
  }

  for (let i = 1; i <= lastDay.getDate(); i++) {
    if (calender[week].length === 7) {
      week++;
      calender[week] = [];
    }
    calender[week].push(i);
  }

  while (calender[week].length < 7) {
    calender[week].push(null);
  }
  return calender;
};

const Calendar = () => {
  const dates = generateDates();
  const currentDay = new Date().getDate();
  const [selectedDay, setSelectedDay] = useState(currentDay);
  const daySelectHandler = (day) => {
    setSelectedDay(day);
  };
  const date = new Date();
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const month = date.getMonth();
  const year = date.getFullYear();
  return (
    <>
      <Navbar2 />
      <div
        className="body-wrapper_flex"
        style={{
          height: "80vh",
          paddingBottom: "1vh",
          backgroundImage: "url(https://i.gifer.com/J4o.gif)",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "white",
        }}
      >
        <div className="calender-wrapper">
          <div className="calender-block-wrapper_flex2">
            <CalenderHeader />
            <Weeks />
            <DatesMatrix
              dates={dates}
              currentDay={currentDay}
              selectedDay={selectedDay}
              onSelect={daySelectHandler}
            />
          </div>

          <div className="contests-wrapper">
            <div
              style={{
                textAlign: "center",
                fontWeight: "bold",
                paddingBottom: 25,
              }}
            >
              Contests List for {selectedDay}
              {(selectedDay === 1 && "st") ||
                (selectedDay === 2 && "nd") ||
                (selectedDay === 3 && "rd") ||
                "th"}
            </div>
            <Contests day={selectedDay} month={month} year={year} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Calendar;
