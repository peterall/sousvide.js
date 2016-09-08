setInterval(() => {
    getTemperature(temp => {
        if(temp < 54.5) {
            heaterOn();
        } else {
            heaterOff();
        }
    });
}, 1000);
