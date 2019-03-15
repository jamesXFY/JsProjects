/**
 * union geoJSON, group several features into one feature,
 * feature[0]'s properties will be inherited
 */
/**
 * union geoJSON, group several features into one feature,
 * feature[0]'s properties will be inherited
 */
var featureCollectionBorder = {
    wholeLen: 0,
    fetchIndex: 0,
    geoJSONData: null,
    unionedgeoJSON: {
        type: "FeatureCollection",
        crs: { "type": "name", "properties": { "name": "urn:ogc:def:crs:EPSG::28356" } },
        features: []
    },
    initialize: function (geoJSONData) {
        //featureCollectionBorder.geoJSONData = turf.simplify(geoJSONData,0.01);
        featureCollectionBorder.geoJSONData = geoJSONData;
    
        if (geoJSONData.hasOwnProperty("type")) {
            featureCollectionBorder.unionedgeoJSON.type = geoJSONData.type;
        }
        if (geoJSONData.hasOwnProperty("crs")) {
            //featureCollectionBorder.unionedgeoJSON.crs = geoJSONData.crs;
        }
    },
    unionFeaturesByWorker: function (shapeFileID, geoJSONData) {
        return new Promise(function (resolve, reject) {
            var geoJSON = {
                "type": geoJSONData.type,
                "crs": geoJSONData.crs,
                "features": []
            };
            var features = geoJSONData.features;
            var unionFeature;
            if (window.Worker) {
                var unionWorker = new Worker('js/cidss/cidss.unionFeature.js');
                unionWorker.postMessage(features);
                unionWorker.onmessage = function (e) {
                    var o = e.data;
                    if (typeof o == "number") {
                        prePorcessFunction.fetchIndex += 1;
                    } else {
                        prePorcessFunction.fetchIndex += 0;
                        if (o.data != window.undefined) {
                            var result = {};
                            unionFeature = o.data;
                            unionFeature.properties["shapeFileID"] = shapeFileID;
                            geoJSON.features.push(unionFeature);
                            result["id"] = shapeFileID;
                            result["data"] = geoJSON;
                            console.info(result);
                            resolve(result);
                        }
                    }
                    var percent = ((prePorcessFunction.fetchIndex / prePorcessFunction.wholeLen) * 100).toFixed();

                    $("#displayProgress")[0].style.width = percent + "%";
                    $("#displayProgress")[0].innerText = percent + "%";
                }
            }



        });
    },

    unionFeatures: function (shapeFileID) {
        var geoJSON = {
            "type": featureCollectionBorder.unionedgeoJSON.type,
            "crs": featureCollectionBorder.unionedgeoJSON.crs,
            "features": []
        };
        var features = featureCollectionBorder.geoJSONData.features;
        var unionFeature;
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
            }
            subUnitedFeatures.push(feature);
        }
        unionFeature = subUnitedFeatures[0];
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
        if (type != window.undefined && type == "Polygon") {
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
            unionFeature.properties["shapeFileID"] = shapeFileID;
            geoJSON.features.push(unionFeature);
        }
        return geoJSON;

    }
}

var prePorcessFunction = {
    scenarioFile: null,
    geoJSONAttrName: "shapeFileID",
    originalGeoJSON: {
        id: "",
        features: []
    },
    preProcessedGeoJSON: {
        id: "",
        features: []
    },

    setgeoJSONAttrName: function (geoJSONAttrName) { prePorcessFunction.geoJSONAttrName = geoJSONAttrName },

    clearUI: function () {
        prePorcessFunction.scenarioFile = null;
        prePorcessFunction.geoJSONAttrName = "shapeFileID";
        prePorcessFunction.preProcessedGeoJSON = {
            id: "",
            features: []
        };
        prePorcessFunction.originalGeoJSON = {
            id: "",
            features: []
        };
    },

    initialize: function (fileID) {
        prePorcessFunction.clearUI();
        prePorcessFunction.preProcessedGeoJSON.id = fileID;
        prePorcessFunction.originalGeoJSON.id = fileID;
        d3.csv(truiiWCF.GetFileDownloadUrl(fileID), function (d) {
            prePorcessFunction.scenarioFile = d;
            prePorcessFunction.preProcessing();
            //prePorcessFunction.pushProcessedDataToGolbal();
        });
    },

    preProcessing: function () {
        var fileIDS = [];
        for (var index = 0; index < prePorcessFunction.scenarioFile.length; index++) {
            var pu = prePorcessFunction.scenarioFile[index];
            var fileID = pu[prePorcessFunction.geoJSONAttrName];
            if (fileID != null && fileID != "" && fileID != window.undefined && fileID != 0) {
                fileIDS.push(fileID);
            }
        }
        var filesData = [];
        truiiWCF.getGeoTaggingForCIDSS(fileIDS, this.unionFeatures);
    },
    unionFeatures: function (datas, status) {
        if (status) {
            if (window.Worker) {
                prePorcessFunction.wholeLen = 0;
                prePorcessFunction.fetchIndex = 0;
                for (var index = 0; index < datas.length; index++) {
                    prePorcessFunction.wholeLen += datas[index].data.geoData.features.length;
                }
                var promises = [];
                for (var index = 0; index < datas.length; index++) {
                    var ofeature = {};
                    var data = datas[index].data.geoData;
                    ofeature["id"] = datas[index].id;
                    ofeature["data"] = data;
                    prePorcessFunction.originalGeoJSON.features.push(ofeature);
                    promises.push(featureCollectionBorder.unionFeaturesByWorker(datas[index].id,data));
                }
                Promise.all(promises).then(function (data) {
                    console.info(data);
                    prePorcessFunction.preProcessedGeoJSON.features = data;
                    prePorcessFunction.pushProcessedDataToGolbal();
                    $('#progessBar').modal('toggle');
                });

            } else {
                for (var index = 0; index < datas.length; index++) {
                    var ofeature = {};
                    var feature = {};
                    var data = datas[index].data.geoData;
                    ofeature["id"] = datas[index].id;
                    ofeature["data"] = data;
                    prePorcessFunction.originalGeoJSON.features.push(ofeature);
                    featureCollectionBorder.initialize(data);
                    var unionedFeature = featureCollectionBorder.unionFeatures(datas[index].id);
                    feature["id"] = datas[index].id;
                    feature["data"] = unionedFeature;
                    console.info(unionedFeature);
                    prePorcessFunction.preProcessedGeoJSON.features.push(feature);
                }
                prePorcessFunction.pushProcessedDataToGolbal();
            }
            
        } else
        {
            console.info(datas);
        }
        
    },
    pushProcessedDataToGolbal: function () {
        CIDSSAjax.unionedPUFilesGlobalSetting({ "scnariofile": prePorcessFunction.preProcessedGeoJSON});
        CIDSSAjax.PUFilesGlobalSetting({ "scnariofile": prePorcessFunction.originalGeoJSON });
        document.getElementById("cidssBody").style.cursor = "auto";
    }
}