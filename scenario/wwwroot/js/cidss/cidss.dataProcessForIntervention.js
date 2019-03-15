var interventionTableConstructor = {
    unionedFiles: null,  //combined PU
    originalFiles: null,  // featureed PU
    /**
        overall risk store the overallriskdata
    */
    overallRisks: {},
    detailRisks: null,

    currentPUFileIDS : null,
    currentSITE: null,

    actionArray: [], // action array store the map and barchart data according to the click action

    newFileName : "", // new scenario file name

    mouseOverFunc: function () {
        $(".slider").css("opacity", 1);
    },
    mouseOutFunc: function () {
        $(".slider").css("opacity", 0);
    },


    clickFunction: function (PUFileID, keyName) {
        if (keyName == "shapeFileID") {
            var currentDetail = {};
            var currentScenario = interventionTableConstructor.overallRisks.scenario;
            for (var index = 0; index < currentScenario.length; index++) {
                if (currentScenario[index].shapeFileID == PUFileID) {
                    currentDetail["key"] = PUFileID;
                    interventionTableConstructor.currentPUFileIDS = currentScenario[index];
                    interventionTableConstructor.getFileStructure(currentScenario[index], currentDetail, interventionTableConstructor.doneFunc, PUFileID, "Pfaf_code");
                    break;
                }
            }
            interventionTableConstructor.detailRisks = currentDetail;
        }
        else if (keyName == "Pfaf_code") {
            var currentFileStruct = interventionTableConstructor.detailRisks;
            var currentSite = {};
            currentSite["key"] = PUFileID;
            for (var index = 0; index < currentFileStruct.scenarioRiskO.length; index++) {
                if (currentFileStruct.scenarioRiskO[index][keyName] == PUFileID) {
                    currentSite["scenarioRiskO"] = interventionTableConstructor.detailRisks.scenarioRiskO[index];
                    currentSite["scenarioRiskT"] = interventionTableConstructor.detailRisks.scenarioRiskT[index];

                    interventionTableConstructor.updateDataForBarChart(interventionTableConstructor.detailRisks.scenarioRiskO, interventionTableConstructor.detailRisks.scenarioRiskT, interventionTableConstructor.detailRisks.intervention, interventionTableConstructor.detailRisks.cost, interventionTableConstructor.overallRisks.unitArea, PUFileID, keyName , true);
                    interventionTableConstructor.currentSITE = currentSite;
                    break;
                }
            }
        }
        else if (keyName == "father") {
            if (interventionTableConstructor.currentSITE != null) {
                interventionTableConstructor.currentSITE = null;
                interventionTableConstructor.updateDataForBarChart(interventionTableConstructor.overallRisks.scenarioRiskO, interventionTableConstructor.overallRisks.scenarioRiskT, interventionTableConstructor.overallRisks.intervention, interventionTableConstructor.overallRisks.cost, interventionTableConstructor.overallRisks.unitArea, interventionTableConstructor.detailRisks.key, "Pfaf_code");
            }
            else if (interventionTableConstructor.detailRisks != null) {
                interventionTableConstructor.currentPUFileIDS = null;
                interventionTableConstructor.detailRisks = null;
                interventionTableConstructor.updateDataForBarChart(interventionTableConstructor.overallRisks.scenarioRiskO, interventionTableConstructor.overallRisks.scenarioRiskT, interventionTableConstructor.overallRisks.intervention, interventionTableConstructor.overallRisks.cost, interventionTableConstructor.overallRisks.unitArea, interventionTableConstructor.unionedFiles.id, "Pfaf_code");
                setTimeout(function () { interventionTableConstructor.updateDataForMap(interventionTableConstructor.overallRisks.scenarioRiskO, interventionTableConstructor.overallRisks.scenarioRiskT, "shapeFileID", keyName); }, 700);
            }
        }
        else if (keyName == "apply")
        {
            var updateVals = dataIniForIntervention.regroupDataFromHOT(PUFileID);
            if (updateVals.length > 0)
            {
                var pCode = updateVals[updateVals.length - 1][0];
                var id = interventionTableConstructor.unionedFiles.id;
                console.info(interventionTableConstructor.currentPUFileIDS.InterventionFildID + "" + id + "" + updateVals + "" + interventionTableConstructor.detailRisks);
                var shapeFileID = interventionTableConstructor.detailRisks.key;
                
                truiiWCF.runCIDSSOptimization(interventionTableConstructor.currentPUFileIDS.InterventionFildID, id, updateVals, shapeFileID, false, "", function (data) {
                    console.info(data);
                    interventionTableConstructor.overallRisks["key"] = data;
                    d3.csv(truiiWCF.GetFileDownloadUrl(data), function (data) {
                        interventionTableConstructor.overallRisks["scenario"] = data;
                        interventionTableConstructor.getFileStructure(interventionTableConstructor.overallRisks["scenario"][0], interventionTableConstructor.overallRisks, interventionTableConstructor.updateAfterUpdateIntervention);
                    });
                });
            }
        } else if (keyName == "creatNewFiles") {
            var updateVals = dataIniForIntervention.regroupDataFromHOT(PUFileID);
            if (updateVals.length > 0) {
                var pCode = updateVals[updateVals.length - 1][0];
                var id = interventionTableConstructor.unionedFiles.id;
                console.info(interventionTableConstructor.currentPUFileIDS.InterventionFildID + "" + id + "" + updateVals + "" + interventionTableConstructor.detailRisks);
                var shapeFileID = interventionTableConstructor.detailRisks.key;

                truiiWCF.runCIDSSOptimization(interventionTableConstructor.currentPUFileIDS.InterventionFildID, id, updateVals, shapeFileID, true, newFileName, function (data) {
                    console.info(data + "the returned data from truii");
                    interventionTableConstructor.overallRisks["key"] = data;
                    d3.csv(truiiWCF.GetFileDownloadUrl(data), function (data) {
                        interventionTableConstructor.overallRisks["scenario"] = data;
                        interventionTableConstructor.getFileStructure(interventionTableConstructor.overallRisks["scenario"][0], interventionTableConstructor.overallRisks, interventionTableConstructor.updateAfterUpdateIntervention);
                    });
                });
            }
        }
    },

    updateAfterUpdateIntervention: function () {
        //over all risk update
        var baseLayers = maps.baseLayers;
        var overLayers = maps.overLayers;
        //rerender the baseLayer
        //for (var baseIndex= 0; baseIndex < baseLayers.length; baseIndex++)
        //{
        //    var LgeoObject = baseLayers[baseIndex].left;
        //    var RgeoObject = baseLayers[baseIndex].right;
        //    LgeoObject.setStyle(function (feature) { return maps.getFeatureStyle(feature, interventionTableConstructor.overallRisks.scenarioRiskT, "shapeFileID"); });
        //    RgeoObject.setStyle(function (feature) { return maps.getFeatureStyle(feature, interventionTableConstructor.overallRisks.scenarioRiskO, "shapeFileID"); });
        //    baseLayers[baseIndex].left = LgeoObject;
        //    baseLayers[baseIndex].right = RgeoObject;

        //}
        //remove old over layers
        var LgeoObject = overLayers[overLayers.length - 1].left;
        var RgeoObject = overLayers[overLayers.length - 1].right;
        maps.leftMap.removeLayer(LgeoObject);
        maps.rightMap.removeLayer(RgeoObject);
        overLayers.splice(overLayers.length - 1, 1);

        interventionTableConstructor.currentPU = null;
        interventionTableConstructor.currentSITE = null;
        //reload detail risk for the map and redraw overLayer
        interventionTableConstructor.clickFunction(interventionTableConstructor.detailRisks.key,"shapeFileID");
    },

    doneFunc: function (currentFileStruct, index, keyName) {
        interventionTableConstructor.updateDataForBarChart(interventionTableConstructor.overallRisks.scenarioRiskO, interventionTableConstructor.overallRisks.scenarioRiskT, interventionTableConstructor.overallRisks.intervention, interventionTableConstructor.overallRisks.cost, interventionTableConstructor.overallRisks.unitArea, index, keyName);
        setTimeout(function () { interventionTableConstructor.updateDataForMap(currentFileStruct.scenarioRiskO, currentFileStruct.scenarioRiskT, currentFileStruct.key ,"Pfaf_code"); }, 700);
    },




    scenarioFiles: null,
    currentPU: null,

    initialize: function (unionedFiles, originalFiles) {
        this.unionedFiles = unionedFiles;
        this.originalFiles = originalFiles;
        this.overallRisks["key"] = unionedFiles.id;
        d3.csv(truiiWCF.GetFileDownloadUrl(unionedFiles.id), function (data) {
            interventionTableConstructor.overallRisks["scenario"] = data;
            interventionTableConstructor.getFileStructure(interventionTableConstructor.overallRisks["scenario"][0], interventionTableConstructor.overallRisks, interventionTableConstructor.afterLoadingData);
        });
    },

    getFileStructure: function (PU, currentFileStruct, doneF,index, keyName) {
        var scenarioRiskOFileID = PU.riskBeforeFildID;
        var scenarioRiskTFileID = PU.riskAfterFildID;
        var scenarioInterventionFileID = PU.InterventionFildID;
        var scenarioCostFileID = PU.CostFildID;
        var scenarioUnitAreaFileID = PU.UnitAreaFildID;
        var promisses = [];
        promisses.push(interventionTableConstructor.getCSVFileData(scenarioRiskOFileID, currentFileStruct["scenarioRiskO"]));
        promisses.push(interventionTableConstructor.getCSVFileData(scenarioRiskTFileID, currentFileStruct["scenarioRiskT"]));
        promisses.push(interventionTableConstructor.getCSVFileData(scenarioInterventionFileID, currentFileStruct["intervention"]));
        promisses.push(interventionTableConstructor.getCSVFileData(scenarioCostFileID, currentFileStruct["cost"]));
        promisses.push(interventionTableConstructor.getCSVFileData(scenarioUnitAreaFileID, currentFileStruct["unitArea"]));
        Promise.all(promisses).then(function (data) {
            currentFileStruct["scenarioRiskO"] = data[0];
            currentFileStruct["scenarioRiskT"] = data[1];
            currentFileStruct["intervention"] = data[2];
            currentFileStruct["cost"] = data[3];
            currentFileStruct["unitArea"] = data[4];
            doneF(currentFileStruct, index, keyName);
        });
    },

    getCSVFileData: function (fileID, targetObject) {
        return new Promise(function(resolve, reject){
            d3.csv(truiiWCF.GetFileDownloadUrl(fileID), function (data) {
                //currentFileStruct["scenarioRiskO"] = risko;
                targetObject = data;
                resolve(data);
            });
        });
    },

    afterLoadingData: function (currentFileStruct) {
        interventionTableConstructor.mapProcess();
        interventionTableConstructor.barchartProcess();
    },
    mapProcess: function () {
        maps.mapsInitializAndSync("originalMap", "targetMap");
        maps.mapsClickFunc(interventionTableConstructor.clickFunction);
        maps.loadInitialGeoJson(statesData, "shapeFileID", interventionTableConstructor.overallRisks.scenarioRiskO, interventionTableConstructor.overallRisks.scenarioRiskT, "Pfaf_code", "Combined");

        var features = interventionTableConstructor.unionedFiles.features;
        for (var index = 0; index < features.length; index++) {
            maps.loadOverLayGeoJsons(features[index].data, "shapeFileID", interventionTableConstructor.overallRisks.scenarioRiskO, interventionTableConstructor.overallRisks.scenarioRiskT, "Pfaf_code", "Combined",false);
        }
    },
    barchartProcess: function () {
        //dataIni.initialize(scenario.overallRisks.scenarioRiskO, scenario.overallRisks.scenarioRiskT, scenario.overallRisks.intervention, scenario.overallRisks.cost, scenario.overallRisks.unitArea,);
        //dataIni.drawOverAllTitle("OVERALLRISK", this.unionedFiles.id, "Pfaf_code");
        //dataIni.drawbar("TSSTITLE", "Total Suspended Sediment(TSS)", "TSSBARCHART", this.unionedFiles.id, "Pfaf_code");
        //dataIni.drawBarWithChild("MICROBIALTITLE", "Microbial E.Coli/Protozoa", "MICROBIALBARCHART", this.unionedFiles.id, "Pfaf_code");
        //dataIni.drawInterVentionAndCost("KEYINTERVENTION", "Key Interventions in this Region", "INTERVENTIONDESCRIPTION", this.unionedFiles.id, "Pfaf_code");
        dataIniForIntervention.initialize("INTERVENTIONTABLE", interventionTableConstructor.overallRisks.intervention, interventionTableConstructor.overallRisks.cost, interventionTableConstructor.overallRisks.unitArea);
        dataIniForIntervention.drawInterventionTable(this.unionedFiles.id, "Pfaf_code");
    },

    updateDataForMap: function (riskO, riskT, key, geoJSONPrimaryKey) {
        console.info(key+"****");
        //var leftOverLayers = maps.overLayGeosForL;
        var overLayers = maps.overLayers;
        var baseLayers = maps.baseLayers;

        if (geoJSONPrimaryKey == "father") {

            var LgeoObject = overLayers[overLayers.length - 1].left;
            var RgeoObject = overLayers[overLayers.length - 1].right;
            maps.leftMap.removeLayer(LgeoObject);
            maps.rightMap.removeLayer(RgeoObject);
            overLayers.splice(overLayers.length - 1, 1);


            maps.rightMap.fitBounds(baseLayers[0].right.getBounds());
            maps.leftMap.fitBounds(baseLayers[0].left.getBounds());

            for (var index = 0; index < overLayers.length; index++) {
                var LgeoObject = overLayers[index].left;
                var RgeoObject = overLayers[index].right;
                LgeoObject.addTo(maps.leftMap);
                RgeoObject.addTo(maps.rightMap);
                LgeoObject.setStyle(function (feature) { return maps.getFeatureStyle(feature, interventionTableConstructor.overallRisks.scenarioRiskT, "shapeFileID"); });
                RgeoObject.setStyle(function (feature) { return maps.getFeatureStyle(feature, interventionTableConstructor.overallRisks.scenarioRiskO, "shapeFileID"); });
            }
        }
        else {
            for (var index = 0; index < overLayers.length; index++) {
                LgeoObject = overLayers[index].left;
                RgeoObject = overLayers[index].right;
                maps.leftMap.removeLayer(LgeoObject);
                maps.rightMap.removeLayer(RgeoObject);
            }
            for (var index = 0; index < originalFiles.length; index++) {
                if (key == originalFiles[index].id) {
                    maps.loadOverLayGeoJsons(originalFiles[index].data, geoJSONPrimaryKey, riskO, riskT, "Pfaf_code", "Combined", key, true);
                }
            }
        }

    },
    /**
        update bar chart data on click

        index : key in riskO and riskT

        keyName : keyName in riskO and riskT
    **/
    updateDataForBarChart: function (riskO, riskT, intervention,cost,unitarea ,index, keyName ,editable) {
        //dataIni.initialize(riskO, riskT, intervention, cost, unitarea);
        //dataIni.updateOverAllTitle("OVERALLRISK", index, keyName);
        //dataIni.updatebar("TSSBARCHART", index, keyName);
        //dataIni.updateBarWithChild("MICROBIALBARCHART", index, keyName);
        //dataIni.updateInterVentionAndCost("KEYINTERVENTION", "Key Interventions in this Region", "INTERVENTIONDESCRIPTION", index, keyName);

        dataIniForIntervention.initialize("INTERVENTIONTABLE", intervention, cost, unitarea);
        dataIniForIntervention.updateInterventionTable(index, keyName, editable);
    },

    splitStringTool: function(str, len) {
        var ret = [];
        for (var offset = 0, strLen = str.length; offset < strLen; offset += len) {
            ret.push(str.slice(offset, len + offset));
        }
        return ret;
    }
};

