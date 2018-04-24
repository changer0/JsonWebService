var mongo = require("mongodb");//@2.2.11
var MongoClient = mongo.MongoClient;
//var assert = require('assert');
var port = "27017";
var url = "mongodb://127.0.0.1:27017/jsonDb";


//add一条数据
var add = function (db, collections, selector, fn) {
  console.log("执行了add方法");
  var collection = db.collection(collections);
  collection.insertMany([selector], function (err, result) {
    if (err) throw err;
    fn(result);
  });
};
//delete
var deletes = function (db, collections, selector, fn) {
  var collection = db.collection(collections);
  collection.deleteOne(selector, function (err, result) {
    if (err) throw err;
    fn(result);
    //db.close();
  });
};
//find
var find = function (db, collections, selector, fn) {
  console.log("执行了find方法");
  var collection = db.collection(collections);
  collection.find(selector).toArray(function (err, docs) {
    try {
      if (err) throw err;
    } catch (e) {
      console.log(e);
      docs = [];
    }

    fn(docs);
  });

}
// //（权限控制） -- 暂时没有用
// MongoClient.connect(Urls, function (err, db) {
//   find(db, "powers", null, function (d) {
//     console.log("123s");
//     console.log(d.length);
//   });
// });

//update
var updates = function (db, collections, selector, fn) {
  var collection = db.collection(collections);
  collection.updateOne(selector[0], selector[1], function (err, result) {
    if (err) throw err;
    fn(result);
  });

}

//方法都赋值到操作对象上，便于调用
var methodType = {
  // login: find,
  // show: find,
  add: add,
  // getpower: find,
  update: updates,
  delete: deletes,
  // updatepass: updates,
  // adduser: add,
  // usershow: find,
  // getcategory: find,
  // getcourse: find,
  find: find
  // state: find,
  // top: find,
  // AddDirectory: find,
  // updateDirectory: updates,
  // deleteDirectory: deletes,
  // showlist: find,
  // showdir: find
};
//主逻辑
module.exports = function (action,collections, selector, callback) {
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("jsonDb");
    //methodType[req.query.action](db,collections,selector,fn);
    methodType[action](dbo, collections, selector, callback);
    //db.close();
  });

};