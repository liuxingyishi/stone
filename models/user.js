/**
 * Created by lenovo on 2015/2/12.
 */
var mongodb = require('./db');
function User(user) {
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
    this.password = user.password;
    this.avatar = user.avatar;
};
module.exports = User;
User.prototype.save = function save(callback) {
    // 存入 Mongodb 的文档
    var user = {
        id: this.id,
        name: this.name,
        email:this.email,
        password: this.password,
        avatar: this.avatar
    };
    mongodb.collection('users', function(err, collection) {
        if (err) {
            return callback(err);
        }
        // 为 name 属性添加索引
        //collection.ensureIndex('name', {unique: true});
        // 写入 user 文档
        collection.insert(user, {safe: true}, function(err, user) {
            callback(err, user);
        });
    });
};
User.get = function  get(username, callback) {
    mongodb.collection('users', function(err, collection) {
        if (err) {
            return callback(err);
        }
        // 查找 name 属性为 username 的文档
        collection.findOne({name: username}, function(err, doc) {
            if (doc) {
                // 封装文档为 User 对象
                var user = new User(doc);
                callback(err, user);
            } else {
                callback(err, null);
            }
        });
    });
};
User.update = function update(user,callback){
    mongodb.collection('users', function(err, collection) {
        if (err) {
            return callback(err);
        }
        var options = {
            w:1
        };
        var name = user.name;
        delete user.name;
        collection.update({"name":name}, {$set: user}, options, function(err, data) {
            if (err) callback(err);
            else callback(null, data);
        });
    });
};
User.getIds = function(callback){
    mongodb.collection('ids', function(err, collection) {
        if (err) callback(err);
        else {
            collection.findAndModify({
                    "name": 'users'
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
}