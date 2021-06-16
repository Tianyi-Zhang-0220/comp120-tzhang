function makeMap() {
    const southStation = { lat: 42.352271, lng: -71.05524200000001 };
    const map = new google.maps.Map(document.getElementById("map"), { zoom: 14, center: southStation, });

    jsonlocations = '[{"id": "mXfkjrFw", "lat": 42.3453, "lng": -71.0464}, {"id": "nZXB8ZHz", "lat": 42.3662, "lng": -71.0621}, {"id": "Tkwu74WC", "lat": 42.3603, "lng": -71.0547}, {"id": "5KWpnAJN", "lat": 42.3472, "lng": -71.0802}, {"id": "uf5ZrXYw", "lat": 42.3663, "lng": -71.0544}, {"id": "VMerzMH8", "lat": 42.3542, "lng": -71.0704}]';
    var i;
    obj = JSON.parse(jsonlocations);
    for(i = 0; i < jsonlocations.length; i++){
        try{
            position = { lat: obj[i].lat, lng: obj[i].lng, };
            newMark = new google.maps.Marker({ position: position, map: map });
            newMark.setIcon("car.png");
        } catch (TypeError){
            console.log("Unhandled Promise Rejection: TypeError")
        }
        
    }

  }