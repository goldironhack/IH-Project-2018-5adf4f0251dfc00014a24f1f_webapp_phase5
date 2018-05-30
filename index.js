const API_KEY = "AIzaSyARD8AJykZ5pTbZusyz0D-TY1GEJJGYsDY";
const NeighborhoodNames_URL = "https://data.cityofnewyork.us/api/views/xyye-rtrs/rows.json?accessType=DOWNLOAD";
const HousingNY_URL = "https://data.cityofnewyork.us/api/views/hg8x-zxpr/rows.json?accessType=DOWNLOAD";
const CrimesNY_URL = "https://data.cityofnewyork.us/api/views/qgea-i56i/rows.json?accessType=DOWNLOAD";
//icon security  https://cdn3.iconfinder.com/data/icons/computer-system-and-data/512/14-48.png
//  						 https://cdn2.iconfinder.com/data/icons/security-pro-1/512/Security-01-48.png
//							https://cdn4.iconfinder.com/data/icons/maps-and-pins-4/512/map_pin_destination_location_adress_police_shield-2-48.png
//icon distance https://cdn3.iconfinder.com/data/icons/google-material-design-icons/48/ic_directions_walk_48px-48.png
//							https://cdn1.iconfinder.com/data/icons/transportation-28/100/10_Walking-48.png
var neighborhoodsPoint;

var map;
var NYU_coordenates = {lat: 40.7291, lng: -73.9965};
var neighborhoods = [];
var coordinatesNeighborhoodNames = [];
var lowIncome = [];
var housing = [];


var jsonText = 'https://services5.arcgis.com/GfwWNkhOj9bNBqoJ/arcgis/rest/services/nycd/FeatureServer/0/query?where=1=1&outFields=*&outSR=4326&f=geojson';
var mapNY = jsonText;

var directionsService;
var directionsRenderer;

function initMap(){
	mapNY = new google.maps.Map(document.getElementById('map'), {
		zoom: 10,
		center: NYU_coordenates,
    });

	var image = 'https://cdn4.iconfinder.com/data/icons/maps-and-pins-4/512/map_pin_destination_location_address_university_college-2-48.png';
	NYU_coordenates = new google.maps.Marker({
        position: NYU_coordenates,
        map: map,
		icon: image,
	    title: 'NYU Stern'
    });

	NYU_coordenates.setMap(mapNY);
	mapNY.data.loadGeoJson('https://services5.arcgis.com/GfwWNkhOj9bNBqoJ/arcgis/rest/services/nycd/FeatureServer/0/query?where=1=1&outFields=*&outSR=4326&f=geojson');
	drawDistricts();

	directionsService = new google.maps.DirectionsService();
	directionsRenderer = new  google.maps.DirectionsRenderer();
	//markerEvents(neighborhoodsPoint);

}

function drawDistricts(){

    mapNY.data.setStyle(function(feature) {
    var id = feature.getProperty('BoroCD');
    var color;

        if(id > 100 && id <= 200){
            color = 'blue';
        }
        if(id > 200 && id <= 300){
            color = 'yellow';
        }
        if(id > 300 && id <= 400){
            color = 'red';
        }
        if(id > 400 && id <= 450){
            color = 'orange';
        }
        if(id > 450){
            color = 'green';
        }

       return {
          fillColor: color,
					strokeWeight: 1,
					fillOpacity: 0.2
      };
    });
}

