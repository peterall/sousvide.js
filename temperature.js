var npi = require("./ext/npi/npi.node");

var adc = new npi.ADC(); 

var nct = [
    {temp: -40, resistance: 230400},
    {temp: -39, resistance: 216900},
    {temp: -38, resistance: 204200},
    {temp: -37, resistance: 192500},
    {temp: -36, resistance: 181400},
    {temp: -35, resistance: 171100},
    {temp: -34, resistance: 161400},
    {temp: -33, resistance: 152400},
    {temp: -32, resistance: 143900},
    {temp: -31, resistance: 136000},
    {temp: -30, resistance: 128500},
    {temp: -29, resistance: 121600},
    {temp: -28, resistance: 115000},
    {temp: -27, resistance: 108800},
    {temp: -26, resistance: 103100},
    {temp: -25, resistance: 97630},
    {temp: -24, resistance: 92510},
    {temp: -23, resistance: 87700},
    {temp: -22, resistance: 83170},
    {temp: -21, resistance: 78910},
    {temp: -20, resistance: 74890},
    {temp: -19, resistance: 71100},
    {temp: -18, resistance: 67530},
    {temp: -17, resistance: 64160},
    {temp: -16, resistance: 60980},
    {temp: -15, resistance: 57980},
    {temp: -14, resistance: 55150},
    {temp: -13, resistance: 52480},
    {temp: -12, resistance: 49950},
    {temp: -11, resistance: 47570},
    {temp: -10, resistance: 45310},
    {temp: -9, resistance: 43180},
    {temp: -8, resistance: 41160},
    {temp: -7, resistance: 39240},
    {temp: -6, resistance: 37430},
    {temp: -5, resistance: 35720},
    {temp: -4, resistance: 34090},
    {temp: -3, resistance: 32550},
    {temp: -2, resistance: 31090},
    {temp: -1, resistance: 29700},
    {temp: 0, resistance: 28380},
    {temp: 1, resistance: 27130},
    {temp: 2, resistance: 25940},
    {temp: 3, resistance: 24810},
    {temp: 4, resistance: 23740},
    {temp: 5, resistance: 22720},
    {temp: 6, resistance: 21750},
    {temp: 7, resistance: 20830},
    {temp: 8, resistance: 19950},
    {temp: 9, resistance: 19120},
    {temp: 10, resistance: 18320},
    {temp: 11, resistance: 17570},
    {temp: 12, resistance: 16840},
    {temp: 13, resistance: 16160},
    {temp: 14, resistance: 15500},
    {temp: 15, resistance: 14880},
    {temp: 16, resistance: 14280},
    {temp: 17, resistance: 13710},
    {temp: 18, resistance: 13170},
    {temp: 19, resistance: 12650},
    {temp: 20, resistance: 12160},
    {temp: 21, resistance: 11690},
    {temp: 22, resistance: 11240},
    {temp: 23, resistance: 10810},
    {temp: 24, resistance: 10390},
    {temp: 25, resistance: 10000},
    {temp: 26, resistance: 9623},
    {temp: 27, resistance: 9263},
    {temp: 28, resistance: 8918},
    {temp: 29, resistance: 8588},
    {temp: 30, resistance: 8272},
    {temp: 31, resistance: 7970},
    {temp: 32, resistance: 7680},
    {temp: 33, resistance: 7402},
    {temp: 34, resistance: 7136},
    {temp: 35, resistance: 6881},
    {temp: 36, resistance: 6636},
    {temp: 37, resistance: 6402},
    {temp: 38, resistance: 6177},
    {temp: 39, resistance: 5961},
    {temp: 40, resistance: 5754},
    {temp: 41, resistance: 5555},
    {temp: 42, resistance: 5365},
    {temp: 43, resistance: 5182},
    {temp: 44, resistance: 5006},
    {temp: 45, resistance: 4837},
    {temp: 46, resistance: 4674},
    {temp: 47, resistance: 4518},
    {temp: 48, resistance: 4368},
    {temp: 49, resistance: 4224},
    {temp: 50, resistance: 4085},
    {temp: 51, resistance: 3952},
    {temp: 52, resistance: 3823},
    {temp: 53, resistance: 3700},
    {temp: 54, resistance: 3581},
    {temp: 55, resistance: 3466},
    {temp: 56, resistance: 3356},
    {temp: 57, resistance: 3250},
    {temp: 58, resistance: 3148},
    {temp: 59, resistance: 3050},
    {temp: 60, resistance: 2955},
    {temp: 61, resistance: 2863},
    {temp: 62, resistance: 2775},
    {temp: 63, resistance: 2691},
    {temp: 64, resistance: 2609},
    {temp: 65, resistance: 2530},
    {temp: 66, resistance: 2454},
    {temp: 67, resistance: 2380},
    {temp: 68, resistance: 2309},
    {temp: 69, resistance: 2241},
    {temp: 70, resistance: 2174},
    {temp: 71, resistance: 2111},
    {temp: 72, resistance: 2049},
    {temp: 73, resistance: 1989},
    {temp: 74, resistance: 1931},
    {temp: 75, resistance: 1876},
    {temp: 76, resistance: 1822},
    {temp: 77, resistance: 1770},
    {temp: 78, resistance: 1720},
    {temp: 79, resistance: 1671},
    {temp: 80, resistance: 1624},
    {temp: 81, resistance: 1578},
    {temp: 82, resistance: 1534},
    {temp: 83, resistance: 1491},
    {temp: 84, resistance: 1450},
    {temp: 85, resistance: 1410},
    {temp: 86, resistance: 1372},
    {temp: 87, resistance: 1334},
    {temp: 88, resistance: 1298},
    {temp: 89, resistance: 1263},
    {temp: 90, resistance: 1229},
    {temp: 91, resistance: 1196},
    {temp: 92, resistance: 1165},
    {temp: 93, resistance: 1134},
    {temp: 94, resistance: 1104},
    {temp: 95, resistance: 1075},
    {temp: 96, resistance: 1047},
    {temp: 97, resistance: 1020},
    {temp: 98, resistance: 993.4},
    {temp: 99, resistance: 967.8},
    {temp: 100, resistance: 942.8},
    {temp: 101, resistance: 918.4},
    {temp: 102, resistance: 894.8},
    {temp: 103, resistance: 871.9},
    {temp: 104, resistance: 849.6},
    {temp: 105, resistance: 828},
    {temp: 106, resistance: 807.1},
    {temp: 107, resistance: 786.7},
    {temp: 108, resistance: 767},
    {temp: 109, resistance: 747.8},
    {temp: 110, resistance: 729.2}
];
/*
calibration = [ [
    { m: 24.4, a: 24.2 },
    { m: 44.9, a: 45.5 },
    { m: 49.8, a: 50.1 },
    { m: 55.0, a: 55.4 },
    { m: 60.1, a: 61.0 } ]];
*/
calibration = [ [
    { m: 45.0, a: 45.0 },
    { m: 50.0, a: 50.0 },
    { m: 55.0, a: 55.0 },
    { m: 60.0, a: 60.0 } ]];

