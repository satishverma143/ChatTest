var express = require('express');
var http = require('http');
//var nodemailer = require("nodemailer");
var ios = require('socket.io');
var path = require('path');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const flash = require('connect-flash');
var SocketIOFileUpload = require('socketio-file-upload');

//var routes = require('./routes/index'); // login page
//var users = require('./routes/users');

var app = express().use(SocketIOFileUpload.router);

app.locals.moment = require('moment');
// Include Authentication Strategies
require('./config/passport/passport');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // to support URL-encoded bodies
app.use(require('express-session')({ secret: 'n0d3castz secret cat key', resave: false, saveUninitialized: false }));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(function (req, res, next) {
    req.session.message = req.session.message || { error: [], success: [], info: [] };
    app.locals.message = req.session.message;
    next();
});

//app.use('/', routes);
//app.use('/users', users);
// Include all Routes
require('./routes/routes')(app);

var port = Number(process.env.PORT || 1337);

app.set('port', Number(process.env.PORT || 1337));

var server = http.createServer(app).listen(port, function () {
    console.log("Listening on " + port);
});


var io = ios.listen(server);

//app.get('/', function (req, res) {
//    res.sendfile('index.html');
//});


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


//TODO : Socket.io 
require('./routes/chat_socket')(io);


module.exports = app;