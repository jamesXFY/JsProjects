   
var M43_Senarios = function () {

    this.interventionFileId = -1;
    this.riskFileId = -1; 
    this.costFileId = -1;
    this.revisedRiskId = -1;
    //this.riskId = -1;
    //this.maxInterventionId = -1;
    //this.costId = -1;
    //this.upperId = -1;
    //this.lowerId = -1;

      
    this.interventionFileSelector = null;
    this.riskFileSelector= null;
    this.costFileSelector= null;
    this.revisedRiskPopSelector= null;
   // this.maxPopSelector= null;
  //  this.costPopSelector= null;
  //  this.upperPopSelector= null;
  //  this.lowerPopSelector = null;

    return this;
}

M43_Senarios.prototype = {

    displayFileTree : function (control, prefix, label, property) {
        var o = this;

        var initialDataRequest = function () {
            return truiiWCF["getLibraryTree"]({ lazyLoading: true, dataType: ".csv" });
        };

        var getItemsRequest = function (nodeId) {
            return truiiWCF["getFolderTreeViewContent"]({
                id: nodeId,
                lazyLoading: true,
                includeSubFolders: true,
                includeFiles: true,
                includeSubFolderContent: false,
                dataType: ".csv",
                checkGeoMapping: false
            });
        };

        var tree = new NavTree({
            treeControlId: control,
            prefix: prefix,
            getInitialDataRequest: initialDataRequest,
            getItemsRequest: getItemsRequest,
            onFolderClick: o.onFolderClick,
            onFileClick: function(fileId){
                o.onFileClick(fileId, control, label, property);
            }
        });
    },

    closeFileSelectionDialogs:function()
    {
        var o = this;
        //if (o.rawPopSelector && fieldID.indexOf("Raw") == -1) o.rawPopSelector.popover('hide'); 
        //if (o.puPopSelector && fieldID.indexOf("PU") == -1) o.puPopSelector.popover('hide'); 
        //if (o.scalingPopSelector && fieldID.indexOf("Scaling") == -1) o.scalingPopSelector.popover('hide');
        //if (o.riskPopSelector && fieldID.indexOf("Risk") == -1) o.riskPopSelector.popover('hide');
        //if (o.maxPopSelector && fieldID.indexOf("Max") == -1) o.maxPopSelector.popover('hide');
        //if (o.costPopSelector && fieldID.indexOf("Cost") == -1) o.costPopSelector.popover('hide');
        //if (o.upperPopSelector && fieldID.indexOf("Upper") == -1) o.upperPopSelector.popover('hide');
        //if (o.lowerPopSelector && fieldID.indexOf("Lower") == -1) o.lowerPopSelector.popover('hide');


        if (o.interventionFileSelector) o.interventionFileSelector.popover('hide'); 
        if (o.riskFileSelector) o.riskFileSelector.popover('hide'); 
        if (o.costFileSelector) o.costFileSelector.popover('hide');
        if (o.revisedRiskPopSelector) o.revisedRiskPopSelector.popover('hide');
        //if (o.maxPopSelector) o.maxPopSelector.popover('hide');
        //if (o.costPopSelector) o.costPopSelector.popover('hide');
        //if (o.upperPopSelector) o.upperPopSelector.popover('hide');
        //if (o.lowerPopSelector) o.lowerPopSelector.popover('hide');
         
    },

    closeDialog: function (e) {
        try {
            $("#M43_Tree").fancytree("destroy");
        } catch (ex) {
            console.log(ex);
        }
          
        $(e).dialog("close"); 
    },
      
    open: function () {
        this.clearUI(); 
    },

    clearUI: function () {
        var o = this;

        $("#M43_selectIntervention").empty();
        $("#M43_selectRisk").empty();
        $("#M43_selectCost").empty();
        $("#M43_selectRevisedRisk").empty();
        //$("#M43_selectIntMaxImp").empty();
        //$("#M43_selectIntCost").empty();
        //$("#M43_selectIntUpper").empty();
        //$("#M43_selectIntLower").empty();
          
       // o._tree = tree;
        //document.getElementById('M43_runButton').onclick = function (event, ui) { o.onRunButtonClicked(event, ui); };

        if (o.interventionFileSelector) o.interventionFileSelector.popover('hide');
        if (o.riskFileSelector) o.riskFileSelector.popover('hide');
        if (o.costFileSelector) o.costFileSelector.popover('hide');
        if (o.revisedRiskPopSelector) o.revisedRiskPopSelector.popover('hide');

        

        o.interventionFileSelector = o.initFileSelector("#M43_selectInterventionFile_button", "#M43_selectIntervention", o.interventionFileId, "M43_file_Intervention", 'tableSelector_model_params');
        o.riskFileSelector = o.initFileSelector("#M43_selectRisk_button", "#M43_selectRisk", o.riskFileId, "M43_file_risk", 'tableSelector_model_params_1');
        o.costFileSelector = o.initFileSelector("#M43_selectCost_button", "#M43_selectCost", o.costFileId, "M43_file_cost", 'tableSelector_model_params_2');
        o.revisedRiskPopSelector = o.initFileSelector("#M43_selectRevisedRisk_button", "#M43_selectRevisedRisk", o.revisedRiskId, "M43_file_revisedRisk", 'tableSelector_model_params_3');
        //o.maxPopSelector = o.initFileSelector("#M43_selectIntMaxImp_button", "#M43_selectIntMaxImp", o.maxInterventionId, "M43_file_intMaxImp", 'tableSelector_model_params_4');
        //o.costPopSelector = o.initFileSelector("#M43_selectIntCost_button", "#M43_selectIntCost", o.costId, "M43_file_cost", 'tableSelector_model_params_5');
        //o.upperPopSelector = o.initFileSelector("#M43_selectIntUpper_button", "#M43_selectIntUpper", o.upperId, "M43_file_upper", 'tableSelector_model_params_6');
        //o.lowerPopSelector = o.initFileSelector("#M43_selectIntLower_button", "#M43_selectIntLower", o.lowerId, "M43_file_lower", 'tableSelector_model_params_7');
         
    },

 
    initFileSelector: function (controlId, label, property, prefix, style) {
        var o = this; 
        // select  popover inits
        var id = truiiTools.guid();

        var popoverOptions = {
            title: 'File tree',
            style: style,
            dismissible: true,
            cache: false,
            /*offsetLeft: 94,*/
            content: function () {
                return "<div id=" + id + " style='width: 300px; height: 206px; overflow: auto' class='pre-scrollable'></div>"
            },
            placement: "auto",
            html: true,
            arrow: true
        };

        var popSelector = $(controlId).popover(popoverOptions);
        popSelector.on("shown.bs.popover", function () { o.displayFileTree($('#' + id), prefix, label, property); });
        return popSelector;
    },

    onFileClick: function (fileId, control, labelId, property) {
        var o = this;
        property = fileId; // o.puPropertiesId
        var metaRequest = truiiWCF.GetMetadata(fileId);
        metaRequest.done(function (meta) {
            $(labelId).text(meta.Name);
            $(labelId).prop("title",fileId);
            $(labelId).css("display", "inline-block");
            control.popover("hide");
        });
    },
 
    onFolderClick: function (folderId) {
        // console.log(folderId);
    },


    //CIDSS RUNNER FUNCTION
    onRunButtonClicked: function (event, ui) {

        var o = this;

        document.getElementById("cidssBody").style.cursor = "wait";

        // get raw threat id 
        //var m = document.getElementById("M43_selectRawThreat");
        // var c = document.getElementById("M43_selectPUProp");
        var interventionFile = $("#M43_selectIntervention").attr('title');
        var riskFile = $("#M43_selectRisk").attr('title');
        var costFile = $("#M43_selectCost").attr('title');
        //var risk = $("#M43_selectRisk").attr('title');
        //var max = $("#M43_selectIntMaxImp").attr('title');
        //var cost = $("#M43_selectIntCost").attr('title');
        //var upper = $("#M43_selectIntUpper").attr('title');
        //var lower = $("#M43_selectIntLower").attr('title');
        // get file properties   
        //var raw = o.rawThreatId;
        //var prop = o.puPropertiesId;
        //var scaling = o.scalingId;
        //var risk = o.riskId;
        //var max = o.maxInterventionId;
        //var cost = o.costId;
        //var upper = o.upperId;
        //var lower = o.lowerId;

        // get simulated annealing settings
        //var alpha = document.getElementById("M43_alpha").value;
        //var temperature = document.getElementById("M43_temp").value;
        //var epsilon = document.getElementById("M43_epsilon").value;

        // get additional parameters
        //var budget = document.getElementById("M43_budget").value;
        // var step = document.getElementById("M43_step").value; 
        //var newfilename = document.getElementById("M43_newfilename").value;


        // send the request
        d3.csv(truiiWCF.GetFileDownloadUrl(Number(interventionFile)), function (data) {
             console.log(data);
        });
        d3.csv(truiiWCF.GetFileDownloadUrl(Number(riskFile)), function (data) {
            console.log(data);
        });
        d3.csv(truiiWCF.GetFileDownloadUrl(Number(costFile)), function (data) {
            console.log(data);
            document.getElementById("cidssBody").style.cursor = "normal";
        });
    }
}

