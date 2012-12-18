
/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , path = require('path')
  , jsdom = require("jsdom")
  , request = require('request');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3003);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', function(req, res) {  
  var title = '9gag//randomizer';
  // request
  request('http://9gag.com/random', function (error, response, body) {
    if (!error && response.statusCode == 200) {      
      // jsdom
      jsdom.env(
        body, 
        ["http://code.jquery.com/jquery.js"],
        function (errors, window) {      
          console.log(errors);
          var $ = window.$;
          var src = 'http:' + $('.img-wrap img').attr('src');
          var alt = $('.img-wrap img').attr('alt');
          var likes = $('.loved span').text();
          var prev = $('#post-control-bar.div');
          var next = $('#post-control-bar.div');
          res.render('index', { 
                            title: title, 
                            subtitle: alt, 
                            screen: src, 
                            likes: likes,
                            prev: prev, 
                            next: next
                          });
         }
      );
    }
  });  
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
