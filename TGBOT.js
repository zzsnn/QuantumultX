//declare a variable
var token = 'your tgbot token';
var chat = '';
var id ='';
var message = '';
var chatid = '';
var username = '';
var usercode = '';
var activityname = '';
//dopost is method of getting data from tgbot and assignment
//++++++++++++++++++++++++++++++++++++
async function doPost(e) {
   chat = JSON.parse(e.postData.contents);
   id = chat.message.from.id;
   message = chat.message.text;
   chatid = chat.message.chat.id;
   date = chat.message.date;
   username = chat.message.from.username;
   await working()
}
//deal data, set up special commands and to deal
//make sure your message contains the keywords, then use it
//++++++++++++++++++++++++++++++++++++++
//   /submitactivity secret@1234
function deal(message){
  usercode = message.split("/submitactivitycodes ")[1].split("@")[1]//1234
  activityname = message.split("/submitactivitycodes ")[1].split("@")[0]//secret
}
//TGBOT real function, reply to the special commands and deal with messages
//thanks to CenBomin
//+++++++++++++++++++++++++++++++++++++++
async function working(){
  if(chatid == `special group id`){
     if (message.indexOf("/test") > -1) { 
       msg(chatid,`@${username}机器人可以交互工作!`)
  };
     if (message.indexOf("/selectcount") > -1) {
       msg(chatid,`【每日统计】\n\n 我的网红店 - wdwhd :当前人数 `+stats("secret"))
  };
     if (message.indexOf("/start") > -1) {
       msg(chatid,`机器人正常使用，请放心提交！`)
  };
     if (message.indexOf("/help") > -1) {
       msg(chatid,`机器人提交验证方式为群组提交，命令为：\n /test:用于测试机器人交互\n /start:用于激活机器人使用\n /submitactivitycodes:用于提交验证码，格式为：/submitactivitycodes 软件名称@用户验证码\n`)
  };
     if(message.indexOf("/submitactivitycodes@zy_validation_bot") > -1){
        msg(chatid,`@${username} 本次验证码${usercode}提交失败!!!\n提交格式:/submitactivitycodes {软件名}@{提交验证码}`);
     };
     if (message.indexOf("/submitactivitycodes") > -1) {
      await deal(message);
       //make sure secrets effectively
      if(activityname == "secret" && !isNaN(usercode) && JSON.stringify(usercode).length >= 4){
      Logger.log("数据审核成功")
      var dataToImport = {
        Date: date,
        Uid: id,
        Name: username,
        Code: usercode,
    };
      setData(`${activityname}/${id}/${usercode}`, dataToImport);
        if(activityname && activityname == "secret"){
          msg(chatid,`@${username} 成功提交本次验证码${usercode}:\n现在已储存至临时数据库,等待10S后上传！`);
          await sleep(10000)
          await doUpdateSecrets();
        }else{
          msg(chatid,`@${username} 本次验证码${usercode}提交失败!!!\n提交格式:/submitactivitycodes {软件名}@{提交验证码}`);
    };
     }else{
       msg(chatid,`@${username} 本次验证码${usercode}提交失败!!!\n注意 wdwhd 验证码为大于4位的数字，请核对`)
       return false;
     }
     };
}else{
      if(message.indexOf("/submitactivitycodes") > -1){
        msgtouser(id,`本次验证码${usercode}提交失败!!!请在群组提交验证`)
      }else if(message.indexOf("/test") > -1){
        msgtouser(id,`Ariszy机器人可以交互工作!`)
      }else if(message.indexOf("/start") > -1){
        msgtouser(id,`机器人为Ariszy用于提交验证码`)
      }else if(message.indexOf("/help") > -1){
        msgtouser(id,`机器人提交验证方式为群组提交，命令为：\n /test:用于测试机器人交互\n /start:用于激活机器人使用\n /submitactivitycodes:用于提交验证码\n 格式为：\n /submitactivitycodes 软件名称@用户验证码\n`)
      }else if (message.indexOf("/selectcount") > -1) {
       msgtouser(id,`【每日统计】\n\n 我的网红店 - wdwhd :当前人数 `+stats("secret"))
  }else{
        msgtouser(id,`我不和你玩\n${message}`)
      }
  };
};
//setup webhook to your tgbot
//++++++++++++++++++++++++++++++++++++
function setWebhook() {
  const data = {
    url: `your GAP network url`
  };

  const option = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(data)
  };

  const result = UrlFetchApp.fetch(`https://api.telegram.org/bot${token}/setWebhook`, option);

  Logger.log(result);
}
//update data to firebase and Git, maybe Git faile, firebase is prepare for data and the function of repeat make sure true
//++++++++++++++++++++++++++++++++++++
async function doUpdateSecrets() {
  // getData('/user/' + id + '/message', message);
  const firebaseUrl = 'https://ariszy-3cf50-default-rtdb.firebaseio.com/';
  const secret = 'y6o1QqPy0Wnqjdc6ycIwJ3KLhHt2b7e572KLDWFk';
  const base = FirebaseApp.getDatabaseByUrl(firebaseUrl, secret);
  const getdata = base.getData("secret");
  const strbase64 = Utilities.base64Encode(JSON.stringify(getdata), Utilities.Charset.UTF_8);
  Logger.log(strbase64);
  const shaoption = {
    method: 'get',
    contentType: 'application/json',
  };
  const getresult = UrlFetchApp.fetch(`https://api.github.com/repos/Ariszy/test/contents/xxx.js`, shaoption);
  const sha = JSON.parse(getresult)["sha"]
  Logger.log(sha);
  const datadata = {
    message: "更新用户数据",
    committer: {
      name: "Ariszy",
      email: "zhiyi8028@gmail.com"
    },
    content: strbase64,
    sha: sha,
  };

  const data = JSON.stringify(datadata)
  Logger.log(typeof data);

  const headers = {
    "Accept": "application/json",
    "Authorization": "your Git token (repo)",
  };

  const method = "PUT";
  const myRequest = {
    method: 'put',
    headers: headers,
    payload: data,
    contentType: 'application/json'
  };

  var myRequest2 = JSON.stringify(myRequest)
  let status = UrlFetchApp.fetch(`https://api.github.com/repos/Ariszy/test/contents/xxx.js`,myRequest);
  if(status) {
  msg(`special group id`,`成功上传用户数据到数据库!!！`);
  }else{
    msg(`special group id`,`@ ${username}上传数据库失败等待10S再一次上传`)
    await sleep(10000)
    await doUpdateSecrets();
  }
}
//reply to user whose msg is private 含参
//++++++++++++++++++++++++++++++++++++
function msgtouser(id,text) {
  const data = {
    chat_id: `user id`,
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
//TGBOT send msg to TGgroup ,含参 
//++++++++++++++++++++++++++++++++++++
function msg(chatid,text) {
  const data = {
    chat_id: chatid,
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
//thanks to CenBomin, select some datas from firebase where keywards = `name`, push data to Array[] zy and using the length of zy
//+++++++++++++++++++++++++++++++++++++
function stats(activityname){
 const firebaseUrl = '******************************';
  const secret = '*************************************';
  const base = FirebaseApp.getDatabaseByUrl(firebaseUrl, secret);
  const getdata = base.getData(activityname);
  const obj = getdata;
  let idArr = new Array();
  for (var id in obj) {
    idArr.push(id)
  }
  //id数组
  // Logger.log(idArr);
  let codeArr = new Array();
  for (let i = 0; i < idArr.length; i++) {
    var objcode = obj[idArr[i]];
    for (var code in objcode) {
      codeArr.push(code)
    }
  }
  //code数组
  // Logger.log(codeArr);
  return codeArr.length
}

//sleep work for waiting 含参函数
//+++++++++++++++++++++++++++++++++++++
function sleep(time){
	var start = new Date().getTime();
  while(new Date().getTime() < start + time);
}

//++++++++++++++++++++++++++++++++++++++++++++++TEST++++++++++++++++++++++++++++++++++++++++++++++++++++
//test send msg to the opreator  含参
//+++++++++++++++++++++++++++++++++++
function msgtome(text) {
  const data = {
    chat_id: `the opreator's TGid`,
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
//test check a little of functions and grammer
//+++++++++++++++++++++++++++++++++++++
async function showmsg(){
   var  x = `/test@zy_validation_bot`
   var w = 1234;
  if (x.indexOf("/test") > -1) { 
    Logger.log(isNaN(x))
    if(!isNaN(123)){
    //await sleep(10000)
    Logger.log("9999999999")
    Logger.log(JSON.stringify(w).length)
    return; //stop
    Logger.log("8888888888")
    }
       //msgtome(`test`)
  };
     if (x.indexOf("/selectcount") > -1) {
       Logger.log("select")
       msgtome(`select`)
  };
     if (x.indexOf("/submitactivitycodes") > -1) {
       await deal(x);
       Logger.log(usercode)
       Logger.log(activityname)
       Logger.log("submit")
       msgtome(`submit`)
}
}
