var express = require('express');
var PINS = require("../Constants");
var Gpio = require('onoff').Gpio; //require onoff to control GPIO
var router = express.Router();

var LEDPins = LEDPins = {RED: new Gpio(PINS.RED, 'out'), GREEN: new Gpio(PINS.GREEN, 'out'), BLUE: new Gpio(PINS.BLUE, 'out')};
var LEDPreset = PINS.PRESET;
var timeout;

function init() {
    LEDPins = {RED: new Gpio(PINS.RED, 'out'), GREEN: new Gpio(PINS.GREEN, 'out'), BLUE: new Gpio(PINS.BLUE, 'out')};
}
//init();

function deinit()
{
    for(var pin in LEDPreset) {
        console.log("Unexporting", pin);
        LEDPins[pin].unexport();
    }
}

//Timeout
setInterval(function() {
    var time = (new Date()).getTime();
    if(time - timeout >= 1000*60*5)
    {
        console.log("Switching off due to inactivity");
        switchOnPreset();
    }else {
    console.log("Still active");}

}, 1000*60*5);

function animate()
{
    //init();
    switchOffPreset();
    setTimeout(function() {switchOnPreset()}, 200);
    setTimeout(function() {switchOffPreset()}, 400);
    setTimeout(function() {switchOnPreset()}, 600);
}

function switchOffPreset()
{

    for(var pin in LEDPreset) {
        LEDPins[pin].writeSync(1);
        //LEDPreset[pin].unexport();
    }


    //LEDPins.POWER.writeSync(1);

    //deinit();
}

function parseStatus(status) {
    if(status == "on")
    {
        status = 0;
    }
    else
    {
        status = 1;
    }
    return status;
}

function red(status) {
    LEDPins.RED.writeSync(parseStatus(status))
}
function green(status) {
    LEDPins.GREEN.writeSync(parseStatus(status))
}
function blue(status) {
    LEDPins.BLUE.writeSync(parseStatus(status))
}

function switchOnPreset()
{
    //init();
    for(var pin in LEDPreset) {
        //console.log(pin, LEDPreset[pin]);
        if(!LEDPreset[pin]) LEDPins[pin].writeSync(1);
        LEDPins[pin].writeSync(0);
    }
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
    animate();
    res.status(200);
    res.send();
});

router.post("/off", function (req, res, next) {
    console.log("LEDs are off");
    timeout = (new Date()).getTime();
    switchOffPreset();
    res.status(200);
    res.send();
});

module.exports = router;
