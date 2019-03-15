var seqMap = function(){
    this.viewPoint = [-27.30, 153.10];
    this.zoomSize = 8;
    this.tileLayer = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png';


    this.map = null;
    this.controlPanel = function () {
        this.baseLayers = null;
        this.overLapLayers = null;

    };
    return this;
}

seqMap.prototype = {
    initiallize: function (domID, viewPoint, zoomSize, tileLayer) {

        viewPoint = viewPoint == null ? this.viewPoint : viewPoint;
        zoomSize = zoomSize == null ? this.zoomSize : zoomSize;
        tileLayer = tileLayer == null ? this.tileLayer : tileLayer;

        var map = L.map(domID).setView(viewPoint, zoomSize);
        return map;
    },

    baselayerCreator: function (name, url) {
        var tileLayer=L.tileLayer(url, {});
        this.controlPanel.baseLayers[name] = tileLayer;
    },

    overLapLayerCreator: function (name, data, style, onEachFunction, pointFunction) {
        var baseLayer = L.geoJSON(data, { style: style, onEachFeature: onEachFunction, pointToLayer: pointFunction });
        this.controlPanel.overLapLayers[name] = baseLayer;
        //return baseLayer;
    },

    geoJsononEachFeatureFunction : function (feature,layer) {
        layer.on({
            mouseover: function () { },
            mouseout: function () { },
            click: function (feature, layer) {
                reloadMap;
                reloadTable;
            },
            zoomend: function () { }
        });

    },

    geoJsonStyle: function () {

    }
    
}