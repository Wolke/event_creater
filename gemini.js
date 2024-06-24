// gemini.js

const WORKSPACE_TOOLS = {
  "function_declarations": [
    {
      "name": "setupEvent",
      "description": "Sets up a event in Google Calendar.",
      "parameters": {
        "type": "object",
        "properties": {
          "title": {
            "type": "String",
            "description": "the title of the event"
          },
          "time": {
            "type": "String",
            "description": "The time of the event."
          },
          "timezone":{
            "type": "String",
            "description": "The timezone of the location."
          },
          "startTime": {
            "type": "String",
            "description": "the date and time when the event starts"
          },
          "endTime": {
            "type": "String",
            "description": "the date and time when the event ends"
          },
          "description": {
            "type": "String",
            "description": "a free-form description of the event"
          },
          "location":{
            "type": "String",
            "description": "the location of the event"
          }
        },
        "required": [
          "title",
          "time",
          "timezone",
          "description",
          "location"
        ]
      }
    }
  ]
};

// Common function to call the API with different instructions and tools
async function callApi(apiKey, text, systemInstruction, tools = null, temperature = 0) {
const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

const payload = {
    systemInstruction: {
        parts: [
            {
                text: systemInstruction
            }
        ]
    },
    contents: [{
        parts: [{
            text: text
        }]
    }],
    generationConfig: {
        temperature: temperature
    }
};

if (tools) {
    payload.tools = tools;
    payload.tool_config = {
        function_calling_config: {
            mode: "ANY"
        }
    };
}

const options = {
    'method': 'post',
    'contentType': 'application/json',
    'payload': JSON.stringify(payload)
};

try {
    const response = UrlFetchApp.fetch(apiUrl, options);
    const data = JSON.parse(response.getContentText());
    return tools ? data.candidates[0].content.parts[0].functionCall : data.candidates[0].content.parts[0].text;
} catch (error) {
    Logger.log('Error: ' + error);
    return { error: error.toString() };
}
}


// code.js
// Example usage for ICS format
async function callApiForICS(text) {
var apiKey = PropertiesService.getScriptProperties().getProperty("GEMINI_API_KEY");
const systemInstruction = "response in ICS format";
var response = await callApi(apiKey, text, systemInstruction);

return response;
}


// Example usage with WORKSPACE_TOOLS
async function callApiWithWorkspaceTools(text) {
var CalendarID = PropertiesService.getScriptProperties().getProperty("CalendarID");
var apiKey = PropertiesService.getScriptProperties().getProperty("GEMINI_API_KEY");
const systemInstruction = "use tools";

var tool_use = await callApi(apiKey, text, systemInstruction, WORKSPACE_TOOLS);
if (tool_use['name'] === "setupEvent" && tool_use['args']['time'] !== "unknown" ) {
  const { timezone, title, time, startTime, endTime, location, description } = tool_use['args'];

  const eventLink = setupEvent(timezone, title, startTime, endTime, location, description, CalendarID);
 
  return eventLink
}
return "fail"
}