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

//
// Main Drawing Method
//
var chartVal;
var colName;
var configData;
function renderCore(sfdata) {

    if (resizing) {
        return;
    }

    configData = sfdata.config;
    var actualData = sfdata.data;
    colName = sfdata.columns[2];
    var series = {};
    data = [];
    targetData = [];
    assetArray = [];
    indexdata = [];
    indicesarray = [];
    indicesarrayobject = [];
    markedAssets = [];

    var DateValue = new Date(sfdata.config.DateFilter);
    var DateValueFormatted = DateValue.valueOf();
    var nextDate = new Date(sfdata.config.DateFilter);
    var numberOfDaysToAdd = 1;
    nextDate.setDate(nextDate.getDate() + numberOfDaysToAdd);
    var nextDateValueFormatted = nextDate.valueOf();
    //   log("NextDate - " + nextDate);
    var actualData = sfdata.data;

    //   log("actualDataBefore" + actualData.length);
    actualData = actualData.filter(function (el) {
        DateValue = new Date(sfdata.config.DateFilter);
        DateValueFormatted = DateValue.valueOf();
        var formatedDate = new Date(el.items[4].replace("/Date(", "").replace(")/", "").valueOf()).valueOf();
        if (formatedDate.toString() === DateValueFormatted.toString()) {

            return (el);
        }

    });

    //  log("actualDataAfter" + actualData.length);

    for (i = 0; i < actualData.length; i++) {
        if (sfdata.config.FilteredCategory != undefined && sfdata.config.FilteredCategory != "") {
            if (sfdata.config.FilteredCategory == actualData[i].items[0]) {
                assetArray.push([actualData[i].items[1]]);
                data.push(actualData[i].items[2]);

                indexdata.push(actualData[i].hints.index);
                indicesobject = {};
                indicesobject.index = actualData[i].hints.index;
                indicesobject.Asset = actualData[i].items[1];
                indicesobject.marked = actualData[i].hints.marked != undefined ? actualData[i].hints.marked : false;
                indicesarrayobject.push(indicesobject);
                targetData.push(actualData[i].items[3]);
                if (actualData[i].hints.marked != undefined && actualData[i].hints.marked) {
                    markedAssets.push(actualData[i].items[1]);
                }
                //log("Hints Marked:" + actualData[i].hints.marked);
                //log("Hints Marked object:" + indicesarrayobject[i].marked);
                //data.push(actualData[i].hints.index);
                //data.push ( actualData[i].hints.marked ? true : false );
            }
        }
        else {
            //log(actualData[i].hints.marked);
            if (actualData[i].hints.marked != undefined && actualData[i].hints.marked) {
                markedAssets.push(actualData[i].items[1]);
            }

            indexdata.push(actualData[i].hints.index);
            assetArray.push([actualData[i].items[1]]);
            data.push(actualData[i].items[2]);
            targetData.push(actualData[i].items[3]);
        }
    }
    series =

        [{
            name: 'Actual',
            data: data,
            pointPadding: 0,
            pointPlacement: 0,
            pointWidth: 30,
            point: {
                events: {
                    click: function ()
                        //{
                        //  runScript("OS1-Gauge");
                        //}
                    {
                        /*for (var i = 0; i < this.series.data.length; i++) {
                            if (this.series != chartVal.series[0])
                            {
                            if (chartVal.series[1].data[i].y >= chartVal.series[0].data[i].y) {
                                chartVal.series[0].data[i].update({ color: 'rgba(31, 174, 57, 0.3)', borderColor: '#fff' });
                            } else {
                                chartVal.series[0].data[i].update({ color: 'rgba(234, 52, 16,0.3)', borderColor: '#fff' });
                            }
                        }
                            //this.series.data[i].update({ color: 'rgba(38,162,237,.3)' }, true, false);
                        }
                        this.update({ color: 'rgba(31, 174, 57, 0.3)' }, true, false);*/
                        //log("selected bar" + this.index);
                        for (var j = 0; j < assetArray.length; j++) {
                            //log("assetArray" + assetArray[j]);
                            if (assetArray[j] == this.category) {
                                //log(indexdata[j]);
                                indicesarray.push(indexdata[j]);
                                //log("index"+ indicesarray.length);
                            }
                        }
                        var markData = {};

                        markData.markMode = "Replace";
                        markData.indexSet = indicesarray;
                        //if ( typeof(JSViz) != 'undefined' )
                        //{
                        markIndices(markData);
                        //} 

                    }


                }
            }

        }, {
            name: 'Target',
            type: 'scatter',
            pointWidth: 50,

            point: {
                events: {
                    click: function ()
                        //{
                        //  runScript("OS1-Gauge");
                        //}
                    {
                        for (var i = 0; i < this.series.data.length; i++) {
                            //this.series.data[i].update({ color: '#294251' }, true, false);
                        }
                        //this.update({ color: '#26a2ed' }, true, false)
                    }


                }
            },

            data: targetData,
            pointPadding: 0,
            pointPlacement: 0
        }];
    var chartObj = $("#js_chart");

    if ($('#wrapper', chartObj).length == 0) {
        $(chartObj).wrapInner("<div id='wrapper'/>");
        $('#wrapper', chartObj).height(220);
    }

    Highcharts.Renderer.prototype.symbols.line = function (x, y, width, height) {
        return ['M', x, y + width / 2, 'L', x + height, y + width / 2];
    };

    var options = {
        credits: {
            enabled: false
        },
        chart: {
            renderTo: 'js_chart',
            type: 'column',
            backgroundColor: 'transparent',
            borderColor: 'transparent',
            events: {
                click: function (event) {

                    for (var i = 0; i < this.series[0].data.length; i++) {
                        if (this.series[1].data[i].y >= this.series[0].data[i].y) {
                            this.series[0].data[i].update({ color: 'rgba(31, 174, 57,1)' });
                        } else {
                            this.series[0].data[i].update({ color: 'rgba(234, 52, 16, 1)' });
                        }
                        //this.series[0].data[i].update({ color: '#26a2ed' }, true, false);
                    }

                    var markData = {};
                    markData.markMode = "Replace";
                    markData.indexSet = indexdata;
                    ////log("indexdata array length:" + indexdata.length);
                    //log("markData array length:" + indexdata.length);
                    //if ( typeof(JSViz) != 'undefined' )
                    // {

                    markIndices(markData);
                    //} 
                }
            }
        },
        title: {
            text: '',
            color: '#fff',
            style: { color: '#ccc', fontSize: '13px', fontFamily: 'arial' },
        },
        xAxis: {
            tickLength: 0,
            lineColor: '#ccc',
            lineWidth: 0,
            categories: assetArray,
            labels:

			{

			    style: {
			        color: '#fff'
			    }
			}
        },
        yAxis: [{
            min: 0,
            title: {
                text: configData.XAxisTitle,
                style: { color: '#ccc', fontSize: '13px', fontFamily: 'arial' },
            },
            labels:

			{

			    style: {
			        color: '#fff'
			    }
			}, gridLineColor: 'rgba(255,255,255,.3)'
        }],
        legend: {
            shadow: false,
            enabled: false,
        },
        exporting: { enabled: false },
        tooltip: {
            //shared: true
            formatter: function () {
                debugger;
                return this.series.name + ": <strong>" + Highcharts.numberFormat(this.y, 2) + "</strong><br></br> Field: <strong>" + this.x + "</strong>"
                ;
            }
        },
        plotOptions: {

            column: {
                color: {
                    linearGradient: [500, 0, 500, 0],
                    stops: [
                        [0, '#25acff'],
                                      [0.5, '#fff'],
                                    [1, '#25acff']
                    ]
                },
                grouping: false,
                shadow: false,
                borderWidth: 1,
                borderColor: 'transparent'

            }, scatter: {
                marker: {
                    symbol: 'line',
                    lineWidth: 6,
                    radius: 16,
                    lineColor: '#fcff01',

                }
            },
            series: {
                cursor: 'pointer',
                events: {
                    click: function (e) {
                        var asset = e.point.category;
                        //if (asset != undefined && asset != "")                            
                        //        asset = asset;                            
                        //else
                        //    asset = "SA";
                        //runScript("CustomFieldMarking", [{ "Key": "Asset", "Value": asset.toString() }]);
                    }
                }
            }
        },
        series: series
    }
    chartVal = new Highcharts.Chart(options);
    //wait(sfdata.wait, sfdata.static);

    for (i = 0; i < chartVal.series[0].data.length; i++) {
        if (this.chartVal.series[1].data[i].y >= this.chartVal.series[0].data[i].y) {
            this.chartVal.series[0].data[i].update({ color: 'rgba(31, 174, 57,1)' });
        } else {
            this.chartVal.series[0].data[i].update({ color: 'rgba(234, 52, 16, 1)' });
        }
    }
    //log("markedAssets" + markedAssets.length);
    if (markedAssets.length > 0) {

        for (i = 0; i < chartVal.series[0].data.length; i++) {
            //var found = $.inArray(chartVal.series[0].data[i].category, markedAssets) > -1;
            //log("found" +found);
            var marked = false;
            for (j = 0; j < markedAssets.length; j++) {

                if (chartVal.series[0].data[i].category == markedAssets[j]) {
                    //log("markedAssets" + markedAssets[j]);
                    //this.chartVal.series[i].data[0].update({ color: 'red' });

                    marked = true;
                    if (this.chartVal.series[1].data[i].y >= this.chartVal.series[0].data[i].y) {
                        this.chartVal.series[0].data[i].update({ color: 'rgba(31, 174, 57, 1)', borderColor: '#fff' });
                    } else {
                        this.chartVal.series[0].data[i].update({ color: 'rgba(234, 52, 16,1)', borderColor: '#fff' });
                    }
                    debugger;
                }


                else if (!marked) {
                    debugger;

                    if (this.chartVal.series[1].data[i].y >= this.chartVal.series[0].data[i].y) {
                        this.chartVal.series[0].data[i].update({ color: 'rgba(31, 174, 57, 0.3)' });
                    } else {
                        this.chartVal.series[0].data[i].update({ color: 'rgba(234, 52, 16, 0.3)' });
                    }
                    //this.chartVal.series[0].data[i].update({ color: '#294251' });
                }
            }
        }
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



}

// 
// #endregion Marking Code
//////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////
// #region Resizing Code
//

var resizing = false;

window.onresize = function (event) {
    // No resizing logic for now
    resizing = true;
    if ($("#js_chart")) {
    }
    resizing = false;
}

// 
// #endregion Resizing Code
//////////////////////////////////////////////////////////////////////////////



