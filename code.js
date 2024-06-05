// Retrieve the Calendar ID from the script properties
var CalendarID = PropertiesService.getScriptProperties().getProperty("CalendarID");

// Function to handle HTTP GET requests and return the index HTML file
function doGet(e) {
  return HtmlService.createHtmlOutputFromFile('index');
}

// Asynchronous function to handle form submissions
async function handleForm(form) {
  // Retrieve the text input from the form
  var text = form.textbox;
  Logger.log('Received message: ' + text);
  if (text.length < 1) {
    return "Please enter a message";
  }

  // Call the Gemini tool with the provided text and workspace tools
  var tool_use = callGeminiWithTools(text, WORKSPACE_TOOLS);
  Logger.log(tool_use);

  // Check if the tool identified is 'setupEvent'
  if (tool_use['name'] === "setupEvent" && tool_use['args']['time'] !== "unknown") {
    // Destructure the arguments from the tool
    const { timezone, title, time, location, description } = tool_use['args'];

    // Call Gemini to get the time zone offset
    let timeZoneOffset = await callGeminiGetTimeZoneOffset(timezone);

    // Call Gemini to get the time details
    let content = await callGeminiGetTime(time, timeZoneOffset);

    // Create Date objects for the start and end times
    const startDate = createDate(content["start"], timeZoneOffset);
    const endDate = createDate(content["end"], timeZoneOffset);

    // Set up the event and get the event link
    const eventLink = setupEvent(timeZoneOffset, title, startDate, endDate, location, description, CalendarID);
    Logger.log("Your meeting has been set up. Event link: " + eventLink);

    // Return the event link
    return eventLink;
  } else {
    // Log and return a message if no proper tool is found
    Logger.log("No proper tool found");
    return "No proper tool found";
  }
}
