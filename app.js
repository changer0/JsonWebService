var jsonDb = require('./jsonDb');
var express = require('express');
var app = express();
var MongoClient = require('mongodb').MongoClient;
var bodyParser = require('body-parser');

// 创建 application/x-www-form-urlencoded 编码解析
var urlencodedParser = bodyParser.urlencoded({ extended: false })

var url = "mongodb://127.0.0.1:27017/jsonDb";
var collectionsName = "jsonCol";

app.get('/test/', (req, res) => {
	var jsonObj = {
		"key": "test1",
		jsonStr: "{\"test\": \"哈哈哈\"}"
	};
	// jsonDb("add", collectionsName, jsonObj, (result) => {
	// 	console.log("提交成功");
	// });

	jsonDb("find", collectionsName, jsonObj, (result) => {
		console.log("数据: ");
		console.log("result.length: " + result.length);
		console.log("result: " + JSON.stringify(result));
		res.send(result[0].jsonStr);
	});


});

//  主页输出 "Hello World"
app.get('/', function (req, res) {
	console.log("主页 GET 请求:");
	// var myobj = { name: "这是测试数据XXXXXXXXXXXXX"};
	// jsonDb("delete", collectionsName, myobj, (result) => {
	// 	console.log("删除完成");
	// });
	// jsonDb("find", collectionsName, {}, (result) => {
	// 	res.send(JSON.stringify(result));
	// });
	//res.send(req.query.action);
	//console.log(req.get());
	var resStr = '';
	var key = req.query.key;

	var jsonObj = {
		key: key
	};
	console.log("key: " + key);
	jsonDb("find", collectionsName, jsonObj, (result) => {
		console.log("请求到的result有" + result.length + "条数据!");
		if (result.length > 0) {
			console.log("result[0].jsonStr : " + JSON.stringify(result));
			resStr = result[result.length - 1].jsonStr;
		} else {
			resStr = "数据为空";
		}
		res.send(resStr);
	});
})
//post请求
app.post('/', urlencodedParser, (req, res) => {
	console.log("key => " + req.body.key);
	console.log("json => " + req.body.jsonStr);
	var jsonObj = {
		key: req.body.key
	};

	jsonDb("find", collectionsName, jsonObj, (result) => {

		jsonObj.jsonStr = req.body.jsonStr;

		console.log("请求到的result有" + result.length + "调数据!");
		console.log(JSON.stringify(result[0]));
		if (result.length > 0) {
			var updateObj = [
				result[0],
				{ $set: jsonObj }
			];
			jsonDb("update", collectionsName, updateObj, (result) => {
				res.send("更新成功!!");
			});

		} else {
			jsonDb("add", collectionsName, jsonObj, (result) => {
				res.send("提交成功!!");
			});
		}
	});

});




var server = app.listen(8765, function () {

	var host = server.address().address
	var port = server.address().port

	console.log("应用实例，访问地址为 http://%s:%s", host, port)

})