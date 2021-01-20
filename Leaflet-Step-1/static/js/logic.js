// Define query URL with filter for lat lng
var queryUrl = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2014-01-01&endtime=" +
  "2014-01-02&maxlongitude=-69.52148437&minlongitude=-123.83789062&maxlatitude=48.74894534&minlatitude=25.16517337";

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
  console.log(data)
});

// Define function to run once for each feature in the features array
function createFeatures(earthquakeData) {

// Function to size circle based on magnitude
function getRadius(mag) {
  return mag * 6;
    }

// Function for color based on depth
function getColor(d) {
      return d > 100 ? '#FF4500' :
      d > 50  ? '#FF8C00' :
      d > 30  ? '#FFA500' :
      d > 20  ? '#FF6347' :
      d > 15   ? '#FF7F50' :
      d > 10   ? '#FFD700' :
      d > 0   ? '#98EE00' :
                 '#FFEDA0';
  }
  
  // Style for magnitude circle
  function style(feature) {
    return {
        fillColor: getColor(feature.geometry.coordinates[2]),
        opacity: 1,
        fillOpacity: 1,
        color: "#000000",
        radius: getRadius(feature.properties.mag),
        stroke: true,
        weight: 0.5
    };  
 }
 // Give each feature a popup with earthquake info
 function onEachFeature(feature, layer) {
  layer.bindPopup(`<h3>Location: ${feature.properties.place} 
    </h3><hr><p> Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]}</p>
    <p>Date and Time: ${new Date(feature.properties.time)}</p>`);
}
 
  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng)
    },
    onEachFeature: onEachFeature,
    style: style
  });

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);

}

function createMap(earthquakes) {

  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create myMap, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap, earthquakes]
  });

  // Create a layer control - pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

 // Add a legend to myMap
var legend = L.control({position: 'bottomright'});

legend.onAdd = function() {

    var div = L.DomUtil.create('div', 'info legend')
    var grades = [0, 10, 15, 20, 30, 50, 100];
    var colors = [
      '#98EE00',
      '#FFD700',
      '#FF7F50',
      '#FF6347',
      '#FFA500',
      '#FF8C00',
      '#FF4500' 
        ]

    // loop through our depth data and generate a colors
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + colors[i] + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
      }
      div.innerHTML='<h3>Legend</h3>'+div.innerHTML
      return div;
};

legend.addTo(myMap);  
}

    