var cidssLogicFunction = {
    PUFileID: "",

    loadPUDetailData: function (PUFileID, keyName) {
        console.info(PUFileID + " *** " + keyName);
        this.PUFileID = PUFileID;
        if (cidssLogicFunction.PUFileID == "father") {
            if (scenario.currentSITE != null) {
                scenario.currentSITE = null;
                cidssLogicFunction.loadDataForBarChart(scenario.currentPU.scenarioRiskO, scenario.currentPU.scenarioRiskT, scenario.currentPU.key , "Pfaf_code");
            }
            else if (scenario.currentPU != null) {
                scenario.currentPU = null;
                cidssLogicFunction.loadDataForBarChart(scenario.scenarioFiles.scenarioRiskO, scenario.scenarioFiles.scenarioRiskT, scenario.unionedFiles.id, "Pfaf_code");
                setTimeout(function () { cidssLogicFunction.loadDataForMap(scenario.scenarioFiles.scenarioRiskO, scenario.scenarioFiles.scenarioRiskT, "shapeFileID"); }, 700);
            }

        } else
        {
            if (keyName == "Pfaf_code") {
                //sub sites in plan units 
                var currentFileStruct = scenario.currentPU;
                currentFileStruct["key"] = cidssLogicFunction.PUFileID;
                for (var index = 0; index < scenario.currentPU.scenarioRiskO.length; index++) {
                    if (scenario.currentPU.scenarioRiskO[index]["Pfaf_code"] == cidssLogicFunction.PUFileID) {
                        cidssLogicFunction.loadDataForBarChart(scenario.currentPU.scenarioRiskO, scenario.currentPU.scenarioRiskT, index, keyName);
                        scenario.currentSITE = currentFileStruct;
                        break;
                    }
                }
            } else if (keyName == "shapeFileID") {
                var currentFileStruct = {};
                for (var index = 0; index < scenario.scenarioFiles.scenarioFile.length; index++) {
                    if (scenario.scenarioFiles.scenarioFile[index].shapeFileID == cidssLogicFunction.PUFileID) {
                        currentFileStruct["key"] = cidssLogicFunction.PUFileID;
                        scenario.currentPU = scenario.getFileStructure(scenario.scenarioFiles.scenarioFile[index], currentFileStruct, cidssLogicFunction.loadDataAfter, cidssLogicFunction.PUFileID, "Pfaf_code");
                        //break;
                        return "";
                    }
                }
            }

        }
    },
    loadDataForMap: function (riskO,riskT, geoJSONPrimaryKey) {
        var leftOverLayers = maps.overLayGeosForL;
        var rightOverLayers = maps.overLayGeosForR;

        var leftBaseLayers = maps.baseLayersForL;
        var rightBaseLayers = maps.baseLayersForR;

        if (cidssLogicFunction.PUFileID == "father") {
            for (var index = 1; index < leftBaseLayers.length; index++) {
                LgeoObject = leftBaseLayers[index];
                RgeoObject = rightBaseLayers[index];
                maps.leftMap.removeLayer(LgeoObject.data);
                maps.rightMap.removeLayer(RgeoObject.data);
            }
            maps.rightMap.fitBounds(rightBaseLayers[0].data.getBounds());
            maps.leftMap.fitBounds(leftBaseLayers[0].data.getBounds());
            for (var index = 0; index < leftOverLayers.length; index++) {
                LgeoObject = leftOverLayers[index];
                RgeoObject = rightOverLayers[index];
                LgeoObject.data.addTo(maps.leftMap);
                RgeoObject.data.addTo(maps.rightMap);
            }

        } else {
            for (var index = 0; index < leftOverLayers.length; index++) {
                LgeoObject = leftOverLayers[index];
                RgeoObject = rightOverLayers[index];
                maps.leftMap.removeLayer(LgeoObject.data);
                maps.rightMap.removeLayer(RgeoObject.data);
            }
            for (var index = 0; index < originalFiles.length; index++) {
                if (cidssLogicFunction.PUFileID == originalFiles[index].id) {
                    maps.loadInitialGeoJson(originalFiles[index].data, geoJSONPrimaryKey, riskO, riskT, "Pfaf_code", "Combined", cidssLogicFunction.PUFileID);
                }
            }
        }

    },
    /**
        update bar chart data on click

        index : key in riskO and riskT

        keyName : keyName in riskO and riskT
    **/
    loadDataForBarChart: function (riskO, riskT,index, keyName) {
        dataIni.initialize(riskO, riskT);
        dataIni.updateOverAllTitle("OVERALLRISK", index, keyName );
        dataIni.updatebar("TSSBARCHART", index, keyName);
        dataIni.updateBarWithChild("MICROBIALBARCHART", index, keyName);
    },

    loadDataAfter: function (currentFileStruct, index, keyName) {
        scenario.currentPU = currentFileStruct;
        cidssLogicFunction.loadDataForBarChart(scenario.scenarioFiles.scenarioRiskO, scenario.scenarioFiles.scenarioRiskT, index, keyName);
        setTimeout(function () { cidssLogicFunction.loadDataForMap(scenario.currentPU.scenarioRiskO, scenario.currentPU.scenarioRiskT, "Pfaf_code");}, 700);
    }
} 