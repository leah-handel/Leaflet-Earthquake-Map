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

        var color = "#648FFF";

        if (depth < 5) {
            color = "#FFB000";
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

});