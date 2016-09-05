var express = require("express"),
    stylus = require("stylus"),
    nib = require("nib"),
    redis = require("redis"),
    sousvide = require("./sousvide.js");


var client = redis.createClient();
client.on("error", function(err) { console.log("Redis error: " + err); });

var sousvide = sousvide.create();
client.get("settings", function(err,s) {
    if(s) sousvide.settings(JSON.parse(s));
});

var app = express();
function compile(str, path) {
  return stylus(str)
    .set("filename", path)
    .use(nib());
}
app.set("views", __dirname + "/views");
app.set("view engine", "jade");
//app.use(express.logger("dev"));
app.use(express.bodyParser());
app.use(stylus.middleware({ src: __dirname + "/public", compile: compile }));
app.use(express.static(__dirname + "/public"));

app.get("/", function(req, res) {
    res.render("index", { temp: sousvide.getWaterTemp() });
});
app.get("/graph", function(req, res) {
    var hours = 2;
    client.lrange("temps", -(hours * 60 * 6), -1, function(err,temps) {
        var data = temps
            .map(function(j) {
                var s = JSON.parse(j);
                return [
                    { x: s.time, y: s.watertemp },
                    { x: s.time, y: s.dutycycle*100},
                    { x: s.time, y: s.setpoint }
                    ]; 
                })
            .filter(function(s) { return s[0].y !== undefined; });
            
        res.json([ { 
            key: "watertemp",
            data: data.map(function(s) { return s[0]; }) 
        },{
            key: "dutycycle",
            data: data.map(function(s) { return s[1]; })
        },{
            key: "setpoint",
            data: data.map(function(s) { return s[2]; })
        }]
        );  
    });
});
setInterval(function() {
    var log = {
            time: Math.floor(Date.now()/1000), 
            watertemp: sousvide.getWaterTemp(10),
            setpoint: sousvide.isStarted() ? sousvide.getTargetTemperature() : 0.0,
            dutycycle: sousvide.getDutyCycle()
        };
    if(log.watertemp !== undefined) {
        client.rpush("temps", JSON.stringify(log));
    }
}, 10000);

app.post("/clearGraph", function(req, res) {
    console.log("Clear graph");
    client.del("temps");
    res.json({});
});
app.get("/status", function(req, res) {
    res.json({
        status: sousvide.isStarted() ? "started" : "stopped",
        watertemp: sousvide.getWaterTemp(),
        target: sousvide.getTargetTemperature(),
        dutycycle: sousvide.getDutyCycle(),
        tunings: sousvide.getTunings(),
        limits: sousvide.getLimits()
    });
});
app.post("/status", function(req, res) {
    switch(req.body.status) {
        case "started":
            sousvide.start();
            break;
        case "stopped":
            sousvide.stop();
            break;
    }
    res.json({});
});
app.get("/settings", function(req, res) {
    res.json({ });
});
app.post("/settings", function(req, res) {
    console.log(req.body);
    var s = {
        setpoint : parseFloat(req.body.t),
        limits : {
            min: parseFloat(req.body.min), 
            max: parseFloat(req.body.max)
        },
        tunings : {
            kp: parseFloat(req.body.p), 
            ki: parseFloat(req.body.i), 
            kd: parseFloat(req.body.d)
        }
    };
    sousvide.settings(s);
    client.set("settings", JSON.stringify(s));
    res.json(s);
});


app.listen(80);
console.log("App started");
