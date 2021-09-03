/*
    ServerCode.js
    Is used through Heroku to construct the server that sends json data to the client

    Author: Tianyi Zhang
*/
var validator = require('validator');
var bodyParser = require('body-parser');
var express = require('express');
var user = require('random-username-generator');

const path = require('path')
const PORT = process.env.PORT || 5000;

app = express();


app.use(express.static(path.join(__dirname, 'public')));

app.get('/rides', function(request, response) {
  response.header('Access-Control-Allow-Origin', '*');
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//Connects the client to a postgreSQL database
const { Client } = require('pg');
const client = new Client({
	connectionString: process.env.DATABASE_URL || "postgres://xumfhbniiskejy:c9346aefff928f286191fac96818f1ea42c7a1efd6c85a83bba9746a8a243ebd@ec2-3-214-136-47.compute-1.amazonaws.com:5432/dab85npqs0443",
	ssl: {
		rejectUnauthorized: false
	}
});
client.connect();

//Used to send data back to the client while allowing client to access the server
app.post('/rides', function(request, response) {
  response.header("Access-Control-Allow-Origin", "*");
  response.header("Access-Control-Allow-Headers", "X-Requested-With");

  var username = request.body.username; 
  var lat = request.body.lat;
  var lng = request.body.lng;
  var created_at = new Date();
  var data = [];

  if(username != undefined && lat != undefined && lng != undefined){
    
    //Below is commented out because it adds 15 random cars to the PostgreSQL database
    
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



//Used so client has access to data
app.get('/', function(request,response) {
  var data = [];

  client.query('SELECT * FROM ride_requests', (error, result) => {
    if(!error){
      for(var i = 0; i<result.rows.length; i++){
        data.push({'get':'get',username:result.rows[i].username, lat:result.rows[i].lat, lng:result.rows[i].lng});
      }
      
      response.send(data);
    }
  });
});

//Gets all the data for a certain passenger/username
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

//Gets all the data for a certain vehicle
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



