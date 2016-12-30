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


//
// Placeholder for XmlHttp.post error handling function
//
function errorHandler(status, message)
{
	// Do nothing
}


//////////////////////////////////////////////////////////////////////////////
// #region Helper Functions
//

//
// Wait for rendering to settle before export (7.5 only)
//
var waiter;
var accumulatedWait = 0; // ms
var interval = 250;      // ms

function wait(waitTime, isStatic) // seconds
{
    if (!isStatic || waitTime <= 0 || JSViz.version.major < 3)
    {
        return;
    }

    accumulatedWait = 0; // Reset accumulated wait for each invocation of renderCore
    
    function timer() {
        Spotfire.read("wait", function (retval) {return;}); // Ping the server;
        accumulatedWait = accumulatedWait + interval;
        if (accumulatedWait >= (waitTime * 1000))
        {
            window.clearInterval(waiter); // We have waited long enough.
        }
    }

    waiter = setInterval(timer, interval);
}


//
// Log a message.
//
function log (message){
    if (typeof(JSViz) != 'undefined' && JSViz.version.major > 2){
        // Spotfire 7.5:
        Spotfire.modify("log", message);
    }
    else if (proClient && window && window.Spotfire){
        // Spotfire 6/7 Professional:
        window.Spotfire.Log(message);
    }
    else if (window.console){
        // Spotfire 6/7 Web Player:
        console.log(message); 
    }
}

//
// Mark a  set of indices.
//
function markIndices (markData)
{
    var markDataJSON = JSON.stringify(markData);

    if (typeof(JSViz) != 'undefined' && JSViz.version.major > 2){
        // Spotfire 7.5:
        Spotfire.modify("mark", markData);
    }
    else if (proClient && window.Spotfire) {
        // Spotfire 6/7 Professional:
        window.Spotfire.MarkIndices(markDataJSON);
    }
    // Post to server if we are WP
    else {
        // Spotfire 6/7 Web Player:
        var markRequest = { "mark": "mark", "MarkData": markDataJSON }
        XmlHttp.post(window.location.href, markRequest, CustomVisualization.update, errorHandler);
    }
}

//
// Mark a  set of indices.
//
function markIndices2 (markData)
{
    var markDataJSON = JSON.stringify(markData);

    if (typeof(JSViz) != 'undefined' && JSViz.version.major > 2){
        // Spotfire 7.5:
        Spotfire.modify("mark2", markData);
    }
    else if (proClient && window.Spotfire) {
        // Spotfire 6/7 Professional:
        window.Spotfire.MarkIndices2(markDataJSON);
    }
    // Post to server if we are WP
    else {
        // Spotfire 6/7 Web Player:
        var markRequest = { "mark2": "mark2", "MarkData": markDataJSON }
        XmlHttp.post(window.location.href, markRequest, CustomVisualization.update, errorHandler);
    }
}

//
// Set the configuration parameters
//
function setConfig(configObject) {
    var configJSON = JSON.stringify(configObject);

    if (typeof(JSViz) != 'undefined' && JSViz.version.major > 2){
        // Spotfire 7.5:
        Spotfire.modify("config", configObject);
    }
    else if (proClient && window.Spotfire) {
        // Spotfire 6/7 Professional:
        window.Spotfire.SetConfiguration(configJSON);
    }
    else {
        // Spotfire 6/7 Web Player:
        values = { "config": configJSON };
        XmlHttp.post(window.location.href, values, CustomVisualization.update, errorHandler);
    }
}

//
// Set a Spotfire Document Property
//
function setDocumentProperty(name, value) {
    var DocumentPropertyInfo = { "PropertyName": name, "PropertyValue": value };
    var dpiJson = JSON.stringify ( DocumentPropertyInfo );
 
    if (typeof(JSViz) != 'undefined' && JSViz.version.major > 2){
        // Spotfire 7.5:
        Spotfire.modify("documentproperty", DocumentPropertyInfo);
    }
    else if (proClient && window.Spotfire) {
        // Spotfire 6/7 Professional:
        window.Spotfire.SetDocumentProperty ( dpiJson );
    }
    else {
        // Spotfire 6/7 Web Player:
        var values = { "documentproperty": "documentproperty", 
                       "DocumentPropertyInfo": dpiJson };
        XmlHttp.post ( window.location.href, values, CustomVisualization.update,errorHandler );
    }
}

//
// Set a visualizations runtime state
//
function setRuntimeState(stateObject) {
    var stateJSON = JSON.stringify(stateObject);

    if (typeof(JSViz) != 'undefined' && JSViz.version.major > 2){
        // Spotfire 7.5:
        Spotfire.modify("runtime", stateObject);
    }
    else if (proClient && window.Spotfire) {
        // Spotfire 6/7 Professional:
        window.Spotfire.SetRuntimeState(stateJSON);
    }
    else {
        // Spotfire 6/7 Web Player:
        values = { "runtime": stateJSON };
        XmlHttp.post(window.location.href, values, CustomVisualization.update, errorHandler);
    }
}

