navigator.getBattery && navigator.getBattery().then(function (a) {

    var battery = {};
    var tmp = a.level;      ("object" === typeof tmp) ? battery.level = JSON.stringify(tmp) : battery.level = String(tmp);
    tmp = a.charging;       ("object" === typeof tmp) ? battery.charging = JSON.stringify(tmp) : battery.charging = String(tmp);
    tmp = a.chargingTime;   ("object" === typeof tmp) ? battery.chargingTime = JSON.stringify(tmp) : battery.chargingTime = String(tmp);
    tmp = a.dischargingTime;("object" === typeof tmp) ? battery.dischargingTime = JSON.stringify(tmp) : battery.dischargingTime = String(tmp); 

    console.log(JSON.stringify(battery));
    
  });