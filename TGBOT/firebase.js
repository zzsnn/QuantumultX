//thanks to CenBomin
var firebaseUrl = '**************************';
var secret = '************************************';
var base = FirebaseApp.getDatabaseByUrl(firebaseUrl, secret);
var token = '******************************************';

// firebase set
function setData(key, value) {
  base.setData(key, value);
}

// firebase update
function updateData(key, value) {
  base.updateData(key, value);
}

// firebase push
function pushData(key, value) {
  base.pushData(key, value);
}

// firebase get data
function getData(target) {
  target = target || null;
  if(target !== null) {
    return base.getData(target);
  }
  else {
    return base.getData();
  }
}
