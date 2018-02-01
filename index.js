var cool = require('cool-ascii-faces');
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var Scraper = require ('images-scraper')
  , google = new Scraper.Google();




app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var nameSchema = new mongoose.Schema({
    firstName: String,
    height: Number,
    thumb_height: Number,
    thumb_url: String,
    thumb_width: Number,
    type: String,
    url: String,
    width: Number
});

var User = mongoose.model("User", nameSchema);

app.set('port', (process.env.PORT || 5000));
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/node-demo");
app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index')
});

app.get('/list', function(request, response) {
  response.render('pages/list')
});

app.get('/images', function(request, response) {
  response.render('pages/images')
});

// application -------------------------------------------------------------
// app.get('*', function(req, res) {
//     res.sendfile('index.html'); // load the single view file (angular will handle the page changes on the front-end)
// });

app.get('/cool', function(request, response) {
  response.send(cool());
});

app.post("/api/", (req, res) => {
  var myData = new User(req.body);
  google.list({
    keyword: myData.firstName,
    num: 5,
    detail: true,
    nightmare: {
        show: true
    }
})
.then(function (response) {
     for(var i=0; i<response.length; i++)
     {
      response[i]['firstName']= myData.firstName;
      var myData2 = new User(response[i]);
      myData2.save()
     .then(item => {
      res.send("item saved to database");
    })
    .catch(err => {
      res.status(400).send("unable to save to database");
    });
     }
     
    //console.log('first 10 results from google', response);
    
}).catch(function(err) {
    console.log('err', err);
});

  // myData.save()
  //   .then(item => {
  //     res.send("item saved to database");
  //   })
  //   .catch(err => {
  //     res.status(400).send("unable to save to database");
  //   });
});

app.get("/api/:searchStr",(req, res) => {
  console.log(req.params.searchStr);
   User.find({firstName:req.params.searchStr}).then(item => {
     res.send(item);
   }).catch(err => {
      res.status(400).send("unable to fetch from database");
    });
});



// you can also watch on events
google.on('result', function (item) {
    //console.log('out', item);
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
