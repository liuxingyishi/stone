/**
 * Created by lenovo on 2015/2/12.
 */
var reg = require('./routes/reg');
var login = require('./routes/loginout');
var home = require('./routes/home');
var fee = require('./routes/fee');
var set = require('./routes/set');
var forgot = require('./routes/forgot');
var logger = require('./models/logger').logger;

module.exports = function(app){

    /*session控制*/
    app.all('*',function(req,res,next){
        if(!(/\/reg|\/login|\/favicon.ico|\/index|validUser|forgot/i.test(req.url) || req.url == '/') && req.session.user == null){
            res.redirect('/index');
            logger.info('[sessionControl]','not pass --url:'+ req.url);
        }else{
            if(req.session.user == null){
                logger.info('[sessionControl]','pass --url:'+ req.url);
            }else {
                logger.info('[user]', 'pass --user:' + req.session.user.name + ',url:' + req.url);
            }
            next();
        }
    });

    /*get home page*/
    app.get('/', function(req, res, next) {
        res.render('index', { title: 'Stone',user:req.session.user,layout:'./layout/layout.ejs' });
    });
    app.get('/index', function(req, res, next) {
        res.render('index', { title: 'Stone',user:req.session.user,layout:'./layout/layout.ejs' });
    });

    /*注册*/
    app.get('/reg',reg.index);
    app.post('/reg',reg.doReg);
    app.post('/data/validUser',reg.validUser);

    /*登录*/
    app.get('/login',login.index);
    app.post('/login',login.doLogin);
    app.get('/logout',login.doLogout);

    /*忘记密码*/
    app.get('/forgot',forgot.index);

    /*用户主页*/
    app.get('/home',home.index);
    /*数据查询*/
    app.post('/data/myDetail',home.myDetails);    //我的支出详细
    app.post('/data/myYearFees',home.myYearFees);    //我的年度支出统计
    app.post('/data/myFeeComponents',home.myFeeComponents);    //我的支出组成

    /*用户设置*/
    app.get('/mySet',set.index);
    app.post('/mySet/resetPwd',set.doResetPwd);
    app.post('/mySet/setAvatar',set.setAvatar);

    /*fee*/
    app.get('/fee/add',fee.index);
    app.post('/fee/add',fee.doAdd);

};