 

var truiiTools = {

    ContainerContent: "<div class='container-content' style='width: 100%; height: 100%'></div>",

    CopyFail: "You cannot copy them to the destination. Please check your account capacity or some security setups of the destination.",

    MoveFail: "You cannot move them to the destination. Please check your account capacity or some security, capacity setups of the destination.",

    CreateDatapageFail: "You cannot create a datapage due to your account's insufficient capacity.",
     
    LongPullingSetups: {
        timeout: 5000, // in miliseconds,
        permanentQueue: {
            queue: [
                /*
                {
                    method: "App/getLibraryInvites",
                    settings: "",
                    done: function (invites) {
                        truii.displayNews(invites);
                    },
                    timeout: 60000
                },
                {
                    method: "test",
                    settings: "",
                    done: function (data) {
                        console.log("method 3500" + data);
                    },
                    timeout: 3500
                }*/
            ]
        },
        onFlyQueue: {
            queue: [],
            timeout: 4000,
        },
    },

    getIconUrl: function (nfo) {

        var ext = nfo.replace(".", "").toLowerCase();
        switch (ext) {
            case 'home': return '/images/icons/user-home.png' ;  
            case 'fav': return '/images/icons/favourite-star.png';  
            case 'library': return '/images/icons/library-owner.png';  
            case 'folder': return '/images/file-icons/folder.png'; 
            case 'rpt': return '/images/file-icons/icon-datapage-16x16.png';  
            case '7z': return '/images/file-icons/file-zip.png'; 
            case 'rar': return '/images/file-icons/file-zip.png';  
            case 'zip': return '/images/file-icons/file-zip.png'; 
            case 'tsv': return '/images/file-icons/file-zip.png';  
            case 'csv': return '/images/file-icons/table_small.png'; 
            case 'tsv': return '/images/file-icons/table_small.png';  
            case 'xls': return '/images/file-icons/file-xls.png'; 
            case 'xlsx': return '/images/file-icons/file-xls.png';  
            case 'dbf': return '/images/file-icons/file.png';
            case 'nc' : return '/images/file-icons/file-netcdf.png';
            case 'bmp': return '/images/file-icons/file.png';
            case 'jpeg': return '/images/file-icons/file-img.png';  
            case 'jpg': return '/images/file-icons/file-img.png';  
            case 'png': return '/images/file-icons/file-img.png';  
            case 'svg': return '/images/file-icons/file-img.png';  
            case 'shp': return '/images/file-icons/file.png';
            case 'shx': return '/images/file-icons/file.png';
            case 'prj': return '/images/file-icons/file.png';
            case 'dbf': return '/images/file-icons/file.png';
            case 'json': return '/images/file-icons/file.png';
            case 'geojson': return '/images/file-icons/file.png';
            case 'doc': return '/images/file-icons/file-doc.png'; 
            case 'docx': return '/images/file-icons/file-doc.png'; 
            case 'txt': return '/images/file-icons/file.png';  
            case 'kml': return '/images/file-icons/file.png';
            case 'kmz': return '/images/file-icons/file.png';
            case 'pdf' : return '/images/file-icons/file-pdf.png'; 
            default: return '/images/file-icons/file-unknown.png';
        }   
         
    },

    getThumbnail: function (nfo) {
        if (nfo == null)
            return null;

        if (nfo.indexOf('data:image/jpg;base64,') != -1)
            return nfo;
        var ext = nfo.replace(".", "").toLowerCase();
        return (ext == 'folder' ? '/images/icons/folder_large.png' : '/images/icons/file_large.png');
    },

    isReport: function (extension) {
        var ext = extension.replace(".", "").toLowerCase();
        return ext == "rpt";
    },

    isSpatialFile: function (extension) {
        return this.isGeoJSON(extension);
    },

    isGeoJSON: function (extension) {
        var ext = extension.replace(".", "").toLowerCase();
        return ext == "geojson";
    },

    isTable: function (extension) {
        var ext = extension.replace(".", "").toLowerCase();
        return ext == "csv" || ext == "tsv" || ext == "dbf" || ext == "xls" || ext == "xlsx";
    },

    isImage: function (extension) {
        var ext = extension.replace(".", "").toLowerCase();
        return ext == "png" || ext == "jpg" || ext == "jpeg" || ext == "svg" || ext == "bmp";
    },

    /* Get the datatpye enum that match a file extension */
    getDataTypeForExtension: function (extension) {
         
        return extension;
         
    },

    getHiddenDownloaderFrame: function () {
        var hiddenIFrameID = 'hiddenDownloader';
        // create a hidden frame to link the file to, thus initialising the file download in the browser 
        var hiddenFrame = document.getElementById(hiddenIFrameID);
        if (hiddenFrame == null) {
            hiddenFrame = document.createElement('iframe');
            hiddenFrame.id = hiddenIFrameID;
            hiddenFrame.style.display = 'none';
            document.body.appendChild(hiddenFrame);
        }
        return hiddenFrame;
    },

    displayBottomLoading: function (vis) {
        if (vis == true)
            $("#textLoading").css('display', 'block');
        else 
            $("#textLoading").css('display', 'none');
    },

    initNotificationDialog: function() {
        return $("#notificationDialog").dialog({
            autoOpen: false,
            modal: true,
            buttons: {
               Close: function () {
                    $(this).dialog("close");
                }
            },
            close: function () {
                $(this).dialog("close");
            },
        });

        $("#notificationDialog").dialog("close");
    },

    openNotificationDialog: function (message) {
        $("#notificationDialog").dialog("close");
        $("#notificationDialog").find(".notificationMessage").text(message);
        $("#notificationDialog").dialog("open");
    },

    closeNotificationDialog: function () {
        $("#notificationDialog").dialog("close");
    },

    selNavigatorTemplate: "#V3_fileNavigator_template",
    selNavigatorControl: "#fileNavigator",

    reloadPage: function (data) {
        window.location.reload();
    },

    getValueFromPercent: function (percent, max, min) {
        var delta = percent / 100 * (max - min);
        return delta + min;
    },

    getPercentFromValue: function (value, max, min) {
        var delta = value - min;
        return delta / (max - min) * 100;
    },

    TestWebService: function () {
        try {
            var proxy = new ServiceReference1.DataService();
            proxy.set_enableJsonp(true);
            proxy.GetTimeSeries(5, onSuccess, onFail);
        }
        catch (exception) { }
    },

    successDelegate: function (data) {
        //console.log("success");
    },
     
    onControlClick : function (controlId, func) {
        // on control click run the associated method
        $(controlId).on('click', function (e) {
            if (func != null)
                func();
        });
    },

    getColorParamsFromUI: function (jQueryUI) {
        var r = Math.round(jQueryUI.spectrum("get")._r);
        var g = Math.round(jQueryUI.spectrum("get")._g);
        var b = Math.round(jQueryUI.spectrum("get")._b);
        var a = jQueryUI.spectrum("get")._a;

        return { r: r, g: g, b: b, a: a };
    },

    logError: function (result) {
        console.log("load failed: " + result.toString());
    },


    setReportItemsBehaviour: function (ctrl) {
        var item = document.getElementById(ctrl);
        if (item != null) {
            for (var i = 0; i < item.children.length ; i++) {
                var ctrl = item.children[i];
                var id = ctrl.id;
                ctrl.draggable = true;
                ctrl.resizable = true;
                $("#" + id.toString()).draggable({ handle: "p" }); // make the item draggable //  , containment: "RightColumn_ctl00_myCanvas" 
                $("#" + id.toString()).resizable(); // make the item resizable
            }
            //item.style.top = "444px";
        }
        else
            console.log('report canvas not found');
    },

    /* DATETIME UTILITY METHODS */
    formatDate: function (date) {
        return (date.getDate() < 10 ? "0" : "") + date.getDate() + "/" + (date.getMonth() + 1 < 10 ? "0" : "") + (date.getMonth() + 1).toString() + "/" + date.getFullYear() + " " + date.getHours() + ":" + (date.getMinutes() < 10 ? "0" : "") + date.getMinutes();
    },


    dateToJson: function (date, useOffset) {
        var offset = '-0000';
        if (useOffset == true) {
            var value = date.getTimezoneOffset();
            if (value != 0) {
                var isNegative = value <= 0;
                if (isNegative) value = -value;
                offset = (isNegative ? "-" : "+") + (value > 0 && value < 1000 ? "0" : "") + value;
            }
        }
        return '\/Date(' + date.getTime() + offset + ')\/';
    },

    dateToString: function (date) {
        var day = (date.getDate() < 10 ? "0" : "") + date.getDate();
        var month = (date.getMonth() + 1 < 10 ? "0" : "") + (date.getMonth() + 1).toString();
        var year = date.getFullYear();
        var hour = (date.getHours() < 10 ? "0" : "") + date.getHours();
        var minute = (date.getMinutes() + 1 < 10 ? "0" : "") + (date.getMinutes() + 1).toString();
        var second = (date.getSeconds() + 1 < 10 ? "0" : "") + (date.getSeconds() + 1).toString();

        var dateString = day + "/" + month + "/" + year + " " + hour + ':' + minute + ':' + second; //"dd/MM/yyyy HH:mm:ss"
        return dateString;
    },

    dateToYMDString: function (date) {
        if (date == null)
            return null;

        var day = (date.getDate() < 10 ? "0" : "") + date.getDate();
        var month = (date.getMonth() + 1 < 10 ? "0" : "") + (date.getMonth() + 1).toString();
        var year = date.getFullYear();
        var hour = (date.getHours() < 10 ? "0" : "") + date.getHours();
        var minute = (date.getMinutes()  < 10 ? "0" : "") + (date.getMinutes()).toString();
        var second = (date.getSeconds()  < 10 ? "0" : "") + (date.getSeconds()).toString();

        var dateString = year + "-" + month + "-" + day + " " + hour + ':' + minute + ':' + second; //"MM/dd/yyyy HH:mm:ss"
        return dateString;
    },

    timeConvert: function (ds) {
        var D, dtime;
        var dobj = ds.match(/(\d+)|([+-])|(\d{4})/g);
        var T = parseInt(dobj[0]);
        var tz = dobj[1];
        var off = dobj[2];
        if (isNaN(T)) {
            if (dobj[0] == "-") {
                T = -parseInt(dobj[1]);
                tz = dobj[2];
                off = dobj[3];
            }
            if (dobj[0] == "+") {
                T = parseInt(dobj[1]);
                tz = dobj[2];
                off = dobj[3];
            }
        }

        if (off) {
            off = (parseInt(off.substring(0, 2), 10) * 3600000) +
                  (parseInt(off.substring(2), 10) * 60000);
            if (tz == '-')
                off *= -1;
        }
        else
            off = 0;
        return new Date(T += off);
    },

    toUTC: function (date) {
        return new Date(date.valueOf() + date.getTimezoneOffset() * 60000);
    },

    dateToMDYString: function (date) {
        return "" + (date.getMonth() + 1) + "/" + (date.getDate()) + "/" + (date.getFullYear()) + " " + (date.getHours()) + ":" + (date.getMinutes()) + ":" + (date.getSeconds());
    },

    localToUTC: function (date) {
        var millis = date.getTime() + (date.getTimezoneOffset() * 60000);
        
        var offset = '-0000';
        var value = date.getTimezoneOffset();
        //if (value != 0) {
        //    var isNegative = value <= 0;
        //    if (isNegative) value = -value;
        //    offset = (isNegative ? "-" : "+") + (value > 0 && value < 1000 ? "0" : "") + value;
        //}
        //console.log(new Date(millis) + " offset : " + offset);


        return '\/Date(' + millis + offset + ')\/';
    },
    AddDays: function (Day, Count) {
        return Day.setDate(Day.getDate() + Count);
    },

    /* COLOR UTILITY METHODS */
    toRGB: function (r, g, b) {
        var hexR = (r.toString(16).length < 2 ? "0" : "") + r.toString(16);
        var hexG = (g.toString(16).length < 2 ? "0" : "") + g.toString(16);
        var hexB = (b.toString(16).length < 2 ? "0" : "") + b.toString(16);

        return "#" + hexR + hexG + hexB;
    },
    getColor: function (r, g, b) {
        return "rgb(" + r.toString() + ", " + g.toString() + ", " + b.toString() + ")";
    },

    getRGBAColor: function (r, g, b, a) {
        return "rgba(" + r.toString() + ", " + g.toString() + ", " + b.toString() + ", " + a.toString() + ")";
    },

    rgbArrFromHexString: function(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? [
            parseInt(result[1], 16),
            parseInt(result[2], 16),
            parseInt(result[3], 16)
        ] : null;
    },

    // Interpolates two [r,g,b] colors and returns an [r,g,b] of the result
    // Taken from the awesome ROT.js roguelike dev library at
    // https://github.com/ondras/rot.js
    interPolateColorValue: function(min, max, factor) {
        if (arguments.length < 3) { factor = 0.5; }
        var result = min.slice();
        for (var i=0;i<3;i++) {
            result[i] = Math.round(result[i] + factor*(max[i]-min[i]));
        }
        return result;
    },

    interPolateValue: function(min, max, factor) {
        if (arguments.length < 3) { factor = 0.5; }
        var result = min;
        return result + factor * (max-min);
    },

    /* GEOGRAPHIC PROJECTIONS UTILITY METHODS */
    dmsToDecimalDegrees: function (deg, min, secs) {
        deg = Math.abs(deg) + Math.abs(min) / 60 + Math.abs(secs) / 3600;
        if (deg < 0) {
            degDegrees = -deg;
        } else if (min < 0) {
            degDegrees = -deg;
        } else if (secs < 0) {
            degDegrees = -deg;
        } else {
            degDegrees = deg;
        }
        return degDegrees;
    },

    decimalDegreesToDMS: function (degDegrees) {
        deg = parseInt(degDegrees);
        min = parseInt((degDegrees - deg) * 60);
        secs = (degDegrees - deg - (min / 60)) * 3600;

        return {
            Degrees: deg,
            Minutes: min,
            Seconds: secs
        };
    },

    latLongToGDA: function (latitude, longitude, ref) {
        // Redfearn's
        var sma = 6378137.000; // semi major axis
        var inv = 298.257222101000; //  GRS80 inverse flattening 
        if (ref == "WGS84")
            inv = 298.257223563000;

        // GDA-MGA
        var falseEasting = 500000.0000;
        var falseNorthing = 10000000.0000;
        var centralScaleFactor = 0.9996;
        var zoneWidthDegrees = 6;
        var longitudeOfTheCentralMeridianOfZone1Degrees = -177;

        var flattening = 1 / inv;
        var semiMinorAxis = sma * (1 - flattening);
        var eccentricity = (2 * flattening) - (flattening * flattening);
        var n = (sma - semiMinorAxis) / (sma + semiMinorAxis);
        var n2 = Math.pow(n, 2);
        var n3 = Math.pow(n, 3);
        var n4 = Math.pow(n, 4);
        var g = sma * (1 - n) * (1 - n2) * (1 + (9 * n2) / 4 + (225 * n4) / 64) * Math.PI / 180;
        var longitudeOfWesternEdgeOfZoneZeroDegrees = longitudeOfTheCentralMeridianOfZone1Degrees - (1.5 * zoneWidthDegrees);
        var centralMeridianOfZoneZeroDegrees = longitudeOfWesternEdgeOfZoneZeroDegrees + (zoneWidthDegrees / 2);
        var latitudeRadians = (latitude / 180) * Math.PI;
        var zoneNoReal = (longitude - longitudeOfWesternEdgeOfZoneZeroDegrees) / zoneWidthDegrees;
        var zone = intval(zoneNoReal);
        var centralMeridian = (zone * zoneWidthDegrees) + centralMeridianOfZoneZeroDegrees;

        var diffLongitudeDegrees = longitude - centralMeridian;
        var diffLongitudeRadians = (diffLongitudeDegrees / 180) * Math.PI;
        var sinLatitude = Math.sin(latitudeRadians);
        var sinLatitude2 = Math.sin(2 * latitudeRadians);
        var sinLatitude4 = Math.sin(4 * latitudeRadians);
        var sinLatitude6 = Math.sin(6 * latitudeRadians);
        var e2 = eccentricity;
        var e4 = Math.pow(e2, 2);
        var e6 = e2 * e4;
        var a0 = 1 - (e2 / 4) - ((3 * e4) / 64) - ((5 * e6) / 256);
        var a2 = (3 / 8) * (e2 + (e4 / 4) + ((15 * e6) / 128));
        var a4 = (15 / 256) * (e4 + ((3 * e6) / 4));
        var a6 = (35 * e6) / 3072;
        var meridianDistanceTerm1 = sma * a0 * latitudeRadians;
        var meridianDistanceTerm2 = -sma * a2 * sinLatitude2;
        var meridianDistanceTerm3 = sma * a4 * sinLatitude4;
        var meridianDistanceTerm4 = -sma * a6 * sinLatitude6;
        var sumMeridianDistances = meridianDistanceTerm1 + meridianDistanceTerm2 + meridianDistanceTerm3 + meridianDistanceTerm4;
        var rho = sma * (1 - e2) / Math.pow((1 - e2 * Math.pow(sinLatitude, 2)), 1.5);
        var nu = sma / Math.pow((1 - (e2 * Math.pow(sinLatitude, 2))), 0.5);
        var cosLatitude1 = Math.cos(latitudeRadians);
        var cosLatitude2 = Math.pow(cosLatitude1, 2);
        var cosLatitude3 = Math.pow(cosLatitude1, 3);
        var cosLatitude4 = Math.pow(cosLatitude1, 4);
        var cosLatitude5 = Math.pow(cosLatitude1, 5);
        var cosLatitude6 = Math.pow(cosLatitude1, 6);
        var cosLatitude7 = Math.pow(cosLatitude1, 7);
        var diffLongitude1 = diffLongitudeRadians;
        var diffLongitude2 = Math.pow(diffLongitude1, 2);
        var diffLongitude3 = Math.pow(diffLongitude1, 3);
        var diffLongitude4 = Math.pow(diffLongitude1, 4);
        var diffLongitude5 = Math.pow(diffLongitude1, 5);
        var diffLongitude6 = Math.pow(diffLongitude1, 6);
        var diffLongitude7 = Math.pow(diffLongitude1, 7);
        var diffLongitude8 = Math.pow(diffLongitude1, 8);
        var tanLatitude1 = Math.tan(latitudeRadians);
        var tanLatitude2 = Math.pow(tanLatitude1, 2);
        var tanLatitude4 = Math.pow(tanLatitude1, 4);
        var tanLatitude6 = Math.pow(tanLatitude1, 6);
        var psi1 = nu / rho;
        var psi2 = Math.pow(psi1, 2);
        var psi3 = Math.pow(psi1, 3);
        var psi4 = Math.pow(psi1, 4);

        var eastingTerm1 = nu * diffLongitude1 * cosLatitude1;
        var eastingTerm2 = nu * diffLongitude3 * cosLatitude3 * (psi1 - tanLatitude2) / 6;
        var eastingTerm3 = nu * diffLongitude5 * cosLatitude5 * (4 * psi3 * (1 - 6 * tanLatitude2) + psi2 * (1 + 8 * tanLatitude2) - psi1 * (2 * tanLatitude2) + tanLatitude4) / 120;
        var eastingTerm4 = nu * diffLongitude7 * cosLatitude7 * (61 - 479 * tanLatitude2 + 179 * tanLatitude4 - tanLatitude6) / 5400;

        var sumEasting = eastingTerm1 + eastingTerm2 + eastingTerm3 + eastingTerm4;
        var sumEastingK = centralScaleFactor * sumEasting;

        var easting = falseEasting + sumEastingK;

        var northingMeridianDistance = sumMeridianDistances;
        var northingTerm1 = nu * sinLatitude * diffLongitude2 * cosLatitude1 / 2;
        var northingTerm2 = nu * sinLatitude * diffLongitude4 * cosLatitude3 * (4 * psi2 + psi1 - tanLatitude2) / 24;
        var northingTerm3 = nu * sinLatitude * diffLongitude6 * cosLatitude5 * (8 * psi4 * (11 - 24 * tanLatitude2) - 28 * psi3 * (1 - 6 * tanLatitude2) + psi2 * (1 - 32 * tanLatitude2) - psi1 * (2 * tanLatitude2) + tanLatitude4) / 720;
        var northingTerm4 = nu * sinLatitude * diffLongitude8 * cosLatitude7 * (1385 - 3111 * tanLatitude2 + 543 * tanLatitude4 - tanLatitude6) / 40320;

        var sumNorthing = northingMeridianDistance + northingTerm1 + northingTerm2 + northingTerm3 + northingTerm4;
        var sumNorthingK = centralScaleFactor * sumNorthing;

        var northing = falseNorthing + sumNorthingK;

        var gridConvergenceTerm1 = -sinLatitude * diffLongitude1;
        var gridConvergenceTerm2 = -sinLatitude * diffLongitude3 * cosLatitude2 * (2 * psi2 - psi1) / 3;
        var gridConvergenceTerm3 = -sinLatitude * diffLongitude5 * cosLatitude4 * (psi4 * (11 - 24 * tanLatitude2) - psi3 * (11 - 36 * tanLatitude2) + 2 * psi2 * (1 - 7 * tanLatitude2) + psi1 * tanLatitude2) / 15;
        var gridConvergenceTerm4 = sinLatitude * diffLongitude7 * cosLatitude6 * (17 - 26 * tanLatitude2 + 2 * tanLatitude4) / 315;

        var gridConvergenceRadians = gridConvergenceTerm1 + gridConvergenceTerm2 + gridConvergenceTerm3 + gridConvergenceTerm4;
        var gridConvergenceDegrees = (gridConvergenceRadians / Math.PI) * 180;;

        var pointScaleTerm1 = 1 + (diffLongitude2 * cosLatitude2 * psi1) / 2;
        var pointScaleTerm2 = diffLongitude4 * cosLatitude4 * (4 * psi3 * (1 - 6 * tanLatitude2) + psi2 * (1 + 24 * tanLatitude2) - 4 * psi1 * tanLatitude2) / 24;
        var pointScaleTerm3 = diffLongitude6 * cosLatitude6 * (61 - 148 * tanLatitude2 + 16 * tanLatitude4) / 720;
        var sumPointScale = pointScaleTerm1 + pointScaleTerm2 + pointScaleTerm3;
        var pointScale = centralScaleFactor * sumPointScale;

        return {
            Easting: easting,
            Northing: northing,
            Zone: zone,
            GridConvergence: gridConvergenceDegrees,
            PointScale: pointScale,
        };
    },

    gdaToLatLong: function (easting, northing, zone) { // Brisbane 56 
        // Redfearn's formula
        // GDA-MGA 
        var falseEasting = 500000.0000;
        var falseNorthing = 10000000.0000;
        var centralScaleFactor = 0.9996;
        var zoneWidthDegrees = 6;
        var longitudeOfTheCentralMeridianOfZone1Degrees = -177;

        // ref GRS80
        var sma = 6378137.000;
        var inv = 298.257222101000;

        var flattening = 1 / inv;
        var semiMinorAxis = sma * (1 - flattening);
        var eccentricity = (2 * flattening) - (flattening * flattening);
        var n = (sma - semiMinorAxis) / (sma + semiMinorAxis);
        var n2 = Math.pow(n, 2);
        var n3 = Math.pow(n, 3);
        var n4 = Math.pow(n, 4);
        var g = sma * (1 - n) * (1 - n2) * (1 + (9 * n2) / 4 + (225 * n4) / 64) * Math.PI / 180;
        var longitudeOfWesternEdgeOfZoneZeroDegrees = longitudeOfTheCentralMeridianOfZone1Degrees - (1.5 * zoneWidthDegrees);
        var centralMeridianOfZoneZeroDegrees = longitudeOfWesternEdgeOfZoneZeroDegrees + (zoneWidthDegrees / 2);

        var newE = (easting - falseEasting);
        var newEScaled = newE / centralScaleFactor;
        var newN = (northing - falseNorthing);
        var newNScaled = newN / centralScaleFactor;
        var sigma = (newNScaled * Math.PI) / (g * 180);
        var sigma2 = 2 * sigma;
        var sigma4 = 4 * sigma;
        var sigma6 = 6 * sigma;
        var sigma8 = 8 * sigma;

        var footPointLatitudeTerm1 = sigma;
        var footPointLatitudeTerm2 = ((3 * n / 2) - (27 * n3 / 32)) * Math.sin(sigma2);
        var footPointLatitudeTerm3 = ((21 * n2 / 16) - (55 * n4 / 32)) * Math.sin(sigma4);
        var footPointLatitudeTerm4 = (151 * n3) * Math.sin(sigma6) / 96;
        var footPointLatitudeTerm5 = 1097 * n4 * Math.sin(sigma8) / 512;
        var footPointLatitude = footPointLatitudeTerm1 + footPointLatitudeTerm2 + footPointLatitudeTerm3 + footPointLatitudeTerm4 + footPointLatitudeTerm5;

        var sinFootPointLatitude = Math.sin(footPointLatitude);
        var secFootPointLatitude = 1 / Math.cos(footPointLatitude);

        var rho = sma * (1 - eccentricity) / Math.pow(1 - eccentricity * Math.pow(sinFootPointLatitude, 2), 1.5);
        var nu = sma / Math.pow(1 - eccentricity * Math.pow(sinFootPointLatitude, 2), 0.5);

        var x1 = newEScaled / nu;
        var x3 = Math.pow(x1, 3);
        var x5 = Math.pow(x1, 5);
        var x7 = Math.pow(x1, 7);

        var t1 = Math.tan(footPointLatitude);
        var t2 = Math.pow(t1, 2);
        var t4 = Math.pow(t1, 4);
        var t6 = Math.pow(t1, 6);

        var psi1 = nu / rho;
        var psi2 = Math.pow(psi1, 2);
        var psi3 = Math.pow(psi1, 3);
        var psi4 = Math.pow(psi1, 4);

        var latitudeTerm1 = -((t1 / (centralScaleFactor * rho)) * x1 * newE / 2);
        var latitudeTerm2 = (t1 / (centralScaleFactor * rho)) * (x3 * newE / 24) * (-4 * psi2 + 9 * psi1 * (1 - t2) + 12 * t2);
        var latitudeTerm3 = -(t1 / (centralScaleFactor * rho)) * (x5 * newE / 720) * (8 * psi4 * (11 - 24 * t2) - 12 * psi3 * (21 - 71 * t2) + 15 * psi2 * (15 - 98 * t2 + 15 * t4) + 180 * psi1 * (5 * t2 - 3 * t4) + 360 * t4);
        var latitudeTerm4 = (t1 / (centralScaleFactor * rho)) * (x7 * newE / 40320) * (1385 + 3633 * t2 + 4095 * t4 + 1575 * t6);
        var latitudeRadians = footPointLatitude + latitudeTerm1 + latitudeTerm2 + latitudeTerm3 + latitudeTerm4;
        var latitude = (latitudeRadians / Math.PI) * 180;

        var centralMeridianDegrees = (zone * zoneWidthDegrees) + longitudeOfTheCentralMeridianOfZone1Degrees - zoneWidthDegrees;
        var centralMeridianRadians = (centralMeridianDegrees / 180) * Math.PI;
        var longitudeTerm1 = secFootPointLatitude * x1;
        var longitudeTerm2 = -secFootPointLatitude * (x3 / 6) * (psi1 + 2 * t2);
        var longitudeTerm3 = secFootPointLatitude * (x5 / 120) * (-4 * psi3 * (1 - 6 * t2) + psi2 * (9 - 68 * t2) + 72 * psi1 * t2 + 24 * t4);
        var longitudeTerm4 = -secFootPointLatitude * (x7 / 5040) * (61 + 662 * t2 + 1320 * t4 + 720 * t6);
        var longitudeRadians = centralMeridianRadians + longitudeTerm1 + longitudeTerm2 + longitudeTerm3 + longitudeTerm4;
        var longitude = (longitudeRadians / Math.PI) * 180;

        var gridConvergenceTerm1 = -(x1 * t1);
        var gridConvergenceTerm2 = (t1 * x3 / 3) * (-2 * psi2 + 3 * psi1 + t2);
        var gridConvergenceTerm3 = -(t1 * x5 / 15) * (psi4 * (11 - 24 * t2) - 3 * psi3 * (8 - 23 * t2) + 5 * psi2 * (3 - 14 * t2) + 30 * psi1 * t2 + 3 * t4);
        var gridConvergenceTerm4 = (t1 * x7 / 315) * (17 + 77 * t2 + 105 * t4 + 45 * t6);
        var gridConvergenceRadians = gridConvergenceTerm1 + gridConvergenceTerm2 + gridConvergenceTerm3 + gridConvergenceTerm4;
        var gridConvergenceDegrees = (gridConvergenceRadians / Math.PI) * 180;

        var pointScaleFactor1 = Math.pow(newEScaled, 2) / (rho * nu);
        var pointScaleFactor2 = Math.pow(pointScaleFactor1, 2);
        var pointScaleFactor3 = Math.pow(pointScaleFactor1, 3);
        var pointScaleTerm1 = 1 + pointScaleFactor1 / 2;
        var pointScaleTerm2 = (pointScaleFactor2 / 24) * (4 * psi1 * (1 - 6 * t2) - 3 * (1 - 16 * t2) - 24 * t2 / psi1);
        var pointScaleTerm3 = pointScaleFactor3 / 720;
        var pointScale = centralScaleFactor * (pointScaleTerm1 + pointScaleTerm2 + pointScaleTerm3);

        return {
            Latitude: latitude,
            Longitude: longitude,
            GridConvergence: gridConvergenceDegrees,
            PointScale: pointScale
        };
    },


    /* POPUP DIALOGS UTILITY METHODS */
    createDialogWithButtons: function (controlId, ctrlTitle, ctrlWidth, ctrlHeight, buttonOpts) {
        // create the dialog
        var options = {
            title: ctrlTitle,
            draggable: true,
            resizable: true,
            show: 'Transfer',
            hide: 'Transfer',
            autoOpen: false,
            minHeight: 10,
            minwidth: 10,
            buttons: buttonOpts,
            modal: true
        };

        if (ctrlWidth != null) {
            options.width = ctrlWidth;
        }

        if (ctrlHeight != null) {
            options.height = ctrlHeight;
        }

        var dlg = $(controlId).dialog(options);

        // following is needed to handle events within the attached asp control
        dlg.parent().appendTo(jQuery("form:first"));
        return dlg;
    },

    createDialogWithButtonsAndOptions: function (controlId, cOptions, extOptions, ctrlTitle, ctrlWidth, ctrlHeight, buttonOpts) {
        // create the dialog
        var options = {
            title: ctrlTitle,
            draggable: true,
            resizable: true,
            show: 'Transfer',
            hide: 'Transfer',
            autoOpen: false,
            minHeight: 10,
            minwidth: 10,
            buttons: buttonOpts,
            modal: true
        };

        if (cOptions)
            extend(options, cOptions);

        if (ctrlWidth != null) {
            options.width = ctrlWidth;
        }

        if (ctrlHeight != null) {
            options.height = ctrlHeight;
        }

        var dlg = $(controlId).dialog(options);

        if (extOptions)
            dlg.dialogExtend(extOptions);

        // following is needed to handle events within the attached asp control
        dlg.parent().appendTo(jQuery("form:first"));
        return dlg;
    },

    createDialogWithButtonsAndAutoSize: function (controlId, ctrlTitle, buttonOpts) {
        // create the dialog
        var dlg = $(controlId).dialog({
            title: ctrlTitle,
            draggable: true,
            resizable: true,
            show: 'Transfer',
            hide: 'Transfer',
            autoOpen: false,
            minHeight: 10,
            minwidth: 10,
            buttons: buttonOpts,
            modal: true
        });

        // following is needed to handle events within the attached asp control
        dlg.parent().appendTo(jQuery("form:first"));
        return dlg;
    },
    
    createDialog: function (controlId, ctrlTitle, ctrlWidth, ctrlHeight, button1Text, button1Action, button2Text, button2Action, button3Text, button3Action) {
        // create the dialog validation buttons
        var buttonOpts = {};
        var ctrl = $(controlId);

        // button 1
        if (button1Text != null) {
            buttonOpts[button1Text] = function () {
                if (button1Action != null)
                    button1Action(this);
                else
                    ctrl.dialog("close"); // no action defined, simply close the control
            };
        }
        else { // if no button specified, add a default close button
            if (button1Text == null)
                button1Text = 'Close';

            buttonOpts[button1Text] = function () {
                ctrl.dialog("close"); // no action defined, simply close the control
            };
        }
        // button 2
        if (button2Text != null) {
            buttonOpts[button2Text] = function () {
                if (button2Action != null)
                    button2Action(this);
                else
                    ctrl.dialog("close"); // no action defined, simply close the control
            };
        }
        // button 3
        if (button3Text != null) {
            buttonOpts[button3Text] = function () {
                if (button3Action != null)
                    button3Action();
                else
                    ctrl.dialog("close"); // no action defined, simply close the control
            };
        }

        return truiiTools.createDialogWithButtons(controlId, ctrlTitle, ctrlWidth, ctrlHeight, buttonOpts);
    },

    createDialogWithOptions: function (controlId, options, extOptions, ctrlTitle, ctrlWidth, ctrlHeight, button1Text, button1Action, button2Text, button2Action, button3Text, button3Action) {
        // create the dialog validation buttons
        var buttonOpts = {};
        var ctrl = $(controlId);

        // button 1
        if (button1Text != null) {
            buttonOpts[button1Text] = function () {
                if (button1Action != null)
                    button1Action(this);
                else
                    ctrl.dialog("close"); // no action defined, simply close the control
            };
        }
        else { // if no button specified, add a default close button
            if (button1Text == null)
                button1Text = 'Close';

            buttonOpts[button1Text] = function () {
                ctrl.dialog("close"); // no action defined, simply close the control
            };
        }
        // button 2
        if (button2Text != null) {
            buttonOpts[button2Text] = function () {
                if (button2Action != null)
                    button2Action(this);
                else
                    ctrl.dialog("close"); // no action defined, simply close the control
            };
        }
        // button 3
        if (button3Text != null) {
            buttonOpts[button3Text] = function () {
                if (button3Action != null)
                    button3Action();
                else
                    ctrl.dialog("close"); // no action defined, simply close the control
            };
        }

        return truiiTools.createDialogWithButtonsAndOptions(controlId, options, extOptions, ctrlTitle, ctrlWidth, ctrlHeight, buttonOpts);
    },

    /* TREEVIEW UTILITY METHODS */
    createTreeview: function (controlId, prefix, showCheckbox, selectionMode, onSelect, onBeforeSelect, onActivate, onClick) {
        // reset the tree content
        $(controlId).fancytree({
            tabbable: false,
            checkbox: showCheckbox,
            selectMode: selectionMode,
            idPrefix: prefix,
            source: [],
            select: onSelect,
            beforeSelect: onBeforeSelect,
            activate: onActivate,
            click: onClick,
        });
    },

    populateTreeview: function (rootNode, data, hideRootChekbox, hideChildCheckbox, selectedFiles) {

        if (hideRootChekbox == null) hideRootChekbox = false;
        if (hideChildCheckbox == null) hideChildCheckbox = false;

        // add the file then the columns
        for (var i = 0; i < data.length; i++) {
            var file = data[i];
            var childNode = rootNode.addChildren({
                title: file.Name,
                id: file.FileId,
                key: "file_" + file.FileId,
                tooltip: file.Name,
                folder: true,
                expanded: true,
                hideCheckbox: hideRootChekbox
            });

            var columns = file.Columns;
            if (columns != null) {
                for (var j = 0; j < columns.length; j++) {
                    var column = columns[j];

                    // check if it is selected
                    var isSelected = false;
                    if (selectedFiles != null &&
                        selectedFiles["" + file.FileId] != null &&
                        selectedFiles["" + file.FileId]["" + column.ColId] != null)
                        isSelected = true;

                    var leaf = childNode.addChildren({
                        title: column.Name,
                        id: column.ColId,
                        key: file.FileId + "_" + column.ColId,
                        tooltip: column.Name,
                        folder: false,
                        hideCheckbox: hideChildCheckbox,
                        selected: isSelected
                    });
                }
            }
        }
    },
     
    getTreeviewSelection: function (treeId) {
        // get the selected file and columns
        var columns = [];
        var tree = $(treeId).fancytree("getTree");
        var nodes = tree.getSelectedNodes();
        for (var i = 0; i < nodes.length; i++) {
            var node = nodes[i];
            if (node.key.indexOf("file_") > -1) {
                //// do nothing on tree root
                //var id = node.key.replace("file_", "");
            }
            else {
                // add file/column pair to the list
                var index = node.key.indexOf("_");
                var fileId = node.key.slice(0, index);
                var col = node.key.slice(index + 1);
                columns.push({
                    FileId: fileId,
                    ColIndex: col, // TODO: index isn't used anymore, make sure to match the index to actual COLID
                    ColId: col // use ColID instead of Index
                });
            }
        }
        return columns;
    },

    populateFilesTreeviewAsync: function (treeId, hideRootChekbox, includeNonNumeric, hideChildCheckbox, selectedFiles) {
        // populate the tree
        var requestFileColumns = truiiWCF.getSelectedFilesTree(includeNonNumeric);

        requestFileColumns.done(function (data) {
            var rootNode = $(treeId).fancytree("getRootNode");
            truiiTools.populateTreeview(rootNode, data, hideRootChekbox, hideChildCheckbox, selectedFiles);
        });
    },
      
    /* SELECT MANAGEMENT*/
    createOption: function (text, value) {
        var option = document.createElement("option");
        option.text = text;
        if (value != null)
            option.value = value;
        return option;
    },

    comboBoxAddOption: function (combobox, text, value) {
        var optn = truiiTools.createOption(text, value)
        combobox.options.add(optn);
    },

    comboBoxClear: function (cb) {
        if (cb.options != null)
            cb.options.length = 0;
    },

    sort: function (x, y, findBigger, getX) {

        var map = {};
        for (var i = 0; i < x.length; i++) {

            var xRep = getX(x[i]);
            if (!map["" + xRep])
                map["" + xRep] = {yMap: [], ind: 0};

            map["" + xRep].yMap.push(y[i]);
        }

        x = this.mergeSort(x, findBigger);
        
        for (var i = 0; i < x.length; i++) {
            var xRep = getX(x[i]);
            
            var lookupT = map["" + xRep];
            var coorY = lookupT.yMap[lookupT.ind];
            lookupT.ind = (lookupT.ind + 1) % lookupT.yMap.length;

            y[i] = coorY;
        }

        return x;
    },

    mergeSort: function (x, findBigger) {
        if (x.length < 2)
            return x;

        var middle = parseInt(x.length / 2);
        var left = x.slice(0, middle);
        var right = x.slice(middle, x.length);

        return this.merge(this.mergeSort(left, findBigger), this.mergeSort(right, findBigger), findBigger);
    },

    merge: function (left, right, findBigger) {
        var result = [];

        while (left.length && right.length) {
            if (findBigger(right[0], left[0])) {
                result.push(left.shift());
            } else {
                result.push(right.shift());
            }
        }

        while (left.length)
            result.push(left.shift());

        while (right.length)
            result.push(right.shift());

        return result;
    },

    convertXYPairToXYArray: function (data) {
        var list = {
            x: [],
            y: []
        };

        data.forEach(function (point) {
            list.x.push(point.X);
            list.y.push(point.Y);
        });
            
        return list;
    },

    removeNullOrEmpty: function (arr) {

        if (!arr) {
            console.log("The input array is empty");
            return;
        }

        for (var i = 0; i < arr.length; i++) {
            if (arr[i] == null || ("" + arr[i]).trim() == "") {
                arr.splice(i, 1);
                i--;
            }
        }
    },

    removeNullOrEmptyFromPairs: function (arr1, arr2) {

        if (arr1.length != arr2.length) {
            console.log("The length of 2 arrays is different");
            return;
        }

        for (var i = 0; i < arr1.length; i++) {
            if (arr1[i] == null || ("" + arr1[i]).trim() == "" || arr2[i] == null || ("" + arr2[i]).trim() == ""){
                arr1.splice(i, 1);
                arr2.splice(i, 1);
                i--;
            }
        }
    },

    removeNullOrEmptyHeadAndTrail: function (arr1, arr2) {
        this.removeNullOrEmptyHeadFromPairs(arr1, arr2);
        // this.removeNullOrEmptyTrailFromPairs(arr1, arr2);
    },

    removeNullOrEmptyHeadFromPairs: function (arr1, arr2) {

        if (arr1.length != arr2.length) {
            console.log("The length of 2 arrays is different");
            return;
        }

        var found = false;

        for (var i = 0; i < arr1.length; i++) {
            if (!found && (arr1[i] == null || ("" + arr1[i]).trim() == "" || arr2[i] == null || ("" + arr2[i]).trim() == "")) {
                arr1.splice(i, 1);
                arr2.splice(i, 1);
                i--;
            } else if (arr1[i] != null && ("" + arr1[i]).trim() != "" && arr2[i] != null && ("" + arr2[i]).trim() != "")
                found = true;
        }
    },

    removeNullOrEmptyTrailFromPairs: function (arr1, arr2) {

        if (arr1.length != arr2.length) {
            console.log("The length of 2 arrays is different");
            return;
        }

        var lastNonEmpty = -1;

        for (var i = 0; i < arr1.length; i++) {

            if (arr1[i] != null && ("" + arr1[i]).trim() != "" && arr2[i] != null && ("" + arr2[i]).trim() != "")
                lastNonEmpty = i;
        }

        if (lastNonEmpty != -1) {
            for (var i = lastNonEmpty; i < arr1.length; i++) {
                arr1.splice(i, 1);
                arr2.splice(i, 1);
                i--;
            }
        }
    },

    removeNullOrEmptyFirstInPairs: function (arr1, arr2) {

        if (arr1.length != arr2.length) {
            console.log("The length of 2 arrays is different");
            return;
        }

        for (var i = 0; i < arr1.length; i++) {
            if (arr1[i] == null || ("" + arr1[i]).trim() == "") {
                arr1.splice(i, 1);
                arr2.splice(i, 1);
                i--;
            }
        }
    },

    removeNullOrEmptySecondInPairs: function (arr1, arr2) {

        if (arr1.length != arr2.length) {
            console.log("The length of 2 arrays is different");
            return;
        }

        for (var i = 0; i < arr2.length; i++) {
            if (arr2[i] == null || ("" + arr2[i]).trim() == "") {
                arr1.splice(i, 1);
                arr2.splice(i, 1);
                i--;
            }
        }
    },

    getStdOfAList: function (arr, type) {

        var avg = 0;
        var count = 0;
        for (var i = 0; i < arr.length; i++) {

            if (!isNaN(arr[i])) {
                avg += arr[i];
                count++;
            }
        }

        var avg = avg / count;

        var sum = 0;
        for (var i = 0; i < arr.length; i++) {

            if (!isNaN(arr[i])) {

                sum += (arr[i] - avg) * (arr[i] - avg);
            }
        }

        if (type == 0) return Math.sqrt(sum/count);

        if (type == 1) return Math.sqrt(sum) / count;

        return 0;
    },
     
       
    getLicenceList : function() {
        var list = [
            {
                id: 0,
                name: 'No licence',
                text: 'No specific licence applied',
                url: '#' 
            },
            {
                id: 1,
                name: 'CC BY 3.0 AU',
                text:'Creative Commons Attribution 3.0 Australia (CC BY 3.0 AU)',
                url: 'http://creativecommons.org/licenses/by/3.0/au/'
            },
            {
                id: 2,
                name: 'CC BY-SA 3.0 AU',
                text:'Creative Commons Attribution-ShareAlike 3.0 Australia (CC BY-SA 3.0 AU)',
                url: 'http://creativecommons.org/licenses/by-sa/3.0/au/'
            },
            {
                id: 3,
                name: 'CC BY-ND 3.0 AU',
                text:'Creative Commons Attribution-NoDerivs 3.0 Australia (CC BY-ND 3.0 AU)',
                url:    'http://creativecommons.org/licenses/by/3.0/au/'
            },
            {
                id: 4,
                name: 'CC BY-NC 3.0 AU',
                text:'Creative Commons Attribution-NonCommercial 3.0 Australia (CC BY-NC 3.0 AU)',
                url: 'http://creativecommons.org/licenses/by-nc/3.0/au/'
            },
            {
                id: 5,
                name: 'CC BY-NC-SA 3.0 AU',
                text:'Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Australia (CC BY-NC-SA 3.0 AU)',
                url: 'http://creativecommons.org/licenses/by-nc-sa/3.0/au/'
            },
            {
                id: 6,
                name: 'CC BY-NC-ND 3.0 AU',
                text:'Creative Commons Attribution-NonCommercial-NoDerivs 3.0 Australia (CC BY-NC-ND 3.0 AU)',
                url: ''
            },
            {
                id: 7,
                name: 'Other',
                text: 'Other (please check the description)',
                url:  'http://creativecommons.org/licenses/by-nc-nd/3.0/au/'
            },
        ];
        return list;

    },

    getLicenceText: function (index) {
        var list = truiiTools.getLicenceList();
        return list[index].text; 
    },


    getLicenceUrl: function (index) {
        var list = truiiTools.getLicenceList();
        return list[index].url;
    },

    showFileNavigator: function (navProps) {

        // var template = $(self.selConfigPanelTemplate).html();
        var template = getHTMLFromTemplate(this.selNavigatorTemplate, {});
        $(this.selNavigatorControl).append(template);
        var fileNav = new V3_fileNavigator(navProps);
        vis.fileNav = fileNav;

        truiiTools.createDialog(this.selNavigatorControl, "File Explorer", 1264, 600,
            'Select', function () { if (fileNav) fileNav.select(); },
            'Cancel', function () { if (fileNav) fileNav.close(); });

        $(this.selNavigatorControl).on("dialogclose", fileNav.close);
        var width = Math.min(1300, ($(window).width() * 70 / 100));
        $(this.selNavigatorControl).dialog("option", "height", ($(window).height() * 85 / 100));
        $(this.selNavigatorControl).dialog("option", "width", width);
        $(this.selNavigatorControl).dialog("option", "resizable", false);
        fileNav.init();
        fileNav.open();
    },
    
    copyToClipboard: function (element) {
        var targetId = "_hiddenCopyText_";
        var isInput = element.tagName === "INPUT" || element.tagName === "TEXTAREA";
        var origSelectionStart, origSelectionEnd;
        if (isInput) {
            // can just use the original source element for the selection and copy
            target = element;
            origSelectionStart = element.selectionStart;
            origSelectionEnd = element.selectionEnd;
        } else {
            // must use a temporary form element for the selection and copy
            target = document.getElementById(targetId);
            if (!target) {
                var target = document.createElement("textarea");
                target.style.position = "absolute";
                target.style.left = "-9999px";
                target.style.top = "0";
                target.id = targetId;
                document.body.appendChild(target);
            }
            target.textContent = element.textContent;
        }
        // select the content
        var currentFocus = document.activeElement;
        target.focus();
        target.setSelectionRange(0, target.value.length);

        // copy the selection
        var succeed;
        try {
            succeed = document.execCommand("copy");
        } catch (e) {
            succeed = false;
        }
        // restore original focus
        if (currentFocus && typeof currentFocus.focus === "function") {
            currentFocus.focus();
        }

        if (isInput) {
            // restore prior selection
            element.setSelectionRange(origSelectionStart, origSelectionEnd);
        } else {
            // clear temporary content
            target.textContent = "";
        }
        return succeed;
    },

    removeBracketsFrontAndEnd: function (str) {
        var len = str.length;
        return str.substring(1, len - 1);
    },

    toKeyValuePairs: function (object) {
        if (object == null)
            return [];

        var arr = [];
        for (var prop in object) {
            var pair = {};
            if (object[prop] != null) {
                if ((typeof prop) == "string") {
                    pair.Key = prop;
                }
                else {
                    pair.Key = JSON.stringify(prop);
                }

                if ((typeof object[prop]) == "string")
                    pair.Value = object[prop];
                else
                    pair.Value = JSON.stringify(object[prop]);

                arr.push(pair);
            }
        }

        return arr;
    },

    toStringOfComplexJsonObjects: function (object) {
        if (object == null)
            return [];

        // var arr = [];
        var pair = {};
        for (var prop in object) {
            if (object[prop] != null) {
                if ((typeof prop) == "string") {
                    pair[prop] = {};
                }
                else {
                    pair[prop] = {};
                }

                if ((typeof object[prop]) == "string")
                    pair[prop] = object[prop];
                else
                    pair[prop] = JSON.stringify(object[prop]);
            }
        }

        return pair;
    },

    // ------------------------------------------------------------------
    // Utility functions for parsing in getDateFromFormat()
    // ------------------------------------------------------------------
    _isInteger: function (val) {
        var digits="1234567890";
        for (var i=0; i < val.length; i++) {
            if (digits.indexOf(val.charAt(i))==-1) { return false; }
        }
        return true;
    },

    _getInt: function(str,i,minlength,maxlength) {
        for (var x=maxlength; x>=minlength; x--) {
            var token=str.substring(i,i+x);
            if (token.length < minlength) { return null; }
            if (this._isInteger(token)) { return token; }
        }
        return null;
    },
	

    // ------------------------------------------------------------------
    // getDateFromFormat( date_string , format_string )
    //
    // This function takes a date string and a format string. It matches
    // If the date string matches the format string, it returns the 
    // getTime() of the date. If it does not match, it returns 0.
    // ------------------------------------------------------------------
    getDateFromFormat: function (val, format) {
        val = val + "";
        format = format + "";
        var i_val = 0;
        var i_format = 0;
        var c = "";
        var token = "";
        var token2 = "";
        var x, y;
        var now = new Date();
        var year = now.getYear();
        var month = now.getMonth() + 1;
        var date = 1;
        var hh = now.getHours();
        var mm = now.getMinutes();
        var ss = now.getSeconds();
        var ampm = "";

        while (i_format < format.length) {
            // Get next token from format string
            c = format.charAt(i_format);
            token = "";
            while ((format.charAt(i_format) == c) && (i_format < format.length)) {
                token += format.charAt(i_format++);
            }
            // Extract contents of value based on format token
            if (token == "yyyy" || token == "yy" || token == "y") {
                if (token == "yyyy") { x = 4; y = 4; }
                if (token == "yy") { x = 2; y = 2; }
                if (token == "y") { x = 2; y = 4; }
                year = this._getInt(val, i_val, x, y);
                if (year == null) { return 0; }
                i_val += year.length;
                if (year.length == 2) {
                    if (year > 70) { year = 1900 + (year - 0); }
                    else { year = 2000 + (year - 0); }
                }
            }
            else if (token == "MMM" || token == "NNN") {
                month = 0;
                for (var i = 0; i < MONTH_NAMES.length; i++) {
                    var month_name = MONTH_NAMES[i];
                    if (val.substring(i_val, i_val + month_name.length).toLowerCase() == month_name.toLowerCase()) {
                        if (token == "MMM" || (token == "NNN" && i > 11)) {
                            month = i + 1;
                            if (month > 12) { month -= 12; }
                            i_val += month_name.length;
                            break;
                        }
                    }
                }
                if ((month < 1) || (month > 12)) { return 0; }
            }
            else if (token == "EE" || token == "E") {
                for (var i = 0; i < DAY_NAMES.length; i++) {
                    var day_name = DAY_NAMES[i];
                    if (val.substring(i_val, i_val + day_name.length).toLowerCase() == day_name.toLowerCase()) {
                        i_val += day_name.length;
                        break;
                    }
                }
            }
            else if (token == "MM" || token == "M") {
                month = this._getInt(val, i_val, token.length, 2);
                if (month == null || (month < 1) || (month > 12)) { return 0; }
                i_val += month.length;
            }
            else if (token == "dd" || token == "d") {
                date = this._getInt(val, i_val, token.length, 2);
                if (date == null || (date < 1) || (date > 31)) { return 0; }
                i_val += date.length;
            }
            else if (token == "hh" || token == "h") {
                hh = this._getInt(val, i_val, token.length, 2);
                if (hh == null || (hh < 1) || (hh > 12)) { return 0; }
                i_val += hh.length;
            }
            else if (token == "HH" || token == "H") {
                hh = this._getInt(val, i_val, token.length, 2);
                if (hh == null || (hh < 0) || (hh > 23)) { return 0; }
                i_val += hh.length;
            }
            else if (token == "KK" || token == "K") {
                hh = this._getInt(val, i_val, token.length, 2);
                if (hh == null || (hh < 0) || (hh > 11)) { return 0; }
                i_val += hh.length;
            }
            else if (token == "kk" || token == "k") {
                hh = this._getInt(val, i_val, token.length, 2);
                if (hh == null || (hh < 1) || (hh > 24)) { return 0; }
                i_val += hh.length; hh--;
            }
            else if (token == "mm" || token == "m") {
                mm = this._getInt(val, i_val, token.length, 2);
                if (mm == null || (mm < 0) || (mm > 59)) { return 0; }
                i_val += mm.length;
            }
            else if (token == "ss" || token == "s") {
                ss = this._getInt(val, i_val, token.length, 2);
                if (ss == null || (ss < 0) || (ss > 59)) { return 0; }
                i_val += ss.length;
            }
            else if (token == "a") {
                if (val.substring(i_val, i_val + 2).toLowerCase() == "am") { ampm = "AM"; }
                else if (val.substring(i_val, i_val + 2).toLowerCase() == "pm") { ampm = "PM"; }
                else { return 0; }
                i_val += 2;
            }
            else {
                if (val.substring(i_val, i_val + token.length) != token) { return 0; }
                else { i_val += token.length; }
            }
        }
        // If there are any trailing characters left in the value, it doesn't match
        if (i_val != val.length) { return 0; }
        // Is date valid for month?
        if (month == 2) {
            // Check for leap year
            if (((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0)) { // leap year
                if (date > 29) { return 0; }
            }
            else { if (date > 28) { return 0; } }
        }
        if ((month == 4) || (month == 6) || (month == 9) || (month == 11)) {
            if (date > 30) { return 0; }
        }
        // Correct hours value
        if (hh < 12 && ampm == "PM") { hh = hh - 0 + 12; }
        else if (hh > 11 && ampm == "AM") { hh -= 12; }
        var newdate = new Date(year, month - 1, date, hh, mm, ss);
        return newdate.getTime();
    },

    fromKeyValuePairs: function (pairs) {
        var props = {};
        if (pairs == null)
            return props;

        for (var i = 0; i < pairs.length; i++) {
            var pair = pairs[i]; 
            var key = pair.Key;
            var value = null;

            try {
                var value = JSON.parse(pair.Value);
            }
            catch (error) {
                // console.log(error.message);
                value = pair.Value;
            }

            props["" + key] = value;
            
        }
        return props;
    },

    /**
     * Performs a binary search on the host array. This method can either be
     * injected into Array.prototype or called with a specified scope like this:
     * binaryIndexOf.call(someArray, searchElement);
     *
     * @param {*} searchElement The item to search for within the array.
     * @return {Number} The index of the element which defaults to -1 when not found.
    */
    binarySearch: function (searchElement, arr, isBigger, isEqual) {
        var minIndex = 0;
        var maxIndex = arr.length - 1;
        var currentIndex;
        var currentElement;

        while (minIndex <= maxIndex) {
            currentIndex = (minIndex + maxIndex) / 2 | 0;
            currentElement = arr[currentIndex];

            if (!isBigger(currentElement, searchElement) && !isEqual(currentElement, searchElement)) {
                minIndex = currentIndex + 1;
            }
            else if (isBigger(currentElement, searchElement)) { // currentElement > searchElement
                maxIndex = currentIndex - 1;
            }
            else {
                return currentIndex;
            }
        }

        return -1;
    },

    cutString: function (name, length) {
        var nameCut = "";
        length = length == null ? 10 : length;

        if (name.length > length)
            nameCut = name.substring(0, (length - 1)) + "...";
        else
            nameCut = name;

        return nameCut;
    },

    isJson: function (str) {
        try {
            JSON.parse(str);
        } catch (e) {
            // console.log("Cannot parse " + str);
            return false;
        }
        return true;
    },

    getGradientColor: function (value, min, max, middle, minCode, maxCode, middleCode, minOp, maxOp, middleOp) {
        if (minCode == null || maxCode == null || middleCode == null)
            return d3.rgb(255, 255, 255);

        var rgbMinArrs = truiiTools.rgbArrFromHexString(minCode);
        var rgbMiddleArrs = truiiTools.rgbArrFromHexString(middleCode);
        var rgbMaxArrs = truiiTools.rgbArrFromHexString(maxCode);

        if (minOp == null)
            minOp = 1;
        if (maxOp == null)
            maxOp = 1;
        if (middleOp == null)
            middleOp = null;

        if (value <= min)
            return { r: rgbMinArrs[0], g: rgbMinArrs[1], b: rgbMinArrs[2], a: minOp };
        else if (value >= max)
            return { r: rgbMaxArrs[0], g: rgbMaxArrs[1], b: rgbMaxArrs[2], a: maxOp };
        else if (value > min && value < middle) {
            var factor = (value - min) / (middle - min);
            var rstRgbArrs = truiiTools.interPolateColorValue(rgbMinArrs, rgbMiddleArrs, factor);
            var rstA = truiiTools.interPolateValue(minOp, middleOp, factor);

            return { r: rstRgbArrs[0], g: rstRgbArrs[1], b: rstRgbArrs[2], a: rstA };
        } else if (value >= middle && value < max) {
            var factor = (value - middle) / (max - middle);
            var rstRgbArrs = truiiTools.interPolateColorValue(rgbMiddleArrs, rgbMaxArrs, factor);
            var rstA = truiiTools.interPolateValue(middleOp, maxOp, factor);

            return { r: rstRgbArrs[0], g: rstRgbArrs[1], b: rstRgbArrs[2], a: rstA };
        }

        return { r: 255, g: 255, b: 255, a:1 }
    },

    getGradientSize: function (value, min, max, middle, minCode, maxCode, middleCode) {
        if (minCode == null || maxCode == null || middleCode == null)
            return -1;

        if (value == null)
            console.log(value);

        if (value <= min)
            return minCode;
        else if (value >= max)
            return maxCode;
        else if (value > min && value < middle) {
            var factor = (value - min) / (middle - min);
            return minCode + factor * (middleCode - minCode);
        } else if (value >= middle && value < max) {
            var factor = (value - middle) / (max - middle);
            return middleCode + factor * (maxCode - middleCode);
        }

        return middle;
    },

    correctTextInput: function ($elem, regEx) {
        var val = $elem.val();
        if (!regEx.test(val)) {
            $elem.addClass('error-on-textInput');
            return null;
        }

        $elem.removeClass('error-on-textInput')
        return val;
    },

    getHexFromColorPicker: function ($elem) {
        var r = Math.round($elem.spectrum("get")._r);
        var g = Math.round($elem.spectrum("get")._g);
        var b = Math.round($elem.spectrum("get")._b);
        var a = $elem.spectrum("get")._a;
        
        return {
            hex: this.toRGB(r, g, b),
            opacity: a
        }
    },

    round: function (x, dec) {
        return Math.round(parseFloat("" + x) * Math.pow(10, parseInt("" + dec))) /  Math.pow(10, parseInt("" + dec));
    },

    getRGBAFromColorPicker: function ($elem) {
        var r = Math.round($elem.spectrum("get")._r);
        var g = Math.round($elem.spectrum("get")._g);
        var b = Math.round($elem.spectrum("get")._b);
        var a = $elem.spectrum("get")._a;

        return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
    },

    getPolygonAtPixel: function (map, pixel, layerIndex) {
        var feature = map.forEachFeatureAtPixel(pixel, function (feature, layer) {
            return feature;
        });

        if (feature)
            return feature;

        var coor = map.getCoordinateFromPixel(pixel);
        var layers = map.getLayers().getArray();
        var layer = layers[layerIndex];

        feature = layer.getSource().getClosestFeatureToCoordinate(coor);

        return feature;

        if (!feature)
            return null;

        if (feature.get("shape") == null)
            return null;

        if (feature.get("shape") != "Polygon")
            return null;

        

        var tFe = turf.polygon(feature.getGeometry().getCoordinates());
        var tPt = turf.point(coor);

        return turf.inside(tPt, tFe) ? feature : null;
    },

    getFeaturesAtPixel: function (map, pixel, layer, conditionFn) {
        var coor = map.getCoordinateFromPixel(pixel);
        var feature = map.forEachFeatureAtPixel(pixel, function (feature, tLayer) {
            if (tLayer == layer)
                return feature;
            else
                return null;
        });

        if (feature)
        {
            if (!!!conditionFn)
                return [feature];

            var tfeatures = conditionFn(feature);
            if (!tfeatures || tfeatures.length == 0)
                return [feature];
            else
                return tfeatures;
        }

        return null;

        feature = layer.getSource().getClosestFeatureToCoordinate(coor);

        if (!feature)
            return null;

        if (!!!conditionFn)
            return [feature];
        
        // look for a feature with a condition function, 
        // the condition function should return a feature list, given the closest feature found from the current coordinate
        var features = conditionFn(feature);
        if (!features || features.length == 0)
            return [feature];

        return features;
    },

    getFeaturesWithIds: function (layer) {
        // var vectorSource = this.nonHighlightlayer.getSource();
        /*var vs = layer.getSource();
        var features = vs.getFeatures();
        for ()
        var f = vs.getFeatureById(featureId);
        return f;*/

        var ret = {};
        var vs = layer.getSource();
        var features = vs.getFeatures();
        for (var i = 0; i < features.length; i++) {
            var id = features[i].getId();
            if (!ret["" + id])
                ret["" + id] = {};
            if (!ret["" + id].array)
                ret["" + id].array = [];

            ret["" + id].shape = features[i].get("shape");
            ret["" + id].array.push(features[i]);
        }

        return ret;
    },

    shiftPoint: function (coordinate) {
        /*var MAXCOOR = 40075016.68;
        var coorT = [];
        coorT[0] = 0;
        coorT[1] = coordinate[1];

        if (coordinate[0] < (-MAXCOOR / 2)) {
            coordinate[0] = -coordinate[0];
            coorT[0] = ((coordinate[0] + (MAXCOOR / 2)) % MAXCOOR) - (MAXCOOR / 2);
            coorT[0] = -coorT[0];
            return coorT;
        } 

        coorT[0] = ((coordinate[0] + (MAXCOOR / 2)) % MAXCOOR) - (MAXCOOR / 2);
        return coorT;*/

        coordinate = ol.proj.transform(coordinate, 'EPSG:3857', 'EPSG:4326');

        var MAXCOOR = 360;
        if (coordinate[0] < (-MAXCOOR / 2)) {
            coordinate[0] = -coordinate[0];
            coordinate[0] = ((coordinate[0] + (MAXCOOR / 2)) % MAXCOOR) - (MAXCOOR / 2);
            coordinate[0] = -coordinate[0];
        } else {
            coordinate[0] = ((coordinate[0] + (MAXCOOR / 2)) % MAXCOOR) - (MAXCOOR / 2);
        }

        coordinate = ol.proj.transform(coordinate, 'EPSG:4326', 'EPSG:3857');
        return coordinate;
    },

    isAnyPartInMainView: function (coordinates, shape) {
        coordinates = JSON.parse(JSON.stringify(coordinates));
        if (shape == "Point" || shape == "Circle") {
            if (-180 <= coordinates[0] && coordinates[0] <= 180)
                return true;

            return false;
        }

        if (shape == "Polygon") {

            target = coordinates[0]; /// [[[x, y]]]
            for (var i = 0; i < target.length; i++) {
                target[i] = ol.proj.transform(target[i], 'EPSG:3857', 'EPSG:4326')

                // if the point is in main view, return true
                if (-180 <= target[i][0] && target[i][0] <= 180)
                    return true;
            }
            
            return false;
        } else if (shape == "LineString") {
            var target = coordinates;
            for (var i = 0; i < target.length; i++) {
                target[i] = ol.proj.transform(target[i], 'EPSG:3857', 'EPSG:4326')

                // if the point is in main view, return true
                if (-180 <= target[i][0] && target[i][0] <= 180)
                    return true;
            }

            return false;
        } else if (shape == "MultiPolygon") {
            var mPolygons = coordinates;
            for (var i = 0; i < mPolygons.length; i++) {
                var target = mPolygons[i];
                target = target[0];

                for (var j = 0; j < target.length; j++) {
                    target[j] = ol.proj.transform(target[j], 'EPSG:3857', 'EPSG:4326')

                    // if the point is in main view, return true
                    if (-180 <= target[j][0] && target[j][0] <= 180)
                        return true;
                }
            }

            return false;
        }
    },

    isAnyPartOutMainView: function (coordinates, shape) {
        coordinates = JSON.parse(JSON.stringify(coordinates));
        if (shape == "Point" || shape == "Circle") {
            if (-180 > coordinates[0] || coordinates[0] > 180)
                return true;

            return false;
        }

        if (shape == "Polygon") {

            target = coordinates[0]; /// [[[x, y]]]
            for (var i = 0; i < target.length; i++) {
                target[i] = ol.proj.transform(target[i], 'EPSG:3857', 'EPSG:4326')

                // if the point is in main view, return true
                if (-180 > target[i][0] || target[i][0] > 180)
                    return true;
            }

            return false;
        } else if (shape == "LineString") {
            var target = coordinates;
            for (var i = 0; i < target.length; i++) {
                target[i] = ol.proj.transform(target[i], 'EPSG:3857', 'EPSG:4326')

                // if the point is in main view, return true
                if (-180 > target[i][0] || target[i][0] > 180)
                    return true;
            }

            return false;
        } else if (shape == "MultiPolygon") {
            var mPolygons = coordinates;
            for (var i = 0; i < mPolygons.length; i++) {
                var target = mPolygons[i];
                target = target[0];

                for (var j = 0; j < target.length; j++) {
                    target[j] = ol.proj.transform(target[j], 'EPSG:3857', 'EPSG:4326')

                    // if the point is in main view, return true
                    if (-180 > target[j][0] || target[j][0] > 180)
                        return true;
                }
            }

            return false;
        }
    },

    shiftToOrigin: function (coordinates, shape) {
        console.log(coordinates);
        if (shape != "MultiPolygon" && this.isAnyPartInMainView(coordinates, shape))
            return coordinates;

        if (shape == "MultiPolygon" && !this.isAnyPartOutMainView(coordinates, shape))
            return coordinates;

        if (shape == "Polygon") {
            target = coordinates[0]; /// [[[x, y]]]
            for (var i = 0; i < target.length; i++) {
                target[i] = this.shiftPoint(target[i]);
            }

            return [target];
        } else if (shape == "LineString") {
            var target = coordinates;
            for (var i = 0; i < target.length; i++) {
                target[i] = this.shiftPoint(target[i]);
            }

            return target;
        } else if (shape == "MultiPolygon") {
            var mPolygons = coordinates;

            var tTarget = [];
            for (var i = 0; i < mPolygons.length; i++) {
                var target = mPolygons[i];

                target = target[0];
                for (var j = 0; j < target.length; j++) {
                    target[j] = this.shiftPoint(target[j]);
                }
                target = [target];

                tTarget.push(target);
            }

            return tTarget;
        } else if (shape == "Point") {
            var mPoint = coordinates;
            return this.shiftPoint(mPoint);
        } else if (shape == "Circle") {
            var mPoint = coordinates.center;
            return {
                center: this.shiftPoint(mPoint),
                radius: coordinates.radius
            };
        }

        return null;
    },

    transformCoordinatesFromLatLons: function (coordinates, shape, coorSysSource, coorSysDest) {

        if (coorSysSource == null)
            coorSysSource = "EPSG:4326";

        if (coorSysDest == null)
            coorSysDest = "EPSG:3857";

        if (shape == "Polygon") {
            var target = JSON.parse(coordinates);
            target = target[0]; /// [[[x, y]]]
            for (var i = 0; i < target.length; i++) {
                target[i] = ol.proj.transform(target[i], coorSysSource, coorSysDest);
            }

            return [target];
        } else if (shape == "LineString") {
            var target = JSON.parse(coordinates);
            for (var i = 0; i < target.length; i++) {
                target[i] = ol.proj.transform(target[i], coorSysSource, coorSysDest);
            }

            return target;
        } else if (shape == "MultiPolygon") {
            var mPolygons = JSON.parse(coordinates);

            var tTarget = [];
            for (var i = 0; i < mPolygons.length; i++) {
                var target = mPolygons[i];

                target = target[0];
                for (var j = 0; j < target.length; j++) {
                    target[j] = ol.proj.transform(target[j], coorSysSource, coorSysDest);
                }
                target = [target];

                tTarget.push(target);
            }

            return tTarget;
        } else if (shape == "Point") {
            var mPoint = JSON.parse(coordinates);
            return ol.proj.transform(mPoint, coorSysSource, coorSysDest);
        } else if (shape == "Circle") {
            var mPoint = JSON.parse(coordinates.center);
            return {
                center: ol.proj.transform(mPoint, coorSysSource, coorSysDest),
                radius: coordinates.radius
            };
        }

        return null;
    },

    /* Time series tools */
    initChartFromType: function (containerType, chartType) {
        if (containerType == vis.ContainerType.TIMESERIES ||
            containerType == vis.ContainerType.CATEGORY ||
            containerType == vis.ContainerType.SCATTER ||
            containerType == vis.ContainerType.PIE ||
            containerType == vis.ContainerType.HISTOGRAM ||
            containerType == vis.ContainerType.BOX_PLOT
            ) {
            var chart = {};

            // Clone default configs
            chart._traces = JSON.parse(JSON.stringify(DefaultConfigs[containerType].data));
            chart._layouts = JSON.parse(JSON.stringify(DefaultConfigs[containerType].layout));
            chart._configs = JSON.parse(JSON.stringify(DefaultConfigs[containerType].configs));

            if (DefaultConfigs[containerType].allSeriesConfigs)
                chart.allSeriesConfigs = JSON.parse(JSON.stringify(DefaultConfigs[containerType].allSeriesConfigs));

            if (containerType == vis.ContainerType.HISTOGRAM) {
                chart._catNum = JSON.parse(JSON.stringify(DefaultConfigs[containerType]._catNum));
                chart._xMode = JSON.parse(JSON.stringify(DefaultConfigs[containerType]._xMode));
            }

            // chart._zIndex = JSON.parse(JSON.stringify(DefaultConfigs.zIndex));
            chart._mainType = containerType;

            return chart;
        }

        return null;
    },

    fitBounds: function (lLayer, map) {
        if (lLayer.getLayers() != null && lLayer.getLayers().length > 0)
            map.fitBounds(lLayer.getBounds());
    },

    guid: function () {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
              .toString(16)
              .substring(1);
        };
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
          s4() + '-' + s4() + s4() + s4();
    },

    /*fnc returns greater than 0 number if x1 > x2*/
    isIncreased: function (arr, fnc) {
        if (arr == null || arr.length == 0 || !!!fnc)
            return false;

        var increased = true;
        for (var i = 0; i < (arr.length - 1); i++) {
            if (fnc(arr[i], arr[i + 1]) > 0) {
                increased = false;
                break;
            }
        }

        return increased;
    },

    isDecreased: function (arr, fnc) {
        if (arr == null || arr.length == 0 || !!!fnc)
            return false;

        var decreased = true;
        for (var i = 0; i < (arr.length - 1) ; i++) {
            if (fnc(arr[i], arr[i + 1]) < 0) {
                decreased = false;
                break;
            }
        }

        return decreased;
    },

    isSorted: function (arr, fnc) {
        var up = this.isIncreased(arr, fnc);
        var down = this.isDecreased(arr, fnc);
        return up ? 1 : (down ? -1 : 0);
    },

    openPopOverInCenter: function ($popoverContainer, $popoverTriggeredItem, options) {
        $popoverContainer.css('top', options.top + 'px');
        $popoverContainer.css('left', options.left + 'px');
        $popoverTriggeredItem.data("dataBound", options.data);
        var id = this.guid();

        var popoverOptions = {
            container: $popoverContainer,
            content: function () {
                return "<div id=" + id + " style='width: 100%; height: 100%; position: relative'></div>"
            },
            onShow: function () {
                if (!!options.onShow)
                    options.onShow($("#" + id)[0], $popoverTriggeredItem);
            },
            onHide: function () {
                if (!!options.onHide)
                    options.onHide($("#" + id)[0], $popoverTriggeredItem);
            }
        };

        var temp = {};
        for (var i in options) {
            if (i != "onHide" && i != "onShow") {
                temp[i] = options[i];
            }
        }

        extend(popoverOptions, temp);

        $popoverTriggeredItem.webuiPopover(popoverOptions);
        $popoverTriggeredItem.webuiPopover('show');
    },

    getBalancingSizeInfo: function ($control, options) {
        var dlgWidth = $control.width();
        var dlgHeight = $control.height();

        var width = dlgWidth - 2 * options.left;
        var height = dlgHeight - 2 * options.top;

        return { top: (options.top + options.offsetTop), left: options.left, width: width, height: height };
    },

    spatialGeoToPrimitives: function (data) {

        var extract = function (feature) {
            var newObj = {};
            extend(newObj, JSON.parse(JSON.stringify(feature)));
            if (newObj && newObj.geometry && newObj.geometry.coordinates)
                newObj.geometry.coordinates = {};

            var coordinates = feature.geometry.coordinates;
            var geometryType = feature.geometry.type;
            var newType = null;
            if (geometryType == "MultiPolygon")
                newType = "Polygon";
            else if (geometryType == "MultiLineString")
                newType = "LineString";
            else if (geometryType == "MultiPoint")
                newType = "Point";

            if (newType != null) {
                var arr = [];
                for (var i = 0; i < coordinates.length; i++) {
                    var newObjTemp = JSON.parse(JSON.stringify(newObj));
                    newObjTemp.geometry.type = newType;
                    newObjTemp.geometry.coordinates = coordinates[i];
                    arr.push(newObjTemp);
                }

                return arr;
            }

            return null;
        };

        var ret = [];
        var features = [];

        if (data.type == "FeatureCollection") {
            features = data.features;
        } else if (data.type == "Feature") {
            features.push(data);
        }

        for (var i = 0; i < features.length; i++) {
            var feature = features[i];
            var geos = null;

            if (feature.geometry.type == "MultiPolygon") {
                geos = extract(feature);
            }
            else if (feature.geometry.type == "MultiLineString") {
                geos = extract(feature);
            }
            else if (feature.geometry.type == "MultiPoint") {
                geos = extract(feature);
            } else if (feature.geometry.type == "GeometryCollection") {

                var tGeos = feature.geometry.geometries;
                var tFeatures = [];
                tGeos.forEach(function (tGeo) {
                    var tFeature = JSON.parse(JSON.stringify(feature));
                    tFeature.geometry = {};

                    extend(tFeature.geometry, tGeo);

                    tFeatures.push(tFeature);
                })

                geos = [];
                tFeatures.forEach(function (tFeature) {
                    var prims = spatialGeoToPrimitives(tFeature);
                    prims.forEach(function (prim) {
                        geos.push(prim);
                    });
                });

                if (geos.length == 0) {
                    feature = null;
                }
            }

            if (geos != null && geos.length > 0) {
                for (var j = 0; j < geos.length; j++) {
                    ret.push(geos[j]);
                }
            } else {
                if (feature)
                    ret.push(feature);
            }
        }
        return ret;
    },

    convertToCSV: function (data) {
        var csvContent = "";

        data.forEach(function (infoArray, index) {
            var dataString = infoArray.join(",");
            csvContent += index < data.length ? dataString + "\n" : dataString;
        });

        return csvContent;
    }
};