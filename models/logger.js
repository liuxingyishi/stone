/**
 * log
 * 日志模块
 * related to @winston
 * Created by lenovo on 2015/3/5.
 */
var winston = require('winston');
var now = require('./util').getNowTime();

exports.logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({colorize:true}),
        new (winston.transports.File)({
            filename: '../logs/stone.all.log',
            json:false,
            timestamp: function() {
                return now;
            }
        })
        /*, //daily 日志
        new (winston.transports.DailyRotateFile)({
            filename:'../logs/stone.daily.log',
            json:false
        })*/
    ],
    exceptionHandlers: [
        new winston.transports.File({
            filename: '../logs/stone.error.log',
            json:false,
            timestamp: function() {
                return now;
            }
        })
    ],
    exitOnError:false
});
