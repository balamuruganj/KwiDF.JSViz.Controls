$(document).ready(function () {
    var chartObj = $("#js_chart");
    chartObj.on('click', '.wrapper', function () {
        $(this).toggleClass('selected');

        //log("DocClick" + selectedCategoryActual);
        if ($(this).hasClass('selected')) {
            $(".overlay", $(this)).show();
            updateColor();
           
           // setDocumentProperty("RefreshKPI", "false");
           
            var actual = actualVal + ' as ' + actualDisplay;
            var target = targetVal + ' as ' + targetDisplay;
            //runScript("DynamicProductionCategory", [{ "Key": "actualValue", "Value": actual }, { "Key": "targetValue", "Value": target }, { "Key": "isDelete", "Value": 0 }]);
        } else {
            $(".overlay", $(this)).hide();
            updateColor();
           
            //setDocumentProperty("RefreshKPI", "false");
           
            var actual = actualVal + ' as ' + actualDisplay;
            var target = targetVal + ' as ' + targetDisplay;
          //  runScript("DynamicProductionCategory", [{ "Key": "actualValue", "Value": actual }, { "Key": "targetValue", "Value": target }, { "Key": "isDelete", "Value": 1 }]);
        }
    });

    chartObj.on('click', ".icon-holder button", function (event) {
        event.stopPropagation();
    });


});


function assignDocPropertyValue(isDelete) {
    var splitActual = [];
    actualVal = "";
    splitActual = selectedCategoryActual.split(',');
    for (var i = 0; i < splitActual.length; i++) {

        if (columnsArray[2] != splitActual[i])
            if (actualVal == '')
                actualVal = splitActual[i]
            else
                actualVal += ',' + splitActual[i]
    }
    if (isDelete == 0) {
        if (actualVal != "") {
            actualVal += ',' + columnsArray[2];
        }
        else {
            actualVal = columnsArray[2];
        }
    }
    log(actualVal);
    //setDocumentProperty(propertyName[0],actualVal);			
    var splitTarget = [];
    targetVal = "";
    splitTarget = selectedCategoryTarget.split(',');
    for (var i = 0; i < splitTarget.length; i++) {

        if (columnsArray[3] != splitTarget[i])
            if (targetVal == '')
                targetVal = splitTarget[i]
            else
                targetVal += ',' + splitTarget[i]
    }
    if (isDelete == 0) {
        if (targetVal != "") {
            targetVal += ',' + columnsArray[3]
        }
        else {
            targetVal = columnsArray[3];
        }
    }
    log(targetVal);
    //setDocumentProperty(propertyName[1],targetVal);	
}


