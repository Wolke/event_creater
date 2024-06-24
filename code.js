

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

  Logger.log(ics)
  let link = await callApiWithWorkspaceTools(ics)

  Logger.log(link)

}
