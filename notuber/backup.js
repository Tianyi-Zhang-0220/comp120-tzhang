
var validator = require('validator');
var bodyParser = require('body-parser');
var express = require('express');
var user = require('random-username-generator');

//var cors = require('cors');

const path = require('path')
const PORT = process.env.PORT || 5000;

app = express();

// Add a list of allowed origins.
// If you have more origins you would like to add, you can add them to the array below.
//const allowedOrigins = ['http://localhost:8000', 'https://secret-reef-32430.herokuapp.com/'];


// Then pass these options to cors:
//app.use(cors(allowedOrigins));

app.use(express.static(path.join(__dirname, 'public')));

/*
app.use((request, response, next) => {
  response.header('Access-Control-Allow-Origin', 'http://localhost:8000');
  response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  response.header('Access-Control-Allow-Methods', 'GET, DELETE, POST');
  response.header('Vary', 'origin');

  //response.header("Access-Control-Allow-Credentials", 'true');
  /*if(isPreflight(request)){
    response.set('Access-Control-Allow-Methods', 'GET, DELETE, POST');
    response.status(204).end();
  }*
  next();
});*/

app.get('/rides', function(request, response) {
  response.header('Access-Control-Allow-Origin', '*');
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

const { Client } = require('pg');
const client = new Client({
	connectionString: process.env.DATABASE_URL || "postgres://xumfhbniiskejy:c9346aefff928f286191fac96818f1ea42c7a1efd6c85a83bba9746a8a243ebd@ec2-3-214-136-47.compute-1.amazonaws.com:5432/dab85npqs0443",
	ssl: {
		rejectUnauthorized: false
	}
});
client.connect();


app.post('/rides', function(request, response) {
  //response.header("Access-Control-Allow-Origin", "http://localhost:8000");

  response.header("Access-Control-Allow-Origin", "*");
  response.header("Access-Control-Allow-Headers", "X-Requested-With");
  /*response.header("Access-Control-Allow-Credentials", 'true');
  response.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); 
  */
  var username = request.body.username; 
  var lat = request.body.lat;
  var lng = request.body.lng;
  var created_at = new Date();
  var data = [];

  //data.push("postbeforeif");
  if(username != undefined && lat != undefined && lng != undefined){
    
    
    //data.push({"postbeforefor":1});
    /*for(var count = 0; count<15; count++){
      username = user.generate(); 
      username = validator.escape(username); 
      lat = (Math.random()*(180)-90).toString();
      lat = validator.escape(lat);
      lng = (Math.random()*(360)-180).toString();
      lng = validator.escape(lng);
      //var querystring = 'INSERT INTO ride_requests (username, lat, lng) VALUES (asdasd, 42.354951, -71.0509) RETURNING *';
      var querystring = 'INSERT INTO ride_requests (username, lat, lng, created_at) VALUES ($1, $2, $3, $4);';
      client.query(querystring, [username, lat, lng, created_at], (error, result) => {
        if(!error){
          
        }
      });
    }*/
    client.query('SELECT * FROM ride_requests', (error, result) => {
      if(!error){
        //var data = [];
        for(var i = 0; i<result.rows.length; i++){
          data.push({'post':'post',username:result.rows[i].username, lat:result.rows[i].lat, lng:result.rows[i].lng});
        }
        
        response.send(data);
      }
    });
  }
  else{
    response.send({"error":"Whoops, something is wrong with your data!"});
  }

    
});




app.get('/', function(request,response) {
  var data = [];
  //data.push({"getbeforequery":1});

  client.query('SELECT * FROM ride_requests', (error, result) => {
    if(!error){
      //var data = [];
      for(var i = 0; i<result.rows.length; i++){
        data.push({'get':'get',username:result.rows[i].username, lat:result.rows[i].lat, lng:result.rows[i].lng});
      }
      
      response.send(data);
    }
  });
});

app.get('/passenger.json', function(request, response)  {
  var username = request.query.username;
  if(username == undefined || username == null){
    response.send('[]');
  }
  else{
    client.query("SELECT * FROM vehicles WHERE username = '" + username + "'", (error, result) => {
			if (!error) {
				response.send(result.rows);
			}
		});
  }
});

app.get('/vehicle.json', function(request, response)  {
  var username = request.query.username;
  if(username == undefined || username == null){
    response.send('[]');
  }
  else{
    client.query("SELECT * FROM vehicles WHERE username = '" + username + "'", (error, result) => {
			if (!error) {
				response.send(result.rows);
			}
		});
  }
});







app.listen(PORT, () => console.log(`Listening on ${ PORT }`));