//var RefreshKPI=true;
var chartValue;
var gaugaChart;
var colName;
var columnsArray;
var configData;
var topValue = "";
var bottomValue = "";
var targetValue = 0;
var lastTopData = 0;
var lastTargetData = 0;
var colorCode = "";
var selectionType = "";
var actualDisplay = "";
var targetDisplay = "";
var propertyName;
var actualVal = "";
var targetVal = "";
var maxValue;
var minValue;
function renderCore(sfdata) {
    //log("RefreshKPI" + "-" + sfdata.config.RefreshKPI);
    // selectedCategoryActual = sfdata.config.CategoryConditionActual;
    // selectedCategoryTarget = sfdata.config.CategoryConditionTarget;
    var DateValue = new Date(sfdata.config.DateFilter);
    var DateValueFormatted = DateValue.valueOf();
    var nextDate = DateValue;
    var numberOfDaysToAdd = 1;
    nextDate.setDate(nextDate.getDate() + numberOfDaysToAdd);
    var nextDateValueFormatted = nextDate.valueOf();
    actualVal = sfdata.config.ColumnName[0];
    targetVal = sfdata.config.ColumnName[1];
    actualDisplay = sfdata.config.DisplayName[0];
    targetDisplay = sfdata.config.DisplayName[1];
    if (sfdata.config.RefreshKPI == "true") {
        configData = sfdata.config;
        var actualData = sfdata.data;
        actualData = actualData.filter(function (el) {
            DateValue = new Date(sfdata.config.DateFilter);
            DateValueFormatted = DateValue.valueOf();
            //log("DateValueFormatted" + DateValueFormatted + "DateValue" + el.items[0]);
            return el.items[0].replace("/Date(", "").replace(")/", "") <= DateValueFormatted;

        });

        colName = sfdata.columns[2];
        columnsArray = sfdata.columns;
        actualVal = sfdata.columns[2];
        targetVal = sfdata.columns[3];
        var series = {};
        var processed_json = new Array();
        data = [];
        targetData = [];
        changeData = [];
        selectionType = sfdata.config.ChartType;
        colorCode = sfdata.config.ColorCode;

        propertyName = sfdata.config.PropertyName;
        //log("DocPropInit" + selectedCategoryActual);
        for (i = 0; i < actualData.length; i++) {
            /* if (sfdata.config.FilteredCategory != undefined && sfdata.config.FilteredCategory != "" && sfdata.config.GroupCategory != undefined && sfdata.config.GroupCategory != "") {
                 if (sfdata.config.FilteredCategory == actualData[i].items[1] && sfdata.config.GroupCategory == actualData[i].items[3]) {
                     data.push([parseInt(actualData[i].items[0].replace("/Date(", "").replace(")/", "")), actualData[i].items[2]]);
                     bottomArray.push([actualData[i].items[4]]);
                }           
             }
             else if (sfdata.config.FilteredCategory != undefined && sfdata.config.FilteredCategory != "") {
                 if (sfdata.config.FilteredCategory == actualData[i].items[1]) {
                     data.push([parseInt(actualData[i].items[0].replace("/Date(", "").replace(")/", "")), actualData[i].items[2]]);
                     bottomArray.push([actualData[i].items[4]]);
                 }
             }
             else if (sfdata.config.GroupCategory != undefined && sfdata.config.GroupCategory != "") {
                 if (sfdata.config.GroupCategory == actualData[i].items[3]) {
                     data.push([parseInt(actualData[i].items[0].replace("/Date(", "").replace(")/", "")), actualData[i].items[2]]);
                     bottomArray.push([actualData[i].items[4]]);
                 }
             }
             else {*/
            //var dateVal=new Date(actualData[i].items[0]);
            //var xAxisDate=Date.UTC(dateVal.getUTCFullYear(), dateVal.getUTCMonth(), dateVal.getUTCDate(), dateVal.getUTCHours(), dateVal.getUTCMinutes(), dateVal.getUTCSeconds());
            //data.push([xAxisDate, actualData[i].items[2]]);
            data.push([parseInt(actualData[i].items[0].replace("/Date(", "").replace(")/", "")), actualData[i].items[2]]);
            targetData.push([parseInt(actualData[i].items[0]), actualData[i].items[3]]);
            changeData.push(actualData[i].items[4]);
            //bottomArray.push([actualData[i].items[4]]);
            //}
        }
        series = {
            name: sfdata.columns[2],
            data: data
        };
        processed_json.push(series);

        var lastData = 0;
        if (data.length > 0) {
            var len = data.length - 1;
            lastData = data[len][1] != 0 && data[len][1] != "" ? Math.round(data[len][1]) : 0;
            lastTopData = lastData;
            topValue = numberWithCommas(lastData);

            if (targetData.length > 0) {
                var len = targetData.length - 1;
                lastTargetData = targetData[len][1] != 0 && targetData[len][1] != "" ? Math.round(targetData[len][1]) : 0;
                targetValue = numberWithCommas(lastTargetData);
            }
            if (changeData.length > 0) {
                var len = changeData.length - 1;
                var bottomData = changeData[len] != 0 && changeData[len] != "" ? Math.round(changeData[len]) : 0;
                bottomValue = numberWithCommas(bottomData);
            }

            if (lastTopData > lastTargetData) {
                maxValue = lastTopData + ((20 / 100) * lastTopData);
                if (lastTargetData < 0) {
                    minValue = lastTargetData - ((20 / 100) * lastTargetData);
                }
                else {
                    minValue = 0;
                }
            }
            else {
                maxValue = lastTargetData + ((20 / 100) * lastTargetData);
                if (lastTopData < 0) {
                    minValue = lastTopData - ((20 / 100) * lastTopData);
                }
                else {
                    minValue = 0;
                }
            }

            log("MaxValue-" + maxValue);
            log("MinValue-" + minValue);

        }
        else {
            topValue = "";
            bottomValue = "";
            targetValue = 0;
            lastTargetData = 0;
            lastTopData = 0;
        }
        var chartObj = $("#js_chart");


        if ($('.wrapper', chartObj).length == 0) {
            $(chartObj).wrapInner("<div class='wrapper'/>");
            var drawChart = $('.wrapper', chartObj);

            $(drawChart).addClass("smallSection");
            $(drawChart).append("<header/>");
            $(drawChart).append("<section class='chartHolder' id='chartHolder'/>");
            $(drawChart).append("<section class='gaugeHolder' id='gaugeHolder'/>");




            $("header", drawChart).append("<h2>" + sfdata.config.lableText + " <span>" + sfdata.config.UOMText + "</span></h2>").append("<p>" + topValue + "</p>");
            $("header", drawChart).append("<div class='target-holder'/>");
            $("header .target-holder", drawChart).append("<div>Target :</div><div>" + targetValue + "</div>");

            $(drawChart).append("<footer/>");
            $("footer", drawChart).append("<span class='up'>" + bottomValue + "</span>");
            $("footer", drawChart).append("<div class='icon-holder'/>");
            $("footer .icon-holder", drawChart).append('<button onclick="clickedGuage()"  class="active" id="guage"><i class="fa fa-tachometer" aria-hidden="true"></i></button>');
            $("footer .icon-holder", drawChart).append('<button onclick="clickedLine()"  id="line"><i class="fa fa-line-chart" aria-hidden="true"></i></button>');
            $("footer .icon-holder", drawChart).append('<button onclick="clickedChart()" id="bar"><i class="fa fa-bar-chart" aria-hidden="true"></i></button>');
            //$("footer .icon-holder",drawChart).append('<button onclick="clickedCurrency()"  id="currency"><i class="fa fa-arrows-h" aria-hidden="true"></i></button>');
            drawChart.append("<div class='overlay'/>");


        }

        var options = {
            chart: {
                renderTo: 'chartHolder',
                spacingBottom: 0,
                spacingTop: 10,
                spacingLeft: 8,
                spacingRight: 3
            },
            backgroundColor: 'transparent',
            borderWidth: 0,
            plotBackgroundColor: 'transparent',
            plotShadow: false,
            plotBorderWidth: 0,
            title: {
                text: ' ',


            },

            xAxis: {
                type: 'datetime',
                dateTimeLabelFormats: {
                    day: '%e of %b'
                },
                lineWidth: 0,
                title: {
                    text: 'Date'
                },
                labels: {
                    enabled: false
                },


                title: {
                    enabled: false
                },
            },

            plotOptions: {
                series: {
                    color: colorCode,
                    pointPadding: 0,
                    groupPadding: 1,
                    lineWidth: .8,
                    pointPadding: 0,
                    groupPadding: 0,
                }
            },


            exporting: { enabled: false },
            yAxis: [{

                lineWidth: 1,
                opposite: true,

                labels: {
                    enabled: true,
                    align: 'left',
                    x: 5,
                    style: {
                        //color: '#fff'
                    }
                },

                gridLineDashStyle: 'Dash',
                className: 'highcharts-color-0',

                title: {
                    enabled: false,
                    text: 'Temperature (°C)'
                }

            }, ],


            tooltip: {
                formatter: function () {
                    var d1 = new Date(this.x);
                    var calendarNextDay = ("00" + (d1.getDate()).toString()).slice(-2) + "-" + ("00" + (d1.getMonth() + 1).toString()).slice(-2) + "-" + d1.getFullYear();
                    return 'Date:' + calendarNextDay + '<br/>' + sfdata.config.lableText + ':'
                     + Math.round(this.y);
                }
            },
            legend: {
                //  layout: 'vertical',
                //  align: 'center',
                // verticalAlign: 'bottom',
                // borderWidth: 0
                enabled: false
            },
            series: processed_json


        }
        chartValue = new Highcharts.Chart(options);


        createCustomGauge();



        $("header p").html(topValue);
        //log(bottomData);
        //bottomVal = numberWithCommas(bottomData);
        $("footer span").html(bottomValue);
        $("header .target-holder").html("<div>Target :</div><div>" + targetValue + "</div>");
        if (bottomData < 0) {
            $(".smallSection span").addClass("down");
            $(".smallSection span").removeClass("up");
            $(".smallSection span").removeClass("neutral");
            $(".smallSection header").css("background", "red")
        }
        else if (bottomData == 0) {
            $(".smallSection span").addClass("neutral");
            $(".smallSection span").removeClass("up");
            $(".smallSection span").removeClass("down");

        }
        else {
            $(".smallSection span").removeClass("down");
            $(".smallSection span").addClass("up");
            $(".smallSection span").removeClass("neutral");


        }
        if (lastTopData > lastTargetData) {
            $(".smallSection header").css("background", "#429e2f")
        }
        else if (lastTopData < lastTargetData) {
            $(".smallSection header").css("background", "red")
        }
        else {
            $(".smallSection header").css("background", "#f4d646")
        }
        chooseSelection();
        //  wait ( sfdata.wait, sfdata.static ); 
        checkNoData();

        //log("Testing" + selectedCategoryActual);
        /* if (selectedCategoryActual != "" && selectedCategoryActual != undefined) {
             //$('.wrapper').toggleClass('selected');
             if (selectedCategoryActual.indexOf(sfdata.columns[2]) > -1) {
                 //log(selectedCategory);
                 // $(".overlay", $('.wrapper')).show();
             }
             else {
                 // $(".overlay", $('.wrapper')).hide();
             }
         }*/
    }


}

