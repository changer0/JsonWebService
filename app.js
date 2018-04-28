var jsonDb = require('./jsonDb');
var express = require('express');
var app = express();
var MongoClient = require('mongodb').MongoClient;
var bodyParser = require('body-parser');

// 创建 application/x-www-form-urlencoded 编码解析
var urlencodedParser = bodyParser.urlencoded({ extended: false })

var url = "mongodb://127.0.0.1:27017/jsonDb";
var collectionsName = "jsonCol";
app.use(express.static('html'));

var msg = {
	status: 0
};

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
app.get('/getJson/', function (req, res) {
	console.log("getJson 请求:");
	
	var key = req.query.key;

	var jsonObj = {
		key: key
	};
	console.log("key: " + key);
	jsonDb("find", collectionsName, jsonObj, (result) => {
		console.log("请求到的result有" + result.length + "条数据!");
		var resStr;
		if (result.length > 0) {
			console.log("result[0].jsonStr : " + JSON.stringify(result));
			resStr = result[result.length - 1].jsonStr;
		} else {
			resStr = "no msg";
		}
		res.jsonp(resStr);
	});
})
//post请求
app.post('/postJson/', urlencodedParser, (req, res) => {
	console.log("key => " + req.body.key);
	console.log("json => " + req.body.jsonStr);
	console.log("body => " + JSON.stringify(req.body));
	var jsonObj = {
		key: req.body.key
	};

	jsonDb("find", collectionsName, jsonObj, (result) => {

		try {
			jsonObj.jsonStr = JSON.parse(req.body.jsonStr);
		} catch (error) {
			msg.status = -1;
			msg.msg = "JSON格式有误";
			res.send(msg);
			console.log("msg: " + JSON.stringify(msg));
			return;
		}


		console.log("请求到的result有" + result.length + "调数据!");
		console.log(JSON.stringify(result[0]));
		if (result.length > 0) {
			var updateObj = [
				result[0],
				{ $set: jsonObj }//这个地方非常关键!!!
			];
			jsonDb("update", collectionsName, updateObj, (result) => {
				msg.status = 2;
				msg.obj = result;
				res.jsonp(msg);
			});

		} else {
			jsonDb("add", collectionsName, jsonObj, (result) => {
				msg.status = 1;
				msg.obj = result;
				res.jsonp(msg);
			});
		}
	});

});

app.post('/delCol/', urlencodedParser, (req, res) => {
	console.log("pwd => " + req.body.pwd);
	if(req.body.pwd == '1210') {
		jsonDb('deleteCol', collectionsName, {}, (err, delOk) => {
			if(err) {
				if(err.message == 'ns not found') {
					msg.status = -1;
					msg.msg = "已经删除过数据库!";
				}
			} else {
				if(delOk) {
					msg.status = 1;
				} else {
					msg.status = -1;
					msg.msg = err.message;
				}
			}
			res.send(msg);
		});
	} else {
		msg.status = -1;
		msg.msg = '密码不正确';
		res.send(msg);
	}

	
});



var server = app.listen(8765, function () {

	var host = server.address().address
	var port = server.address().port

	console.log("应用实例，访问地址为 http://%s:%s", host, port)

})