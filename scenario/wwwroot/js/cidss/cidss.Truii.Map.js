// defaultOptions for the layers 
var defaultOptions = {
    fillColor: 'blue',
    fillOpacity: 10,
    weight: 1,
    opacity: 0.1
}
//defalut options for the markers
var geojsonMarkerOptions = {
    radius: 8,
    fillColor: "#ff7800",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
};



var closeMsg = function () {
	var messBox = document.getElementById("messagebox");
	messBox.hidden = true;
}
var getRiskStars = function (riskO, riskT, htmlregion) {
    var keys = Object.keys(riskO);
    if (htmlregion == "message") {
        document.getElementById("Orisk").innerHTML = "<font style='font-size: 20px;'>" + riskO['Combined'] + "</font>";
        document.getElementById("Trisk").innerHTML = "<font style='font-size: 20px;'>" + riskT['Combined'] + "</font>";
    } else {
        document.getElementById("OSrisk").innerHTML = "<font style='font-size: 20px;'>" + riskO['Combined'] + "</font>";
        document.getElementById("TSrisk").innerHTML = "<font style='font-size: 20px;'>" + riskT['Combined'] + "</font>";
    }

    //var Orisk=document.getElementsByName(Orisk);
    for (var k = 0; k < keys.length; k++) {
        var targetDiv;
        if (htmlregion == "message") {
            targetDiv = document.getElementsByName(keys[k]);
        } else {
            targetDiv = document.getElementsByName("S" + keys[k]);
        }
        //document.getElementById("s7").style.backgroundImage = "url(start.jpg)";
        var riskOlevel = riskO[keys[k]];
        var riskTlevel = riskT[keys[k]];
        for (var i = 0; i < targetDiv.length; i++) {
            if (i < riskOlevel) {
                targetDiv[i].style.backgroundImage = "url(/images/start.jpg)";
            } else if (i < 5) {
                targetDiv[i].style.backgroundImage = "url(/images/yellow.jpg)";
            } else if (i < (riskTlevel + 5)) {
                targetDiv[i].style.backgroundImage = "url(/images/start.jpg)";
            } else {
                targetDiv[i].style.backgroundImage = "url(/images/yellow.jpg)";
            }
        }
    }

}
var getRisk = function (Id, risk) {
	for (var i = 0; i < risk.length; i++) {
		if (Id == risk[i].LocationId) {
			var risk = risk[i];
			return risk;
		}
	}
}

//should be modified according to user's setting
var getColor = function (Id, risk) {
	for (var i = 0; i < risk.length; i++) {
		if (Id == risk[i].LocationId) {
			var color = parseFloat(risk[i].Microbial, 10) > 4 ? '#800026' :
				parseFloat(risk[i].Microbial, 10) > 3 ? '#F8696B' :
					parseFloat(risk[i].Microbial, 10) > 2 ? '#FCAA78' :
						parseFloat(risk[i].Microbial, 10) > 1 ? '#FFEB84' :
							parseFloat(risk[i].Microbial, 10) > 0 ? '#CBDC81' : '#FED976';
			return color;
		}
	}
}

// using default options and user setting to change the style, and refine differnt style functions
var myStyle = function (feature) {
	return {
		fillColor: getColor(feature.properties.Id, risk02),
		fillOpacity: 10,
		weight: 1,
		opacity: 0.1
	}

};
var myStyle2 = function (feature) {
	return {
		fillColor: getColor(feature.properties.Id, risk01),
		fillOpacity: 10,
		weight: 1,
		opacity: 0.1
	}

};
function mouseover(e) {
	var layer = e.target;
	layer.setStyle({
		color: 'blue'
	});
	layer.bringFront();
}
function mouseout(e) {
	geoJson1.resetStyle(e.target);
	//geoJson2.resetStyle(e.target);
}
var onclick = function (e) {
    var layer = e.target;
        //alert(risk02);
        var riskO = getRisk(layer.feature.properties.Id, risk02);
        var riskT = getRisk(layer.feature.properties.Id, risk01);
        //document.getElementById("regionName").innerHTML=layer.feature.properties.NAME
        var namekey;
        var keys = Object.keys(layer.feature.properties)
        //for whole brisbane area, there is no name in the json file
        for (var j = 0; j < keys.length; j++) {
            if (keys[j].indexOf("nam") !== -1) {
                namekey = keys[j];
            }

        }
        document.getElementById("regionName").innerHTML = namekey;
        // alert(Object.keys(risk));
        // alert(parseInt(risk.keys()[3],10));
        getRiskStars(riskO, riskT, "message");
        var point = e.originalEvent;// mouse click position
        var messagebox = document.getElementById("messagebox");
        messagebox.style.position = "absolute";
        var table = document.getElementById("mapTable");
        //messagebox.style.left = (point.x + 0.0292 * screen.height+18.7) + "px";
        //messagebox.style.top = (point.y + 0.1273 * screen.width+80.6) + "px";
        //alert(table.clientWidth);
        messagebox.style.width = 0.445 * screen.width + "px";
        messagebox.style.left = (point.pageX + 20) + "px";
        messagebox.style.top = (point.pageY - 50) + "px";
        messagebox.hidden = false;
}
var clickfortherisk = function (e) {
	var latlnge = e.latlng;
	var point = turf.point([latlnge.lng, latlnge.lat]);
	var features = statesData.features;
	var feature;
	for (var i = 0; i < features.length; i++) {
		//alert(features[i].geometry.coordinates);
		var poly = turf.multiPolygon(features[i].geometry.coordinates);
		// alert(poly);
		var flag = turf.inside(point, poly);
		if (flag) {
			feature = features[i];
			break;
		}
	}
	//alert(layer.feature.properties.Id);
	var riskO = getRisk(feature.properties.Id, risk02);
    var riskT = getRisk(feature.properties.Id, risk01);
    alert(layer.feature.properties.NAME);
	//document.getElementById("regionName").innerHTML=layer.feature.properties.NAME;
	document.getElementById("regionName").innerHTML = "Wivenhoe catchments NW";
	// alert(Object.keys(risk));
	// alert(parseInt(risk.keys()[3],10));
	getRiskStars(riskO, riskT);
	var point = e.containerPoint;// mouse click position
	var messagebox = document.getElementById("messagebox");
	messagebox.style.position = "absolute";
	messagebox.style.left = (point.x + 21) + "px";
	messagebox.style.top = (point.y + 0.1273 * screen.width) + "px";
	messagebox.hidden = false;
}



