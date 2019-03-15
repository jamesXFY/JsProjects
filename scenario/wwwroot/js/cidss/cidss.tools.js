var scenario = {
    unionedFiles : null,  //combined PU
    originalFiles: null,  // featureed PU

    scenarioFiles: null,

    currentPU: null,
    currentSITE: null,

    initialize: function (unionedFiles, originalFiles) {
        this.unionedFiles = unionedFiles;
        this.originalFiles = originalFiles;
        var currentFileStruct = {};
        currentFileStruct["key"] = unionedFiles.id;
        d3.csv(truiiWCF.GetFileDownloadUrl(unionedFiles.id), function (senario) {
            currentFileStruct["scenarioFile"] = senario;
            scenario.getFileStructure(currentFileStruct["scenarioFile"][0], currentFileStruct, scenario.afterLoadingData);
            

        });
    },

    getFileStructure: function (PU, currentFileStruct, doneF , puid, keyName) {
        var scenarioRiskOFileID = PU.riskBeforeFildID;
        var scenarioRiskTFileID = PU.riskAfterFildID;
            d3.csv(truiiWCF.GetFileDownloadUrl(scenarioRiskOFileID), function (risko) {
                currentFileStruct["scenarioRiskO"] = risko;
                d3.csv(truiiWCF.GetFileDownloadUrl(scenarioRiskTFileID), function (riskt) {
                    currentFileStruct["scenarioRiskT"] = riskt;
                    doneF(currentFileStruct, puid, keyName);
                });
            });
    },

    afterLoadingData: function (currentFileStruct) {
        scenario.scenarioFiles = currentFileStruct;
        scenario.mapProcess();
        scenario.logicProcess();
    },

    mapProcess: function () {
        maps.mapsInitializAndSync("originalMap", "targetMap");
        maps.loadInitialGeoJson(statesData, "shapeFileID", scenario.scenarioFiles.scenarioRiskO, scenario.scenarioFiles.scenarioRiskT, "Pfaf_code", "Combined", scenario.unionedFiles.id);

        var features = scenario.unionedFiles.features;
        for (var index = 0; index < features.length; index++) {
            maps.loadOverLayGeoJsons(features[index].data, "Id", scenario.scenarioFiles.scenarioRiskO, scenario.scenarioFiles.scenarioRiskT, "Pfaf_code", "Combined", features[index].id);
        }
    },
    logicProcess: function () {
        dataIni.initialize(scenario.scenarioFiles.scenarioRiskO, scenario.scenarioFiles.scenarioRiskT);
        dataIni.drawOverAllTitle("OVERALLRISK", this.unionedFiles.id, "Pfaf_code");
        dataIni.drawbar("TSSTITLE", "Total Suspended Sediment(TSS)", "TSSBARCHART", this.unionedFiles.id, "Pfaf_code");
        dataIni.drawBarWithChild("MICROBIALTITLE", "Microbial E.Coli/Protozoa", "MICROBIALBARCHART", this.unionedFiles.id, "Pfaf_code");
       // dataIni.drawInterVentionAndCost("KEYINTERVENTION", "Key Interventions in this Region", "INTERVENTIONDESCRIPTION");
    },

    splitStringTool: function(str, len) {
        var ret = [];
        for (var offset = 0, strLen = str.length; offset < strLen; offset += len) {
            ret.push(str.slice(offset, len + offset));
        }
        return ret;
    }
};

var barChart = {
    title: "TSS",
    Data: [
        {
            type: "rect",
            Data: [
                10.3,
                2.5,
                0,
                3.5,
                4
            ]
        },
        {
            type: "text",
            Data: [
                "Hillslope", "Gully", "InnChannel", "Point", "Total"
            ]
        },
        {
            type: "rect",
            Data: [
                6.3,
                1.5,
                0,
                1.5,
                3
            ]
        },
    ]
};

var barChartM = {
    title: "Microbial",
    Data: [
        {
            type: "rect",
            Data: [
                {
                    Ecoli: 6.5,
                    Protozoa: 2.5,
                    Chemical: 1.5
                },
                {
                    Ecoli: 7.5,
                    Protozoa: 4.3,
                    Chemical: 0
                },
                {
                    Ecoli: 3.5,
                    Protozoa: 5.5,
                    Chemical: 1.5
                },
                {
                    Ecoli: 7.5,
                    Protozoa: 3.5,
                    Chemical: 3.5
                },
                {
                    Ecoli: 7.5,
                    Protozoa: 3.5,
                    Chemical: 3.5
                }
            ]
        },
        {
            type: "text",
            Data: [
                "Onsite", "STP", "STOMEWATER", "INDUSTRY", "AG"
            ]
        },
        {
            type: "rect",
            Data: [
                {
                    Ecoli: 1.5,
                    Protozoa: 2.5,
                    Chemical: 1.5
                },
                {
                    Ecoli: 1.5,
                    Protozoa: 2.5,
                    Chemical: 0
                },
                {
                    Ecoli: 0,
                    Protozoa: 3,
                    Chemical: 2.5
                },
                {
                    Ecoli: 1.5,
                    Protozoa: 3.5,
                    Chemical: 1.5
                },
                {
                    Ecoli: 1.5,
                    Protozoa: 3.5,
                    Chemical: 1.5
                }
            ]
        },
    ]
};

var verseTitle = {
    title: "OVERALL",
    Data: [
        {
            type: "BEFORE INTERVENTION",
            Data: [4]
        },
        {
            type: "text",
            Data: ["VS"]
        },
        {
            type: "AFTER INTERVENTION",
            Data: [2]
        },
    ]
};

var interventionCost = {
    title: "INTERVENTION",
    Data: [
        {
            type: "reverBank",
            Data: { count: "500", unit: "HA", cost: "5444000", description: "of earth work and fancing to establish river bank"}
        },
        {
            type: "fencing",
            Data: { count: "500000", unit: "KM", cost: "6000000000", description: "of earth work and fancing to establish river bank of earth work and fancing to establish river bank of earth work and fancing to establish river bank" }
        },
        {
            type: "veg",
            Data: { count: "0", unit: "PER SYSTEM", cost: "100", description: "of earth work and fancing to establish river bank of earth work and fancing to establish river bank of earth work and fancing to establish river bankV of earth work and fancing to establish river bank" }
        },
        {
            type: "other",
            Data: { count: "100", unit: "NA", cost: "1", description: "of earth work and fancing to establish river bank" }
        }
    ]
};


var leftDiv = $("#originalMap");
var rightDiv = $("#targetMap");
$("#myRange").on("input", function () { sliderOnInput(this.value, leftDiv, rightDiv) });