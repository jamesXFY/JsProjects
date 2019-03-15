var geoJson1; // entire brisbane map json object 
var geoJson2; // entire brisbane map json object
var waterReigon;
var waterReigon2;
var waterTreatMent;
var subRegionRiskO; //subregion polygone risk
var subRegionRiskT; // subregion polygone optimized risk
var LM; //subregion polygone object
var LM2;//subregion polygone object
var map = L.map("originalMap").setView([-27.30, 153.10], 8);
var tMap = L.map("targetMap").setView([-27.30, 153.10], 8);
var baseLayerM = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {});
var baseLayerTM = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {});

var whiteBaseLayerM = L.geoJSON(whiteLayer, { style: colorDiffer });
var whiteBaseLayerTM = L.geoJSON(whiteLayer, { style: colorDiffer });
var waterTreatments = L.geoJSON(waterTreatment, { onEachFeature: waterFeature, pointToLayer: warterTreatMentF });
var TwaterTreatments = L.geoJSON(waterTreatment, { onEachFeature: waterFeature, pointToLayer: warterTreatMentF });

//var riskJson =<%=@ViewBag.message%>;


geoJson1 = L.geoJSON(statesData, { style: myStyle, onEachFeature: oneachfeature });
//geoJson1.addTo(map);
geoJson2 = L.geoJSON(statesData, { style: myStyle2, onEachFeature: oneachfeatureForTarget });
//geoJson2.addTo(tMap);

var damsGeoJsonS = L.geoJSON(damGeoJson);
var damsGeoJsonT = L.geoJSON(damGeoJson);


var baseLayersForMap = {
	'coloredLayer': baseLayerM
}

var baseLayersForTMap = {
	'coloredLayer': baseLayerTM
}

var overLapForMap = {
	'treatments': waterTreatments,
	'whiteLayer': whiteBaseLayerM,
    'regionRiskLayer': geoJson1,
    'damsLayer': damsGeoJsonS
};
var overLapForTMap = {
	'treatments': TwaterTreatments,
	'whiteLayer': whiteBaseLayerTM,
    'regionRiskLayer': geoJson2,
    'damsLayer': damsGeoJsonT
};
//add risk pop up to layers
whiteBaseLayerM.on("click", clickfortherisk);
whiteBaseLayerTM.on("click", clickfortherisk);
//bring to front
//whiteBaseLayerM.on("add",geoJson1.bringToBack());
//geoJson2.on("add",bringToBack);



var controlM = L.control.layers(baseLayersForMap, overLapForMap);
controlM.addTo(map);
var HTMLE = controlM.getContainer();
var selectors = HTMLE.getElementsByTagName("label");
for (var i = 0; i < selectors.length; i++) {
	var id = selectors[i].getElementsByTagName("span")[0].innerText.trim();
	selectors[i].getElementsByTagName("input")[0].setAttribute("id", id);
}

// var controlTM = L.control.layers(baseLayersForTMap, overLapForTMap);
// //controlTM.addTo(tMap);
// var THTMLE = controlTM.getContainer();
// var selectorsT = THTMLE.getElementsByTagName("label");
// for (var i = 0; i < selectorsT.length; i++) {
//     var id = selectorsT[i].getElementsByTagName("span")[0].innerText.trim();
//     selectorsT[i].getElementsByTagName("input")[0].setAttribute("id", id+"T");
// }

map.sync(tMap);
tMap.sync(map);
map.on("baselayerchange", addRoRemove);
map.on("overlayadd", addRoRemoveOverLayer);
map.on("overlayremove", addRoRemoveOverLayer);
//map.on("click",clickfortherisk);
map.on("zoomstart", closeMsg);
//map.on("load", setbackgroundimg);
//tMap.on("click",clickfortherisk);

// tMap.on("baselayerchange", addRoRemove);
// tMap.on("overlayadd", addRoRemoveOverLayer);
// tMap.on("overlayremove", addRoRemoveOverLayer);
// //map.on("click",clickfortherisk);
// tMap.on("zoomstart",closeMsg);
// //tMap.on("click",clickfortherisk);





