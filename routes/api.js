var express = require('express');
var PINS = require("../Constants");
//var Gpio = require('onoff').Gpio; //require onoff to control GPIO
var router = express.Router();


//var LEDPins = {RED: new Gpio(PINS.RED, 'out'), GREEN: new Gpio(PINS.GREEN, 'out'), BLUE: new Gpio(PINS.BLUE, 'out'), POWER: new Gpio(PINS.POWER, 'out')};
var LEDPreset = PINS.PRESET;


var timeout;

setInterval(function() {
    var time = (new Date()).getTime();
    if(time - timeout >= 1000*60*5)
    {
        console.log("Switching off due to inactivity");
        switchOff();
    }else {
    console.log("Still active");}

}, 1000*60*5);

function animate()
{
    switchOn();
    setTimeout(function() {switchOff()}, 200);
    setTimeout(function() {switchOn()}, 400);
}

function switchOn()
{
    for(var pin in LEDPreset) {
        LEDPins[pin].writeSync(1);
    }
    LEDPins.POWER.writeSync(1);
}

function switchOff()
{
    for(var pin in LEDPreset) {
        LEDPins[pin].writeSync(0);
    }
    LEDPins.POWER.writeSync(0);
}

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post("/deadmanswitch", function (req, res, next) {
    console.log("Deadmanswitch triggered");
    timeout = (new Date()).getTime();
    res.status(200);
    res.send();
});

router.post("/on", function (req, res, next) {
    //switchOn();
    console.log("LEDs are on");
    timeout = (new Date()).getTime();
    //animate();
    res.status(200);
    res.send();
});

router.post("/off", function (req, res, next) {
    console.log("LEDs are off");
    timeout = (new Date()).getTime();;
    //switchOff();
    res.status(200);
    res.send();
});

module.exports = router;
