/**
 * Created by lenovo on 2015/3/5.
 */
var crypto = require('crypto');
var User = require('../models/user');
var config = require('../settings').config;
var uuid = require('uuid');
var fs = require('fs');
var logger = require('../models/logger').logger;
var index = function(req,res,next){
    res.render('set',{
        title:'用户设置',
        user:req.session.user,
        layout:'./layout/layout.ejs'
    });
};

var doResetPwd = function(req,res,next){
    var password = crypto.createHash('md5').update(req.body.oldpwd).digest('base64');
    User.get({name:req.session.user.name},function(err,user){
        if(!user){
            req.flash('error','用户不存在');
            return res.redirect('/login');
        }
        if(user.password != password){
            req.flash('error','密码不正确');
            return res.redirect('/');
        }
        var nPassword = crypto.createHash('md5').update(req.body.newpwd).digest('base64');
        var newUser = {
            name: req.session.user.name,
            password: nPassword
        };
        User.update(newUser,function(err,data){
            if(err){
                req.flash('error','系统错误');
                return res.redirect('/500');
            }
            req.flash('success','修改密码成功');
            res.redirect('/home');
        });
    });
};

var setAvatar = function(req,res,next){
    var uid = uuid.v1();
    if(!fs.existsSync('public/'+config.avatarDir + '/big/')){
        fs.mkdirSync('public/'+config.avatarDir + '/big/');
    }
    if(!fs.existsSync('public/'+config.avatarDir + '/mid/')){
        fs.mkdirSync('public/'+config.avatarDir + '/mid/');
    }
    if(!fs.existsSync('public/'+config.avatarDir + '/small/')){
        fs.mkdirSync('public/'+config.avatarDir + '/small/');
    }
    var buf1 = new Buffer(req.body.big.replace(/^data:image\/\w+;base64,/, ''), 'base64');
    fs.writeFileSync('public/'+config.avatarDir + '/big/' + uid + '.png', buf1);
    var buf2 = new Buffer(req.body.mid.replace(/^data:image\/\w+;base64,/, ''), 'base64');
    fs.writeFileSync('public/'+config.avatarDir + '/mid/' + uid + '.png', buf2);
    var buf3 = new Buffer(req.body.small.replace(/^data:image\/\w+;base64,/, ''), 'base64');
    fs.writeFileSync('public/'+config.avatarDir + '/small/' + uid + '.png', buf3);

    var user = {
        name:req.session.user.name,
        avatar:uid
    };
    User.update(user,function(err,data){
        if(err){
            logger.log('error','set avatar error',err);
            // 删除文件
            fs.unlink('public/'+config.avatarDir + '/big/' + uid + '.png', function(){
                logger.log('info','删除public/'+config.avatarDir + '/big/' + uid + '.png');
            });
            fs.unlink('public/'+config.avatarDir + '/mid/' + uid + '.png', function(){
                logger.log('info','删除public/'+config.avatarDir + '/mid/' + uid + '.png');
            });
            fs.unlink('public/'+config.avatarDir + '/small/' + uid + '.png', function(){
                logger.log('info','删除public/'+config.avatarDir + '/small/' + uid + '.png');
            });
            res.json({reCode:'1',reStr:'设置头像失败'});
        }
        req.session.user.avatar = "/" + config.avatarDir + '/{type}/' + uid + '.png';
        res.json({reCode:'100',reStr:'设置头像成功'});
    });
}

exports.index = index;
exports.doResetPwd = doResetPwd;
exports.setAvatar = setAvatar;
