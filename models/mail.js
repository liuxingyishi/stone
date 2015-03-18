/**
 * send email
 * 发送邮件
 * related to @nodemailer
 * Created by lenovo on 2015/3/13.
 */
var nodemailer = require('nodemailer');
var config = require('../settings').settings;

//邮件管理对象
var mailer = function(){
    this.transporter = nodemailer.createTransport({
        service:config.emailService,
        auth: {
            user: config.emailUser,
            pass: config.emailPwd
        }
    });
}
//发送邮件
mailer.prototype.sendMail = function (options) {
    if(!options) options = {};
    var mailOptions = {
        from: config.emailUser, // sender address
        to: options.to || '', // list of receivers
        subject: options.subject || '', // Subject line
        text: options.text || '', // plaintext body
        html: options.html || '' // html body
    };
    this.transporter.sendMail(mailOptions, function(error, info){
        if(error){
            console.log(error);
        }else{
            console.log('Message sent: ' + info.response);
        }
    });
}

module.exports = new mailer();

/*
 new mailer().sendMail({
 from:'306663558@qq.com',
 to:'306663558@qq.com',
 subject:'test',
 text:'hello',
 html:'hehe'
 });*/
