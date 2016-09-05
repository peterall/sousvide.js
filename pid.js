
exports.create = function(getInput, getAverage, setOutput) { 
    var kp = 1, ki = 1, kd = 1;
    var i, lastInput;
    var setpoint = 0;
    var sampletime = 5000;
    var intervalId;
    var lastCycle;
    var outmin = 0, outmax = 1;
    var output = 0;
    
    
    var calculate = function(interval) {
        var input = getInput();
        var avg = getAverage(0), lastAvg = getAverage(-1);
        if(input === undefined) {
            console.log("PID: undefined input, skipping calculation");
            return;
        }
        var error = setpoint - input;
        var d = (kd / interval) * (lastAvg - avg);
        var ti = i + (ki * error * interval);
        
        console.log(
            "PID[ Error: " + error.toFixed(3) + 
            ", P: " + (error * kp).toFixed(3) +
            ", I: " + ti.toFixed(3) +
            ", D:(e: " + (lastAvg - avg).toFixed(3) + ", v:" + d.toFixed(3) + ") ]");
        
        if(isNaN(d))
            d = 0;
        
        output = Math.min(outmax, Math.max(outmin, kp * (error + d + ti)));
        //console.log("OUTPUT: " + output);
        if(output != outmin && output != outmax) {
            i = ti;
        }
        setOutput(output);
        lastInput = input;
    };
    
    var calculate_old = function() {
        var input = getInput();
        if(input === undefined) {
            console.log("PID: undefined input, skipping calculation");
            return;
        }
        var error = setpoint - input;
        i = i + (ki * (sampletime / 1000)) * error;
        console.log("PID: i=" + i.toFixed(2) + " ki=" + ki.toFixed(3) + " error=" + error);
        var p = kp * error, 
            d = (kd / (sampletime / 1000)) * (input - lastInput);
            
        console.log("PID: in=" + input.toFixed(2) + " out=" + output.toFixed(3));
        console.log("PID: P=" + p.toFixed(3) + " I=" + i.toFixed(3) + " D=" + d.toFixed(3));  
        
        // clamp it
        i = Math.min(outmax, Math.max(outmin, i));
        output = Math.min(outmax, Math.max(outmin, p + i - d));
        setOutput(output);
        lastInput = input;
    };

    return {
        setTunings : function(tunings) {
            kp = tunings.kp;
            ki = tunings.ki;
            kd = tunings.kd;
        },
        getTunings : function() { 
            return { kp: kp, ki: ki, kd: kd};
        },
        setLimits : function(min, max) {
            if(min >= 0 && max <= 1 && max > min) {
                outmin = min;
                outmax = max;
            }
        },
        getLimits : function() {
            return { min: outmin, max: outmax };
        },
        setSetpoint : function(sp) {
            if(sp >= 0 && sp <= 100) {
                setpoint = sp;
            }
        },
        getSetpoint : function() {
            return setpoint; 
        },
        getOutput : function() {
            return output; 
        },
        
        start : function() {
            if(intervalId === undefined) {
                lastCycle = Date.now();
                i = 0;
                lastInput = getInput();
                intervalId = setInterval(function() {
                    var now = Date.now();
                    if(lastInput === undefined) {
                        lastInput = getInput();
                        console.log("PID: input undefined, waiting for start sample");
                    }
                    else if(lastCycle !== undefined) {
                        calculate((now - lastCycle) / 1000);
                    }
                    lastCycle = now;
                }, sampletime);
            }
        },
        stop : function() {
            if(intervalId !== undefined) {
                clearInterval(intervalId);
                intervalId = undefined;
                i = output = 0;
                setOutput(0);
            }
        },
        isStarted : function () {
            return intervalId !== undefined;
        }
    };
};