function chooseSelection() {

    $('.chartHolder,.gaugeHolder').addClass("pushBack");

    if (selectionType == "Bar") {
        clickedChart();
    }
    else if (selectionType == "Line") {
        clickedLine();
    }
    else {
        clickedGuage();
    }
    /* if(selection == "gaugeHolder"){
                   clickedGuage();
     }else{
            if(selectionType == "line"){
                   clickedLine();
            }else{
                   clickedChart();
            }
     }*/
    updateColor();
}


function updateColor() {
    var chart = $('.chartHolder').highcharts();
    if (chart.series != undefined) {
        if ($('.overlay').is(':visible')) {

            if (chart.series.length > 0) {
                chart.series[0].options.color = colorCode;
                chart.series[0].update(chartValue.series[0].options);
            }
        } else {
            if (chart.series.length > 0) {
                chart.series[0].options.color = colorCode;
                chart.series[0].update(chartValue.series[0].options);
            }
        }
    }

}


function createCustomGauge() {

    gaugeTitle = "";
    var startColor = "";
    var stopColor = "";
    var borderColor = "";
    var plotBandColor = "";
    if (lastTopData > lastTargetData) {
        startColor = "#eec812";
        stopColor = "#2b2400";
        borderColor = "#473a00";
        plotBandColor = "#fff6cc";
    }
    else if (lastTopData < lastTargetData) {
        startColor = "#ff3054";
        stopColor = "#260007";
        borderColor = "#580212";
        plotBandColor = "#fee1e6";
    }
    else {
        startColor = "#52b93c";
        stopColor = "#051900";
        borderColor = "#104004";
        plotBandColor = "#e6ffe1";
    }
    //var chartVal=new Highcharts.Chart({
    var options = {
        chart: {
            renderTo: 'gaugeHolder',
            type: 'gauge',
            alignTicks: false,
            plotBackgroundColor: null,
            plotBackgroundImage: null,
            spacingTop: 0,
            spacingLeft: 0,
            spacingRight: 0,
            spacingBottom: 0,
            plotBorderWidth: 0,
            plotShadow: false,
            backgroundColor: 'transparent',
            borderColor: 'transparent',
            events: {
                click: function () {
                    //alert('[Category] = \''+ gaugeTitle +'\'');
                    //runScript("DynamicProductionCategory", [{ "Key": "colName", "Value": '[Category] = \''+ gaugeTitle +'\'' }, { "Key": "isDelete", "Value": 0 }]);

                }
            }
        },

        title: {
            text: gaugeTitle,
            style: { color: '#fff', 'font-size': '13px' }

        },

        pane: {
            startAngle: -90,
            endAngle: 90,
            center: ['50%', '95%'],
            size: '140%',
            background:
			{
			    backgroundColor: {
			        radialGradient: {
			            cx: 0.5,
			            cy: 0.5,
			            r: .34
			        },
			        stops: [
						[0, startColor],
						[1, stopColor]
			        ]
			    },
			    borderColor: borderColor,
			    //outerRadius: '50%',
			    //innerRadius: '10%',
			}

        },

        plotOptions: {
            //ticker
            gauge: {

                dial: {
                    radius: '80%',
                    backgroundColor: {
                        linearGradient: {
                            x1: 0,
                            x2: 1,
                            y1: 0,
                            y2: 1
                        },
                        stops: [
							[1, '#f5b120'],
							[0, '#842829']
                        ]
                    },

                    topWidth: 1,
                    baseWidth: 3,
                    rearLength: '0',
                    borderColor: '#aa2707',
                    borderWidth: 1

                },
                pivot: {
                    radius: 22,
                    borderColor: 'gray',
                    backgroundColor: {
                        linearGradient: {
                            x1: 0,
                            y1: 0,
                            x2: 1,
                            y2: 1
                        },
                        stops: [
							[0, '#080808'],
							[1, '#262626']
                        ]
                    }
                },
            },

        },
        exporting: {
            enabled: false
        },
        yAxis: [{
            min: minValue,
            title: {
                text: ''
            },
            max: maxValue,
            tickPositions: [lastTargetData],
            lineColor: '#transparent',
            tickColor: '#000',
            minorTickColor: '#000',
            minorTickPosition: 'inside',
            tickLength: 25,
            tickWidth: 5,
            minorTickLength: 8,
            offset: 0,
            lineWidth: 1.5,
            labels: {
                distance: -40,
                rotation: 10,
                style: {
                    color: '#fff',

                    fontSize: '13px',
                    fontWeight: 'normal'
                }
            },
            endOnTick: false,
            plotBands: [{
                from: minValue,
                to: lastTargetData,
                thickness: '17%',
                color: plotBandColor // green
            }, {
                from: lastTargetData,
                to: maxValue,
                thickness: '17%',
                color: '#eb8206' // red
            },
            ]
        }
        ],

        series: [{

            name: 'Actual',
            data: [0],
            dataLabels: {

                formatter: function () {
                    var kmh = topValue;
                    dataLabel = '<span class="dataLabels">' + kmh + '</span>';
                    $("#gaugeHolder .highcharts-container").after(dataLabel);
                },

                y: 12,
                zIndex: 10,

            },
            tooltip: {
                valueSuffix: '<br></br>  Target:' + lastTargetData,
                backgroundColor: null,
                borderWidth: 0,
                shadow: true,
                useHTML: true,
                style: {
                    padding: 0
                }
            }
        }
        ]

    };
    gaugaChart = new Highcharts.Chart(options);
    setInterval(chartFunction(gaugaChart, lastTopData), 500);

}
var chartFunction = function (gaugaChart, actualValue) {
    var point = gaugaChart.series[0].points[0],
	newVal,
	inc = actualValue;

    newVal = inc;
    if (newVal < 0 || newVal > 100) {
        newVal = actualValue;
    }

    point.update(newVal);
}



