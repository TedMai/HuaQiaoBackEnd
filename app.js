var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const finance = require('./routes/finance.js');
const judge = require('./routes/judge.js');
const backbone = require('./routes/backbone.js');
const processor = require('./routes/processor.js');
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// The app object has methods for
//     Routing HTTP requests; see for example, app.METHOD and app.param.
//     Configuring middleware; see app.route.
//     Rendering HTML views; see app.render.
//     Registering a template engine; see app.engine.
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//                                   app.use([path,] callback [, callback...])
//
// Mounts the specified middleware function or functions at the specified path:
// the middleware function is executed when the base of the requested path matches path.
//
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Since path defaults to “/”, middleware mounted without a path will be executed for every request to the app.
// For example, this middleware function will be executed for every request to the app:
//      --    app.use(function (req, res, next) {
//      --         console.log('Time: %d', Date.now());
//      --         next();
//      --    });
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//                                           body-parser
//
// Parse incoming request bodies in a middleware before your handlers, available under the req.body property.
// --  The bodyParser object exposes various factories to create middlewares.
// --  All middlewares will populate the req.body property with the parsed body when the Content-Type request header matches the type option,
// --  or an empty object ({}) if there was no body to parse, the Content-Type was not matched, or an error occurred.
//
//                                      bodyParser.json([options])
// Returns middleware that only parses json and only looks at requests where the Content-Type header matches the type option.
//
//                                      bodyParser.raw([options])
// Returns middleware that parses all bodies as a Buffer and only looks at requests where the Content-Type header matches the type option.
//
//                                      bodyParser.text([options])
// Returns middleware that parses all bodies as a string and only looks at requests where the Content-Type header matches the type option.
//
//                                      bodyParser.urlencoded([options])
// Returns middleware that only parses urlencoded bodies and only looks at requests where the Content-Type header matches the type option.
//
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//                                           cookie-parser
//
//  Parse Cookie header and populate req.cookies with an object keyed by the cookie names.
//  Optionally you may enable signed cookie support by passing a secret string,
//  which assigns req.secret so it may be used by other middleware.
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.use(cookieParser());
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//                                          express.static
//
//  It serves static files and is based on serve-static.
//  To serve static files such as images, CSS files, and JavaScript files, use the express.static built-in middleware function.
//     --    express.static(root, [options])
//     --    app.use(express.static('public'))  // Now, you can load the files that are in the public directory:
//  Or specify a mount path for the static directory, as shown below:
//     --    app.use('/static', express.static('public'))
//  If you run the express app from another directory, it’s safer to use the absolute path of the directory that you want to serve:
//     --    app.use('/static', express.static(path.join(__dirname, 'public')))
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// app.use(express.static(path.join(__dirname, 'public')));
// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

/*
 *  Middleware functions are executed sequentially, therefore the order of middleware inclusion is important.
 */
app.use("/backbone", backbone);             // 微信小程序
app.use("/authorization", judge);           // 微信公众号网页
app.use("/upload", processor);              // 管理后台
app.use("/file", processor);                //
app.use("/finance", finance);               // 财经
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//                                                error handler
//
// Error-handling middleware always takes four arguments
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
