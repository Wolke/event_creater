// Retrieve the API key from script properties
var API_KEY = PropertiesService.getScriptProperties().getProperty("GEMINI_API_KEY");

// Define the API URL with the retrieved API key
var API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=' + API_KEY;

// Function to call the Gemini API for translating date and time
async function callGeminiGetTime(prompt, timeZoneOffset) {
  // Define the payload with the necessary data and system instruction
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
    "systemInstruction": {
      "parts": [
        {
          "text": `
**Prompt for Translating Date and Time Components into a Different Language (Numeric Only) with Start and End Times, Output in JSON:**

You are a language expert specializing in date and time translations. Your task is to translate the provided date and time string into its individual numeric components (year, month, day, hour, minute, second) in the specified target language. The input may include a date range with start and end times. The output should be in JSON format.

Example 1:
- Input Date and Time: "2023年12月5日 14時30分"
- Target Language: English
- Output:
---json
{
  "start": {
    "year": "2023",
    "month": "12",
    "day": "5",
    "hour": "14",
    "minute": "30",
    "second": "00"
  },
  "end": {}
}
---
Example 2:
- Input Date and Time: "12月5日 至 12月9日"
- Target Language: English
- Output:
---json
{
  "start": {
    "year": "",
    "month": "12",
    "day": "5",
    "hour": "",
    "minute": "",
    "second": ""
  },
  "end": {
    "year": "",
    "month": "12",
    "day": "9",
    "hour": "",
    "minute": "",
    "second": ""
  }
}
---
Input:
1. Date and Time: "{{date_and_time}}"
2. Target Language: "{{target_language}}"
Output in JSON:
---json
{
  "start": {
    "year": "{{start_year}}",
    "month": "{{start_month}}",
    "day": "{{start_day}}",
    "hour": "{{start_hour}}",
    "minute": "{{start_minute}}",
    "second": "{{start_second}}"
  },
  "end": {
    "year": "{{end_year}}",
    "month": "{{end_month}}",
    "day": "{{end_day}}",
    "hour": "{{end_hour}}",
    "minute": "{{end_minute}}",
    "second": "{{end_second}}"
  }
}
---
Notes:
- Translate each component (year, month, day, hour, minute, second) into the target language numerically.
- Ensure that the translation accurately represents the date and time in the target language context.
- Include zero padding for single-digit months, days, hours, minutes, and seconds where necessary.
- If the input includes a date range, provide separate components for the start and end times.
          `
        }
      ]
    },
    "generationConfig": {
      "response_mime_type": "application/json",
      "temperature": 0
    }
  };

  // Define the options for the API request
  const options = {
    'method': 'post',
    'contentType': 'application/json',
    'payload': JSON.stringify(payload)
  };

  // Fetch the response from the API
  const response = await UrlFetchApp.fetch(API_URL, options);
  
  // Parse the response JSON
  const data = JSON.parse(response.getContentText());
  Logger.log(data)
  // Extract and parse the content from the response
  const content = JSON.parse(data["candidates"][0]["content"]["parts"][0]["text"]);

  // Return the parsed content
  return content;
}

// Function to test the callGeminiGetTime function
async function test1() {
  // Call another function to get the time zone offset (assuming it exists)
  let timeZoneOffset = await callGeminiGetTimeZoneOffset("Asia/Taipei");

  // Call the main function with a sample prompt and the retrieved time zone offset
  let d = await callGeminiGetTime("7月6日至7月8日", timeZoneOffset);

  // Log the result
  Logger.log(d);
}
