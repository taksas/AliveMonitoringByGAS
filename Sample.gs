function myFunction() {

  // SHEETNAME名のシートを取得
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('SHEETNAME');
  

  // 3列目にURLがある限り繰り返す（URLは2行目から）
  for (var i = 2; i <= sheet.getLastRow(); i++) {
    var url = sheet.getRange(i, 3).getValue();

  // 出力用に日時を取得
    var dateTime = Utilities.formatDate(new Date(), 'JST', 'MM/dd HH:mm:ss');

    var before = new Date();  // HTTP接続前の時刻
    var status_code = url_fetch(url);  // HTTPステータスコードを取ってくる関数を呼び出し
    var after  = new Date();  // HTTP処理完了後の時刻

    var responseTime = after - before;  // HTTP処理にかかった時間を算出

    
    if (status_code === 200) {
      // 正常時
      Logger.log('"%s": "%s"', url, status_code);
      sheet.getRange(i, 4).setValue("OK");
      sheet.getRange(i, 4).setBackground('Green');
      sheet.getRange(i, 5).setFontWeight('normal');

      // 応答にかかった時間毎に文字色、背景などを変える
      if (responseTime > 6500) {
        sheet.getRange(i, 6).setBackground('orangered');
        sheet.getRange(i, 4).setValue("高負荷");
        sheet.getRange(i, 4).setBackground('orangered');
      } else if (responseTime > 5500){
        sheet.getRange(i, 6).setBackground('tomato');
        sheet.getRange(i, 4).setValue("負荷");
        sheet.getRange(i, 4).setBackground('tomato');
    　} else if (responseTime > 4500){
      　sheet.getRange(i, 6).setBackground('goldenrod');
      } else if (responseTime > 3500){
      　sheet.getRange(i, 6).setBackground('gold');
      } else if (responseTime > 2500){
      　sheet.getRange(i, 6).setBackground('khaki');
    　} else {
     　 sheet.getRange(i, 6).setBackground('white');
    　}

      
    } else {
      // 異常時
      Logger.log('"%s": "%s"', url, status_code);
      sheet.getRange(i, 6).setBackground('white');
      sheet.getRange(i, 4).setValue("NG");
      sheet.getRange(i, 4).setBackground('Red');
      sheet.getRange(i, 5).setFontWeight('bold');
      
    }
    

    sheet.getRange(i, 5).setValue(status_code);
    sheet.getRange(i, 6).setValue(responseTime + " ms");
    sheet.getRange(i, 7).setValue(dateTime);
   
  
    



    // 0.5秒スリープ
    Utilities.sleep(500);
  }
}

// HTTPステータスコードを取ってくる関数
function url_fetch(URL) {

  var response;
  try {
    var response = UrlFetchApp.fetch(URL, {
        muteHttpExceptions: true  // 200以外のコードでエラーを吐かずにコードを返す
    });
  } catch (e) {
    // 謎エラー対応用
    return;
  }
    

    return (response.getResponseCode() );

}
