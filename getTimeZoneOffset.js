/**
 * Asynchronously calls the Gemini API to get the timezone offset for a given timezone string.
 * @param {string} prompt - The timezone string (e.g., "America/New_York", "Europe/London").
 * @returns {number|string} - The timezone offset in hours or an error message.
 */
async function callGeminiGetTimeZoneOffset(prompt) {
  // Define the data to be sent in the request payload
  const data = {
    contents: [
      {
        parts: [
          {
            text: prompt
          }
        ]
      }
    ],
    systemInstruction: {
      parts: [
        {
          text: `
            Provide the timezone offset for a given timezone in JSON format. The input will be a timezone string (e.g., "America/New_York", "Europe/London"), and the output should be the offset from UTC in hours, formatted as JSON.

            For example, if the input is "America/New_York", the output should be:
            ---json
            {
              "timezone_offset_hours": -4
            }
            ---
            Ensure the output considers both standard and daylight saving times where applicable.
          `
        }
      ]
    },
    generationConfig: {
      response_mime_type: "application/json",
      temperature: 0
    }
  };

  // Define the request options
  const options = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(data)
  };

  try {
    // Fetch response from the API
    const response = await UrlFetchApp.fetch(API_URL, options);
    // Parse the JSON response
    const responseData = JSON.parse(response.getContentText());
    // Log the raw data for debugging purposes
    Logger.log(responseData);
    // Extract the timezone offset from the response
    const content = JSON.parse(responseData["candidates"][0]["content"]["parts"][0]["text"]);
    // Log the extracted timezone offset for debugging purposes
    Logger.log(content.timezone_offset_hours);

    return content.timezone_offset_hours;
  } catch (e) {
    // Log the error message
    Logger.log('Error: ' + e.message);
    return 'Sorry, an error occurred while processing your request.';
  }
}

/**
 * Test function to log the timezone offset for "America/New_York".
 */
async function test2() {
  Logger.log(await callGeminiGetTimeZoneOffset("America/New_York"));
}
