new Vue({
    el: '#inputPwd',
    data: {
        clearDbPwd:''
    },
    methods: {
        clearDatabase() {
            this.$http.post(DEL_COL_JSON_URL, {
                pwd: this.clearDbPwd
            }, {
                    emulateJSON: true
                }).then(function (res) {
                    if (res.body.status == 1) {
                        alert("数据库清除成功!");
                        jsonList.refreshJsonList();//刷新数据
                    } else {
                        alert(res.body.msg);
                    }
                });
        },
    }
});
new Vue({
    el: '.container',
    data: {
        keyInfo: "testStr",
        url: ROOT_URL,
        jsonInfo: '{"data":"Json串测试"}'
    },
    methods: {
        clearInfo() {
            this.keyInfo = '';
            this.jsonInfo = '';
        },
        submitJsonInfo: function (ev) {
            if (this.keyInfo.length == 0 || this.jsonInfo.length == 0) {
                alert("内容不能为空!");
                return;
            }
            this.$http.post(POST_JSON_URL, {
                key: this.keyInfo,
                jsonStr: this.jsonInfo,
                headers: {
                    //'Content-Type': 'application/json;charset=UTF-8'
                    //'Content-Type' :'application/x-www-form-urlencoded;charset=UTF-8'
                }
            }, {
                    emulateJSON: true
                }).then(function (res) {
                    if (res.body.status == -1) {
                        alert(res.body.msg);
                    } else {
                        this.url = GET_JSON_TO_USER_URL + this.keyInfo;
                        jsonList.refreshJsonList();//刷新数据
                    }

                }, function (err) {
                    alert("添加失败!" + JSON.stringify(err));
                });
        },

    }
});

var jsonList = new Vue({
    el: '#jsonList',
    data: {
        jsonList:[]
    },
    methods: {
        refreshJsonList () {
            //alert("执行refreshJsonList方法");

            this.$http.get(GET_JSON + "")
            .then( function (res) {
                this.jsonList = res.body;
            });
        },
    },
    mounted: function() {
        this.refreshJsonList();
    }
});