var oneachfeature = function (feature, layer) {
	layer.on({
		mouseover: mouseover,
		mouseout: mouseout,
		zoomstart: closeMsg,
		click: onclick
	});
};

function mouseoverForTarget(e) {
	var layer = e.target;
	layer.setStyle({
		color: 'blue'
	});
	layer.bringFront();
}
function mouseoutForTarget(e) {
	geoJson2.resetStyle(e.target);
}
var onclickForTarget = function (e) {
	var layer = e.target;
	//alert(layer.feature.properties.Id);
	var riskO = getRisk(layer.feature.properties.Id, risk02);
	var riskT = getRisk(layer.feature.properties.Id, risk01);
	//document.getElementById("regionName").innerHTML=layer.feature.properties.NAME;
	document.getElementById("regionName").innerHTML = "Wivenhoe catchments NW";
	// alert(Object.keys(risk));
	// alert(parseInt(risk.keys()[3],10));
	getRiskStars(riskO, riskT);
	var point = e.containerPoint;// mouse click position
	var messagebox = document.getElementById("messagebox");
	messagebox.style.position = "absolute";
	messagebox.style.left = (point.x + 21) + "px";
	messagebox.style.top = (point.y + 0.1273 * screen.width) + "px";
	messagebox.hidden = false;
}
var oneachfeatureForTarget = function (feature, layer) {
	layer.on({
		mouseover: mouseoverForTarget,
		mouseout: mouseoutForTarget,
		click: onclickForTarget,
		zoomend: mouseoutForTarget
	});
};

var warterTreatMentF = function (feature, latlng) {
	var marker = L.marker(latlng, geojsonMarkerOptions);
	return marker;
}
function waterClick(e) {

	var layer = e.target;
	var id = layer.feature.properties["WTP_ID"];
	if (map.hasLayer(geoJson1)) {
		map.removeLayer(geoJson1);
	}
	if (tMap.hasLayer(geoJson2)) {
		tMap.removeLayer(geoJson2);
	}
	if (map.hasLayer(waterReigon)) {
		map.removeLayer(waterReigon);
	}
	if (tMap.hasLayer(waterReigon2)) {
		tMap.removeLayer(waterReigon2);
	}
	if (id.toString().endsWith(1) || id.toString().endsWith(6)) {
		waterReigon = L.geoJSON(WTP_ID5, { style: myStyle, onEachFeature: oneachfeature });
		waterReigon.addTo(map);
		waterReigon2 = L.geoJSON(WTP_ID5, { style: myStyle2, onEachFeature: oneachfeatureForTarget });
		waterReigon2.addTo(tMap);
	}
	if (id.toString().endsWith(2) || id.toString().endsWith(7)) {
		waterReigon = L.geoJSON(WTP_ID4, { style: myStyle, onEachFeature: oneachfeature });
		waterReigon.addTo(map);
		waterReigon2 = L.geoJSON(WTP_ID4, { style: myStyle2, onEachFeature: oneachfeatureForTarget });
		waterReigon2.addTo(tMap);
	}
	if (id.toString().endsWith(3) || id.toString().endsWith(8)) {
		waterReigon = L.geoJSON(WTP_ID3, { style: myStyle, onEachFeature: oneachfeature });
		waterReigon.addTo(map);
		waterReigon2 = L.geoJSON(WTP_ID3, { style: myStyle2, onEachFeature: oneachfeatureForTarget });
		waterReigon2.addTo(tMap);
	}
	if (id.toString().endsWith(4) || id.toString().endsWith(9)) {
		waterReigon = L.geoJSON(WTP_ID2, { style: myStyle, onEachFeature: oneachfeature });
		waterReigon.addTo(map);
		waterReigon2 = L.geoJSON(WTP_ID2, { style: myStyle2, onEachFeature: oneachfeatureForTarget });
		waterReigon2.addTo(tMap);
	}
	if (id.toString().endsWith(5) || id.toString().endsWith(0)) {
		waterReigon = L.geoJSON(WTP_ID1, { style: myStyle, onEachFeature: oneachfeature });
		waterReigon.addTo(map);
		waterReigon2 = L.geoJSON(WTP_ID1, { style: myStyle2, onEachFeature: oneachfeatureForTarget });
		waterReigon2.addTo(tMap);
	}


}
function waterFeature(feature, layer) {
	layer.on({
		click: waterClick
	});
}

function colorDiffer(feature) {
	//alert(feature.properties.type);
	if (feature.properties.Type == "Land") {
		return {
			fillColor: 'white',
			fillOpacity: 0.1,
			color: 'black',
			weight: 0.5,
			opacity: 10
		}
	} else {
		return {
			fillColor: '#4C94CE',
			fillOpacity: 0.9,
			color: '#4C94CE',
			weight: 1,
			opacity: 10
		}
	}
}