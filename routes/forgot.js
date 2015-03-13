/**
 * Created by lenovo on 2015/3/13.
 */
var index = function(req,res,next){
    res.render('forgot', { title: '忘记密码',user:req.session.user,layout:'./layout/layout.ejs' });
};

exports.index = index;