var originalcontainer = document.getElementById('originalRiskTable');
var targetcontainer = document.getElementById('targetRiskTable');
function riskRenderFunction(instance, td, row, col, prop, value, cellProperties) {
	//Handsontable.renders.TextRender.apply(this,arguments);
	Handsontable.renderers.TextRenderer.apply(this, arguments);
	td.style.textaAlign = 'center';
    if (parseFloat(value, 10) >= 0 && parseFloat(value, 10) <= 1) {
        td.style.background = '#97CD7E';
        td.innerHTML = parseFloat(value);
    }
    else if (parseFloat(value, 10) > 1 && parseFloat(value, 10) <= 2) {
        td.style.background = '#CBDC81';
        td.innerHTML = parseFloat(value);
    }
    else if (parseFloat(value, 10) > 2 && parseFloat(value, 10) <= 3) {
        td.style.background = '#FFEB84';
        td.innerHTML = parseFloat(value);
    }
    else if (parseFloat(value, 10) > 3 && parseFloat(value, 10) <= 4) {
        td.style.background = '#FCAA78';
        td.innerHTML = parseFloat(value);
    }
    else if (parseFloat(value, 10) > 4 && parseFloat(value, 10) <= 5) {
        td.style.background = '#F8696B';
        td.innerHTML = parseFloat(value);
    } else
    {
        td.style.background = '#4eb3d3';
        td.innerHTML = parseFloat(value);
    }
}

function firstRenderFunction(instance, td, row, col, prop, value, cellProperties) {
	//Handsontable.renders.TextRender.apply(this,arguments);
	Handsontable.renderers.TextRenderer.apply(this, arguments);
	cr = instance.getDataAtCell(0, 7);
	if (row == 0) {
		td.style.height = '50px'
		if (col == 8) { td.innerHTML = ''; } else { td.innerHTML = cr; }
		td.style.background = '#0099AB';
		td.style.border = '0px';
		td.style.fontSize = "40px";
		td.style.color = '#FFFFFF';
		//td.style.textAlign='center';

	}
	if (row == 1) {
		td.style.background = '#0099AB';
		td.style.border = '0px';


	}

}
/**
 * 
 
function getRegionsName(regionJSON) {
    Array nameArray= new Array(regionJSON.features.length);
    var namekey;
    string[] keys= Object.keys(regionJSON.features[0].properties)
    for (var j = 0; j < keys.length; j++)
    {
        if (keys[j].indexOf("nam") !== -1) {
            namekey = keys[j];
        }
        
    }
    for (var i = 0; i < regionJSON.features.length; i++) {
        
        if (Object.keys(regionJSON.features[i].properties)) {
            nameArray.push(regionJSON.features[i].properties.namekey);
        }
    }

    return nameArray;
}
* @param {any} regionJSON
 */

function getRegionNames(instance, td, row, col, prop, value, cellProperties) {
    for (var i = 0; i < waterTreatment.features.length; i++) {
        if (waterTreatment.features[i].properties.WTP_ID === value) {
            td.innerHTML = waterTreatment.features[i].properties.NAME;
			break;
		}
	}
	return td;

}





