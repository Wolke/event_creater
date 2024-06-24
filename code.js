// code.js
// Example usage for ICS format
async function callApiForICS(text) {
  var apiKey = PropertiesService.getScriptProperties().getProperty("GEMINI_API_KEY");
  const systemInstruction = "response in ICS format";
  var response = await callApi(apiKey, text, systemInstruction);
 
  return response;
}

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

// Example usage with WORKSPACE_TOOLS
async function callApiWithWorkspaceTools(text) {
  var CalendarID = PropertiesService.getScriptProperties().getProperty("CalendarID");
  var apiKey = PropertiesService.getScriptProperties().getProperty("GEMINI_API_KEY");
  const systemInstruction = "use tools";
  
  var tool_use = await callApi(apiKey, text, systemInstruction,WORKSPACE_TOOLS);
  if (tool_use['name'] === "setupEvent" && tool_use['args']['time'] !== "unknown" ) {
    const { timezone, title, time, startTime, endTime, location, description } = tool_use['args'];

    const eventLink = setupEvent(timezone, title, startTime, endTime, location, description, CalendarID);
   
    return eventLink
  }
  return "fail"
}

async function demo(){
let ics = await callApiForICS(`
｜2024【尋．蜜】員林小旅行｜ 百果蜜餞走讀、蜜餞體驗工作坊 預約報名
◾日期｜6月30日 星期日

◾時段｜

走讀：10:00 - 13:00

工作坊：14:00 - 16:00

◾報到時間｜ 09:30 - 10:00


◾走讀開始｜ 10:00
探索蜜餞老店秘辛
百果山文史與故事
認識百果山守護神－廣天宮三恩主
特色蜜餞冰品享用
◾原地解散｜ 13:00


◾報到地點｜

走讀集合地點｜百果山停車場( 彰化縣員林市出水巷15-30號  )
`);


let link = await callApiWithWorkspaceTools(ics)

Logger.log(link)

}
