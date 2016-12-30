/*
Copyright (c) 2016 TIBCO Software Inc

THIS SOFTWARE IS PROVIDED BY TIBCO SOFTWARE INC. ''AS IS'' AND ANY EXPRESS OR
IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT
SHALL TIBCO SOFTWARE BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)
HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

//////////////////////////////////////////////////////////////////////////////
// #region Drawing Code
//

var gauges = [];
$(document).ready(function () {
    var chartObj = $("#js_chart");
    chartObj.on('click', '.wrapper', function () {
        var objId = $(this).attr('id');
        var ind = objId.split('wrapper');
        if (parseInt(ind[1]) == 0) {
            index = 0;
            indexVal = 1;
        }
        else {
            index = parseInt(ind[1]) + parseInt(ind[1]);
            indexVal = index + 1;
        }
        var act = 'Sum([' + categoryArray[index] + '])'
        var tar = 'Sum([' + categoryArray[indexVal] + '])'
        if ($(this).hasClass("selected")) {
            $(this).removeClass('selected');
            runScript("DynamicProductionCategory", [{ "Key": "actualValue", "Value": act }, { "Key": "targetValue", "Value": tar }, { "Key": "isDelete", "Value": 1 }]);
        } else {
            //$('.wrapper').removeClass('selected');
            $(this).addClass('selected');
            runScript("DynamicProductionCategory", [{ "Key": "actualValue", "Value": act }, { "Key": "targetValue", "Value": tar }, { "Key": "isDelete", "Value": 0 }, { "Key": "individualScale", "Value": 1 }]);
        }
    });

});

function dictSize(obj) {
    var size = 0,
	key;
    for (key in obj) {
        if (obj.hasOwnProperty(key))
            size++;
    }
    return size;
}

function createGauge(name, label, size, min, max, actualdata) {
    var config = {
        size: size,
        label: label,
        min: undefined != min ? min : 0,
        max: undefined != max ? max : 100,
        minorTicks: 5
    }

    var range = config.max - config.min;
    config.greenZones = [{
        from: config.min,
        to: actualdata
    }
    ];
    config.yellowZones = [{
        from: actualdata,
        to: config.min + range * 0.9
    }
    ];
    config.redZones = [{
        from: config.min + range * 0.9,
        to: config.max
    }
    ];

    gauges[name] = new Gauge(name, config);
    gauges[name].render();
}

function updateGauges() {
    for (var key in gauges) {
        var value = getRandomValue(gauges[key])
        gauges[key].redraw(value);
    }
}

//
// Main Drawing Method
//
var categoryArray = [];
var titleArray = [];
var columns;
function renderCore(sfdata) {

    if (resizing) {
        return;
    }

    // Extract the columns
    columns = sfdata.columns;

    // Extract the data array section
    var chartdata = sfdata.data;
    var actualData = [];
    var targetData = [];
    for (var j = 0; j < chartdata[0].items.length; j++) {
        if (j % 2 == 0) {
            actualData.push(chartdata[0].items[j]);
        } else {
            targetData.push(chartdata[0].items[j]);
        }
    }

    // Extract the config params section
    var config = sfdata.config;
    categoryArray = config.category;
    titleArray = config.title;
    var gaugesize = undefined != config.gaugesize ? config.gaugesize : 350;

    var idx;

    var chartObj = $("#js_chart");

    for (var i = 0; i < config.noOfGauges; i++) {
        var wrapperObj = 'wrapper' + i;
        if ($('#' + wrapperObj, chartObj).length == 0) {
            $(chartObj).append("<div id=" + wrapperObj + " class='wrapper' />");
            $('#' + wrapperObj, chartObj).height(160);


        }
        var gaugeTitle = config.title[i];
        var gaugeParam = config.category[i];
        var scriptName = config.Script;
        createCustomGauge(wrapperObj, actualData[i], targetData[i], gaugeTitle, gaugeParam, scriptName)

    }
    $(".highcharts-container ", chartObj).after("<div class='overlay'/>");
    // wait ( sfdata.wait, sfdata.static );
}

function createCustomGauge(renderObject, actualValue, targetValue, gaugeTitle, gaugeParam, scriptName) {
    //var chartVal=new Highcharts.Chart({
    var options = {
        chart: {
            renderTo: renderObject,
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
						[0, '#407aaa'],
						[1, '#04142d']
			        ]
			    },
			    borderColor: '#494b4c',
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
            min: 0,
            title: {
                text: ''
            },
            max: 100,
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
                rotation: 0,
                style: {
                    color: '#fff',

                    fontSize: '13px',
                    fontWeight: 'normal'
                }
            },
            endOnTick: true,
            plotBands: [{
                from: 0,
                to: targetValue,
                thickness: '17%',
                color: '#b1bdcd' // green
            }, {
                from: targetValue,
                to: 100,
                thickness: '17%',
                color: '#5b7290' // red
            },
            ]
        }
        ],

        series: [{

            name: 'Actual',
            data: [0],
            dataLabels: {
                formatter: function () {
                    var kmh = this.y;
                    return '<span style="color:#bed730;font-size:11px; font-weight:normal;stroke:none;z-index:10000;">' + kmh + '/' + targetValue + '</span>';
                },
                y: 12,
                zIndex: 10,

            },
            tooltip: {
                valueSuffix: '<br></br>  Target:' + targetValue,
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
    chartVal = new Highcharts.Chart(options);
    setInterval(chartFunction(chartVal, actualValue), 500);

}
var chartFunction = function (chartVal, actualValue) {
    var point = chartVal.series[0].points[0],
	newVal,
	inc = actualValue;

    newVal = inc;
    if (newVal < 0 || newVal > 100) {
        newVal = actualValue;
    }

    point.update(newVal);
}

function markModel(markMode, rectangle) { }



var resizing = false;

window.onresize = function (event) {
    // No resizing logic for now
    resizing = true;
    if ($("#js_chart")) { }
    resizing = false;
}

//
// #endregion Resizing Code
//////////////////////////////////////////////////////////////////////////////

