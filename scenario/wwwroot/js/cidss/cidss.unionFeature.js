importScripts("../turf/turf.min.js");
onmessage = function (event) {
    var features = event.data;
    var subUnitedFeatures = [];
    var fatherIndex = features.length / 50;
    console.info(fatherIndex + "" + features.length);
    for (var index = 0; index < fatherIndex; index++) {
        var subLen = 0;
        if ((index + 1) * 50 > features.length) {
            subLen = features.length;
        } else {
            subLen = (index + 1) * 50;
        }
        var feature = features[index * 50];
        for (var i = index * 50; i < subLen; i++) {
            try {
                feature = turf.union(feature, features[i]);
            } catch (error) {
                if (error.message.includes("non-noded intersection")) {
                    var split = turf.unkinkPolygon(features[i]);
                    var subFeatures = split.features;
                    for (var j = 1; j < subFeatures.length; j++) {
                        feature = turf.union(feature, subFeatures[j]);
                    }
                } else {
                    console.info(error);
                }
            }
            postMessage(1);
        }
        subUnitedFeatures.push(feature);
    }
    var unionFeature = subUnitedFeatures[0];
    for (var index = 1; index < subUnitedFeatures.length; index++) {
        try {
            unionFeature = turf.union(unionFeature, subUnitedFeatures[index]);
        } catch (error) {
            if (error.message.includes("non-noded intersection")) {
                var split = turf.unkinkPolygon(subUnitedFeatures[index]);
                var subFeatures = split.features;
                for (var j = 1; j < subFeatures.length; j++) {
                    unionFeature = turf.union(unionFeature, subFeatures[j]);
                }
            } else {
                console.info(error);
            }
        }
    }
    var type = unionFeature.geometry.type;
    if (type != "undefined" && type == "Polygon") {
        var coord = unionFeature.geometry.coordinates;
        var newCoord = [];
        var border = [];
        for (var index = 0; index < coord.length; index++) {
            var linestring = coord[index];
            if (linestring.length > border.length) {
                border = linestring;
            }
        }
        newCoord.push(border);
        unionFeature.geometry.coordinates = newCoord;
    }
    postMessage({data: unionFeature});
}