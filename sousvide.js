var temp = require("./temperature.js"),
    pid = require("./pid.js"),
    heater = require("./heater.js");


exports.create = function() { 
    temp.startMeasurements();
    
    var control = pid.create(function() { 
        return temp.getTemperature(0, 5); 
    }, function(history) {
        return temp.getTemperature(0, 60, -(60*history));
    },function(output) {
        heater.startCycle(output);
    });
    
    //control.setTunings(0.05, 0.0001, 0.5);
    //control.setTunings(0.005, 0.01, 0.005); // to fast attack
    //control.setTunings(0.005, 0.1, 0.005); // better shite?
    //control.setTunings(0.025, 0.1, 0.005); // good shite?
    // 0.05, 0.05, 1 (overshoot)
    // 0.1, 0.2, 0.05 (not reactive)
    // 
    control.setLimits(0.0, 1);
    
    return {
        getWaterTemp : function(average, offset) {
            return temp.getTemperature(0, average, offset);
        },
        settings : function(s) {
            if(s) {
                console.log("Settings: " + JSON.stringify(s));
                if(s.setpoint) control.setSetpoint(s.setpoint);
                if(s.tunings) control.setTunings(s.tunings);
                if(s.limits) control.setLimits(s.limits);
            }
        },
        getDutyCycle : control.getOutput,
        setTemperature : control.setSetpoint,
        getTargetTemperature : control.getSetpoint,
        getLimits : control.getLimits,
        setLimits : control.setLimits,
        getTunings : control.getTunings,
        setTunings : control.setTunings,
        start : function() {
            control.start(); 
            console.log("Sousvide: Started");
        },
        stop : function() {
            control.stop();
            console.log("Sousvide: Stopped");
        },
        isStarted : function() {
            return control.isStarted();
        }
    };
};




