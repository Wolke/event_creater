var API_KEY = PropertiesService.getScriptProperties().getProperty("GEMINI_API_KEY");
var API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=' + API_KEY;

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
          // "startTime": {
          //   "type": "Date",
          //   "description": "the date and time when the event starts"
          // },
          // "endTime": {
          //   "type": "Date",
          //   "description": "the date and time when the event ends"
          // },
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
          // "startTime",
          // "endTime",
          "timezone",
          "description",
          "location"
        ]
      }
    }
  ]
};

function callGeminiWithTools(prompt, tools, temperature=0) {
  const payload = {
    "contents": [
      {
        "parts": [
          {
            "text": prompt
          },
        ]
      }
    ],
    systemInstruction: {
            parts: [
                {
                    text: "1.detect language 2. output use that language"
                }
            ]
    },
    "tools": tools,
    
    "generationConfig": {
      "temperature": temperature,
    },
    "tool_config": {
    // "function_calling_config": {
    //   "mode": "ANY"
    // },
  }
  };

  const options = {
    'method': 'post',
    'contentType': 'application/json',
    'payload': JSON.stringify(payload)
  };

  const response = UrlFetchApp.fetch(API_URL, options);
  const data = JSON.parse(response.getContentText());
  const content = data["candidates"][0]["content"]["parts"][0]["functionCall"];
  return content;
}
