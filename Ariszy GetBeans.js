var token = '<tgbot token>';
var chat = '';//会话
var userid ='';//userid
var message = '';//message text
var username = '';//username
var beanurl = '';
var base = '';
var cookie = '';
var date = '';
//++++++++++++++++++++++++++++++++++++
async function doPost(e) {
   chat = JSON.parse(e.postData.contents);
   userid = chat.message.from.id;
   message = chat.message.text;
   username = chat.message.from.username;
   beanurl = chat.message.entities[0].url //get bean url
   date = chat.message.date;
   await main()
}
//++++++++++++++++++++++++++++++++++++
function setWebhook() {
  const data = {
    url: `<firebase network url>`
  };

  const option = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(data)
  };

  const result = UrlFetchApp.fetch(`https://api.telegram.org/bot${token}/setWebhook`, option);

  Logger.log(result);
}
//++++++++++++++++++++++++++++++++++++
function msgtouser(userid,text) {
  const data = {
    chat_id: userid,
    text: text,
    parse_mode: 'HTML'
  };
  const option = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(data)
  };
  return UrlFetchApp.fetch(`https://api.telegram.org/bot${token}/sendMessage`, option);
}
//+++++++++++++++++++++++++++++++++++++
//+++++++++++++++++++++++++++++++++++++
function firebase(){
 const firebaseUrl = '<firebase url>/';
  const secret = '<firebase secret>';
  base = FirebaseApp.getDatabaseByUrl(firebaseUrl, secret);
}
//+++++++++++++++++++++++++++++++++++++
function sleep(time){
	var start = new Date().getTime();
  while(new Date().getTime() < start + time);
}
//++++++++++++++++++++++++++++++++++++
function dealck(){
  cookie = message.split("/submitjd ")[1].split("@")[1]
  return cookie;
}
//+++++++++++++++++++++++++++++++++++++
async function main(){
  if(message.indexOf("/helpme") > -1){
    msgtouser(userid,`本机器人是基于步道场频道开发的，提交用户的cookie至机器人数据库，转发步道场链接给机器人，实现自动关注领取！（cookie上传到Ariszy的firebase数据库，介意者请不要使用，不喜勿喷）\n 转发一定带有”一键领取“字样和隐藏链接，不要只转发文本 \n 本机器人旨在简化使用，方便自己你我他 \n\n 提交cookie格式为：/submitjd cookie@pt_key=**************;pt_pin=************; \n iOS用户请使用NobyDa大佬获取cookie脚本获取，其他设备请自行获取 \n 暂不支持多账号，因为使用免费书库和Google Apps Script机器人处理速度有限，后期会开放源代码，用户可以自己搭建 \n\n 谢谢大家使用`)
  };
   if(message.indexOf("/submitjd ") > -1){
    let fick = await dealck()
    if(fick){
      var dataToImport = {
          Date: date,
          Cookie: fick,
          Name: username,
          Uid: userid,
      };
      setData(`${userid}`, dataToImport);
      msgtouser(userid,`成功提交cookie!!!`);
    }else{
      msgtouser(userid,`提交ck失败，请仔细阅读规则后再次尝试~\n 提交格式为/submitjd cookie@pt_key=************;pt_pin=**********;`)
    }
  }else if(message.indexOf("一键领取") > -1){//判断方式为一键领取按钮，可更换，此按钮不科学
    await getbean(userid)
  }else{
    msgtouser(userid,'你要请我喝阔乐吗？'+"https://raw.githubusercontent.com/Ariszy/Private-Script/master/img/thanks.JPG")
  }
}
//+++++++++++++++++++++++++++++++++++++
async function fetchck(userid){
  await firebase();
  const getactivityname = base.getData(userid);
  const obj = getactivityname;
  let cookieArr = new Array()
  for(var i in obj){
    cookieArr.push(obj[i])
  }
  Logger.log(cookieArr[0])
  return cookieArr[0]
}
//+++++++++++++++++++++++++++++++++++++
async function getbean(userid){
  let fock = await fetchck(userid);
  const option = {
    method:'get',
    async: true,
    crossDomain: true,
    headers:{"Accept": "*/*",
    "Connection": "close",
    "Accept-Encoding": "gzip,deflate,br",
    "method": 'get',
    "Cookie": `${fock}`,
   // "Host": 'api.m.jd.com',
    'User-Agent': 'jdapp;iPhone;9.4.8;14.3;809409cbd5bb8a0fa8fff41378c1afe91b8075ad;network/wifi;ADID/201EDE7F-5111-49E8-9F0D-CCF9677CD6FE;supportApplePay/0;hasUPPay/0;hasOCPay/0;model/iPhone13,4;addressid/;supportBestPay/0;appBuild/167629;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1',
    "Accept-Language": "zh-cn"
  }
  }
 // Logger.log(option)
 // Logger.log(beanurl)
  let results = UrlFetchApp.fetch(beanurl,option);
  let result = JSON.parse(results);
  let notify;
  Logger.log(results)
  if(results == `{"code":"1", "message":"用户pin不能为空！"}`){
    //Logger.log("cookie已经过期请重新上传")
    notify = "cookie已经过期请重新上传"
  }else{
    if(result.result.alreadyReceivedGifts){
    notify = result.result.giftDesc+"\n成功获得"+result.result.alreadyReceivedGifts[0].redWord+result.result.alreadyReceivedGifts[0].rearWord
    }else{
      notify = result.result.followDesc+"\n请先取消关注"
    }
  }
  //Logger.log(result)
  //Logger.log(notify)
  msgtouser(userid,`${notify}`)
}
//测试使用
async function test(){
  // beanurl = `https://api.m.jd.com/client.action?functionId=drawShopGift&body=%7B%22follow%22%3A%200%2C%20%22shopId%22%3A%20%2258661%22%2C%20%22activityId%22%3A%20%2210367051%22%2C%20%22sourceRpc%22%3A%20%22shop_app_home_window%22%2C%20%22venderId%22%3A%20%2262915%22%7D&uuid=eddb7f37a05e4eeab10dac85526b5a3b&client=apple&clientVersion=9.4.0&st=1621322827000&sv=102&sign=f1352545a5dcd81087ce03111a0a945b`
   userid = "<tg id>"
  //  await getbean("1051827764")
   message = "/submitjd cookie@"
   if(message.indexOf("/submitjd ") > -1){
 await main()
 Logger.log(cookie)
  }
}
