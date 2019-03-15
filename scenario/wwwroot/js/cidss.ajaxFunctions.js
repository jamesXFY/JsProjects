var CIDSSAjax = {
    UID: "",
    URL: "",
    initialize: function (UID, URL) {
        this.UID = UID;
        this.URL = URL;
    },
    AjaxGetJson: function (url, errorFcn, cache) {
        var asyncL = this.async;
        var errorDelegate = null;// truiiTools.logError;
        if (errorFcn != null)
            errorDelegate = errorFcn;

        var cacheOpt = cache == null ? false : cache;

        // JSONP CALL TO WCF SERVICE
        var request = $.ajax({
            async: asyncL,
            cache: cacheOpt,
            crossDomain: true,
            //data: '{"fileId":"4"}' ,
            url: url,
            type: "GET",
            //jsonpCallback: 'jsonCallback',  
            //jsonpCallback: 4, 
            dataType: "json",
            // dataType: "json",
            contentType: "application/json; charset=utf-8",
            timeout: 600000 // 10 mins

            // error: errorDelegate
            //success: successDelegate
        });
        request.done(function (data) { return data; });
        return request;

    },

    AjaxPutJson: function (url, settings, errorFcn, keepNullString) { //, nreplace) {
        var asyncL = this.async;

        var errorDelegate = null;// truiiTools.logError;
        if (errorFcn != null)
            errorDelegate = errorFcn;

        // convert object to JSON string  (see http://jollytoad.googlepages.com/json.js)
        // e.g. '{"FileId":"10","Uid":"1","Notes":"Hello world"}' 
        var objectAsJson = $.toJSON(settings);  //replaces JSON.stringify({
        if (!keepNullString)
            objectAsJson = objectAsJson.replace('null', '');
        var originalOptions = {
            async: asyncL,
            type: "POST",
            contentType: "application/json;", // charset=utf-8",
            url: url,
            data: objectAsJson,
            processData: false,
            error: errorDelegate,
            timeout: 600000 // 10 mins
        };
        var request = $.ajax(originalOptions);
        return request;
    },

    AjaxGetXml: function (url, errorFcn) {
        var asyncL = this.async;
        var errorDelegate = null;// truiiTools.logError;
        if (errorFcn != null)
            errorDelegate = errorFcn;

        var request = $.ajax({
            async: asyncL,
            cache: false,
            crossDomain: true,
            url: url,
            type: "GET",
            contentType: "text/xml; charset=\"utf-8\"",
            error: errorDelegate
        });
        return request;
    },

    // set globle file ids
    unionedPUFilesGlobalSetting: function (object) {
        this.AjaxPutJson("/Compare/senarioFilesGlobalSetting", object);
    },

    PUFilesGlobalSetting: function (object) {
        this.AjaxPutJson("/Compare/puFilesGlobalSetting", object);
    }
    // dowload geojson files
}