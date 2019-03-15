var rectStyle = {
    'fill': 'black',
    'stroke': 'white',
    'stroke-width': 0.2,
    'opacity': 1,
    fillColor: "#E3E4E5",
    colorGroup: colorbrewer.RiskOriginal['6'],

    initial: function (fill, stroke, strokeWidth, opacity, colorGroup) {
        this["fill"] = fill;
        this["stroke"] = stroke;
        this["stroke-width"] = strokeWidth;
        this["opacity"] = opacity;
        this.colorGroup = colorGroup;
    },
    getColor:function(value) {
        var colors = geoJsonStyle.colorGroup;
        var val = parseInt(value);
        if (Number.isNaN(value) || value <= 0) {
            return geoJsonStyle.fillColor;
        } else if (value <= (val + 0.5)) {
            return colors[val];
        } else if (value > (val + 0.5)) {
            return colors[val + 1];
        }
    },
    returnStyle: function (value) {
        var color = rectStyle.getColor(value);
        return color;
    },

    //returnRectAndEllipseStyle: function (value) {
    //    var color= 
    //    var style = 'fill:white;stroke:' + rectStyle.getColor(value) + ';stroke-width:2';
    //    return style;
    //}
}


var compareBarChart = {
    barHeight: 20,
    alignHeight: 5,
    scaleValue: 7,
    parentDiv: null,
    parentData: null,

    leftDiv: null,
    centerDiv: null,
    rightDiv: null,

    leftData: null,
    centerData: null,
    rightData: null,

    rectStyle: {
        'fill': 'black',
        'stroke': 'black',
        'stroke-width': 5,
        'opacity': 0.5
    },

    /**
     * barHeight : the height of each bar
     * alignHeight : the height between each bar
     * scaleValue : convert the value to width of each bar : value*scale 
     * 
     */
    initialize: function (targetDiv, barHeight, alignHeight, scaleValue) {
        this.barHeight = barHeight;
        this.alignHeight = alignHeight;
        this.scaleValue = scaleValue;
        this.parentDiv = d3.select("#" + targetDiv + "");  
    },

    Data: function (chartData) {
        this.parentData = chartData;
    },

    updateData: function (targetDiv, chartData)
    {
        this.parentDiv = d3.select("#" + targetDiv + "");  
        this.parentData = chartData;

        compareBarChart.leftDiv = this.parentDiv.selectAll(".left");
        compareBarChart.centerDiv = this.parentDiv.selectAll(".center");
        compareBarChart.rightDiv = this.parentDiv.selectAll(".right");

        compareBarChart.leftData = compareBarChart.parentData.Data[0];
        compareBarChart.centerData = compareBarChart.parentData.Data[1];
        compareBarChart.rightData = compareBarChart.parentData.Data[2];

    },

    updateDataForDescription: function (targetDiv, chartData) {
        this.parentDiv = d3.select("#" + targetDiv + "");
        this.parentData = chartData;

        compareBarChart.leftDiv = this.parentDiv.selectAll(".left");
        compareBarChart.leftData = compareBarChart.parentData;


    },

    createThreeDivs: function () {
        var targetDiv = compareBarChart.parentDiv;
        //var divCenterHeight = targetDiv._groups[0][0].getBoundingClientRect().height;
        //var divCenterWidth = targetDiv._groups[0][0].getBoundingClientRect().width;
        compareBarChart.leftDiv = targetDiv.append("div").attr("class", "col-xs-5  text-right svgDiv").append("svg").attr("class", "svgRight left").attr("viewBox", function () { return "0 0 " + this.getBoundingClientRect().width + " " + this.getBoundingClientRect().height + "" });
        compareBarChart.centerDiv = targetDiv.append("div").attr("class", "col-xs-2  text-center svgDiv").append("svg").attr("class", "svgRight center").attr("viewBox", function () { return "0 0 " + this.getBoundingClientRect().width + " " + this.getBoundingClientRect().height + "" });
        compareBarChart.rightDiv = targetDiv.append("div").attr("class", "col-xs-5  text-left svgDiv").append("svg").attr("class", "svgRight right").attr("viewBox", function () { return "0 0 " + this.getBoundingClientRect().width + " " + this.getBoundingClientRect().height + "" });

        compareBarChart.leftData = compareBarChart.parentData.Data[0];
        compareBarChart.centerData = compareBarChart.parentData.Data[1];
        compareBarChart.rightData = compareBarChart.parentData.Data[2];

    },

    createOneDiv: function () {
        var targetDiv = compareBarChart.parentDiv;
        //var divCenterHeight = targetDiv._groups[0][0].getBoundingClientRect().height;
        //var divCenterWidth = targetDiv._groups[0][0].getBoundingClientRect().width;
        compareBarChart.leftDiv = targetDiv.append("div").attr("class", "col-xs-6 svgDiv").append("svg").attr("class", "svgRight left").attr("viewBox", function () { return "0 0 " + this.getBoundingClientRect().width + " " + this.getBoundingClientRect().height + "" });
        compareBarChart.leftData = compareBarChart.parentData;

    },

    /**
    * targetDiv : the div contains the bar chart
     * chartData : var barChart={title : "TSS",Data  : [
        {
            type : "rect",
            Data : [
                10.3,
                2.5,
                0,
                3.5,
                4
            ]
        },
        {
            type : "text",
            Data : [
                "Hillslope","Gully","InnChannel","Point","Total"
            ]
        },
        {
            type : "rect",
            Data : [
                6.3,
                1.5,
                0,
                1.5,
                3
            ]
        },]}
    */
    drawBar: function () {

        compareBarChart.createThreeDivs();
        compareBarChart.drawLeftBarChart(compareBarChart.leftDiv, compareBarChart.leftData.Data);
        compareBarChart.drawCenterText(compareBarChart.centerDiv, compareBarChart.centerData.Data);
        compareBarChart.drawRightBarChart(compareBarChart.rightDiv, compareBarChart.rightData.Data);

    },
    updateBar: function () {
        compareBarChart.updateLeftBarChart(compareBarChart.leftDiv, compareBarChart.leftData.Data);
        compareBarChart.updateCenterText(compareBarChart.centerDiv, compareBarChart.centerData.Data);
        compareBarChart.updateRightBarChart(compareBarChart.rightDiv, compareBarChart.rightData.Data);
    },
    /**
     * 
     * draw bar chart with children
     * var barChartM={ title : "Microbial",Data  : [
        {
            type : "rect",
            Data : [
                {
                    Ecoli: 6.5,
                    Protozoa : 2.5,
                    Chemical : 1.5
                },
                {
                    Ecoli: 7.5,
                    Protozoa : 4.3,
                    Chemical : 0
                },
                {
                    Ecoli: 3.5,
                    Protozoa : 5.5,
                    Chemical : 1.5
                },
                {
                    Ecoli: 7.5,
                    Protozoa : 3.5,
                    Chemical : 3.5
                },
                {
                    Ecoli: 7.5,
                    Protozoa : 3.5,
                    Chemical : 3.5
                }
            ]
        },
        {
            type : "text",
            Data : [
                "Onsite","STP","STOMEWATER","INDUSTRY","AG"
            ]
        },
        {
            type : "rect",
            Data : [
                {
                    Ecoli: 1.5,
                    Protozoa : 2.5,
                    Chemical : 1.5
                },
                {
                    Ecoli: 1.5,
                    Protozoa : 2.5,
                    Chemical : 0
                },
                {
                    Ecoli: 0,
                    Protozoa : 3,
                    Chemical : 2.5
                },
                {
                    Ecoli: 1.5,
                    Protozoa : 3.5,
                    Chemical : 1.5
                },
                {
                    Ecoli: 1.5,
                    Protozoa : 3.5,
                    Chemical : 1.5
                }
            ]
        },
    ] 
}
     * 
     * 
     */
    drawBarWithChild: function () {

        compareBarChart.createThreeDivs();
        compareBarChart.drawLeftBarChartWithChild(compareBarChart.leftDiv, compareBarChart.leftData.Data);
        compareBarChart.drawCenterText(compareBarChart.centerDiv, compareBarChart.centerData.Data);
        compareBarChart.drawRightBarChartWithChild(compareBarChart.rightDiv, compareBarChart.rightData.Data);
    },

    updateBarWithChild: function () {
        compareBarChart.updateLeftBarChartWithChild(compareBarChart.leftDiv, compareBarChart.leftData.Data);
        compareBarChart.updateCenterText(compareBarChart.centerDiv, compareBarChart.centerData.Data);
        compareBarChart.updateRightBarChartWithChild(compareBarChart.rightDiv, compareBarChart.rightData.Data);
    },
    /**


    */
    drawRectAndElipseTitle: function () {
        compareBarChart.createThreeDivs();
        compareBarChart.drawLeftRectAndElipse(compareBarChart.leftDiv, compareBarChart.leftData);
        compareBarChart.drawTitleCenterText(compareBarChart.centerDiv, compareBarChart.centerData.Data);
        compareBarChart.drawRightRectAndElipse(compareBarChart.rightDiv, compareBarChart.rightData);
    },

    updateRectAndElipseTitle: function () {
        compareBarChart.updateRectAndElipse(compareBarChart.leftDiv, compareBarChart.leftData);
        compareBarChart.drawTitleCenterText(compareBarChart.centerDiv, compareBarChart.centerData.Data);
        compareBarChart.updateRectAndElipse(compareBarChart.rightDiv, compareBarChart.rightData);
    },

    /**


   */
    drawInterventionDescription: function () {
        compareBarChart.createOneDiv();
        compareBarChart.drawInterventionDescriptionText(compareBarChart.leftDiv, compareBarChart.leftData.Data);
    },

    updateInterventionDescription: function (index) {
        compareBarChart.updateInterventionDescriptionText(compareBarChart.leftDiv, compareBarChart.leftData.Data, index);
    },

    drawLeftBarChart: function (targetDiv, data) {
        var divLeftWidth = targetDiv._groups[0][0].getBoundingClientRect().width;
        var rect = targetDiv.selectAll("rect")
             rect.data(data).enter().append("rect")
            .attr("height", compareBarChart.barHeight)
            .attr("width", function (d) { return d * divLeftWidth/10; })
                 .attr("x", function (d) { return divLeftWidth - d * divLeftWidth / 10; })
                 .attr("y", function (d, i) { return ((i + 1) * compareBarChart.alignHeight + i * compareBarChart.barHeight); })
                 .style("fill", function (d) { return rectStyle.returnStyle(d); })
                 //.attr("style", function (d) {  return rectStyle.returnStyle(d); })
            .append("svg:title")
                 .text(function (d, i) {
                     var transfered = dataIni.transferMicrobialToTitle("", d);
                     return transfered.data;
                 });
    },


    updateLeftBarChart: function (targetDiv, data) {
        var divLeftWidth = targetDiv._groups[0][0].getBoundingClientRect().width;
        var rect = targetDiv.selectAll("rect");
        rect.data(data)
            .transition()
            .duration(500)
            .ease(d3.easeLinear)
            .attr("width", function (d) { return d * divLeftWidth / 10; })
            .attr("x", function (d) { return divLeftWidth - d * divLeftWidth / 10; })
            .style("fill", function (d) { return rectStyle.returnStyle(d); })
            .select("title")
            .text(function (d, i) {
                var transfered = dataIni.transferMicrobialToTitle("", d);
                return transfered.data;
            });
    },


    drawCenterText: function (targetDiv, data) {
        var divCenterWidth = targetDiv._groups[0][0].getBoundingClientRect().width;
        targetDiv.selectAll("text").data(data).enter().append("text")
            .attr("class", "small")
            .attr("text-anchor", 'middle')
            .attr("alignment-baseline", 'middle')
            .attr("x", function (d) { return divCenterWidth * 0.5; })
            .attr("y", function (d, i) { return ((i + 1) * compareBarChart.alignHeight + (i + 0.5) * compareBarChart.barHeight); })
            .text(function (d) { return d; });
    },
    drawTitleCenterText: function (targetDiv, data) {
        var divCenterWidth = targetDiv._groups[0][0].getBoundingClientRect().width;
        var divCenterHeight = targetDiv._groups[0][0].getBoundingClientRect().height;
        targetDiv.selectAll("text").data(data).enter().append("text")
            .attr("class", "middle")
            .attr("text-anchor", 'middle')
            .attr("alignment-baseline", 'middle')
            .attr("x", function (d) { return divCenterWidth * 0.5; })
            .attr("y", function (d) { return divCenterHeight*0.5; })
            .text(function (d) { return d; });
    },

    updateCenterText: function (targetDiv, data) {
        var divLeftWidth = targetDiv._groups[0][0].getBoundingClientRect().width;
        var rect = targetDiv.selectAll("text")
        rect.data(data).text(function (d, i) { return d; });
    },


    drawRightBarChart: function (targetDiv, data) {
        var divLeftWidth = targetDiv._groups[0][0].getBoundingClientRect().width;
        targetDiv.selectAll("rect").data(data).enter().append("rect")
            .attr("height", compareBarChart.barHeight)
            .attr("width", function (d) { return d * divLeftWidth / 10; })
            .attr("x", function (d) { return 0; })
            .attr("y", function (d, i) { return ((i + 1) * compareBarChart.alignHeight + i * compareBarChart.barHeight); })
            .style("fill", function (d) { return rectStyle.returnStyle(d); })
            .append("svg:title")
            .text(function (d, i) {
                var transfered = dataIni.transferMicrobialToTitle("", d);
                return transfered.data;
            });
    },

    updateRightBarChart: function (targetDiv, data) {
        var divLeftWidth = targetDiv._groups[0][0].getBoundingClientRect().width;
        var rect = targetDiv.selectAll("rect")
        rect.data(data)
            .transition()
            .duration(500)
            .ease(d3.easeLinear)
            .attr("width", function (d) { return d * divLeftWidth / 10; })
            .attr("x", function (d) { return 0; })
            .style("fill", function (d) { return rectStyle.returnStyle(d); })
            .select("title")
            .text(function (d, i) {
                var transfered = dataIni.transferMicrobialToTitle("", d);
                return transfered.data;
            });
    },

    drawLeftBarChartWithChild: function (targetDiv, data) {
        var divLeftWidth = targetDiv._groups[0][0].getBoundingClientRect().width;
        targetDiv.selectAll("g").data(data).enter().append("g")
            .attr("transform", function (d, i) { return "translate(0," + ((i + 1) * compareBarChart.alignHeight + i * compareBarChart.barHeight) + ")"; })
            .selectAll("rect").data(function (d, i) {
                var result = [];
                for (var key in d) {
                    if (d.hasOwnProperty(key)) {
                        result.push({
                            key: key,
                            value: d[key]
                        });
                    }
                }
                return result;
            }).enter().append("rect")
            .attr("height", compareBarChart.barHeight / 3)
            .attr("width", function (d) { var val = d.value; return val * divLeftWidth / 10; })
            .attr("x", function (d) { var val = d.value; return divLeftWidth - val * divLeftWidth / 10; })
            .attr("y", function (d, i) { return i * compareBarChart.barHeight / 3; })
            .style("fill", function (d) { return rectStyle.returnStyle(d.value); })
            .append("svg:title")
            .text(function (d, i) {
                var transfered = dataIni.transferMicrobialToTitle(d.key, d.value);
                return transfered.key + " : " + transfered.data;
            });
    },

    updateLeftBarChartWithChild: function (targetDiv, data) {
        var divLeftWidth = targetDiv._groups[0][0].getBoundingClientRect().width;
        targetDiv.selectAll("g").data(data)
            .selectAll("rect").data(function (d, i) {
                var result = [];
                for (var key in d) {
                    if (d.hasOwnProperty(key)) {
                        result.push({
                            key: key,
                            value: d[key]
                        });
                    }
                }
                return result;
            })
            .transition()
            .duration(500)
            .ease(d3.easeLinear)
            .attr("width", function (d) { var val = d.value; return val * divLeftWidth / 10; })
            .attr("x", function (d) { var val = d.value; return divLeftWidth - val * divLeftWidth / 10; })
            .style("fill", function (d) { return rectStyle.returnStyle(d.value); })
            .select("title")
            .text(function (d, i) {
                var transfered = dataIni.transferMicrobialToTitle(d.key, d.value);
                return transfered.key + " : " + transfered.data;
            });
    },

    drawRightBarChartWithChild: function (targetDiv, data) {
        var divLeftWidth = targetDiv._groups[0][0].getBoundingClientRect().width;
        targetDiv.selectAll("g").data(data).enter().append("g")
            .attr("transform", function (d, i) { return "translate(0," + ((i + 1) * compareBarChart.alignHeight + i * compareBarChart.barHeight) + ")"; })
            .selectAll("rect").data(function (d, i) {
                var result = [];
                for (var key in d) {
                    if (d.hasOwnProperty(key)) {
                        result.push({
                            key: key,
                            value: d[key]
                        });
                    }
                }
                return result;
            }).enter().append("rect")
            .attr("height", compareBarChart.barHeight / 3)
            .attr("width", function (d) { var val = d.value; return val * divLeftWidth / 10; })
            .attr("x", 0)
            .attr("y", function (d, i) { return i * compareBarChart.barHeight / 3; })
            .style("fill", function (d) { return rectStyle.returnStyle(d.value); })
            .append("svg:title")
            .text(function (d, i) {
                var transfered = dataIni.transferMicrobialToTitle(d.key, d.value);
                return transfered.key + " : " + transfered.data;
            });
    },

    updateRightBarChartWithChild: function (targetDiv, data) {
        var divLeftWidth = targetDiv._groups[0][0].getBoundingClientRect().width;
        targetDiv.selectAll("g").data(data)
            .selectAll("rect").data(function (d, i) {
                var result = [];
                for (var key in d) {
                    if (d.hasOwnProperty(key)) {
                        result.push({
                            key: key,
                            value: d[key]
                        });
                    }
                }
                return result;
            })
            .transition()
            .duration(500)
            .ease(d3.easeLinear)
            .attr("width", function (d) { var val = d.value; return val * divLeftWidth / 10; })
            .attr("x", 0)
            .style("fill", function (d) { return rectStyle.returnStyle(d.value); })
            .select("title")
            .text(function (d, i) {
                var transfered = dataIni.transferMicrobialToTitle(d.key, d.value);
                return transfered.key + " : " + transfered.data;
            });
    },

    drawLeftRectAndElipse: function (targetDiv, data) {
        var divLeftWidth = targetDiv._groups[0][0].getBoundingClientRect().width;
        var divLeftHeight = targetDiv._groups[0][0].getBoundingClientRect().height;
        var result = [];
        result.push({ key: data.type, value: data.Data[0]});

        targetDiv.selectAll("rect").data(result).enter().append("rect")
            .attr("height", divLeftHeight*0.5)
            .attr("width", function (d) { return divLeftWidth - 3 * divLeftHeight/4; })
            .attr("x", function (d) { return 3 * divLeftHeight / 4; })
            .attr("y", function (d, i) { return divLeftHeight / 4; })
            .style("fill", function (d) { return rectStyle.returnStyle(d.value); })
            .append("svg:title")
            .text(function (d) {
                var transfered = dataIni.transferRiskToCategoric(d.value);
                return transfered;
            });
        targetDiv.selectAll("ellipse").data(result).enter().append("ellipse")
            .attr("ry", function (d, i) { return (divLeftHeight-2) / 2; })
            .attr("rx", function (d, i) { return (divLeftHeight - 2) / 2; })
            .attr("cx", function (d, i) { return divLeftHeight  / 2; })
            .attr("cy", function (d, i) { return divLeftHeight  / 2; })
            .style("fill", "white")
            .style("stroke-width", "2")
            .style("stroke", function (d) { return rectStyle.returnStyle(d.value); });
        var texts = targetDiv.selectAll("text").data(result).enter();
        texts.append("text")
            .attr("class","small title")
            .attr("text-anchor", 'middle')
            .attr("alignment-baseline", 'middle')
            .attr("height", divLeftHeight * 0.5)
            .attr("width", function (d) { return divLeftWidth - 3 * divLeftHeight / 4; })
            .attr("x", function (d) { return (divLeftWidth + 3 * divLeftHeight / 4)/2; })
            .attr("y", function (d, i) { return divLeftHeight / 2; })
            .text(function (d, i) { return d.key; });
        texts.append("text")
            .attr("class", "large")
            .attr("text-anchor", 'middle')
            .attr("alignment-baseline", 'middle')
            .attr("height", divLeftHeight * 0.5)
            .attr("width", function (d) { return divLeftWidth - 3 * divLeftHeight / 4; })
            .attr("x", function (d) { return divLeftHeight / 2; })
            .attr("y", function (d, i) { return divLeftHeight / 2; })
            .style("fill", function (d) { return rectStyle.returnStyle(d.value); })
            .text(function (d, i) {
                var result = 0;
                if (!Number.isNaN(d.value))
                {
                    result = Math.round(d.value);
                }
                return result;
            });
    },

    updateRectAndElipse: function (targetDiv, data) {
        var divLeftWidth = targetDiv._groups[0][0].getBoundingClientRect().width;
        var divLeftHeight = targetDiv._groups[0][0].getBoundingClientRect().height;
        var result = [];
        result.push({ key: data.type,value: data.Data[0] });

        targetDiv.selectAll("rect").data(result)
            .style("fill", function (d) { return rectStyle.returnStyle(d.value); })
            .select("title")
            .text(function (d) {
                var transfered = dataIni.transferRiskToCategoric(d.value);
                return transfered;
            });
        targetDiv.selectAll("ellipse").data(result)
            .style("stroke", function (d) { return rectStyle.returnStyle(d.value); });


        var texts = targetDiv.selectAll("text").data(function () { return [{ key: data.type }, { value: data.Data[0] }] }).style("fill", function (d, i) {
            if (this.className.baseVal == "small title") {

            } else {
                return rectStyle.returnStyle(d.value);
            }
        }).text(function (d, i) {
            if (this.className.baseVal == "small title")
            {
                return d.key;
            } else
            {
                var result = 0;
                if (!Number.isNaN(d.value)) {
                    result = Math.round(d.value);
                }
                return result;
            }
        });
    },



    drawRightRectAndElipse: function (targetDiv, data) {
        var divLeftWidth = targetDiv._groups[0][0].getBoundingClientRect().width;
        var divLeftHeight = targetDiv._groups[0][0].getBoundingClientRect().height;
        var result = [];
        result.push({ key: data.type, value: data.Data[0] });
        targetDiv.selectAll("rect").data(result).enter().append("rect")
            .attr("height", divLeftHeight * 0.5)
            .attr("width", function (d) { return divLeftWidth - 3 * divLeftHeight / 4; })
            .attr("x", 0)
            .attr("y", function (d, i) { return divLeftHeight / 4; })
            .style("fill", function (d) { return rectStyle.returnStyle(d.value); })
            .append("svg:title")
            .text(function (d) {
                var transfered = dataIni.transferRiskToCategoric(d.value);
                return transfered;
            });            
        
        targetDiv.selectAll("ellipse").data(result).enter().append("ellipse")
            .attr("ry", function (d, i) { return (divLeftHeight - 2) / 2; })
            .attr("rx", function (d, i) { return (divLeftHeight - 2) / 2; })
            .attr("cx", function (d) { return divLeftWidth -  divLeftHeight / 2; })
            .attr("cy", function (d, i) { return divLeftHeight / 2; })
            .style("fill", "white")
            .style("stroke-width", "2")
            .style("stroke", function (d) { return rectStyle.returnStyle(d.value); });
        var texts = targetDiv.selectAll("text").data(result).enter();
        texts.append("text")
            .attr("class", "small title")
            .attr("text-anchor", 'middle')
            .attr("alignment-baseline", 'middle')
            .attr("height", divLeftHeight * 0.5)
            .attr("width", function (d) { return divLeftWidth - 3 * divLeftHeight / 4; })
            .attr("x", function (d) { return (divLeftWidth - 3 * divLeftHeight / 4) / 2; })
            .attr("y", function (d, i) { return divLeftHeight / 2; })
            .text(function (d, i) { return d.key; });
        texts.append("text")
            .attr("class", "large")
            .attr("text-anchor", 'middle')
            .attr("alignment-baseline", 'middle')
            .attr("height", divLeftHeight * 0.5)
            .attr("width", function (d) { return divLeftWidth - 3 * divLeftHeight / 4; })
            .attr("x", function (d) { return divLeftWidth - divLeftHeight / 2; })
            .attr("y", function (d, i) { return divLeftHeight / 2; })
            .style("fill", function (d) { return rectStyle.returnStyle(d.value); })
            .text(function (d, i) {
                var result = 0;
                if (!Number.isNaN(d.value)) {
                    result = Math.round(d.value);
                }
                return result;
            });
    },

    drawTwoSidesBarChartTitle: function (targetDivID, data) {
        var targetDiv = d3.select("#" + targetDivID);
        var divCenterHeight = targetDiv._groups[0][0].getBoundingClientRect().height;
        var divCenterWidth =  targetDiv._groups[0][0].getBoundingClientRect().width;
        targetDiv.selectAll("svg").data(function () { return [data] }).enter().append("svg")
            .attr("class", "svgRight")
            .attr("viewBox", "0 0 " + divCenterWidth + " " + divCenterHeight + "")
            .selectAll("text")
            .data(function (d, i) { return [d]; })
            .enter()
            .append("text")
            .attr("text-anchor", 'middle')
            .attr("alignment-baseline", 'middle')
            .attr("x", function (d) { return divCenterWidth * 0.5; })
            .attr("y", function (d, i) { return divCenterHeight * 0.5; })
            .text(function (d) { return d; });
    },

    drawInterventionDescriptionText: function (targetDiv, data) {
        var divCenterHeight = targetDiv._groups[0][0].getBoundingClientRect().height;
        var divCenterWidth = targetDiv._groups[0][0].getBoundingClientRect().width;
        var rect = targetDiv.selectAll("rect").data(function () { return [data]}).enter().append("rect").attr("class", "rectDescription");
        var textL = targetDiv.append("text");
        
        var tspanL = textL.append("tspan").attr("y", divCenterHeight / 2);
        tspanL.append("tspan").attr("class","large")
            .text(function () { return data.count; });
        tspanL.append("tspan").attr("class", "small")
            .text(function () { return data.unit; });

        var tspanR = textL.append("tspan").attr("x", divCenterWidth/2.5).attr("y", (divCenterHeight/2-10));
        tspanR.selectAll("tspan").data(function () { return compareBarChart.splitStringTool(data.description, 30);}).enter().append("tspan")
            .attr("class", "small")
            .attr("x", function (d, i) { if (i > 0) { return divCenterWidth / 2; } })
            .attr("dy", function (d, i) { if (i > 0) { return '1.5em'; } })
            .text(function (d) { return d;});
        tspanR.append("tspan")
            .attr("class", "small")
            .attr("x", divCenterWidth / 2.5)
            .attr("dy", '1.5em')
            .text(function (d) { return "Cost : "+data.cost;});
    },
    updateInterventionDescriptionText: function (targetDiv, data, index) {
        var divCenterHeight = targetDiv._groups[0][0].getBoundingClientRect().height;
        var divCenterWidth = targetDiv._groups[0][0].getBoundingClientRect().width;
        if (index == 0)
        {
            targetDiv.selectAll("*").remove();
        }

        var rect = targetDiv.selectAll("rect").data(function () { return [data] });
        var textL = targetDiv.selectAll("text");

        var rect = targetDiv.selectAll("rect").data(function () { return [data] }).enter().append("rect").attr("class", "rectDescription");
        var textL = targetDiv.append("text");

        var tspanL = textL.append("tspan").attr("y", divCenterHeight / 2);
        tspanL.append("tspan").attr("class", "large")
            .text(function () { return data.count; });
        tspanL.append("tspan").attr("class", "small")
            .text(function () { return data.unit; });

        var tspanR = textL.append("tspan").attr("x", divCenterWidth / 2).attr("y", (divCenterHeight / 2 - 10));
        tspanR.selectAll("tspan").data(function () { return compareBarChart.splitStringTool(data.description, 25); }).enter().append("tspan")
            .attr("class", "small")
            .attr("x", function (d, i) { if (i > 0) { return divCenterWidth / 2; } })
            .attr("dy", function (d, i) { if (i > 0) { return '1.5em'; } })
            .text(function (d) { return d; });
        tspanR.append("tspan")
            .attr("class", "small")
            .attr("x", divCenterWidth / 2)
            .attr("dy", '1.5em')
            .text(function (d) { return "Cost : $ " + data.cost; });
    },
    splitStringTool: function (str, len) {
        var ret = [];
        for (var offset = 0, strLen = str.length; offset < strLen; offset += len) {
            ret.push(str.slice(offset, len + offset));
        }
        return ret;
    }
}