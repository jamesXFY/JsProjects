var geoJsonStyle = {
    fillColor: "#E3E4E5",
    color: "white",
    weight: 0.5,
    fillOpacity:0.8,
    colorGroup: colorbrewer.RiskOriginal['6'],

    initial: function (borderColor, borderWeight, colorGroup) {
        this.color = borderColor;
        this.weight = borderWeight;
        this.colorGroup = colorGroup;

    },
    getColor: function (value) {
        var colors = geoJsonStyle.colorGroup;
        var val = parseInt(value);
        if (Number.isNaN(value) || value <= 0) {
            return geoJsonStyle.fillColor;
        }else if (value <= (val + 0.5)) {
            return colors[val];
        } else if (value > (val + 0.5))
        {
            return colors[val + 1];
        }
    },
    returnStyle: function (value) {
        var style = {
            fillColor: geoJsonStyle.getColor(value),
            color: geoJsonStyle.color,
            weight: geoJsonStyle.weight,
            fillOpacity: geoJsonStyle.fillOpacity
        }
        return style;
    }
}

/**
 * 
 */
var maps = {
    leftMap: null,
    rightMap: null,
    //geoJson: null,
    valueScalesForL: null,
    valueScalesForR: null,
    geoJsonPrimaryKey: "",
    valueScalesPrimaryKey: "",
    valueScalesKey: "",

    baseLayers: [],
    overLayers: [],

    clickFuc: function () { },
    mapMouseOver: function () { },
    mapMouseOut: function () { },

    /**
     * initial Maps and synchronize them
    */
    mapsInitializAndSync: function (leftDiv, rightDiv) {
        this.leftMap = L.map(leftDiv).setView([-27.30, 153.10], 10);
        this.rightMap = L.map(rightDiv).setView([-27.30, 153.10], 10);
        L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {}).addTo(this.leftMap);
        L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {}).addTo(this.rightMap);
        this.leftMap.sync(this.rightMap);
        this.rightMap.sync(this.leftMap);
        // map mouse over and mouse out event
        this.leftMap.on("mouseover", function () { maps.mapMouseOver(); });
        this.leftMap.on("mouseout", function () { maps.mapMouseOut(); });
        this.rightMap.on("mouseover", function () { maps.mapMouseOver(); });
        this.rightMap.on("mouseout", function () { maps.mapMouseOut(); });
    },

    mapsResetViews : function(lGeoJson,rGeoJson) {
        maps.leftMap.setView(lGeoJson.getBounds().getCenter());
        maps.rightMap.setView(rGeoJson.getBounds().getCenter());

    },

    mapsOnLoadFuc: function (layer) {
        layer.on("load", function () {
            console.log("loaded!");
        })
    },

    mapsClickFunc: function (clickFunc) {
        maps.clickFuc = clickFunc;
    },

    mapsMouseOverFunc: function (overFunc) {
        maps.mapMouseOver = overFunc;
    },

    mapsMouseOutFunc: function (outFunc) {
        maps.mapMouseOut = outFunc;
    },


    /**
            geoJson : the data need to be load in to map
            geoJsonPrimaryKey : the ID of the featurecollection
            valueScalesForR : risk file for left map feature render
            valueScalesForL : risk file for right map feature render
            valueScalesPrimaryKey : the foreign key which link to the geoJsonPrimaryKey
            valueScalesKey : the key which use to get the value render the map feature

        */
    loadOverLayGeoJsons: function (geoJson, geoJsonPrimaryKey, valueScalesForL, valueScalesForR, valueScalesPrimaryKey, valueScalesKey, fitBounds) {
        this.valueScalesPrimaryKey = valueScalesPrimaryKey;
        this.valueScalesKey = valueScalesKey;
        var geoJsonL = L.geoJSON(geoJson, { style: function (feature) { return maps.getFeatureStyle(feature, valueScalesForL, geoJsonPrimaryKey); }, onEachFeature: function (feature, layer) { maps.eachFeature(feature, layer, geoJsonPrimaryKey); } });
        geoJsonL.addTo(this.leftMap);
        var geoJsonR = L.geoJSON(geoJson, { style: function (feature) { return maps.getFeatureStyle(feature, valueScalesForR, geoJsonPrimaryKey); }, onEachFeature: function (feature, layer) { maps.eachFeature(feature, layer, geoJsonPrimaryKey); } });
        geoJsonR.addTo(this.rightMap);
        this.overLayers.push({ right: geoJsonR, left: geoJsonL });
        if (fitBounds)
        {
            this.leftMap.fitBounds(geoJsonL.getBounds());
            this.rightMap.fitBounds(geoJsonR.getBounds());  
        }
    },
    /**
            geoJson : the data need to be load in to map
            geoJsonPrimaryKey : the id which indicate unique feature
            valueScalesForR : risk file for left map feature render
            valueScalesForL : risk file for right map feature render
            valueScalesPrimaryKey : the foreign key which link to the geoJsonPrimaryKey
            valueScalesKey : the key which use to get the value render the map feature

        */
    
    loadInitialGeoJson: function (geoJson, geoJsonPrimaryKey, valueScalesForL, valueScalesForR, valueScalesPrimaryKey, valueScalesKey) {
        this.geoJson = geoJson;
        this.valueScalesForL = valueScalesForL;
        this.valueScalesForR = valueScalesForR;
        //this.geoJsonPrimaryKey = geoJsonPrimaryKey;
        this.valueScalesPrimaryKey = valueScalesPrimaryKey;
        this.valueScalesKey = valueScalesKey;
        var geoJsonL = L.geoJSON(geoJson, { style: function (feature) { return maps.getFeatureStyle(feature, maps.valueScalesForL, geoJsonPrimaryKey); }, onEachFeature: function (feature, layer) { maps.eachFeature(feature, layer, geoJsonPrimaryKey); } });
        geoJsonL.addTo(this.leftMap);
        this.leftMap.fitBounds(geoJsonL.getBounds());
        var geoJsonR = L.geoJSON(geoJson, { style: function (feature) { return maps.getFeatureStyle(feature, maps.valueScalesForR, geoJsonPrimaryKey); }, onEachFeature: function (feature, layer) { maps.eachFeature(feature, layer, geoJsonPrimaryKey); } });
        geoJsonR.addTo(this.rightMap);
        this.rightMap.fitBounds(geoJsonR.getBounds());
        //maps.leftMap.setView(geoJsonL.getBounds().getCenter());
        //maps.rightMap.setView(geoJsonR.getBounds().getCenter());

        this.baseLayers.push({right: geoJsonR, left: geoJsonL});
    },

    getFeatureStyle: function (feature, valueScales, geoJsonPrimaryKey) {
        var id = feature.properties[geoJsonPrimaryKey];
        for (var i = 0; i < valueScales.length; i++) {
            var object = valueScales[i];
            if (id == object[maps.valueScalesPrimaryKey]) {
                var value = object[maps.valueScalesKey];
                return geoJsonStyle.returnStyle(value);
            } else if (i == valueScales.length - 1) {
                return geoJsonStyle.returnStyle("");
            }
        }
    },

    eachFeature: function (feature, layer, geoJsonPrimaryKey) {
        var id = feature.properties[geoJsonPrimaryKey];
        layer.on({
            mouseover: maps.layerMouseOver,
            mouseout: maps.layerMouseOut,
            click: function (e) {
                //scenario.clickFunction(id, geoJsonPrimaryKey);
                maps.clickFuc(id, geoJsonPrimaryKey);
            }
        });
    },

    layerMouseOver: function (e) {
        var layer = e.target;
        if (maps.leftMap.hasLayer(layer)) {
            maps.rightMap.eachLayer(function (tlayer) {
                if (tlayer.feature == layer.feature) {
                    tlayer.setStyle({
                        weight: 5
                    });
                }
            });

        } else if (maps.rightMap.hasLayer(layer)) {
            maps.leftMap.eachLayer(function (tlayer) {
                if (tlayer.feature == layer.feature) {
                    tlayer.setStyle({
                        weight: 5
                    });
                }
            });
        }
        layer.setStyle({
            weight: 5
        });
    },
    layerMouseOut: function (e) {
        var layer = e.target;
        if (maps.leftMap.hasLayer(layer)) {
            maps.rightMap.eachLayer(function (tlayer) {
                if (tlayer.feature == layer.feature) {
                    tlayer.setStyle({
                        weight: geoJsonStyle.weight
                    });
                }
            });

        } else if (maps.rightMap.hasLayer(layer)) {
            maps.leftMap.eachLayer(function (tlayer) {
                if (tlayer.feature == layer.feature) {
                    tlayer.setStyle({
                        weight: geoJsonStyle.weight
                    });
                }
            });
        }
        layer.setStyle({
            weight: geoJsonStyle.weight
        });
    },
    
}