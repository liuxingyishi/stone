/**
 * Created by lenovo on 2015/2/13.
 */
var User = require('../models/user');
var crypto = require('crypto');
var config = require('../settings').config;


var index = function(req,res,next){
    res.render('login',{title:'用户登录',user:req.session.user,layout:'./layout/layout.ejs'});
}

var doLogin = function(req,res,next){
    var md5 = crypto.createHash('md5');
    var password = md5.update(req.body.password).digest('base64');
    var newUser = new User({
        name: req.body.username,
        password: password
    });
    User.get({name:newUser.name},function(err,user){
        if(!user){
            req.flash('error','用户不存在');
            return res.redirect('/login');
        }
        if(user.password != password){
            req.flash('error','用户名或密码不正确');
            return res.redirect('/login');
        }
        delete user.password;
        user.avatar = "/" + config.avatarDir + '/{type}/' + user.avatar + '.png';
        req.session.user = user;
        res.redirect('/home');
    });
}

var doLogout = function(req,res,next){
    req.session.user = null;
    req.flash('success', '登出成功');
    res.redirect('/');
}

exports.index = index;
exports.doLogin = doLogin;
exports.doLogout = doLogout;