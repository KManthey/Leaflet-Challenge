//can get basic information from the website for leavelet and chloropleth
//INSTRUCTIONS create leaflet mep for earthquakes
//using dataset based on their lng and lat
//markers size/colors to refelct magnitude of earthquakes by size and depth
//magnitude = size, depth = color

//file layout https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_week.geojson
//features [{"type": "Feature", "properties": {"mag". 6.3, }}]
//????where is the depth??


//STEPS
// see leaflet and chloropleth websites
// create initial map object - inserted into div with id of 'map'
//set long, lat, starting zoom level
// add tile layer (background map) - use addTo to add objects to our map

// Store our API endpoint inside queryUrl

//can change this query information to filter or call different data.
var queryUrl = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2014-01-01&endtime=" +
  "2014-01-02&maxlongitude=-69.52148437&minlongitude=-123.83789062&maxlatitude=48.74894534&minlatitude=25.16517337";

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
  console.log(data)
});

function createFeatures(earthquakeData) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  //onEach is a leaflet feature
function getRadius(mag) {
  return mag * 6;
    }
function getColor(d) {
      return d > 100 ? '#FF4500' :
      d > 50  ? '#FF8C00' :
      d > 30  ? '#FFA500' :
      d > 20  ? '#FF6347' :
      d > 15   ? '#FF7F50' :
      d > 10   ? '#FFD700' :
      d > 0   ? '#ffe44d' :
                 '#FFEDA0';
  }
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

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

// Add a legend
// var legend = L.control({position: 'bottomright'});

// legend.onAdd = function (map) {

//     var div = L.DomUtil.create('div', 'info legend'),
//     //     grades = [0, 50, 20, 40, 50, 70, 90],
//     //     labels = [];

//     // // loop through our depth data and generate a label with a colored square for each interval
//     // // for (var i = 0; i < geometry.depth[2]; i++) {
//     // //     div.innerHTML +=
//     // //         '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
//     // //         grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
//     // // }

//     return div;
// };

// legend.addTo(myMap);  
}