//var intervention = [{ Pfaf_code: "3614", ES_RS_eart: "0.89", ES_RS_rock: "1.68986666666667", ES_RS_gras: "5.9377569523156", ES_RS_vega: "4.76708236287874", ES_RS_fenc: "4.76708236287874", ES_HL_eart: "4.76708236287874" }];

//var cost = [{ Pfaf_code: "3614", ES_RS_eart: "100", ES_RS_rock: "100", ES_RS_gras: "100", ES_RS_vega: "100", ES_RS_fenc: "100", ES_HL_eart: "100" }];

//var unitarea = [{ ES_RS_eart: "ha", ES_RS_rock: "KM", ES_RS_gras: "pond", ES_RS_vega: "per system", ES_RS_fenc: "ha", ES_HL_eart: "km" }];

//var uintervention = [{ Pfaf_code: "3339", ES_RS_eart: "1000", ES_RS_rock: "5000", ES_RS_gras: "100000", ES_RS_vega: "300000", ES_RS_fenc: "50", ES_HL_eart: "7000000" }];

//var ucost = [{ Pfaf_code: "3339", ES_RS_eart: "1", ES_RS_rock: "5000000", ES_RS_gras: "4000", ES_RS_vega: "3301", ES_RS_fenc: "470", ES_HL_eart: "30000" }];

//var unitarea = [{ ES_RS_eart: "ha", ES_RS_rock: "KM", ES_RS_gras: "pond", ES_RS_vega: "per system", ES_RS_fenc: "ha", ES_HL_eart: "km" }];


var leftDiv = $("#originalMap");
var rightDiv = $("#targetMap");
$("#myRange").on("input", function () { sliderOnInput(this.value, leftDiv, rightDiv, 20) });
$(".maps").on("mouseover", function () { interventionTableConstructor.mouseOverFunc(); });
$(".maps").on("mouseout", function () { interventionTableConstructor.mouseOutFunc(); });
$(".maps").css("background-color", "#08BFDD");