var gpio = require("pi-gpio");

var relay = 13;
gpio.close(relay);
gpio.open(relay, "output", function(err) {
    if(err) { console.log("Error opening PI GPIO: " + err); }
});

gpio.write(relay, 0);

var interval = 5000;

exports.startCycle = function(dutyCycle) {
    var millis = Math.round((interval * dutyCycle) / 50) * 50;
    //console.log("Relay interval: " + millis + "/1000 ms");
    if(millis > 0) {
        gpio.write(relay, 1);
        if(millis < interval) {
            setTimeout(function() {
                gpio.write(relay, 0);
            }, millis);
        }
    }
    else {
        gpio.write(relay, 0);
    }
};


/*
var bone = require('bonescript');

var indicatorPin = "USR3", relayPin = "P8_3";

bone.pinMode(indicatorPin, bone.OUTPUT);
bone.pinMode(relayPin, bone.OUTPUT);
bone.digitalWrite(indicatorPin, bone.LOW);
bone.digitalWrite(relayPin, bone.LOW);

var interval = 5000;
//var cycle = 0;

exports.startCycle = function(dutyCycle) {
    var millis = Math.round((interval * dutyCycle) / 10) * 10;
    //console.log("Relay interval: " + millis + "/1000 ms");
    if(millis > 0) {
        bone.digitalWrite(indicatorPin, bone.HIGH);
        bone.digitalWrite(relayPin, bone.HIGH);
        if(millis < interval) {
            setTimeout(function() {
                bone.digitalWrite(indicatorPin, bone.LOW);
                bone.digitalWrite(relayPin, bone.LOW);
            }, millis);
        }
    }
    else {
        bone.digitalWrite(indicatorPin, bone.LOW);
        bone.digitalWrite(relayPin, bone.LOW);
    }
};
*/