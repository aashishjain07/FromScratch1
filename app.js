
var mongoose = require('mongoose');
var express = require('express');
var path = require('path');
var passport = require('passport');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var config = require('./config/database');



mongoose.connect(config.database);


var db = mongoose.connection;

//check connection
db.once('open', function(){
console.log('COnnected to MongoDB');
});


//Check for db errors
db.on('error', function(err){
    console.log(err);
});

//Init app
var app = express();

//Bring in the model
var Article = require('./model/article');


//View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//parse app Bodyparser middle ware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Setting PUBLIC FOLDER
app.use(express.static(path.join(__dirname, 'public')));

//Express Session middleware
app.use(session({
secret: 'keyboard Cat',
resave: true,
saveUninitialized: true
}));

//Express Messages Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next){
    res.locals.messages = require('express-messages')(req, res);
    next();
});

//Express Validator Middleware
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.')
        , root    = namespace.shift()
        , formParam = root;
  
      while(namespace.length) {
        formParam += '[' + namespace.shift() + ']';
      }
      return {
        param : formParam,
        msg   : msg,
        value : value
      };
    }
  }));

//Passport Config
require('./config/passport')(passport);

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

app.get('*', function(req, res, next){
    res.locals.user = req.user || null;
    next();
})

//Home Route
app.get('/', function(req, res) {
 Article.find({}, function(err, articles){
        if(err) {
            console.log(err);
        } else {
            res.render('index', {
                title: 'Articles',
                articles: articles
        }); 
        }
           
    
    });
});


//Route files
var articles = require('./routes/articles');
var users = require('./routes/users');

app.use('/articles', articles);
app.use('/users', users);



//Started Server
app.listen(3000, function(){
    console.log('Server started on port 3000...');
});

