/**
 * Created by lenovo on 2015/2/26.
 */
/**
 * 取当前时间 返回 yyyy-MM-dd hh:mm:ss
 * @returns {string}
 */
exports.getNowTime = function(){
    var now = new Date();
    var _m = now.getMonth() >= 9?(now.getMonth()+1):('0'+(now.getMonth()+1));
    var _d = now.getDate() >= 10?now.getDate():('0'+now.getDate());
    var _h = now.getHours() >= 10?now.getHours():'0'+now.getHours();
    var _min = now.getMinutes() >= 10?now.getMinutes():'0'+now.getMinutes();
    var _sec = now.getSeconds() >= 10?now.getSeconds():'0'+now.getSeconds();
    return now.getFullYear() + "-"+ _m + "-" + _d + " " + _h + ":" + _min + ":" + _sec;
}