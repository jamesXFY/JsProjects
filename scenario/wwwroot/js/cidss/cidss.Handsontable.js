var interventionHandsOnTable = {
    data: null,
    currentContainer: null,
    currentTable: null,
    options: {
        data: null,
        afterChange: null,
        stretchH: 'all',
        preventOverflow: 'horizontal',
        height: 500,

    },
    currentModifiedData: [],

    optionSetting: function (options) {
        interventionHandsOnTable.options = options;
        interventionHandsOnTable.options["data"] = interventionHandsOnTable.data;
    },

    initial: function (container,data) {
        this.data = data;
        this.currentContainer = container;
        this.options.data = this.data;
        this.options.afterChange = this.afterChangeFunc;
    },

    createNewTable: function () {
        var hoTable = new Handsontable(
            interventionHandsOnTable.currentContainer,
            interventionHandsOnTable.options
        );

        interventionHandsOnTable.currentTable = hoTable;
        //interventionHandsOnTable.currentModifiedData = [];
    },

    reloadDataToTable: function (data) {
        interventionHandsOnTable.currentTable.loadData(data);
        interventionHandsOnTable.currentTable.updateSettings({
            columns: interventionHandsOnTable.options.columns
        });
        interventionHandsOnTable.currentTable.render();
        //interventionHandsOnTable.currentModifiedData = [];
    },

    afterChangeFunc: function (data, event) {
        console.info(dataIniForIntervention.interventionID);
        if (event == "edit" && (data!=null || data!=window.undentified))
        {
            var pfafCode = dataIniForIntervention.interventionID;
            data.push(pfafCode);
            interventionHandsOnTable.currentModifiedData.push(data);
        }
    }
}