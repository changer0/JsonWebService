const isDebug = true;

const ROOT_URL = getRootUrl();
const GET_JSON_TO_USER_URL = ROOT_URL + 'getJsonToUser?key=';
const POST_JSON_URL = ROOT_URL + 'postJson';
const DEL_COL_JSON_URL = ROOT_URL + 'delCol';
const GET_JSON = ROOT_URL + 'getJson?key=';

function getRootUrl(){
    var temp = '';
    if(isDebug) {
        temp = 'http://127.0.0.1:8765/';
    } else {
        temp = 'http://211.159.159.113:8765/';
    }
    return temp;
}