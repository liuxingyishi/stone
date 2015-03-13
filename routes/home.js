/**
 * Created by lenovo on 2015/2/13.
 */
var config = require('../settings');
var fee = require('../models/fee');
var logger = require('../models/logger').logger;
var index = function(req,res,next){
    var user = req.session.user;
    if(user == null){
        return res.redirect('/');
    }
    var params = {"createUser":user.name};
    var mparams = {"createUser":user.name,"year":new Date().getFullYear(),"month":(new Date().getMonth()+1)};
    fee.feeCountByParams(params,null,'$amount',function(err,data){
        if(err){
            req.flash('error', '系统错误');
            return res.redirect('/500');
        }
        if(data.length == 0){
            res.render('home',{
                title:'主页',
                user:req.session.user,
                count:0,total:0,mcount:0,mtotal:0,
                layout:'./layout/layout.ejs'
            });
            return;
        }
        fee.feeCountByParams(mparams,null,'$amount',function(err,mdata){
            if(err){
                req.flash('error', '系统错误');
                return res.redirect('/500');
            }
            if(mdata.length == 0){
                mdata.push({count:0,total:0});
            }
            res.render('home',{
                title:'主页',
                user:req.session.user,
                count:data[0].count,total:data[0].total,mcount:mdata[0].count,mtotal:mdata[0].total,
                layout:'./layout/layout.ejs'
            });
        });
    });
};

var myYearFees = function (req,res,next) {
    var user = req.session.user;
    var params = {"createUser":user.name,"year":new Date().getFullYear()};
    fee.feeCountByParams(params,'$month','$amount',function(err,data){
        if(err){
            logger.log('error','ajax_年度支出_error');
            return;
        }
        res.json({data:data});
    });
};

var myFeeComponents = function(req,res,next){
    var user = req.session.user;
    var feeType = config.config.feeType;
    var params = {"createUser":user.name};
    if(req.body.hasOwnProperty('year')){
        params.year = parseInt(req.body.year);
    }
    if(req.body.hasOwnProperty('month')){
        params.month = parseInt(req.body.month);
    }
    fee.feeCountByParams(params,'$type','$amount',function(err,data){
        if(err){
            logger.log('error','ajax_支出组成_error');
            return;
        }
        res.json({feeType:feeType,data:data});
    });
};

var myDetails = function(req,res,next){
    var pageIndex = req.body.pageIndex;
    var pageSize = config.config.pageSize;
    var user = req.session.user;
    var params = {"createUser":user.name};
    fee.findDetailsByParams(params,pageIndex,pageSize,function(err,data){
        if(err){
            logger.log('error','ajax_支出详细_error');
            return;
        }
        for(var i=1;i < config.config.feeType.length;i++){
            for(var j=0;j < data.data.length;j++){
                if(data.data[j].type == config.config.feeType[i].value){
                    data.data[j].type = config.config.feeType[i].show;
                }
            }
        }
        res.json({data:data.data,count:data.count,pageSize:pageSize});
    });
};

exports.index = index;
exports.myDetails = myDetails;
exports.myYearFees = myYearFees;
exports.myFeeComponents = myFeeComponents;