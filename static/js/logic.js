// base map tile layers

  var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });

  var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  var baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
  };

// data sources

var earthquakeURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
var platesURL = "static/data/PB2002_boundaries.json";

var promises = [];

promises.push(d3.json(earthquakeURL));
promises.push(d3.json(platesURL));

Promise.all(promises).then(function(data) {
    var quakes = data[0].features;
    var plates = data[1].features;

    // creating marker layer with quake data

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
            fillOpacity: 0.8,
            color: color,
            weight: 1,
            fillColor: color,
            radius: 15000*magnitude
          })
          .bindPopup(`<h4>Earthquake ${quake.properties.place}</h4><hr><strong>Magnitude:</strong> ${magnitude}<br><strong>Depth:</strong> ${depth}`);

          markers.push(marker);
    });


    var markerLayer = L.layerGroup(markers)

    // creating tectonic plate layer

    var plateStyle = {
        "color": "red",
        "weight": 2,
        "opacity": .75
    };

    var platesLayer = L.geoJSON(plates, {style: plateStyle});

    // layer control

    var overlayMaps = {
        "Earthquakes": markerLayer,
        "Tectonic Plates": platesLayer
      };

    var map = L.map("map", {
        center: [50, -125],
        zoom: 4,
        layers: [street, platesLayer, markerLayer]
    });

    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
      }).addTo(map);

    // legend template: https://codepen.io/haakseth/pen/KQbjdO

    var legend = L.control({ position: "bottomleft" });

    legend.onAdd = function(map) {
    var div = L.DomUtil.create("div", "legend");
    div.innerHTML += "<h4>Earthquake Depth</h4>";
    div.innerHTML += '<span><i class="bi bi-circle-fill" style="color: #648FFF"></i> &nbsp;&nbsp; &lt; 5 </span><br>';
    div.innerHTML += '<span><i class="bi bi-circle-fill" style="color: #785EF0"></i> &nbsp;&nbsp; 5 - 10</span><br>';
    div.innerHTML += '<span><i class="bi bi-circle-fill" style="color: #DC267F"></i> &nbsp;&nbsp; 10 - 20</span><br>';
    div.innerHTML += '<span><i class="bi bi-circle-fill" style="color: #FE6100"></i> &nbsp;&nbsp; 20 - 50</span><br>';
    div.innerHTML += '<span><i class="bi bi-circle-fill" style="color: #FFB000"></i> &nbsp;&nbsp; 50 +</span><br>';
    
    return div;
    };

    legend.addTo(map);


});