//
// Run a named script with the specifed arguments
//
function runScript(name, args) {
    var ScriptExecutionInfo = { "ScriptName": name, "Arguments": args};
    var seiJson = JSON.stringify(ScriptExecutionInfo);

    if (typeof(JSViz) != 'undefined' && JSViz.version.major > 2){
        // Spotfire 7.5:
        Spotfire.modify("script", ScriptExecutionInfo);
    }
    else if (proClient && window.Spotfire){
        // Spotfire 6/7 Professional:
        window.Spotfire.RunScript(seiJson);
    }
    else {
        // Spotfire 6/7 Web Player:
        values = { "script": "script", "ScriptExecutionInfo": seiJson};
        XmlHttp.post(window.location.href, values, CustomVisualization.update, errorHandler);
    }
}

//
// #endregion Helper Functions
//////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////
// #region Spotfire 6.5 and 7.0
//

var fetchedFirstPlotData = false;

function OnNodeInserted() {
    if (jQuery("#js_chart")) {
        if (!fetchedFirstPlotData) {
            initMarking();
            fetchedFirstPlotData = true;
            getPlotData();
        }
    }
}

//
// Start rendering when #js_chart div gets inserted
//
document.addEventListener('DOMNodeInserted', OnNodeInserted, false);

//
// This is for Spofire 6/7 Pro only, so that data is injected into the renderCore method
//
jQuery('body').on("spotfireready", function () {
    // Register a function to be invoked by Spotfire when the marking
    // in the table configured for the visualisation changes.
    initMarking();
    Spotfire.registerSelectionCallback("renderCore");
});

//
// Parse the text and render the visualization
//
function parseData(data) {
    pData = jQuery.parseJSON(data);
    renderCore(pData);
}

//
// Ask server for JSON.
//
function getPlotData() {
    //
    // This function should only be used for Spotfire 6/7 Web Player
    //
    if (proClient || (typeof(JSViz) != 'undefined' && JSViz.version.major > 2) ) {
        return;
    }

    var values = { data: 'data' }; // just request "data"   
    XmlHttp.post(window.location.href, values, parseData, errorHandler);
}


if (!proClient) {
    //
    // This function should only be used for Spotfire 6/7 Web Player
    //
    if (typeof(JSViz) == 'undefined' || (JSViz.version.major < 3)) {
        //
        // Override the CustomVisualization invalidate function
        //
        // getPlotData will be called when the visualization need to update.
        // Pro-client will inject data straight into parseData(data)
        CustomVisualization.onInvalidated = getPlotData;
    
        jQuery( document ).ready(function() {
            getPlotData(); // Handler for .ready() called.
        });
    }
}

// 
// #endregion Spotfire 6.5 and 7.0
//////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////
// #region Spotfire 7.5
//

//
// This code performs initialization when running under Spotfire 7.5
//

if (typeof(JSViz) != 'undefined' && JSViz.version.major > 2)
{
    //
    // The Spotfire 7,5 JavaScript visualization API generates a "SpotfireLoaded"
    // event when all the required objects are loaded and initialized.
    //
    jQuery(window).on("SpotfireLoaded", function()
    {
        initMarking();
		
        var render = function ()
        {
            Spotfire.read("data", {}, function(data)
            {
                if (data)
                {
                    renderCore(JSON.parse(data));
                }
            });
        };

        Spotfire.addEventHandler("render", render);
        render();
    });
}

// 
// #endregion Spotfire 7.5
//////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////
// #region Marking Code
//

//
// Initiate marking rectangle functionality on body element
//
function initMarking ()
{
	jQuery("body").on("mousedown", function(mouseDownEvent)
	{
		
        var getMarkMode = function(e)
        {
            // shift: add rows
            // control: toggle rows
            // none: replace rows
            if (e.shiftKey)
            {
                return "Add";
            }
            else if (e.ctrlKey)
            {
                return "Toggle";
            }

            return "Replace";
        };

        mouseDownEvent.preventDefault();
		
        var markMode = getMarkMode(mouseDownEvent);
        //
        // Create initial marking rectangle, will be used if the user only clicks.
        //
        var x = mouseDownEvent.pageX,
        y = mouseDownEvent.pageY,
        width = 1,
        height = 1;

        var $selection = jQuery("<div/>").css({
            'position': 'absolute',
            'border': '1px solid #0a1530',
            'background-color': '#8daddf',
            'opacity': '0.5'
        }).hide().appendTo(this);

        jQuery(this).on("mousemove", function(mouseMoveEvent)
        {
            x = Math.min(mouseDownEvent.pageX, mouseMoveEvent.pageX);
            y = Math.min(mouseDownEvent.pageY, mouseMoveEvent.pageY);
            width = Math.abs(mouseDownEvent.pageX - mouseMoveEvent.pageX);
            height = Math.abs(mouseDownEvent.pageY - mouseMoveEvent.pageY);

            $selection.css({
                'left': x + 'px',
                'top': y + 'px',
                'width': width + 'px',
                'height': height + 'px'
            });

            $selection.show();
        });

        jQuery(this).on("mouseup", function()
        {
            var rectangle =  {
                'x': x,
                'y': y,
                'width': width,
                'height': height
            };

            markModel(markMode, rectangle);

            $selection.remove();
            jQuery(this).off("mouseup mousemove");
        });
    });
}

// 
// #endregion Marking Code
//////////////////////////////////////////////////////////////////////////////
