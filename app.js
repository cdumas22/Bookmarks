
/**
 * Module dependencies.
 */

express = require('express');
var express_resource = require('express-resource'),
    routes = require('./routes'),
    path = require('path'),
	util = require('util'),
	engine = require('ejs-locals');
app = express();
var server = require('http').createServer(app),
    mongo = require('mongodb'),
    Server = mongo.Server,
    Db = mongo.Db,
    mongoserver = new Server('localhost', 27017, { auto_reconnect: true });
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
db = new Db('bookmarksdb', mongoserver, { safe: true});

db.open(function (err, db) {
    if (!err) {
        db.collection('bookmarks', { strict: true }, function (err, collection) {
            if (err) {
                console.log("The 'bookmarks' collection doesn't exist.");
            }
        });
    }
});
//---------------END DATABASE-----------------------
//---------------APP SERVER-----------------------
// all environments
var passport = require('passport'),
	LinkedInStrategy = require('passport-linkedin').Strategy;





app.engine('ejs', engine);
app.set('port', 3001);
app.set('views', __dirname + '/views');
app.use(express.favicon(path.join(__dirname, 'public/images/bookmark-icon-lg.png')));
app.set('view engine', 'ejs');
app.use(express.compress());
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.methodOverride());

app.use(express.session({ secret: 'keyboard cat' }));
// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(passport.initialize());
app.use(passport.session());

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
//var authentication = app.resource('auth', require('./routes/User'));

var bookmarks = app.resource('bookmarks', require('./routes/Bookmark'));
var tags = app.resource('tags', require('./routes/Tag'));
//---------------END APP SERVER-----------------------


var LINKEDIN_API_KEY = "75h9an3slhifwv";
var LINKEDIN_SECRET_KEY = "LPXK1Abj5WvqYuyI";

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete LinkedIn profile is
//   serialized and deserialized.
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});
// Use the LinkedInStrategy within Passport.
//   Strategies in passport require a `verify` function, which accept
//   credentials (in this case, a token, tokenSecret, and LinkedIn profile), and
//   invoke a callback with a user object.
passport.use(new LinkedInStrategy({
    consumerKey: LINKEDIN_API_KEY,
    consumerSecret: LINKEDIN_SECRET_KEY,
    callbackURL: "http://127.0.0.1:3001/auth/linkedin/callback"
  },
  function(token, tokenSecret, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
      // To keep the example simple, the user's LinkedIn profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the LinkedIn account with a user record in your database,
      // and return that user instead.
      return done(null, profile);
    });
  }
));

app.get('/account', ensureAuthenticated, function(req, res){
  res.render('account', { user: req.user });
});

app.get('/login', function(req, res){
  res.render('login', { user: req.user });
});

// GET /auth/linkedin
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in LinkedIn authentication will involve
//   redirecting the user to linkedin.com.  After authorization, LinkedIn will
//   redirect the user back to this application at /auth/linkedin/callback
app.get('/auth/linkedin',
  passport.authenticate('linkedin'),
  function(req, res){
    // The request will be redirected to LinkedIn for authentication, so this
    // function will not be called.
  });

// GET /auth/linkedin/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/auth/linkedin/callback',
  passport.authenticate('linkedin', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});


// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
}