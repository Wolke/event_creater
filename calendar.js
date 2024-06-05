function setupEvent(timeZoneOffset, title, startDate, endDate, location, description, calendarId) {
  Logger.log(`${timeZoneOffset}, ${title}, ${startDate}, ${endDate}, ${location}, ${description}, ${calendarId}`)
  // Retrieve the default calendar
  let calendar = CalendarApp.getDefaultCalendar();

  // If a specific calendar ID is provided, use that calendar instead
  if (calendarId) {
    calendar = CalendarApp.getCalendarById(calendarId);
  }

  let event;
  
  // Check if endDate is null, indicating an all-day event
  if (endDate == null) {
    // Set the end date to one day after the start date for an all-day event
    endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 1);
    
    // Create an event for the entire day
    event = calendar.createEvent(title, startDate, endDate);
  } else {
    // Create a standard event with the given start and end dates
    event = calendar.createEvent(title, startDate, endDate);
  }

  // Set the event's description and location
  event.setDescription(description);
  event.setLocation(location);

  // Generate the event URL
  var splitEventId = event.getId().split('@');
  var eventURL = "https://www.google.com/calendar/event?eid=" + 
                 Utilities.base64Encode(splitEventId[0] + " " + calendarId).replace("==", '');

  // Return the event URL
  return eventURL;
}

function listAllCalendars() {
  // Get all calendars
  var calendars = CalendarApp.getAllCalendars();

  // Iterate through each calendar and log its name and ID
  for (var i = 0; i < calendars.length; i++) {
    var calendar = calendars[i];
    var name = calendar.getName();
    var id = calendar.getId();
    Logger.log('Name: ' + name + ', ID: ' + id);
  }
}
