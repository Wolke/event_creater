// gemini.js

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
