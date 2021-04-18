var map = L.map("map", {
    center: [45, -115],
    zoom: 4
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

        var marker = L.circle(location, {
            fillOpacity: 0.75,
            color: "red",
            fillColor: "purple",
            radius: 1000
          })
          .bindPopup(quake.properties.place);

          markers.push(marker);
    });
    
    console.log(markers);

    var markerLayer = L.layerGroup(markers)

    map.addLayer(markerLayer);

});