var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var flash = require('connect-flash');
var settings = require('./settings');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//use ejs layout
app.use(partials());
//express session
app.use(session({
    secret: settings.settings.cookieSecret,
    store: new MongoStore({
        db: settings.settings.db,
        ttl:30*60
    })
}));
//flash
app.use(flash());
app.use(function(req, res, next){
    /*console.log("app.usr local");
    res.locals.user = req.session.user;*/
    var error = req.flash('error');
    res.locals.error = error.length ? error : null;
    var success = req.flash('success');
    res.locals.success = success.length ? success : null;
    next();
});
// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//controllers
require('./routes')(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            title:'服务器开小差啦',
            user:req.session.user,
            message: err.message,
            error: err,
            layout:'./layout/layout.ejs'
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        title:'服务器开小差啦',
        user:req.session.user,
        message: err.message,
        error: {},
        layout:'./layout/layout.ejs'
    });
});


module.exports = app;
