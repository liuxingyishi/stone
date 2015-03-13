/**
 * Created by lenovo on 2015/2/15.
 */
var settings = require('../settings');
var Fee = require('../models/fee');
var index = function(req,res,next){
    var types = settings.config.feeType;
    res.render('feeAdd',{title:'支用记录',types:types,user:req.session.user,layout:'./layout/layout.ejs'});
}
var doAdd = function(req,res,next){
    var newFee = new Fee({
        date:req.body.date,
        type:req.body.type,
        amount:req.body.amount,
        remark:req.body.remark,
        createUser:req.session.user.name,
        createTime:new Date()
    });
    newFee.save(function(err){
        if (err) {
            req.flash('error', JSON.stringify(err));
            return res.redirect('/fee/add');
        }
        req.flash('success','记录成功');
        res.redirect('/home');
    });
}
exports.index = index;
exports.doAdd = doAdd;