var express = require('express');
var PINS = require("../Constants");
var Gpio = require('onoff').Gpio; //require onoff to control GPIO
var router = express.Router();


var LEDPins = {RED: new Gpio(PINS.RED, 'out'), GREEN: new Gpio(PINS.GREEN, 'out'), BLUE: new Gpio(PINS.BLUE, 'out'), POWER: new Gpio(PINS.POWER, 'out')};
var LEDPreset = PINS.PRESET;



/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post("/on", function (req, res, next) {
    for(var pin in LEDPreset) {
        LEDPins[pin].writeSync(1);
    }
    LEDPins.POWER.writeSync(1);
    res.status(200);
    res.send();
});

router.post("/off", function (req, res, next) {
    for(var pin in LEDPreset) {
        LEDPins[pin].writeSync(0);
    }
    LEDPins.POWER.writeSync(0);
    res.status(200);
    res.send();
});

module.exports = router;
