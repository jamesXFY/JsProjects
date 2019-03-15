   
var M43_cidss = function () {

    this.rawThreatId = -1;
    this.puPropertiesId = -1; 
    this.scalingId = -1;
    this.riskId = -1;
    this.maxInterventionId = -1;
    this.costId = -1;
    this.upperId = -1;
    this.lowerId = -1;

    this.puShapeId = -1;
    this.onsiteId = -1;
    this.agPopId = -1;
    this.intId = -1;
    this.swId = -1;
    this.stpId = -1;
    this.scenarioId = -1;

      
    this.rawPopSelector = null;
    this.puPopSelector= null;
    this.scalingPopSelector= null;
    this.riskPopSelector= null;
    this.maxPopSelector= null;
    this.costPopSelector= null;
    this.upperPopSelector= null;
    this.lowerPopSelector = null;

    this.puShapeSelector = null;
    this.onsiteSelector = null;
    this.agPopSelector = null;
    this.intSelector = null;
    this.swSelector = null;
    this.stpSelector = null;
    this.scenarioSelector = null;


    return this;
}

M43_cidss.prototype = {

    displayFileTree: function (control, prefix, label, property, popOverID, fileType) {
        var o = this;

        var initialDataRequest = function () {
            return truiiWCF["getLibraryTree"]({ lazyLoading: true, dataType: fileType });
        };

        var getItemsRequest = function (nodeId) {
            return truiiWCF["getFolderTreeViewContent"]({
                id: nodeId,
                lazyLoading: true,
                includeSubFolders: true,
                includeFiles: true,
                includeSubFolderContent: false,
                dataType: fileType,
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
                o.onFileClick(fileId, popOverID, label, property);
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

        if (o.rawPopSelector) o.rawPopSelector.popover('hide'); 
        if (o.puPopSelector) o.puPopSelector.popover('hide'); 
        if (o.scalingPopSelector) o.scalingPopSelector.popover('hide');
        if (o.riskPopSelector) o.riskPopSelector.popover('hide');
        if (o.maxPopSelector) o.maxPopSelector.popover('hide');
        if (o.costPopSelector) o.costPopSelector.popover('hide');
        if (o.upperPopSelector) o.upperPopSelector.popover('hide');
        if (o.lowerPopSelector) o.lowerPopSelector.popover('hide');


        if (o.puShapeSelector) o.puShapeSelector.popover('hide');
        if (o.onsiteSelector) o.onsiteSelector.popover('hide');
        if (o.agPopSelector) o.agPopSelector.popover('hide');
        if (o.intSelector) o.intSelector.popover('hide');
        if (o.swSelector) o.swSelector.popover('hide');
        if (o.stpSelector) o.stpSelector.popover('hide');

        if (o.scenarioSelector) o.scenarioSelector.popover('hide');

         
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

        $("#M43_selectRawThreat").empty();
        $("#M43_selectPUProp").empty();
        $("#M43_selectScaling").empty();
        $("#M43_selectRisk").empty();
        $("#M43_selectIntMaxImp").empty();
        $("#M43_selectIntCost").empty();
        $("#M43_selectIntUpper").empty();
        $("#M43_selectIntLower").empty();

        $("#M43_selectPUShape").empty();
        $("#M43_selectSTP").empty();
        $("#M43_selectIND").empty();
        $("#M43_selectSW").empty();
        $("#M43_selectONSITE").empty();
        $("#M43_selectAG").empty();
        $("#M43_newfilename").empty();

          
       // o._tree = tree;
        document.getElementById('M43_runButton').onclick = function (event, ui) { o.onRunButtonClicked(event, ui); };
                
        o.rawPopSelector = o.initFileSelector("#M43_selectRawThreat_button", "#M43_selectRawThreat", o.rawThreatId, "M43_file_rawThreat", 'tableSelector_model_params','.csv');
        o.puPopSelector = o.initFileSelector("#M43_selectPUProp_button", "#M43_selectPUProp", o.puPropertiesId, "M43_file_PUProp", 'tableSelector_model_params_1', '.csv');
        o.scalingPopSelector = o.initFileSelector("#M43_selectScaling_button", "#M43_selectScaling", o.scalingId, "M43_file_scaling", 'tableSelector_model_params_2', '.csv');
        o.riskPopSelector = o.initFileSelector("#M43_selectRisk_button", "#M43_selectRisk", o.riskId, "M43_file_risk", 'tableSelector_model_params_3', '.csv');
        o.maxPopSelector = o.initFileSelector("#M43_selectIntMaxImp_button", "#M43_selectIntMaxImp", o.maxInterventionId, "M43_file_intMaxImp", 'tableSelector_model_params_4', '.csv');
        o.costPopSelector = o.initFileSelector("#M43_selectIntCost_button", "#M43_selectIntCost", o.costId, "M43_file_cost", 'tableSelector_model_params_5', '.csv');
        o.upperPopSelector = o.initFileSelector("#M43_selectIntUpper_button", "#M43_selectIntUpper", o.upperId, "M43_file_upper", 'tableSelector_model_params_6', '.csv');
        o.lowerPopSelector = o.initFileSelector("#M43_selectIntLower_button", "#M43_selectIntLower", o.lowerId, "M43_file_lower", 'tableSelector_model_params_7', '.csv');

        o.puShapeSelector = o.initFileSelector("#M43_selectPUSHAPE_button", "#M43_selectPUShape", o.puShapeId, "M43_file_pu", 'tableSelector_model_params_8', '.zip');
        o.onsiteSelector = o.initFileSelector("#M43_selectIntONSITE_button", "#M43_selectONSITE", o.onsiteId, "M43_file_os", 'tableSelector_model_params_9', '.zip');  
        o.agPopSelector = o.initFileSelector("#M43_selectAG_button", "#M43_selectAG", o.agPopId, "M43_file_ag", 'tableSelector_model_params_10', '.zip');  
        o.intSelector = o.initFileSelector("#M43_selectIND_button", "#M43_selectIND", o.intId, "M43_file_ind", 'tableSelector_model_params_11', '.zip');  
        o.swSelector = o.initFileSelector("#M43_selectSW_button", "#M43_selectSW", o.swId, "M43_file_sw", 'tableSelector_model_params_12', '.zip');  
        o.stpSelector = o.initFileSelector("#M43_selectSTP_button", "#M43_selectSTP", o.stpId, "M43_file_stp", 'tableSelector_model_params_13', '.zip');  

        
        o.scenarioSelector = o.initFileSelector("#M43_selectSenario_button", "#M43_newfilename", o.scenarioId, "M43_file_scenario", 'tableSelector_model_params_14', '.csv'); 
         
    },

 
    initFileSelector: function (controlId, label, property, prefix, style, fileType) {
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
        popSelector.on("shown.bs.popover", function () { o.displayFileTree($('#' + id), prefix, label, property, $(controlId), fileType); });
        return popSelector;
    },

    onFileClick: function (fileId, control, labelId, property) {
        var o = this;
        property = fileId; // o.puPropertiesId
        var metaRequest = truiiWCF.GetMetadata(fileId);
        metaRequest.done(function (meta) {
            if ($(labelId)[0].type == "text") {
                $(labelId)[0].value = meta.Name;
            } else
            {
                $(labelId).text(meta.Name);
            }
            
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
        var raw = $("#M43_selectRawThreat").attr('title');
        var prop = $("#M43_selectPUProp").attr('title');
        var scaling = $("#M43_selectScaling").attr('title');
        var risk = $("#M43_selectRisk").attr('title');
        var max = $("#M43_selectIntMaxImp").attr('title');
        var cost = $("#M43_selectIntCost").attr('title');
        var upper = $("#M43_selectIntUpper").attr('title');
        var lower = $("#M43_selectIntLower").attr('title');

        var puShape = $("#M43_selectPUShape").attr('title');
        var onsite = $("#M43_selectONSITE").attr('title');
        var ag = $("#M43_selectAG").attr('title');
        var int = $("#M43_selectIND").attr('title');
        var sw = $("#M43_selectSW").attr('title');
        var stp = $("#M43_selectSTP").attr('title'); 


        // get simulated annealing settings
        var alpha = document.getElementById("M43_alpha").value;
        var temperature = document.getElementById("M43_temp").value;
        var epsilon = document.getElementById("M43_epsilon").value;

        // get additional parameters
        var budget = document.getElementById("M43_budget").value;
        // var step = document.getElementById("M43_step").value; 
        var newfilename = document.getElementById("M43_newfilename").value;
        var scenariofileId = $("#M43_newfilename").attr('title') == window.undentified ? 0: $("#M43_newfilename").attr('title');
        var useScenarioFile = $("#M43_selectSenario_button")[0].checked;


        if (raw == Window.undentified || prop == Window.undentified || scaling == Window.undentified || risk == Window.undentified || max == Window.undentified || cost == Window.undentified
            || upper == Window.undentified || lower == Window.undentified || puShape == Window.undentified || onsite == Window.undentified || ag == Window.undentified || int == Window.undentified || sw == Window.undentified || stp == Window.undentified
        )
        {
            alert("some file is missing!");
        }

        newfilename, scenariofileId, Boolean(useScenarioFile)

        if (useScenarioFile == false && (newfilename.length == 0 || newfilename.trim().length == 0))
        {
            alert("please give scenario a name!");
            scenariofileId = 0;
        }

        // send the request
        var outputFolderId = -1;
        var request = truiiWCF.runCIDSS(raw, prop, scaling, risk, max, cost, upper, lower, puShape, onsite, ag, int, sw, stp, Number(alpha), Number(temperature), Number(epsilon), budget, newfilename, scenariofileId,Boolean(useScenarioFile));

         
        request.done(function (data) {

            document.getElementById("cidssBody").style.cursor = "default";
            // refresh the workspace with the model output files
            //o._parent.refreshWorkspaceWithFiles(data, true);
            //$(o._containerId).dialog("close");

            //maybe jump to another page
        });

    }
}

