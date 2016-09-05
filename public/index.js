
var createGraph = function() {
    var graph = new Rickshaw.Graph( { 
        element: document.querySelector('#chart'),
        renderer: 'line',
        interpolation: 'linear',
        max : 80.0,
        height: 300,
        series: [ {
            name: 'Targt',
            key: "setpoint",
            color: '#D0D0D0',
            data: [{x:0,y:0}]
        },{
            name: 'Duty Cycle',
            key: "dutycycle",
            color: 'red',
            data: [{x:0,y:0}]
        },{
            name: 'Water Temperature',
            key: "watertemp",
            color: '#6CCED9',
            data: [{x:0,y:0}]
        }]
    });
    var x_axis = new Rickshaw.Graph.Axis.Time({
        graph: graph,
        ticksTreatment: 'glow'
    });
    var y_axis = new Rickshaw.Graph.Axis.Y({
        graph: graph,
        tickFormat: Rickshaw.Fixtures.Number.formatKMBT,
        ticksTreatment: 'glow'
    });
    var hoverDetail = new Rickshaw.Graph.HoverDetail({
        graph: graph
    });
    return graph;
};


$(function() {
    var graph = createGraph();
    var updateGraph = function() {
        $.getJSON('/graph', function(series) {
            graph.series.forEach(function(gs) {
               series.forEach(function(s) {
                   if(gs.key == s.key)
                        gs.data = s.data;
               });
            });
            graph.render();
        });
    };

    updateGraph();
    setInterval(updateGraph, 10000);

    var updateStatus = function(first) {
        $.getJSON('/status', function(status) {
            $("#temp").html(status.watertemp.toFixed(2));
            $("#target").html(status.target);
            $("#dutycycle").html(Math.floor(status.dutycycle*100));
            if(first) {
                $("input[name=t]").val(status.target);
                $("input[name=p]").val(status.tunings.kp);
                $("input[name=i]").val(status.tunings.ki);
                $("input[name=d]").val(status.tunings.kd);
                $("input[name=min]").val(status.limits.min);
                $("input[name=max]").val(status.limits.max);
            } 
        });
    };
    updateStatus(true);
    setInterval(function() { updateStatus(false); }, 1000);
    
    $("#start").button().click(function() {
        $.post("/status", { status: "started" });
    });
    
    $("#stop").button().click(function() {
        $.post("/status", { status: "stopped" });
    });
    
    $("#update").button().click(function() {
        $.post("/settings", $("#tunings").serialize(), function() { updateStatus(true); });
    });
    
    $("#clear").button().click(function() {
        $.post("/clearGraph", {}, updateGraph);
    });
    
});