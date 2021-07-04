function makeMap() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    } else {
      x.innerHTML = "Geolocation is not supported by this browser.";
    }
  }
  
function showPosition(position) {
    const lat = position.coords.latitude;
    const long = position.coords.longitude;
    const myPosition = { lat: lat, lng: long };
    const map = new google.maps.Map(document.getElementById("map"), { zoom: 2, center: myPosition, });
    myMark = new google.maps.Marker({ position: myPosition, map: map});

    var http = new XMLHttpRequest();
    var url = "https://secret-reef-32430.herokuapp.com/rides";
    var params = "username=vot48s6K&lat=" + lat + "&lng=" + long;
    http.open('POST', url, true);
    
    http.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    http.setRequestHeader("Access-Control-Allow-Origin", "*");
    
    list = http.send(params);
    http.onreadystatechange = function(){
        if(http.readyState == 4 && http.status == 200){
            content = addCars(http.responseText, map, lat, long);
            contentWindow = "<h1>Closest Car to my Position</h1>" + 
                            "<p>ID: "+ content[1] + "</p>" +
                            "<p>Username: " + content[2] + "</p>" +
                            "<p>Distance: "+content[0]+" miles</p>";
            const infoWindow = new google.maps.InfoWindow({content: contentWindow,});
            myMark.addListener("click", ()=>{infoWindow.open({anchor: myMark, map, shouldFocus: false})});
        }
    }
    
    
  }

function addCars(list, map, lat, long) {
    var i;
    obj = JSON.parse(list);
    for (i = 0; i<list.length; i++){
        try{ 
            addInfoWindow(obj, i, map, lat, long);
            
        } catch (TypeError){
            console.log("Unhandled Promise Rejection: TypeError")
        }
    }
    return findDistance(list, lat, long, map);
  }

function findDistance(list, lat, long, map) {
    var i;
    value = -1;
    id = "";
    username = "";
    smallLat = 0;
    smallLong = 0;
    for (i = 0; i<list.length; i++){
        try{
            const R = 6371e3;
            const one = lat * Math.PI/180;
            const two = obj[i].lat * Math.PI/180;
            const three = (obj[i].lat-lat) * Math.PI/180;
            const four = (obj[i].lng-long) * Math.PI/180;

            const a = Math.sin(three/2) * Math.sin(three/2) +
                    Math.cos(one) * Math.cos(two) *
                    Math.sin(four/2) * Math.sin(four/2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

            const d = R * c;
            if(value == -1 || d < value){
                value = d;
                id = obj[i].id;
                username = obj[i].username;
                smallLat = obj[i].lat;
                smallLong = obj[i].lng;
            }
        } catch (TypeError){
            console.log("Unhandled Promise Rejection: TypeError")
        }
        
    }

    const theLine = [{lat: lat, lng: long}, {lat: smallLat, lng: smallLong}];
    const thePath = new google.maps.Polyline({
        path: theLine,
        geodesic: true,
        strokeColor: "#8A2BE2",
        strokeOpacity: 1.0,
        strokeWeight: 2,
    });
    thePath.setMap(map);

    value = value / 1609.344;
    return [value, id, username];

  }

function addInfoWindow(obj, i, map, lat, long) {
    position = { lat: obj[i].lat, lng: obj[i].lng, };
    newMark = new google.maps.Marker({ position: position, map: map });
    newMark.setIcon("car.png");
    
    const R = 6371e3; // metres
    const one = lat * Math.PI/180; // φ, λ in radians
    const two = obj[i].lat * Math.PI/180;
    const three = (obj[i].lat-lat) * Math.PI/180;
    const four = (obj[i].lng-long) * Math.PI/180;

    const a = Math.sin(three/2) * Math.sin(three/2) +
            Math.cos(one) * Math.cos(two) *
            Math.sin(four/2) * Math.sin(four/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    const d = R * c / 1609.344;


    contentWindow = "<h1>This car's info</h1>" + 
                    "<p>ID: "+ obj[i].id + "</p>" +
                    "<p>Username: " + obj[i].username + "</p>" + 
                    "<p>Distance from me: " + d + " miles</p>";

    var infoWindow = new google.maps.InfoWindow({content: contentWindow});
    newMark.infowindow = infoWindow;
    newMark.addListener("click", function() {
        return this.infowindow.open(map, this);
    });
}