function numberWithCommas(x) {
    //log(x);
    if (x != 0 && x != "" && x != null)
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    else
        return 0;
}
Array.prototype.unique = function () {
    var n = [];
    for (var i = 0; i < this.length; i++) {
        if (n.indexOf(this[i].items[1]) == -1) n.push(this[i].items[1]);
    }
    return n;
}

function clickedGuage() {
    $('.chartHolder').addClass("pushBack");
    $('.gaugeHolder').removeClass("pushBack");
    $(".icon-holder button").removeClass("active");
    $("#guage").addClass("active");

    selection = "gaugeHolder";
    selectionType = "";
}

function clickedLine() {
    $('.chartHolder').removeClass("pushBack");
    $('.gaugeHolder').addClass("pushBack");
    var chart = $('.chartHolder').highcharts();
    chart.inverted = false;
    chart.xAxis[0].update({}, false);
    chart.yAxis[0].update({}, false);
    chart.series[0].update({
        type: 'line'
    });

    $(".icon-holder button").removeClass("active");
    $("#line").addClass("active");
    selection = "chartHolder";
    selectionType = "line";
}

function clickedChart() {
    $('.chartHolder').removeClass("pushBack");
    $('.gaugeHolder').addClass("pushBack");
    var chart = $('.chartHolder').highcharts();
    chart.inverted = false;
    chart.xAxis[0].update({}, false);
    chart.yAxis[0].update({}, false);
    chart.series[0].update({
        type: 'column'
    });

    $(".icon-holder button").removeClass("active");
    $("#bar").addClass("active");
    selection = "chartHolder";
    selectionType = "column";
}

function checkNoData() {
    if (chartValue.series[0].data.length > 0) {
        //alert("data available")
        chartValue.yAxis[0].update({ lineWidth: 1, })
    }
    else {
        chartValue.yAxis[0].update({ lineWidth: 0, })
    }
}




// 
// #endregion Drawing Code
//////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////
// #region Marking Code
//

//
// This method receives the marking mode and marking rectangle coordinates
// on mouse-up when drawing a marking rectangle
//
function markModel(markMode, rectangle) {
    // Implementation of logic to call markIndices or markIndices2 goes here
}

//
// Legacy mark function 2014 HF2
//
function mark(event) {
}

// 
// #endregion Marking Code
//////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////
// #region Resizing Code
//

var resizing = false;

window.onresize = function (event) {
    resizing = true;
    if ($("#js_chart")) {
    }
    resizing = false;
}
