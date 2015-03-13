/**
 * Created by lenovo on 2015/2/12.
 */
var crypto =require('crypto');
var User = require('../models/user');

var index = function(req,res){
    res.render('reg', { title: '用户注册',user:req.session.user,layout:'./layout/layout.ejs' });
};

var validUser = function(req,res){
    var name = req.body.name;
    User.get(name, function(err, user) {
        if (user){
            res.json({result:1});
        }else{
            res.json({result:0});
        }
    });
};

var doReg = function(req,res){
    var newUser = new User({
        name: req.body.username,
        email:req.body.email,
        avatar:'default'
    });
    //检查用户名是否已经存在
    User.get(newUser.name, function(err, user) {
        if (user){
            req.flash('error', '用户名已存在');
            return res.redirect('/reg');
        }
        //如果不存在则新增用户
        //生成口令的散列值
        var md5 = crypto.createHash('md5');
        var password = md5.update(req.body.password).digest('base64');
        newUser.password = password;
        User.getIds(function(err,obj){
            if(err){
                req.flash('error', '系统错误');
                return res.redirect('/500');
            }
            newUser.id = obj.id;
            newUser.save(function (err) {
                if (err) {
                    req.flash('error', JSON.stringify(err));
                    return res.redirect('/reg');
                }
                delete newUser.password;
                newUser.avatar = config.avatarDir + '/{type}/' + user.avatar + '.png';
                req.session.user = newUser;
                req.flash('success', '注册成功');
                res.redirect('/home');
            });
        });
    });
}

exports.index = index;
exports.doReg = doReg;
exports.validUser = validUser;