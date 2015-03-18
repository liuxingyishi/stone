/**
 * Created by lenovo on 2015/3/13.
 */
var User = require('../models/user');
var mailer = require('../models/mail');
var util = require('../models/util');
var config = require('../settings').config;
var base = require('../models/base');
var crypto = require('crypto');

var index = function(req,res,next){
    res.render('forgot', { title: '忘记密码',user:req.session.user,layout:'./layout/layout.ejs' });
};

var sendMail = function(req,res,next){
    User.get({email:req.body.email},function(err,user){
        if (user){
            var r_chars = util.randomChar(6);
            var obj = {'id':user.id,'type':'forgot-captcha','value':r_chars,'try':3,'expire':new Date()};
            base.del('ttlinfos',{id:user.id,type:'forgot-captcha'},function(err,num){
                if(err){
                    res.json({reCode:'1',reStr:'系统错误'});
                }
                base.insert('ttlinfos',obj,function(err,object){
                    if(err){
                        res.json({reCode:'1',reStr:'系统错误'});
                    }else{
                        var mailOptions = {
                            to: user.email, // list of receivers
                            subject: 'stone-找回密码', // Subject line
                            text: '', // plaintext body
                            html: '您好，您此次操作的验证码为<strong>'+ r_chars +'</strong>,30分钟内有效，请在找回密码页填入此验证码。' // html body
                        };
                        process.nextTick(mailer.sendMail(mailOptions));
                        res.json({reCode:'100',reStr:'操作成功',account:user.id});
                    }
                });
            });
        }else{
            res.json({reCode:'1',reStr:'邮箱未注册，请注册'});
        }
    });
};

var captcha = function(req,res,next){
    var params = {id:parseInt(req.body.account),type:'forgot-captcha'};
    base.getObj('ttlinfos',params,function(err,obj){
        if(err){
            res.json({reCode:'1',reStr:'系统错误'});
        }else{
            if(obj){
                if(obj.try > 1){
                    if(obj.value == req.body.captcha){
                        res.json({reCode:'100',reStr:'操作成功',account:obj.id});
                    }else{
                        base.update('ttlinfos',{id:obj.id,type:'forgot-captcha'},{$inc:{try:-1}},function(err,data){
                            if(err){
                                res.json({reCode:'1',reStr:'系统错误'});
                            }
                        });
                        res.json({reCode:'-1',reStr:'验证码错误'});
                    }
                }else if(obj.try = 1){
                    if(obj.value == req.body.captcha){
                        res.json({reCode:'100',reStr:'操作成功',account:obj.id});
                    }else{
                        base.del('ttlinfos',{id:obj.id,type:'forgot-captcha'},function(err,num){
                            if(err){
                                res.json({reCode:'1',reStr:'系统错误'});
                            }
                        });
                        res.json({reCode:'1',reStr:'错误次数过多，请重新发送验证码'});
                    }
                }else{
                    res.json({reCode:'1',reStr:'请重新发送验证码'});
                }
            }else{
                res.json({reCode:'1',reStr:'请发送验证码'});
            }
        }
    });
};

var resetPwd = function(req,res,next){
    var new_password = crypto.createHash('md5').update(req.body.pwd).digest('base64');
    base.update('users',{id:parseInt(req.body.resetAccount)},{$set:{password:new_password}},function(err,data){
        if(err){
            req.flash('error','系统错误');
            return res.redirect('/500');
        }
        req.flash('success','修改密码成功');
        res.redirect('/login');
    });
};
exports.index = index;
exports.sendMail = sendMail;
exports.captcha = captcha;
exports.resetPwd = resetPwd;
