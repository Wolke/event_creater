function setupEvent(timezone, title, startDate, endDate, location, description, calendarId) {
  // Retrieve the default calendar
   let calendar = CalendarApp.getDefaultCalendar();
 
   // If a specific calendar ID is provided, use that calendar instead
   if (calendarId) {
     calendar = CalendarApp.getCalendarById(calendarId);
   }
 
   let event = calendar.createEvent(title, parseDateString(startDate), endDate ? parseDateString(endDate) : null);
 
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
 
 function parseDateString(dateString) {
     // Extract year, month, day, hour, minute, and second from the string
     const year = dateString.substring(0, 4);
     const month = dateString.substring(4, 6) - 1; // Months are zero-based in JavaScript Date object
     const day = dateString.substring(6, 8);
     const hour = dateString.substring(9, 11);
     const minute = dateString.substring(11, 13);
     const second = dateString.substring(13, 15);
 
     // Create a new Date object using the extracted components
     return new Date(year, month, day, hour, minute, second);
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
 