var setbackgroundimg = function () {
    var riskO = getRisk("0", risk02);
    var riskT = getRisk("0", risk01);
    getRiskStars(riskO, riskT, "summary");
}
var interventionHT;
var interventionCostHT;
//ajaxReq("/Scenario/interventionTable/","intevention");
/**
 get the intervention files from truii lib
*/
d3.csv(truiiWCF.GetFileDownloadUrl(Number(scnarioInterventionFile)), function (data) {
    initialHandsontable(data,"intevention");
});
d3.csv(truiiWCF.GetFileDownloadUrl(Number(scnarioInterventionCostFile)), function (data) {
    initialHandsontable(data, "inteventionCost");
});
//
/**
 get the risk files from truii lib
*/
var subRegionRiskFromTruii01;
var subRegionRiskFromTruii02;
var riskOriginal;
var riskTarget;
d3.csv(truiiWCF.GetFileDownloadUrl(Number(scnarioRevisededRiskFile)), function (data) {
    //initialHandsontable(data, "intevention");
    subRegionRiskFromTruii01 = data;
    
    riskOriginal = new Handsontable(originalcontainer, {
        data: convertData(subRegionRiskFromTruii01, 1),
        colHeaders: Object.keys(subRegionRiskFromTruii01[0]),
        //colHeaders: [
        //	"RISK AT WTP",
        //	"TSS <br> Hillslope",
        //	"TSS Gully",
        //	"TSS <br> Inchannel",
        //	"TSS Point",
        //	"TSS Total",
        //	"Microbial",
        //	"Combined",
        //	''
        //],
        //columns: [{ data: 'LocationId', renderer: getRegionNames },
        //{ data: 'TSS Hillslope' },
        //{ data: 'TSS Gully' },
        //{ data: 'TSS Inchannel' },
        //{ data: 'TSS Point' },
        //{ data: 'TSS Total' },
        //{ data: 'Microbial' }, { data: 'Combined' }, {}],
        fixedRowsTop: 2,
        //fixedColumnsLeft: 1,
        //colWidths: [100, 45, 45, 45, 45, 45, 45],
        className: "htMiddle htCenter",
        cells: function (row, col, prop) {
            var cellProperties = {};
            if (col >= 1) {
                cellProperties.renderer = riskRenderFunction;
            }
            if ((row == 0 && (col == 0 || col == 8)) || row == 1) {
                cellProperties.renderer = firstRenderFunction;
            }
            return cellProperties;
        },
        afterScrollVertically: function (e) {
            //console.info(riskOriginal.view.wt.wtTable.holderOffset.top);
            // console.info(riskOriginal.view.wt.wtOverlays.topOverlay.getScrollPosition());
            riskTarget.view.wt.wtOverlays.topOverlay.setScrollPosition(riskOriginal.view.wt.wtOverlays.topOverlay.getScrollPosition());
            //console.info(getScrollTop(document));
        },
        //preventOverflow: 'horizontal',
        //columnSorting: true,
        manualColumnResize: true,
        stretchH: 'all',
        //manualColumnMove : true
        //width:600,
        //overflow:hidden
        //colWidths: [100, 75, 75, 75, 75, 75, 75]
        //autoColumnSize: {useHeaders: true}
    });
});
d3.csv(truiiWCF.GetFileDownloadUrl(Number(scnarioAttenuatedRiskFile)), function (data) {
    //initialHandsontable(data, "inteventionCost");
    subRegionRiskFromTruii02 = data;
    //displaySubRegionRish("subregion02");
    riskTarget = new Handsontable(targetcontainer, {
        data: convertData(subRegionRiskFromTruii02, 1),
        colHeaders: Object.keys(subRegionRiskFromTruii02[0]),
        //colHeaders: [
        //	"RISK AT WTP",
        //	"TSS <br> Hillslope",
        //	"TSS Gully",
        //	"TSS <br> Inchannel",
        //	"TSS Point",
        //	"TSS Total",
        //	"Microbial",
        //	"Combined",""
        //],
        fixedRowsTop: 2,
        //fixedColumnsLeft: 1,
        //columns: [{ data: 'LocationId', renderer: getRegionNames },
        //{ data: 'TSS Hillslope' },
        //{ data: 'TSS Gully' },
        //{ data: 'TSS Inchannel' },
        //{ data: 'TSS Point' },
        //{ data: 'TSS Total' },
        //{ data: 'Microbial' }, { data: 'Combined' }, {}],
        //colWidths: [100, 45, 45, 45, 45, 45, 45],
        className: "htMiddle htCenter",
        cells: function (row, col, prop) {
            var cellProperties = {};
            if (col >= 1) {
                cellProperties.renderer = riskRenderFunction;
            }
            if ((row == 0 && (col == 0 || col == 8)) || row == 1) {
                cellProperties.renderer = firstRenderFunction;
            }
            return cellProperties;
        },
        stretchH: 'all',
        afterScrollVertically: function (e) {
            sync(riskTarget, riskOriginal);
        }
        //preventOverflow: 'horizontal',
        //columnSorting: true
        //width:600,
        //overflow:hidden
        //colWidths: [30, 80, 80, 80, 80,80,80,80]
        //autoColumnSize: {useHeaders: true}
    });
});
var initialHandsontable = function (intervention, name) {
    if (name == "intevention") {
        interventionHT = new Handsontable(interventionTable, {
            data: intervention,
            colHeaders: Object.keys(intervention[0]),
           // fixedrowsTop:1,
          //  fixedColumnsLeft: 1,
            stretchH: 'all',
            //colWidths: [90, 70, 70, 70, 70, 70, 70,70,70,70],
            className: "htMiddle htCenter",
            columnSummary: summaryArray(intervention[0],0,1)
        });
        //interventionHT.alter('insert_row', 0, 1);
        //ajaxReq("/Scenario/interventionCostTable", "inteventionCost");
    } else
    {
        interventionCostHT = new Handsontable(interventionCostTable, {
            data: intervention,
            colHeaders: Object.keys(intervention[0]),
            // when add money formate, the sumed value wont be passed by getdatabycell() function
            //fixedRowsTop:1,
           // fixedColumnsLeft: 1,
            stretchH: 'all',
            //colWidths: [90, 70, 70, 70, 70, 70, 70,70,70,70],
            className: "htMiddle htCenter",
            afterLoadData: function () {
                
            },
            columnSummary: summaryArray(intervention[0], 0, 1),
            AutoColumnSize: true

        });
        //update the intervention summary table
        updateInterventionSummaryTable(0, 1);
        //update the risk summary table
        setbackgroundimg();
    }

}

var sync = function (source,target) {
    var scrollTopSource = source.view.wt.wtOverlays.topOverlay.getScrollPosition();
    var scrollTopTarget = target.view.wt.wtOverlays.topOverlay.getScrollPosition();
    if (scrollTopSource != scrollTopTarget) {
        target.view.wt.wtOverlays.topOverlay.setScrollPosition(scrollTopSource);
    }
}

