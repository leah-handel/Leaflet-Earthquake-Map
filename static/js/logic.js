var map = L.map("map", {
    center: [40, -115],
    zoom: 5
  });
  
  // Adding a tile layer (the background map image) to our map:
  // We use the addTo() method to add objects to our map.
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

var earthquakeURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

d3.json(earthquakeURL).then(function(data) {
    var quakes = data.features;

    var markers = [];

    quakes.forEach(function(quake) {

        var coordinates = quake.geometry.coordinates;

        var location = [coordinates[1], coordinates[0]];

        var depth = coordinates [2];

        // accessible color scheme from https://davidmathlogic.com/colorblind/#%23648FFF-%23785EF0-%23DC267F-%23FE6100-%23FFB000

        var color = "#FFB000";

        if (depth < 5) {
            color = "#648FFF";
        } else if (depth < 10) {
            color = "#785EF0";
        } else if (depth < 20) {
            color = "#DC267F";
        } else if (depth <50) {
            color = "#FE6100";
        }

        var magnitude = quake.properties.mag;

        var marker = L.circle(location, {
            fillOpacity: 0.9,
            color: "black",
            weight: 1,
            fillColor: color,
            radius: 10000*magnitude
          })
          .bindPopup(quake.properties.place);

          markers.push(marker);
    });
    
    console.log(markers);

    var markerLayer = L.layerGroup(markers)

    map.addLayer(markerLayer);

    // legend: https://codepen.io/haakseth/pen/KQbjdO

    var legend = L.control({ position: "bottomleft" });

    legend.onAdd = function(map) {
    var div = L.DomUtil.create("div", "legend");
    div.innerHTML += "<h4>Earthquake Depth</h4>";
    div.innerHTML += '<span><i class="bi bi-circle-fill" style="color: #648FFF"></i> &nbsp;&nbsp; &lt; 5 </span><br>';
    div.innerHTML += '<span><i class="bi bi-circle-fill" style="color: #785EF0"></i> &nbsp;&nbsp; 5 - 10</span><br>';
    div.innerHTML += '<span><i class="bi bi-circle-fill" style="color: #DC267F"></i> &nbsp;&nbsp; 10 - 20</span><br>';
    div.innerHTML += '<span><i class="bi bi-circle-fill" style="color: #FE6100"></i> &nbsp;&nbsp; 20 - 50</span><br>';
    div.innerHTML += '<span><i class="bi bi-circle-fill" style="color: #FFB000"></i> &nbsp;&nbsp; 50 +</span><br>';
    //div.innerHTML += '<i class="icon" style="background-image: url(https://d30y9cdsu7xlg0.cloudfront.net/png/194515-200.png);background-repeat: no-repeat;"></i><span>Grænse</span><br>';
  
    return div;
    };

    legend.addTo(map);
});

