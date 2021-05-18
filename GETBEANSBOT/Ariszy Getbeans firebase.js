var firebaseUrl = '<firebase url>/';
var secret = '<firebase secret>';
var jdbase = FirebaseApp.getDatabaseByUrl(firebaseUrl, secret);
var token = '<tgbot token>';

// firebase set
function setData(key, value) {
  jdbase.setData(key, value);
}

// firebase update
function updateData(key, value) {
  jdbase.updateData(key, value);
}

// firebase push
function pushData(key, value) {
  jdbase.pushData(key, value);
}

// firebase get data
function getData(target) {
  target = target || null;
  if(target !== null) {
    return jdbase.getData(target);
  }
  else {
    return jdbase.getData();
  }
}