var tempHistory = [[]];
var historyLength = 60*10;
var intervalId;
var sampleInterval = 1000;

exports.startMeasurements = function() {
    if(intervalId === undefined) {
        intervalId = setInterval(function() {
            console.time("ADC");
            readAdc(0, function(temp) {
                tempHistory[0].push(temp);
                if(tempHistory[0].length > historyLength)
                    tempHistory[0].shift();
            });
        }, sampleInterval);
    }
};

exports.stopMeasurements = function() { 
    if(intervalId !== undefined)
        clearInterval(intervalId);
};

exports.isStarted = function() {
    return intervalId !== undefined;
};

exports.getTemperature = function(sensor, count, offset) {
    if(count === undefined) {
        count = 1;
    }
    if(offset === undefined) {
        offset = 0;
    }
        
    var h = tempHistory[sensor], t = 0;
    if(h.length === 0) {
        return undefined;
    }
    var first = h.length-1-offset;
    var i = first
    var last = first-count;

    for (;i>=last;i--) {
        if(h[i] === undefined)
            break;
            
        t += h[i];
    }
    //console.log("Temp query: f=" + first + ",i=" + i + ",last=" + last);
    return Math.floor((t/(first-i))*100) / 100;
};

var adjust = function(sensor, temp) {
    var c = calibration[sensor];
    var p = function(ca) { return ca.a/ca.m; };
    
    var min = 0, max = c.length;
    if(temp <= c[min].m) {
        return temp * p(c[min]);
    } else if(temp >= c[max-1].m) {
        return temp * p(c[max-1]);
    } else {
        for(var i=min+1;i<max;i++)
            if(c[i-1].m <= temp && c[i].m >= temp) break;
        
        var pct = (temp - c[i-1].m) / (c[i].m - c[i-1].m);
        //console.log("pct: " + pct);
        return c[i-1].a + ((c[i].a - c[i-1].a) * pct);
    }     
}

var readAdc = function(sensor, cb) {
    adc.read(sensor, 256, function(value) {
        //console.log("sensor: " + value.toFixed(4));
        //console.timeEnd("ADC");
        var resistance = (10000*value)/(1-value); 
        //console.log("sensor: " + value.toFixed(3) + 
        //    ", resistance: " + resistance.toFixed(3) + "ohm");
        var min = 0, max = nct.length;
        if(resistance > nct[min].resistance || resistance < nct[max-1].resistance) {
            return undefined;
        }
        while(max > min) {
            var mid = min + Math.floor((max - min) / 2);
            
            if(nct[mid].resistance > resistance)
                min = mid + 1;
            else if(nct[mid].resistance < resistance)
                max = mid - 1;
            else
                min = max = mid;
        }
        var temp = nct[min].temp - ((resistance - nct[min].resistance) / (nct[min-1].resistance - nct[min].resistance));       
        var adjusted = adjust(sensor, temp);
        //console.log("Temp: " + temp.toFixed(3) + ", Adjusted: " + adjusted.toFixed(3));
        cb(adjusted);
    });
};