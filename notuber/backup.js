
var validator = require('validator');
var bodyParser = require('body-parser');
var express = require('express');
const path = require('path')
const PORT = process.env.PORT || 5000;
app = express();


app.use(express.static(path.join(__dirname, 'public')));
app.use('/rides', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
  });


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.post('/rides', function(request, response) {
    var username = request.body.username;
    var lat = request.body.lat;
    var lng = request.body.lng;
    if(username != undefined && lat != undefined && lng != undefined){
      response.send('{"_id":"5cdf411856e9c200042989d7","username":"JANET","lat":42.354951,"lng":-71.0509,"created_at":"2020-05-17T23:17:44.427Z"}');
    }
    else{
      response.send({"error":"Whoops, something is wrong with your data!"});
    }
    
  });

app.listen(PORT, () => console.log(`Listening on ${ PORT }`));