function getNeighborhoodNames(){
  var data = $.get(NeighborhoodNames_URL,function(){})
    .done(function(){

        var dataRow = data.responseJSON.data;
        for (var i = 0; i < dataRow.length; i++) {
        		neighborhoods.push([dataRow[i][9],dataRow[i][10], dataRow[i][16]]);
        }
				//alert(dataRow[0][11]);
        //var tableReference = $("#tableBody")[0];
        var newRow, neighborhood, point;
				var boroughID;

				for (var j = 0; j < dataRow.length; j++) {

						boroughID = dataRow[j][16];
						if (boroughID == 'Manhattan') {
							pointString = dataRow[j][9];
							//alert(pointString);
							var point = pointString.split(" ");
							//alert(point);
							point[1] = point[1].slice(1);
							var longitud = parseFloat(point[1]);
							//alert(length);
							point[2] = point[2].slice(0,16);
							var latitude = parseFloat(point[2]);
							//alert(latitude);

							var neighborhoodName = dataRow[j][10];
							var neighborhoodsPoint = {lat: latitude, lng: longitud};
							neighborhoodsPoint = new google.maps.Marker({
									position: neighborhoodsPoint,
									map: map,
									title: neighborhoodName
							});
						//alert(neighborhoodsPoint);
						neighborhoodsPoint.setMap(mapNY);
						markerEvents(neighborhoodsPoint);
						}

				}
      /*
        for (var i = 0; i < neighborhoods.length; i++) {
            newRow = tableReference.insertRow(tableReference.rows.length);

            point = newRow.insertCell(0);
            neighborhood = newRow.insertCell(1);
    		district = newRow.insertCell(2);

            point.innerHTML = neighborhoods[i][0];
            neighborhood.innerHTML = neighborhoods[i][1];
            district.innerHTML = neighborhoods[i][2];

        }
        */
      console.log(neighborhoods);

    })
    .fail(function(error){
    console.log(error);
  })
}

function markerEvents(marker){
  if(!(marker == "undefined")){
    marker.addListener("click",function(){
      getRoute();
    });
  }
}

function getRoute(){
  var request = {
    origin: NYU_coordenates.position,
    destination: neighborhoodsPoint.position,
    travelMode: 'DRIVING'
  }
  directionsRenderer.setMap(mapNY);
  directionsService.route(request, function(result,status){
    if(status == "OK"){
      directionsRenderer.setDirections(result);
    }
  });
}

function getHousingNY(){
  var data = $.get(HousingNY_URL,function(){})
    .done(function(){

        var dataRow = data.responseJSON.data;
        
        for (var i = 0; i < dataRow.length; i++) {
			
			lowIncome[i] = dataRow[i][31];
			
		    if(lowIncome[i] > 150){
		        // Proyect Name, Building ID, Street, Borough, Coincii District, Latitude, Longitud, Extremely Low Incomes Units, Total Units
			    housing.push([dataRow[i][9],dataRow[i][12],dataRow[i][14],dataRow[i][15],dataRow[i][20],dataRow[i][22],dataRow[i][25],dataRow[i][26],dataRow[i][31],dataRow[i][48]]);
			    
			    //if(dataRow[i][22] )
			    
			    latitudeString = dataRow[i][25];
			    longitudString = dataRow[i][26];
    			var latitude = parseFloat(latitudeString);
                var longitud = parseFloat(longitudString);
                //alert("latitude " + typeof latitude + " " + latitude);
			    //alert("longitud " + typeof longitud + " " + longitud);
    			var housingName = dataRow[i][9];
    			var housingPoint = {lat: latitude, lng: longitud};
    			
				var image = 'https://cdn4.iconfinder.com/data/icons/maps-and-pins-4/512/map_pin_destination_location_adress_house_home-2-32.png';
				    housingPoint = new google.maps.Marker({
					position: housingPoint,
					map: map,
					icon: image,
					title: housingName
				});
				//alert(neighborhoodsPoint);
				housingPoint.setMap(mapNY);
			    
			}	
			
        }
        //alert(dataRow.length);
        //alert(lowIncome);

//
    })
		console.log(housing);
}

/*
$.ajax({
    url: "https://data.cityofnewyork.us/resource/9s4h-37hy.json",
    type: "GET",
    data: {
      "$limit" : 5000,
      "$$app_token" : "YOURAPPTOKENHERE"
    }
}).done(function(data) {
  alert("Retrieved " + data.length + " records from the dataset!");
  console.log(data);
});
*/
$("document").ready(function(){
  $("#getNeighborhoodNames").on("click", getNeighborhoodNames)
})

$("document").ready(function(){
  $("#getHousingNY").on("click", getHousingNY).data('position')
})
/*
$("document").ready(function(data){
  $("#getSafety").on("click")
})
*/
/*
function toggleBounce() {
  if (NYU_coordenates.getAnimation() == null) {
    NYU_coordenates.setAnimation(null);
  } else {
    NYU_coordenates.setAnimation(google.maps.Animation.BOUNCE);
  }
}
*/
