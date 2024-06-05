// Retrieve the Calendar ID from the script properties
var CalendarID = PropertiesService.getScriptProperties().getProperty("CalendarID");

async function main() {
  // User query for the event
  const userQuery = "happy";

  // Call the Gemini tool with the user query and workspace tools
  var tool_use = await callGeminiWithTools(userQuery, WORKSPACE_TOOLS);

  // Check if the tool identified is 'setupEvent'
  if (tool_use['name'] === "setupEvent" && tool_use['args']['time'] !== "unknown" ) {
    const { timezone, title, time, location, description } = tool_use['args'];

    // Retrieve the timezone offset using the Gemini tool
    let timeZoneOffset = await callGeminiGetTimeZoneOffset(timezone);
    // Get the event time details using the Gemini tool
    let content = await callGeminiGetTime(time, timeZoneOffset);

    // Create Date objects for the event start and end times
    const startDate = createDate(content["start"], timeZoneOffset);
    const endDate = createDate(content["end"], timeZoneOffset);

    // Set up the event in the calendar
    const eventLink = setupEvent(timeZoneOffset, title, startDate, endDate, location, description, CalendarID);
    Logger.log("Your meeting has been set up. Event link: " + eventLink);
  } else {
    Logger.log("No proper tool found");
  }
}
