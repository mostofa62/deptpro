import React, { useEffect, useState } from "react";
import moment from "moment"; // Import moment for date handling

// Define types for extraDayData
type ExtraDayDataItem = {
    date: string;
    title: string;
    description: any;
  };
  
  type ExtraDayDataSingle = {
    [key: string]: {
      title: string;
      description: any;
    };
  };
  
  // Define the prop types
  interface BasicCalendarProps {
    extraDayData: ExtraDayDataSingle | ExtraDayDataItem[];
    currentMonth?:string;
  }
  

  const BasicCalendar: React.FC<BasicCalendarProps> = ({ extraDayData,currentMonth }) => {
  
  const [currentDate, setCurrentDate] = useState(moment()); // Initialize with current date

  useEffect(()=>{

    if(currentMonth){
        setCurrentDate(moment(currentMonth,'YYYY-MM-DD'))
    }

  },[currentMonth])

  // Calculate the number of days in the current month
  const daysInMonth = currentDate.daysInMonth();
  
  // Calculate the starting day of the month (0 = Sunday, 1 = Monday, ...)
  const firstDayOfMonth = currentDate.clone().startOf("month").day(); 

  

  const handlePrevMonth = () => {
    setCurrentDate(currentDate.clone().subtract(1, "month")); // Subtract a month
  };

  const handleNextMonth = () => {
    setCurrentDate(currentDate.clone().add(1, "month")); // Add a month
  };

  const renderDaysOfWeek = () => {
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return daysOfWeek.map((day, index) => (
      <div key={index} className="text-center font-bold text-gray-500">
        {day}
      </div>
    ));
  };

  const renderDates = () => {
    // Create an array of empty slots for days before the first day of the month
    const emptyDays = Array(firstDayOfMonth).fill(null);
    
    // Create an array of day numbers for the current month (1 to daysInMonth)
    const daysArray = [...emptyDays, ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];

    return daysArray.map((day, index) => {
      if (!day) return <div key={index} className="h-16 w-16"></div>; // Empty day cell with increased height

      // Create a moment object for each day
      const dayMoment = currentDate.clone().date(day);
      const formattedDate = dayMoment.format("YYYY-MM-DD"); // Format date as 'YYYY-MM-DD'
      // Get extra data for this day
      const extraData = Array.isArray(extraDayData)
        ? extraDayData.find(item => item.date === formattedDate)
        : extraDayData[formattedDate];

      return (
        <div
          key={index}
          className={`h-12 w-auto flex flex-col items-center justify-center relative rounded-lg cursor-pointer group ${
            extraData ? 'bg-[#31c4a2] text-white' : 'bg-gray-200 text-black'
          }`}
        >
          <div className="flex flex-col justify-center items-center">
            <span className="text-sm font-semibold">{day}</span>
            {/*extraData && (
                <span className="absolute bottom-1 text-xs font-semibold">{extraData.title}</span>
            )*/}
          </div>
          {/* Show the extra data in a styled box below the date */}
          {extraData && (
            <div
              className="z-999 absolute -top-full left-1/2 transform -translate-x-1/2 mt-2 w-auto bg-white border border-gray-300 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ minWidth: '200px' }} // Adjust width as needed
            >
              <div className="p-2 text-xs text-[#4f4f4f]">
                <div className="font-semibold capitalize text-sm">{extraData.title}</div>
                <div className="font-medium">{extraData.description}</div>
              </div>
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="p-4 w-auto mx-auto bg-white shadow-lg rounded-lg">
      <div className="flex justify-between items-center mb-4 bg-[#43acd6] text-white px-5 py-3 rounded">
        <button
          onClick={handlePrevMonth}
          className="text-lg font-bold text-gray-600"
        >
          &lt;
        </button>
        <h2 className="text-xl uppercase font-semibold">
          {currentDate.format("MMMM YYYY")}
        </h2>
        <button
          onClick={handleNextMonth}
          className="text-lg font-bold text-gray-600"
        >
          &gt;
        </button>
      </div>
      <div className="grid grid-cols-7 gap-4">
        {renderDaysOfWeek()}
        {renderDates()}
      </div>
    </div>
  );
};

export default BasicCalendar;
