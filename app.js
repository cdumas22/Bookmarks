
/**
 * Module dependencies.
 */

var express = require('express'),
    express_resource = require('express-resource'),
    routes = require('./routes'),
    path = require('path'),
    app = express(),
    server = require('http').createServer(app),
	datastore = require('nedb');
    //mongo = require('tingodb')({cacheSize:0}),
	mongo = require('mongodb');
    //Server = mongo.Server,
    //Db = mongo.Db,
    //mongoserver = new Server('localhost', 27017, { auto_reconnect: true });
	db = new datastore({filename: 'db/bookmarks.db', autoload:true});
//--------------SOCKET.IO----------------------
//global
io = require('socket.io').listen(server);
socket = null;
io.sockets.on('connection', function(soc) {
    socket = soc;
    console.log(soc);
});
//--------------END SOCKET.IO----------------------
//---------------DATABASE-----------------------
//global
BSON = mongo.BSONPure;
//db = new mongo.Db('c:/code/playground/bookmarks/db', {});
//db = new Db('bookmarksdb', mongoserver, { safe: true});

// db.open(function (err, db) {
    // if (!err) {
        // db.collection('bookmarks', { strict: true }, function (err, collection) {
            // if (err) {
                // console.log("The 'bookmarks' collection doesn't exist.");
            // }
        // });
    // }
// });


//var fs = require("fs");
//var file = "./bookmarks.db";
//var exists = fs.existsSync(file);

//if (!exists) {
//    console.log("Creating DB file.");
//    fs.openSync(file, "w");
//}

//var sqlite3 = require("sqlite3").verbose();
//db = new sqlite3.Database(file);



//---------------END DATABASE-----------------------
//---------------APP SERVER-----------------------
// all environments
app.set('port', 3001);
app.set('views', __dirname + '/views');
app.use(express.favicon(path.join(__dirname, 'public/images/bookmark-icon-lg.png')));
app.set('view engine', 'jade');
app.set('view options', { pretty: false });
app.use(express.compress());
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

app.get('/', routes.index);

//restful paths
var bookmarks = app.resource('bookmarks', require('./routes/Bookmark'));
var tags = app.resource('tags', require('./routes/Tag'));
//---------------END APP SERVER-----------------------
