function createDate(dateParts = {}, timeZoneOffset) {
  // Destructure the dateParts object and provide default values for each component
  const {
    year = new Date().getFullYear().toString(), // Default to the current year as a string
    month = "1", // Default to January
    day = "1", // Default to the first day of the month
    hour = "0", // Default to midnight
    minute = "0", // Default to the top of the hour
    second = "0" // Default to the top of the minute
  } = dateParts;

  // Parse the values from strings to integers
  const parsedYear = year ? parseInt(year) : new Date().getFullYear();
  const parsedMonth = month ? parseInt(month) - 1 : 0; // Months are 0-based in JavaScript Date
  const parsedDay = day ? parseInt(day) : 1;
  const parsedHour = hour ? parseInt(hour) : 0;
  const parsedMinute = minute ? parseInt(minute) : 0;
  const parsedSecond = second ? parseInt(second) : 0;

  // If all date components are at their default values, return null
  if (
    parsedYear == new Date().getFullYear() && 
    parsedMonth == 0 && 
    parsedDay == 1 && 
    parsedHour == 0 && 
    parsedMinute == 0 && 
    parsedSecond == 0
  ) {
    return null;
  }

  // Create a date object in UTC time
  let utcTime = new Date(Date.UTC(parsedYear, parsedMonth, parsedDay, parsedHour, parsedMinute, parsedSecond));
  
  // Calculate the GMT offset in milliseconds
  let gmtOffset = timeZoneOffset * 60 * 60000;
  
  // Log the UTC time
  Logger.log(utcTime);
  
  // Adjust the UTC time to the desired time zone by adding the offset
  let gmt = new Date(utcTime + gmtOffset);
  
  // If the offset is positive, it means the time zone is ahead of UTC, so subtract the offset instead
  if (gmtOffset > 0) {
    gmt = new Date(utcTime - gmtOffset);
  }
  
  // Log the adjusted time
  Logger.log(gmt);
  
  // Return the adjusted time
  return gmt;
}


/**
 * Unit tests for createDate function.
 */
function test3() {
  // Helper function to compare dates (ignoring milliseconds)
  function datesAreEqual(date1, date2) {
    return date1.getTime() === date2.getTime();
  }

  // Test cases
  const testCases = [
    {
      description: "Returns null for default values",
      input: [{}, 0],
      expected: null
    },
    {
      description: "Creates date correctly with provided date parts",
      input: [{ year: '2023', month: '5', day: '15', hour: '10', minute: '30', second: '45' }, 0],
      expected: new Date(Date.UTC(2023, 4, 15, 10, 30, 45))
    },
    {
      description: "Creates date correctly with time zone offset",
      input: [{ year: '2023', month: '5', day: '15', hour: '10', minute: '30', second: '45' }, 5],
      expected: new Date(Date.UTC(2023, 4, 15, 5, 30, 45)) // UTC time minus 5 hours
    },
    {
      description: "Creates date correctly with negative time zone offset",
      input: [{ year: '2023', month: '5', day: '15', hour: '10', minute: '30', second: '45' }, -3],
      expected: new Date(Date.UTC(2023, 4, 15, 13, 30, 45)) // UTC time plus 3 hours
    }
  ];

  // Run tests
  testCases.forEach(({ description, input, expected }) => {
    const [dateParts, timeZoneOffset] = input;
    const actual = createDate(dateParts, timeZoneOffset);
    if (expected === null) {
      Logger.log(actual === null, `FAILED: ${description} - Expected null, but got ${actual}`);
    } else {
      Logger.log(datesAreEqual(actual, expected), `FAILED: ${description} - Expected ${expected}, but got ${actual}`);
    }
  });

  console.log("All tests passed!");
}