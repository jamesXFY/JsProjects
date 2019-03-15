dataIniForIntervention = {

    intervention: null,
    cost: null,
    unitarea: null,
    targetDiv: "",
    rowHeaders : [],
    colHeaders: ["Intervention", "UnitArea", "Amount", "Cost"],
    columns: [{
        //data: 'Intervention',
        editor: false
    }, {
        //data: 'UnitArea',
        editor: false
    }, {
        //data: 'Amount',
        editor: false
    }, {
        //data: 'Cost',
        editor: false
    },],
    editableColumns: [{
        //data: 'Intervention',
        editor: false
    }, {
        //data: 'UnitArea',
        editor: false
    }, {
        //data: 'Amount',
        //editor: true
    }, {
        //data: 'Cost',
        editor: false
    },],
    colWidths: [50, 50, 80, 80],
    rowHeaderWidth: 100,
    currentIntervention: null,
    currentCost: null,

    interventionID: null,



   
    initialize: function (targetDiv, intervention, cost, unitarea) {
        this.intervention = intervention;
        this.cost = cost;
        this.unitarea = unitarea;
        this.targetDiv = targetDiv;
    },
   
    regroupDataForHOT: function (pu, keyName) {
        var cCost;
        for (var index = 0; index < dataIniForIntervention.intervention.length; index++) {
            var key = dataIniForIntervention.intervention[index][keyName];
            if (key == pu) {
                dataIniForIntervention.currentIntervention = dataIniForIntervention.intervention[index];
                break;
            }
        }
        for (var index = 0; index < dataIniForIntervention.cost.length; index++) {
            var key = dataIniForIntervention.cost[index][keyName];
            if (key == pu) {
                dataIniForIntervention.currentCost = dataIniForIntervention.cost[index];
                break;
            }
        }

        var interventionTable = [];
        var keys = Object.keys(dataIniForIntervention.currentIntervention);

        for (var index = 0; index < keys.length; index++) {
            if (keys[index] != keyName)
            {
                var intervention = parseFloat(dataIniForIntervention.currentIntervention[keys[index]]);
                var interventionUnitArea = dataIniForIntervention.unitarea[0][keys[index]];
                var interventionCost = parseFloat(dataIniForIntervention.currentCost[keys[index]]);
                var interventionRow = [];
                interventionRow.push(keys[index]);
                interventionRow.push(interventionUnitArea);
                interventionRow.push(intervention == Number.isNaN(intervention) ? 0 : intervention.toFixed());
                interventionRow.push(interventionCost == Number.isNaN(interventionCost) ? 0 : dataIniForIntervention.floatToCurrency(interventionCost.toFixed(2)));
                interventionTable.push(interventionRow);

                dataIniForIntervention.rowHeaders.push(keys[index]);
            }

        }

        return interventionTable;
    },
    regroupDataFromHOT: function () {
        var modifiedData = interventionHandsOnTable.currentModifiedData;
        var updatedVals = [];
        if (modifiedData.length!=0){
            modifiedData.forEach(
                function (modifiedData)
                {
                    var modified = modifiedData[0];
                    var interVentionName = dataIniForIntervention.rowHeaders[modified[0]];
                    var newVal = modified[3];
                    var pfafCode = modifiedData[1];
                    dataIniForIntervention.currentIntervention[interVentionName] = newVal; // or updae the intervention directly 
                    
                    console.info(pfafCode);
                    var val = [pfafCode, interVentionName, newVal];
                    updatedVals.push(val);
                }
            );
            interventionHandsOnTable.currentModifiedData = [];
        }
        return updatedVals;
    },
    drawInterventionTable: function (pu, keyName) {
       
        //var container = $("#" + dataIniForIntervention.targetDiv);
        var container = document.getElementById(dataIniForIntervention.targetDiv);
        var data = dataIniForIntervention.regroupDataForHOT(pu, keyName);

        interventionHandsOnTable.initial(container, data);
        interventionHandsOnTable.options["colHeaders"] = dataIniForIntervention.colHeaders;
        interventionHandsOnTable.options["columns"] = dataIniForIntervention.columns;
        //interventionHandsOnTable.options["rowHeaderWidth"] = dataIniForIntervention.rowHeaderWidth;
        interventionHandsOnTable.createNewTable();
    },

    updateInterventionTable: function (pu, keyName, editable) {
        dataIniForIntervention.interventionID = pu;
        if (interventionHandsOnTable.currentTable == null) {
            var container = $("#" + dataIniForIntervention.targetDiv);
            var data = dataIniForIntervention.regroupDataForHOT(pu, keyName);
            interventionHandsOnTable.initial(container, data);
            interventionHandsOnTable.createNewTable();

        } else
        {
            if (editable) {
                var data = dataIniForIntervention.regroupDataForHOT(pu, keyName);
                interventionHandsOnTable.options["columns"] = dataIniForIntervention.editableColumns;
                interventionHandsOnTable.reloadDataToTable(data);
            } else
            {
                var data = dataIniForIntervention.regroupDataForHOT(pu, keyName);
                interventionHandsOnTable.options["columns"] = dataIniForIntervention.columns;
                interventionHandsOnTable.reloadDataToTable(data);

            }
            

        }
    },

    floatToCurrency : function(val) {
        var currency = (val + "").replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
        return "$"+currency;
        
    }
}