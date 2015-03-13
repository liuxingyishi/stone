/**
 * 支出模块 fee
 * Created by lenovo on 2015/2/25.
 */
var mongodb = require('./db');
function Fee(fee){
    //this.id = parseInt(fee.id);
    this.year = parseInt(fee.date.split('-')[0]);
    this.month = parseInt(fee.date.split('-')[1]);
    this.date = fee.date;
    this.type = fee.type;
    this.amount = parseFloat(fee.amount);
    this.remark = fee.remark;
    this.createUser = fee.createUser;
    this.createTime = fee.createTime;
}
module.exports = Fee;
Fee.prototype.save = function(callback){
    var fee = {
        //id:this.id,
        year:this.year,
        month:this.month,
        date:this.date,
        type:this.type,
        amount:this.amount,
        remark:this.remark,
        createUser:this.createUser,
        createTime:this.createTime
    };
    mongodb.collection('fees', function(err, collection) {
        if (err) {
            return callback(err);
        }
        // 写入文档
        collection.insert(fee, {safe: true}, function(err, fee) {
            callback(err, fee);
        });
    });
};

Fee.findDetailsByParams = function(params,pageIndex,pageSize,callback){
    mongodb.collection('fees', function (err, collection) {
        if (err) {
            return callback(err);
        }
        collection.find(params).count(function (err, count) {
            if (err) {
                return callback(err);
            }
            if (count > 0) {
                collection.find(params).sort({
                        date: -1
                }).skip((pageIndex - 1) * pageSize).limit(pageSize).toArray(function (err, data) {
                    if (err){
                        callback(err);
                    }
                    else {
                        var result = {};
                        result.data = data;
                        result.count = count;
                        callback(null, result);
                    }
                });
            } else {
                var result = {};
                result.data = [];
                result.count = count;
                callback(null, result);
            }
        });
    });
};
Fee.feeCountByParams = function(conditions,g_col,t_col,callback){
    mongodb.collection('fees', function (err, collection) {
        if (err) {
            return callback(err);
        }
        collection.aggregate([
            { $match : conditions},
            { $group : { _id : g_col, count:{$sum:1}, total : {$sum : t_col} }}
        ],function(err,data){
            if (err){
                callback(err);
            }
            callback(err,data);
        });
    });
};
