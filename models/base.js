/**
 * Created by lenovo on 2015/3/12.
 */
/*var mongodb = require('./db');

*//**
 * 获取id标识
 * @param collection
 * @param callback
 *//*
var getIds = function(collection,callback){
    mongodb.collection('ids', function(err, db) {
        if (err) callback(err);
        else {
            db.findAndModify({
                    "name": collection
                },
                ["name", "asc"], {
                    $inc: {
                        "id": 1
                    }
                },
                {
                    'new': true,
                    'upsert': true
                },
                callback);
        }
    });
};
exports.getIds = getIds;*/
