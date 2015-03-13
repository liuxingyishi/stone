/**
 * Created by lenovo on 2015/2/12.
 */
var settings = require('../settings');
var logger = require('./logger').logger;
var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var myDb = function(){
    this.mongo = new Db(settings.settings.db, new Server(settings.settings.host, Connection.DEFAULT_PORT,{auto_reconnect: true}, {}),{safe: true});
    //打开数据库
    this.mongo.open(function(err,db){
        if(err) {
            logger.error(err);
        } else{
            logger.info("db open...");
            //验证用户
/*            db.authenticate(settings.settings.dbUser,settings.settings.dbPwd,function(err,result){
                if(err) {
                    logger.error(err);
                }else {
                    logger.info("db authenticated..."+result);
                }
            });*/
        }
    });
}

module.exports = new myDb().mongo;