function switchButton(val){
    if (val == "Yes") {
        document.getElementById("regionSelect").hidden = false;
    } else
    {
        document.getElementById("regionSelect").hidden = true;
        document.getElementById("defaultOption").selected=true;
        reloadEntireMap();
        reloadEntireTables();
    }
}

// show subregion risk 
function selectionOnChange() {
    if (map.hasLayer(geoJson1)) {
        map.removeLayer(geoJson1);
        tMap.removeLayer(geoJson2);
    }
    if (map.hasLayer(whiteBaseLayerM)) {
        map.removeLayer(whiteBaseLayerM);
        tMap.removeLayer(whiteBaseLayerTM);
    }

    //ajaxReqForRisk("/Scenario/entireRiskTable/", "subregion01");
    //ajaxReqForRisk("/Scenario/entireOptimiezedRiskTable/", "subregion02");
    displaySubRegionRish("subregion01");
    displaySubRegionRish("subregion02");

}

//show subregion risk
function displaySubRegionRish(name) {
    if (name == "subregion01") {
        //subRegionRiskO = result;
        LM = L.geoJSON(pu, { style: myStyleForSubRegion, onEachFeature: oneachfeatureForSubRegion });
        map.addLayer(LM);
        map.fitBounds(LM.getBounds(), { animate: true, duration: 0.5, padding: [50, 50] });
        //reloadInterventionForOriginal(result);
    } else
    {
        //subRegionRiskT = result;
        LM2 = L.geoJSON(pu, { style: myStyle2ForSubRegion, onEachFeature: oneachfeatureForTargetForSubRegion });
        tMap.addLayer(LM2);
        tMap.fitBounds(LM2.getBounds());
        //reloadInterventionForTarget(result);
    }
}

// reload original layer
function reloadEntireMap() {
    if (map.hasLayer(LM)) {
        map.removeLayer(LM);
        tMap.removeLayer(LM2);
    }
    map.addLayer(geoJson1);
    tMap.addLayer(geoJson2);
    map.fitBounds(geoJson1.getBounds());
    tMap.fitBounds(geoJson2.getBounds());
}

//reload the handsontable
function reloadEntireTables() {
    riskOriginal.updateSettings({
        columns: [{ data: 'LocationId', renderer: getRegionNames },
        { data: 'TSS Hillslope' },
        { data: 'TSS Gully' },
        { data: 'TSS Inchannel' },
        { data: 'TSS Point' },
        { data: 'TSS Total' },
        { data: 'Microbial' }, { data: 'Combined' }, {}]
    });
    riskOriginal.loadData(convertData(risk02));
    riskTarget.updateSettings({
        columns: [{ data: 'LocationId', renderer: getRegionNames },
        { data: 'TSS Hillslope' },
        { data: 'TSS Gully' },
        { data: 'TSS Inchannel' },
        { data: 'TSS Point' },
        { data: 'TSS Total' },
        { data: 'Microbial' }, { data: 'Combined' }, {}]
    });
    riskTarget.loadData(convertData(risk01));
}
/**
 * update the intervention summary table after the intervention handsontable has be loaded
 * @param {any} rowIndex which row should be pick up
 * @param {any} colIndex from which col should be pick up
 */
// 
function updateInterventionSummaryTable(rowIndex, colIndex) {
    var colheaders = interventionHT.getColHeader();
    var html = [];
    for (var i = colIndex; i < colheaders.length; i++) {
        var val1 = interventionHT.getDataAtCell(rowIndex, i);
        var val2 = interventionCostHT.getDataAtCell(0, i);
        console.info(interventionCostHT.getDataAtCell);
        var ele = {};
        ele["name"] = colheaders[i];
        ele["value1"] = val1;
        ele["value2"] = val2;
        html.push(ele);
        //var val2 = interventionCostHT.getDataAtCell(rowIndex, i);
        // html += "<tr style='height: 30px; '>< td style= 'text-align: left'><DIV>" + colheaders[i]+"</DIV></td ><td><DIV>"+val1+"</DIV></td><td style='text-align: right'><DIV>"+val2+"</DIV></td></tr >";
    }
    //document.getElementById("interventionSummaryTable").innerHTML = html;
    var interventionSummaryHT = new Handsontable(interventionSummaryTable, {
        //nestedHeaders:[[{label: 'B', colspan: 2}]],
        data: html,
        columns: columnsFormating(Object.keys(html[0]), '$ 0,0.00', 'numeric', 2),
        stretchH: "all"
    });
    interventionCostHT.updateSettings({ columns: columnsFormating(colheaders, '$ 0,0.00', 'numeric', 1) });
    var plugin = interventionCostHT.getPlugin('autoColumnSize');
    plugin.recalculateAllColumnsWidth();
    interventionCostHT.render();
}