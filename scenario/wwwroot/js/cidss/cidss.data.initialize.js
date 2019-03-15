dataIni = {
    scenarioBeforeData: null,
    scenarioAfterData: null,
    intervention: null,
    cost: null,
    unitarea:null,
    barChartHeight: 18,
    barchartAlign: 5,
    barChartWidhtScale: 7,

    overAll: "Combined",
    TSSTitles: [
        //"Hillslope", "Gully", "InnChannel", "Point", "Total"
        //"BankE_kemp", "HillslE_ke", "LandslE_ke", "Total_TSS"
        //"Streambank", "Hillslope", "Landslip", "Inchannel"
        { key: "Streambank", data: ["BankE_kemp"]},
        { key: "Hillslope", data: ["HillslE_ke"]},
        { key: "Landslip", data: ["LandslE_ke"]},
        { key: "Inchannel", data: ["Inchannel"]},
    ],
    MicrobialTitle: [
        { key: "Onsite Wastewater", data: ["OS_Ec_sc", "OS_Pr_sc"] },
        { key: "Pumping Station", data: ["STP_Ec_sc", "STP_Pr_sc"]},
        { key: "Stormwater", data: ["SW_Ec_sc", "SW_Pr_sc"]},
        { key: "Industry", data: ["In_Ec_sc", "In_Pr_sc"]},
        { key: "Agriculture", data: ["Ag_Ec_sc", "Ag_Pr_sc"]}
    ],

    MicrobialTitleTransfer: [
        { key: "OS_Ec_sc", data: ["bacteria"] },
        { key: "STP_Ec_sc", data: ["bacteria"] },
        { key: "SW_Ec_sc", data: ["bacteria"] },
        { key: "In_Ec_sc", data: ["bacteria"] },
        { key: "Ag_Ec_sc", data: ["bacteria"] },

        { key: "OS_Pr_sc", data: ["protozoa"] },
        { key: "STP_Pr_sc", data: ["protozoa"] },
        { key: "SW_Pr_sc", data: ["protozoa"] },
        { key: "In_Pr_sc", data: ["protozoa"] },
        { key: "Ag_Pr_sc", data: ["protozoa"] },
    ],
    
    

    initialize: function (scenarioBeforeData, scenarioAfterData, intervention, cost, unitarea) {
        this.scenarioBeforeData = scenarioBeforeData;
        this.scenarioAfterData = scenarioAfterData;
        this.intervention = intervention;
        this.cost = cost;
        this.unitarea = unitarea;
    },
    setTitles: function (key, value) {
        if (key == "TSSTitles") {
            this.TSSTitles = value;
        } else if (key == "MicrobialTitle") {
            this.MicrobialTitle = value;
        } else if (key == "MicrobialTitle") {
            this.overAll = value;
        }
    },

    /**
        barChartHeight : the bar chart height
        barchartAlign : each bar chart align to each other
        barChartWidhtScale : data value to barchart width, formular : widht = value * scale;

    **/
    setBarChartProp: function (barChartHeight, barchartAlign, barChartWidhtScale) {
        this.barChartHeight = barChartHeight;
        this.barchartAlign = barchartAlign;
        this.barChartWidhtScale = barChartWidhtScale;
    },
    regroupDataForTSSBarChart: function (titles, pu, keyName) {
        var oBefore;
        var oAfter;
        for (var index = 0; index < dataIni.scenarioBeforeData.length; index++) {
            var key = dataIni.scenarioBeforeData[index][keyName];
            if (key == pu) {
                oBefore = dataIni.scenarioBeforeData[index];
                break;
            }
        }
        for (var index = 0; index < dataIni.scenarioAfterData.length; index++) {
            var key = dataIni.scenarioAfterData[index][keyName];
            if (key == pu) {
                oAfter = dataIni.scenarioAfterData[index];
                break;
            }
        }
        var twoBarData = { title: "TSS", Data: [] };

            var leftBarData = {
                type: "rect",
                Data: []
            };
            var middleTitleData = {
                type: "text",
                Data: []
            };
            var rightBarData = {
                type: "rect",
                Data: []
            };
            for (var index = 0; index < titles.length; index++) {
                var title = titles[index].key;
                var subTitles = titles[index].data;
                for (var subindex = 0; subindex < subTitles.length; subindex++) {
                    var beforeData = oBefore[subTitles[subindex]];
                    var afterData = oAfter[subTitles[subindex]];
                    if (beforeData == "NaN" || beforeData == "" || beforeData == window.undefined) {
                        leftBarData.Data.push("0");
                    } else {
                        leftBarData.Data.push(beforeData);
                    }

                    if (afterData == "NaN" || afterData == "" || afterData == window.undefined) {
                        rightBarData.Data.push("0");
                    } else {
                        rightBarData.Data.push(afterData);
                    }
                }
                middleTitleData.Data.push(title);
            }
            twoBarData.Data.push(leftBarData);
            twoBarData.Data.push(middleTitleData);
            twoBarData.Data.push(rightBarData);
        return twoBarData;
    },
    /**
     *  titles = [{key: title, data:[child1,child2,child3]},...]
     *
     **/
    regroupDataForMICROBarChart: function (titles, pu, keyName) {
        var oBefore;
        var oAfter;
        for (var index = 0; index < dataIni.scenarioBeforeData.length; index++) {
            var key = dataIni.scenarioBeforeData[index][keyName];
            if (key == pu) {
                oBefore = dataIni.scenarioBeforeData[index];
                break;
            }
        }
        for (var index = 0; index < dataIni.scenarioAfterData.length; index++) {
            var key = dataIni.scenarioAfterData[index][keyName];
            if (key == pu) {
                oAfter = dataIni.scenarioAfterData[index];
                break;
            }
        }

        var twoBarData = { title: "Microbial", Data: [] };

            var leftBarData = {
                type: "rect",
                Data: []
            };
            var middleTitleData = {
                type: "text",
                Data: []
            };
            var rightBarData = {
                type: "rect",
                Data: []
            };
            
            for (var index = 0; index < titles.length; index++) {
                var title = titles[index].key;
                var subTitles = titles[index].data;
                var leftChild = {};
                var rightChild = {};
                for (var subindex = 0; subindex < subTitles.length; subindex++)
                {
                    var beforeData = oBefore[subTitles[subindex]];
                    var afterData = oAfter[subTitles[subindex]];
                    if (beforeData == "NaN" || beforeData == "" || beforeData == window.undefined) {
                        leftChild[subTitles[subindex]] = "0";
                    } else {
                        leftChild[subTitles[subindex]] = beforeData;
                    }

                    if (afterData == "NaN" || afterData == "" || afterData == window.undefined) {
                        rightChild[subTitles[subindex]]="0";
                    } else {
                        rightChild[subTitles[subindex]] = afterData;
                    }
                }   
                leftBarData.Data.push(leftChild);
                rightBarData.Data.push(rightChild)
                middleTitleData.Data.push(titles[index].key);
            }
            twoBarData.Data.push(leftBarData);
            twoBarData.Data.push(middleTitleData);
            twoBarData.Data.push(rightBarData);
            console.info(twoBarData);
        return twoBarData;
    },
    regroupDataForIntervention: function (pu, keyName ,top) {
        var cIntervention;
        var cCost;
        for (var index = 0; index < dataIni.intervention.length; index++) {
            var key = dataIni.intervention[index][keyName];
            if (key == pu) {
                cIntervention = dataIni.intervention[index];
                break;
            }
        }
        for (var index = 0; index < dataIni.cost.length; index++) {
            var key = dataIni.cost[index][keyName];
            if (key == pu) {
                cCost = dataIni.cost[index];
                break;
            }
        }
        var result = dataIni.getTopNValInPro(cCost, top, keyName);


        var interventionCost = {
            title: "INTERVENTION",
            Data: []
        };

        var keys = Object.keys(result);

        for (var index = 0; index < keys.length; index++)
        {
            var intervention = parseFloat(cIntervention[keys[index]]);
            var Cost = parseFloat(result[keys[index]]);

            var iteration = {};
            var des = dataIni.unitarea[1][keys[index]];
            if (des == window.undefined || des.length ==0)
            {
                des = keys[index];
            }

            iteration.type = keys[index];
            iteration.Data = {};
            iteration.Data.count = intervention == Number.isNaN(intervention) ? 0 : intervention.toFixed();
            iteration.Data.unit = dataIni.unitarea[0][keys[index]];
            iteration.Data.cost = Cost == Number.isNaN(Cost) ? 0 : dataIni.floatToCurrency(Cost.toFixed());
            iteration.Data.description = des;
            interventionCost.Data.push(iteration);
        }

        return interventionCost;
    },

    regroupDataForOverAll: function (pu, keyName) {
        var oBefore;
        var oAfter;
        for (var index = 0; index < dataIni.scenarioBeforeData.length; index++) {
            var key = dataIni.scenarioBeforeData[index][keyName];
            if (key == pu) {
                oBefore = dataIni.scenarioBeforeData[index];
                break;
            }
        }
        for (var index = 0; index < dataIni.scenarioAfterData.length; index++) {
            var key = dataIni.scenarioAfterData[index][keyName];
            if (key == pu) {
                oAfter = dataIni.scenarioAfterData[index];
                break;
            }
        }


        var verseTitle = { title: "OVERALL", Data: [] };
        
        var leftData = oBefore[dataIni.overAll];
        var rightData = oAfter[dataIni.overAll];
        var leftDivData = {
            type: "BEFORE INTERVENTION",
            Data: [leftData]
        };
        var middleDivData = {
            type: "text",
            Data: ["VS"]
        };
        var rightDivData = {
            type: "AFTER INTERVENTION",
            Data: [rightData]
        };
        verseTitle.Data.push(leftDivData);
        verseTitle.Data.push(middleDivData);
        verseTitle.Data.push(rightDivData);
        return verseTitle;
    },
    drawbar: function (titlediv, title, bardivid,pu , keyName) {
        
        compareBarChart.drawTwoSidesBarChartTitle(titlediv, title);
        var data = dataIni.regroupDataForTSSBarChart(this.TSSTitles, pu, keyName);
        compareBarChart.initialize(bardivid, this.barChartHeight, this.barchartAlign, this.barChartWidhtScale);
        compareBarChart.Data(data);
        compareBarChart.drawBar();
    },
    updatebar: function (bardivid, pu, keyName) {

        var data = dataIni.regroupDataForTSSBarChart(this.TSSTitles, pu, keyName);
        compareBarChart.updateData(bardivid, data);
        compareBarChart.updateBar();
    },

    drawBarWithChild: function (titlediv, title, bardivid, pu, keyName) {
        compareBarChart.drawTwoSidesBarChartTitle(titlediv, title);
        var data = dataIni.regroupDataForMICROBarChart(this.MicrobialTitle, pu, keyName);
        compareBarChart.initialize(bardivid, this.barChartHeight, this.barchartAlign, this.barChartWidhtScale);
        compareBarChart.Data(data);
        compareBarChart.drawBarWithChild();
    },

    updateBarWithChild: function (bardivid, pu, keyName) {

        var data = dataIni.regroupDataForMICROBarChart(this.MicrobialTitle, pu, keyName);
        compareBarChart.updateData(bardivid, data);
        compareBarChart.updateBarWithChild();
    },

    drawOverAllTitle: function (bardivid, pu, keyName) {
        //compareBarChart.drawTwoSidesBarChartTitle("KEYINTERVENTION", "Key Interventions in this Region");
        var data = dataIni.regroupDataForOverAll(pu, keyName);
        compareBarChart.initialize(bardivid, this.barChartHeight, this.barchartAlign, this.barChartWidhtScale);
        compareBarChart.Data(data);
        compareBarChart.drawRectAndElipseTitle();
    },
    updateOverAllTitle: function (bardivid, pu, keyName) {

        var data = dataIni.regroupDataForOverAll(pu, keyName);
        compareBarChart.updateData(bardivid, data);
        compareBarChart.updateRectAndElipseTitle();
    },

    drawInterVentionAndCost: function (titlediv, title, bardivid, pu, keyName) {
        compareBarChart.drawTwoSidesBarChartTitle(titlediv, title);
        compareBarChart.initialize(bardivid, this.barChartHeight, this.barchartAlign, this.barChartWidhtScale);
        var data = dataIni.regroupDataForIntervention(pu,  keyName , 4);
        for (var obj in data.Data) {
            compareBarChart.Data(data.Data[obj]);
            compareBarChart.drawInterventionDescription();
        }

    },
    updateInterVentionAndCost: function (titlediv, title, bardivid, pu, keyName) {

        var data = dataIni.regroupDataForIntervention(pu, keyName, 4);
        var targetDiv = d3.select("#" + bardivid + "");
        targetDiv.selectAll("*").remove();
        compareBarChart.initialize(bardivid, this.barChartHeight, this.barchartAlign, this.barChartWidhtScale);
        for (var obj in data.Data) {
            compareBarChart.Data(data.Data[obj]);
            compareBarChart.drawInterventionDescription();
        }

    },

    getTopNValInPro: function (o, top, primaryKey)
    {
        var results = {};
        var keys = Object.keys(o);
        var interator = top;
        for (var index = 0; index < keys.length; index++)
        {
            var key = keys[index];
            if (key == primaryKey)
            {
                continue;
            }
            var val = o[key];
            var bigger = 0;
            var smaller = 0;
            var equal = 0;
            for (var subIndex = 0; subIndex < keys.length; subIndex++) {
                var subkey = keys[subIndex];
                if (subkey == primaryKey) {
                    continue;
                }
                var subval = o[subkey];
                if (val < subval) {
                    smaller++;
                } else if (val > subval) {
                    bigger++;
                } else
                {
                    equal++;
                }
            }
            if (smaller < top) {
                if (smaller + equal >= top && interator > smaller) {
                    results[key] = val;
                    interator = interator - 1
                }
                else if (smaller + equal < top) {
                    results[key] = val;
                }

            }
        }
        console.info(results);
        return results;
    },
    floatToCurrency: function (val) {
        var currency = (val + "").replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
        return "$" + currency;
    },
    transferMicrobialToTitle: function (key, val)
    {
        var transferedTitle = key;
        for (var i = 0; i < dataIni.MicrobialTitleTransfer.length; i++)
        {
            var transfer = dataIni.MicrobialTitleTransfer[i];
            if (transfer.key == key)
            {
                transferedTitle = transfer.data;
            }
        }
        
        var transferedVal = parseFloat(val).toFixed(2);
        return { "key": transferedTitle, "data": transferedVal};

    },
    transferRiskToCategoric: function (val) {
        if (val > 8) {
            return "Very High";
        } else if (val > 6) {
            return "High";
        } else if (val > 4) {
            return "Medium";
        } else
        {
            return "Low";
        }
    }

}