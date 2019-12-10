// ==UserScript==
// @name         FMS 5 LED Plugin
// @namespace    https://leitstellenspiel.de
// @version      1.0
// @description  Activates LED on FMS5
// @author       Lennard[TFD]
// @match        https://www.leitstellenspiel.de/
// @match        https://www.missionchief.com/
// @match        https://www.meldkamerspel.com/
// @updateURL    https://github.com/LennardTFD/FMS5LED/raw/master/fmsled.user.js
// @downloadURL  https://github.com/LennardTFD/FMS5LED/raw/master/fmsled.user.js
// @grant        none
// ==/UserScript==

var LEDLocation = "http://raspi:3000";

function switchLed(status) {
    if (status == "on") {
        $.ajax({
            type: "POST",
            url: LEDLocation + "/api/on"
        }).done(function () {
            console.log("LED Switched on!");
            //resolve(true);
        });
    } else {
        $.ajax({
            type: "POST",
            url: LEDLocation + "/api/off"
        }).done(function () {
            console.log("LED Switched off!");
            //resolve(true);
        });
    }
}

function fms5Exists() {
    return $("#radio_messages_important").find("li").length > 0;
}

(function () {
    var timeout = setInterval(function() {
        $.ajax({
            type: "POST",
            url: LEDLocation + "/api/deadmanswitch"
        }).done(function () {
            console.log("LED Switched off!");
        });
    },1000 * 60 * 3);

    if(fms5Exists())
    {
        switchLed("on");
    }

    var mutationObserver = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {

            var node = mutation.addedNodes[0];
            console.log(node);
            if(node == undefined)
            {
                if(!fms5Exists())
                {
                    switchLed("off");
                    console.log("Switching LED off");
                }
            }
            else{
                switchLed("on");
                console.log("Switching LED on");
            }
        });
    });

//Listen for new Incomming Status updates
    mutationObserver.observe($("#radio_messages_important")[0], {
        childList: true
    });

})();