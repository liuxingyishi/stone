/**
 * Created by lenovo on 2015/3/12.
 */
var mongodb = require('./db');
var logger = require('./logger').logger;

/**
 * 获取id标识
 * @param collection
 * @param callback
 */
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

/**
 * 插入文档
 * @param collection
 * @param object
 * @param callback
 */
var insert = function(collection,object,callback){
    mongodb.collection(collection,function(err,db){
        if(err){
            logger.error('[db]',err);
            callback(err);
        }else{
            db.insert(object, {safe: true}, function(err, obj) {
                logger.info('[db]','insert: '+collection);
                if(err){
                    logger.error('[db]',err);
                    callback(err, obj);
                }else {
                    callback(err, obj);
                }
            });
        }
    });
};

/**
 * 查询集合内文档
 * @param collection
 * @param param
 * @param callback
 */
var getObj = function(collection,param, callback) {
    mongodb.collection(collection, function(err, db) {
        if (err) {
            logger.error('[db]',err);
            return callback(err);
        }
        db.findOne(param, function(err, doc) {
            logger.info('[db]','find: '+collection);
            if(err){
                logger.error('[db]',err);
            }
            callback(err, doc);
        });
    });
};

/**
 * 更新集合
 * @param collection
 * @param params
 * @param upsets
 * @param callback
 */
var update = function update(collection,params,upsets,callback){
    mongodb.collection(collection, function(err, db) {
        if (err) {
            logger.error('[db]',err);
            return callback(err);
        }
        var options = {
            w:1
        };
        db.update(params,upsets, options, function(err, data) {
            logger.info('[db]','update: '+collection);
            if(err){
                logger.error('[db]',err);
                callback(err);
            }else callback(null, data);
        });
    });
};

/**
 * 删除集合数据
 * @param collection
 * @param params
 * @param callback
 */
var del = function(collection,params,callback){
    mongodb.collection(collection, function(err, db) {
        if (err) {
            logger.error('[db]',err);
            return callback(err);
        }
        db.remove(params,{safe: true},function(err, numberOfRemovedDocs) {
            logger.info('[db]','delete: '+collection);
                if(err){
                    logger.error('[db]',err);
                    callback(err);
                } else callback(null, numberOfRemovedDocs);
            });
    });
};

exports.getIds = getIds;
exports.insert = insert;
exports.getObj = getObj;
exports.update = update;
exports.del = del;
