var scenario = {
    unionedFiles: null,  //combined PU
    originalFiles: null,  // featureed PU
    /**
        overall risk store the overallriskdata
    */
    overallRisks: {},
    detailRisks: null,

    currentSITE: null,

    actionArray: [], // action array store the map and barchart data according to the click action

    // move mouse into the maps, change the opacity of the range slider
    mouseOverFunc: function () {
        $(".slider").css("opacity", 1);
    },
    mouseOutFunc: function () {
        $(".slider").css("opacity", 0);
    },


    clickFunction: function (PUFileID, keyName) {
        if (keyName == "shapeFileID") {
            var currentDetail = {};
            var currentScenario = scenario.overallRisks.scenario;
            for (var index = 0; index < currentScenario.length; index++) {
                if (currentScenario[index].shapeFileID == PUFileID) {
                    currentDetail["key"] = PUFileID;
                    scenario.getFileStructure(currentScenario[index], currentDetail, scenario.doneFunc, PUFileID, "Pfaf_code");
                    break;
                }
            }
            scenario.detailRisks = currentDetail;
        }
        else if (keyName == "Pfaf_code")
        {
            var currentFileStruct = scenario.detailRisks;
            var currentSite = {};
            currentSite["key"] = PUFileID;
            for (var index = 0; index < currentFileStruct.scenarioRiskO.length; index++) {
                if (currentFileStruct.scenarioRiskO[index][keyName] == PUFileID) {
                    currentSite["scenarioRiskO"] = scenario.detailRisks.scenarioRiskO[index];
                    currentSite["scenarioRiskT"] = scenario.detailRisks.scenarioRiskT[index];

                    scenario.updateDataForBarChart(scenario.detailRisks.scenarioRiskO, scenario.detailRisks.scenarioRiskT, scenario.detailRisks.intervention, scenario.detailRisks.cost, scenario.overallRisks.unitArea, PUFileID, keyName);
                    scenario.currentSITE = currentSite;
                    break;
                }
            }
        }
        else if (keyName == "father") {
            
            if (scenario.currentSITE != null) {
                scenario.currentSITE = null;
                scenario.updateDataForBarChart(scenario.overallRisks.scenarioRiskO, scenario.overallRisks.scenarioRiskT, scenario.overallRisks.intervention, scenario.overallRisks.cost, scenario.overallRisks.unitArea, scenario.detailRisks.key, "Pfaf_code");
            }
            else if (scenario.detailRisks != null) {
                scenario.detailRisks = null;
                scenario.updateDataForBarChart(scenario.overallRisks.scenarioRiskO, scenario.overallRisks.scenarioRiskT, scenario.overallRisks.intervention, scenario.overallRisks.cost, scenario.overallRisks.unitArea, scenario.unionedFiles.id, "Pfaf_code");
                setTimeout(function () { scenario.updateDataForMap(scenario.overallRisks.scenarioRiskO, scenario.overallRisks.scenarioRiskT, "shapeFileID", keyName); }, 700);
            }
            //$("#backToParent").removeClass("disabled");
        }  
        //setTimeout(function () { $("#backToParent").attr("disabled", true); }, 1000);
        
    },

    doneFunc: function (currentFileStruct, index, keyName) {
        scenario.updateDataForBarChart(scenario.overallRisks.scenarioRiskO, scenario.overallRisks.scenarioRiskT, scenario.overallRisks.intervention, scenario.overallRisks.cost, scenario.overallRisks.unitArea, index, keyName);
        setTimeout(function () { scenario.updateDataForMap(currentFileStruct.scenarioRiskO, currentFileStruct.scenarioRiskT, currentFileStruct.key, "Pfaf_code"); }, 700);
        console.info("finish doneFunc");
    },




    scenarioFiles: null,
    currentPU: null,

    initialize: function (unionedFiles, originalFiles) {
        this.unionedFiles = unionedFiles;
        this.originalFiles = originalFiles;
        this.overallRisks["key"] = unionedFiles.id;
        d3.csv("http://127.0.0.1:8887/data/Scenario.csv", function (data) {
            scenario.overallRisks["scenario"] = data;
            scenario.getFileStructure(scenario.overallRisks["scenario"][0], scenario.overallRisks, scenario.afterLoadingData);
        });
    },

    getFileStructure: function (PU, currentFileStruct, doneF,index, keyName) {
        var scenarioRiskOFileID = PU.riskBeforeFildID;
        var scenarioRiskTFileID = PU.riskAfterFildID;
        var scenarioInterventionFileID = PU.InterventionFildID;
        var scenarioCostFileID = PU.CostFildID;
        var scenarioUnitAreaFileID = PU.UnitAreaFildID;
        var promisses = [];
        console.info("begin loading");
        promisses.push( scenario.getCSVFileData(scenarioRiskOFileID, currentFileStruct["scenarioRiskO"]));
        promisses.push(scenario.getCSVFileData(scenarioRiskTFileID, currentFileStruct["scenarioRiskT"]));
        promisses.push(scenario.getCSVFileData(scenarioInterventionFileID, currentFileStruct["intervention"]));
        promisses.push(scenario.getCSVFileData(scenarioCostFileID, currentFileStruct["cost"]));
        promisses.push(scenario.getCSVFileData(scenarioUnitAreaFileID, currentFileStruct["unitArea"]));
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
        scenario.mapProcess();
        scenario.barchartProcess();
        console.info("finish loading");
    },
    mapProcess: function () {
        maps.mapsInitializAndSync("originalMap", "targetMap");
        maps.mapsClickFunc(scenario.clickFunction);
        //maps.mapsMouseOverFunc(scenario.mouseOverFunc);
        //maps.mapsMouseOutFunc(scenario.mouseOutFunc);
        maps.loadInitialGeoJson(statesData, "shapeFileID", scenario.overallRisks.scenarioRiskO, scenario.overallRisks.scenarioRiskT, "Pfaf_code", "Combined");

        var features = scenario.unionedFiles.features;
        for (var index = 0; index < features.length; index++) {
            maps.loadOverLayGeoJsons(features[index].data, "shapeFileID", scenario.overallRisks.scenarioRiskO, scenario.overallRisks.scenarioRiskT, "Pfaf_code", "Combined",false);
        }
    },
    barchartProcess: function () {
        dataIni.initialize(scenario.overallRisks.scenarioRiskO, scenario.overallRisks.scenarioRiskT, scenario.overallRisks.intervention, scenario.overallRisks.cost, scenario.overallRisks.unitArea,);
        dataIni.drawOverAllTitle("OVERALLRISK", this.unionedFiles.id, "Pfaf_code");
        dataIni.drawbar("TSSTITLE", "Total Suspended Sediment(TSS)", "TSSBARCHART", this.unionedFiles.id, "Pfaf_code");
        dataIni.drawBarWithChild("MICROBIALTITLE", "Pathogens. \Bacteria/Protozoa/Virus", "MICROBIALBARCHART", this.unionedFiles.id, "Pfaf_code");
        dataIni.drawInterVentionAndCost("KEYINTERVENTION", "Key Interventions in this Region", "INTERVENTIONDESCRIPTION", this.unionedFiles.id, "Pfaf_code");
    },

    updateDataForMap: function (riskO, riskT, key, geoJSONPrimaryKey) {

        var overLayers = maps.overLayers;

        var baseLayers = maps.baseLayers;

        if (geoJSONPrimaryKey == "father") {
            console.info(overLayers.length + "*******");
            //for (var removeIndex = overLayers.length;)
            var LgeoObject = overLayers[overLayers.length - 1].left;
            var RgeoObject = overLayers[overLayers.length - 1].right;
            maps.leftMap.removeLayer(LgeoObject);
            maps.rightMap.removeLayer(RgeoObject);
            overLayers.splice(overLayers.length - 1, 1)


            maps.rightMap.fitBounds(baseLayers[0].right.getBounds());
            maps.leftMap.fitBounds(baseLayers[0].left.getBounds());
            //maps.leftMap.setView(baseLayers[0].left.getBounds().getCenter());
            //maps.rightMap.setView(baseLayers[0].right.getBounds().getCenter());

            for (var index = 0; index < overLayers.length; index++) {
                var LgeoObject = overLayers[index].left;
                var RgeoObject = overLayers[index].right;
                LgeoObject.addTo(maps.leftMap);
                RgeoObject.addTo(maps.rightMap);
            }
        }
        else {
            for (var index = 0; index < overLayers.length; index++) {
                LgeoObject = overLayers[index].left;
                RgeoObject = overLayers[index].right;
                maps.leftMap.removeLayer(LgeoObject);
                maps.rightMap.removeLayer(RgeoObject);
            }
            for (var index = 0; index < this.originalFiles.length; index++) {
                if (key == this.originalFiles[index].id) {
                    maps.loadOverLayGeoJsons(this.originalFiles[index].data, geoJSONPrimaryKey, riskO, riskT, "Pfaf_code", "Combined", key, true);
                }
            }
        }

    },
    /**
        update bar chart data on click

        index : key in riskO and riskT

        keyName : keyName in riskO and riskT
    **/
    updateDataForBarChart: function (riskO, riskT, intervention,cost,unitarea ,index, keyName) {
        dataIni.initialize(riskO, riskT, intervention, cost, unitarea);
        dataIni.updateOverAllTitle("OVERALLRISK", index, keyName);
        dataIni.updatebar("TSSBARCHART", index, keyName);
        dataIni.updateBarWithChild("MICROBIALBARCHART", index, keyName);
        dataIni.updateInterVentionAndCost("KEYINTERVENTION", "Key Interventions in this Region", "INTERVENTIONDESCRIPTION", index, keyName);
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
$("#myRange").on("input", function () { 
    sliderOnInput(this.value, leftDiv, rightDiv, 20) });
$(".maps").on("mouseover", function () { scenario.mouseOverFunc(); });
$(".maps").on("mouseout", function () { scenario.mouseOutFunc(); });
$(".maps").css("background-color", "#08BFDD");
