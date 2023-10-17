//Improve error checking and code restrictions.
"use strict";

//MAIN SCREEN
/*This is the base for the whole screen*/
var MAINSCREEN = function() {
    this.simualting = false;
    this.extrafunc = false;
    this.loudSpeaker = true;
    this.loudSpeakerSrc ='speakeron.png';
    this.radioColums = 2;
    this.radioRows = 7;
    this.hearts =3;
    this.points =0;
    this.tsp = "tsp.png";
    this.chardead = 'dead.png';
    this.PTTSRC = 'PTT.png';
    this.PTT = false;
    this.SIMULATION = false;
    this.intercount = 0;
    this.x =0;
    this.y =0;
};

//Check user inputs to set TSP MAINSCREEN position.
//This function wont work if the game is over.
MAINSCREEN.prototype.handleInput = function(key)
{

    if(key ==  "up"){
        this.y-=83;
        var el = allElements[0].radioChannels[0].radiosLeft[0];

        if(el.vol < 11){
            el.vol = el.vol+1;
            el.toDrawOver[0].src = 'radioVolume'+ el.vol + '.png';
        }
    }
    if(key ==  "down"&&TSP.y<395){
        this.y+=83;
        allElements[0].radioChannels[0].radiosLeft[0].sprite = chparts.baseRx;
    }
    if(key ==  "right"&& TSP.x <404){
        this.x+=101;
    }
    if(key ==  "left"&&TSP.x>0){
        this.x-=101;
    }

};

//Resets the MAINSCREEN starting posiion.
MAINSCREEN.prototype.reset = function()
{
};

//Sets the MAINSCREEN points status, resest its status and
//increase dificulty.
MAINSCREEN.prototype.update = function() {
};

// Draw the TSP on the screen and change TSP appeal if 
//not alive, required method for game.
MAINSCREEN.prototype.render = function() {
    ctx.drawImage(Resources.get(this.tsp), this.x, this.y);
};


MAINSCREEN.prototype.simulate = function(status) {
    if(status){
        allElements[0].radioChannels[0].SIMULATION = true;
        allElements[0].radioChannels[1].SIMULATION = true;
        allElements[0].radioChannels[4].SIMULATION = true;
        allElements[0].radioChannels[6].SIMULATION = true;
        allElements[0].radioChannels[7].SIMULATION = true;

        allElements[0].radioChannels[0].sprite = chparts.baseTx;
        allElements[0].radioChannels[1].sprite = chparts.baseTx;
        allElements[0].radioChannels[4].sprite = chparts.baseTx;
        allElements[0].radioChannels[6].sprite = chparts.baseTx;
        allElements[0].radioChannels[7].sprite = chparts.baseTx;
    }else{
        allElements[0].radioChannels[0].SIMULATION = false;
        allElements[0].radioChannels[1].SIMULATION = false;
        allElements[0].radioChannels[4].SIMULATION = false;
        allElements[0].radioChannels[6].SIMULATION = false;
        allElements[0].radioChannels[7].SIMULATION = false;
    }
    
};
