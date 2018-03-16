var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var config = require('./config');
var index  = require('./routes/index');
var users  = require('./routes/users');
var apiV1  = require('./routes/api.v1');

var app = express();
var mysql = require("mysql");

global.connection = mysql.createConnection({
	host     : config.db.host,
	user     : config.db.user,
    database : config.db.database,
});

// Initial connection to database
connection.connect(function(error) {
	if (error) throw error;
	console.log("Connected to database!");
	var query = `CREATE TABLE IF NOT EXISTS users (
					 id TINYINT NOT NULL AUTO_INCREMENT,
					 name VARCHAR(55), 
					 added DATE,
					 PRIMARY KEY (id)
				 );`;
	global.connection.query(query, function (error, results, fields) {
		if (error) throw error;
	});

	var query2 = `CREATE TABLE IF NOT EXISTS points (
					  added DATE,
					  userId TINYINT(10) NOT NULL,
					  deleted VARCHAR(55)
				  );`;
	global.connection.query(query2, function (error, results, fields) {
		if (error) throw error;
	});
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/api/v1', apiV1);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
