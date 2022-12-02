//Improve error checking and code restrictions.
"use strict";

//Channels base background images
var chparts = {
    baseRx:"BASERX.png",
    baseTx:"BASETX.png",
    base:"BASE.png"
};

var chIcons = 
{
    volume:{src:'radioVolume7.png',positionx:5,positiony:25},
    onuse:{src:'multiple.png',positionx:121,positiony:25},
    hollow:{src:'uphollow.png',positionx:75,positiony:30},
    downarrow:{src:'downarrow.png',positionx:20,positiony:30},
    frecuency:{src:'',positionx:50,positiony:20},
    uparrow: {src:'uparrow.png',positionx:75,positiony:30},
}

//RADIO CHANNELS
/* Radio Channel our TSP must have*/
var radioChannel =  function(row, col) {
    this.onuse = false;                             //Indicates channel been selected in a diferent position
    this.selected = false;                          //Active when channel TX has been selected
    this.activePTT = false;                         //Channel has an active PTT signal
    this.row = row;
    this.col = col;
    this.vol = 7;
    this.frecuency = 110 +row+col*4+" LON";
    this.sprite = 'BASE.png';        //Radio Channel background image
    this.visible = true;
    this.AG = false;
    this.count = 50;
    this.counting = 0;
    this.intercount = 0;
    this.SIMULATION = false;
    this.toDrawOver = {
    volume:{status:true},
    onuse:{status:false},
    hollow:{status:false},
    downarrow:{status:false},
    frecuency:{status:true},
    uparrow: {status:false}
    };
};

//Channel Update
/*Update changes in the radioChannel
Usually actions we need to keep track on 
like when a channel is selected in a diferent
position

Parameter: dt, a time delta*/
radioChannel.prototype.update = function(dt) 
{
    //ICON
    if(this.onuse){
        this.toDrawOver.onuse.status = true;
    }
    else{
        this.toDrawOver.onuse.status = false;
    }

    //DOWN ARROW
    if((this.AG || this.activePTT) && this.sprite != chparts.base){
        this.toDrawOver.downarrow.status = true;
    }
    else{this.toDrawOver.downarrow.status = false};

    //UP ARROW
    if(this.sprite == chparts.baseTx && !this.activePTT && TSP.PTT){
        this.toDrawOver.uparrow.status = true;
        this.activePTT = true;
    }else if(!TSP.PTT || this.sprite == chparts.baseRx){
        if(this.toDrawOver.uparrow.status == true){ 
            this.toDrawOver.uparrow.status = false;
            this.activePTT = false;
        }
    }

    //PTT on busy channel
    if(this.selected && this.toDrawOver.hollow.status && this.activePTT && TSP.PTT){
        window.alert("You shoud not PTT while a Channel is been used.");
        TSP.PTT = false;
        ptt.sprite = ptt.off;
        TSP.PTTSRC ='ptt.png';
    }

    //HOLLOW  UP ARROW 
    if(this.onuse && this.selected && this.activePTT && !TSP.PTT){
        this.toDrawOver.hollow.status = true;
    }else{
        this.toDrawOver.hollow.status = false;
    }
};

// Draw the radioChannel on the screen, required method. 
radioChannel.prototype.render = function() 
{
    var ch = this;
    var col = this.col/2*130;
    var match;
    ctx.drawImage(Resources.get(this.sprite),col,(this.row+1)*66);
    Object.keys(this.toDrawOver).forEach(function(draw) {
        if(ch.toDrawOver[draw].status){

            if(draw != 'frecuency'){
                ctx.drawImage(Resources.get(chIcons[draw].src),col+chIcons[draw].positionx,(ch.row+1)*66+chIcons[draw].positiony);
            }else{
                ctx.fillText(ch.frecuency,col+chIcons[draw].positionx,(ch.row+1)*66+chIcons[draw].positiony); 
            }
        }
    });
    
};

//Checks if the Channel has been touched
//Them checks if is an RX or TX
radioChannel.prototype.grab = function(row,col) {
    //row-1 because starts at row 1 instead of row 0
    //Si es un RX
    if(this.col == col && this.row == row-1){
        //console.log("matchRX");
        this.selected = false;
        if (this.sprite == chparts.baseRx) { 
            this.sprite = chparts.base;}
            else{
                this.sprite = chparts.baseRx;
            }
    }

    //If TX selected
    if(this.col == col-1 && this.row == row-1){
        //console.log("matchTX");
        this.sprite = chparts.baseTx;
        this.selected = true;
    } 
};

radioChannel.prototype.simulate = function() {
    if(this.SIMULATION){
        this.counting++;
        if(this.count < this.counting){
            this.intercount++;
            this.count = Math.floor(Math.random() * 200);
            this.counting = 0;
            if(this.intercount <= 1){
                if( this.activePTT){
                    this.activePTT = false;
                }else{
                    this.activePTT = true;
                }
            }else{
                if( this.AG){
                    this.AG = false;
                }else{
                    this.AG = true;
                }
            }
            if(this.intercount >=3){this.intercount = 0};
        } 
    }
};



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
    this.tsp = "tspBase.png";
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

// Place the MAINSCREEN object in a variable called TSP
var TSP = new MAINSCREEN();

//ALL RADIOS
/*Create all Channels to be used on the TSP
Place all radioChannel objects in an array called allElements*/
var allElements =[{radioChannels:[]}];

for (var i = 0; i < TSP.radioRows; i++) {
    allElements[0].radioChannels.push(new radioChannel(i,0));
    allElements[0].radioChannels.push(new radioChannel(i,2));
}


//ALL BUTTONS
/*Create all button to be used on the TSP*/
function createAllButtons(){
    buttons.forEach(function(button) {
        var newbutton = new Button(button);
        if(typeof button.extrafunc === 'undefined'){
            allButtons[0].buttons.push(newbutton);
        }
        else{
                if(button.extrafunc == true){
                    newbutton.visible = false;
                    allButtons[1].extrabuttons.push(newbutton);
            
                }
                else{
                    newbutton.visible = false;
                    allButtons[2].dialpadbuttons.push(newbutton);
                }
            }
        
        window[button.name.toLowerCase()] = newbutton;
        //eval("var " + button.name + " = 2");
    });
}


var allvar = [];
var allButtons = [{buttons:[]},{extrabuttons:[]},{dialpadbuttons:[]}];
var buttons = 
[
{name:"VOLPAD", col:4, row:0},
{name:"SELECTROLE", col:11, row:0},
{name:"DIALPAD", col:11, row:6},
{name:"DA", col:4, row:7},
{name:"REPLAY", col:5, row:7},
{name:"CHIME", col:6, row:7},
{name:"CALLDIVERT", col:7, row:7},
{name:"PRIO", col:8, row:7},
{name:"IC", col:9, row:7},
{name:"PHONELIST", col:10, row:7},
{name:"SPLIT", col:4, row:8},
{name:"LOCKSCREEN", col:5, row:8},
{name:"POSMON", col:6, row:8},
{name:"HOLD", col:8, row:8},
{name:"XFER", col:9, row:8},
{name:"CONF", col:10, row:8},
{name:"LOUDSPEAKER", col:0, row:8},
{name:"FREQLOCK", col:1, row:8},
{name:"COUPLE", col:2, row:8},
{name:"ONCHANNEL", col:3, row:8},
{name:"row1", col:3, row:1},
{name:"row2", col:3, row:2},
{name:"row3", col:3, row:3},
{name:"row4", col:3, row:4},
{name:"row5", col:3, row:5},
{name:"row6", col:3, row:6},
{name:"row7", col:3, row:7},
{name:"HS", col:4, row:4},
{name:"HND", col:5, row:4},
{name:"PTT", col:0, row:9},
{name:"SIMULATE", col:10, row:9},
{name:"ENDCALL", col:11, row:7},
{name:"EXTRAFUNC", col:7, row:8},
{name:"CHIMEMULTI", col:5, row:7, extrafunc:true},
{name:"RADCONN", col:6, row:7, extrafunc:true},
{name:"CROSSCONN", col:7, row:7, extrafunc:true},
{name:"TELCONN", col:8, row:7, extrafunc:true},
{name:"CALLPICKUP", col:9, row:7, extrafunc:true},
{name:"MAINSTBY", col:4, row:8, extrafunc:true},
{name:"VOLLEFTROW", col:5, row:8, extrafunc:true},
{name:"VOLRIGHTROW", col:6, row:8, extrafunc:true},
{name:"ROLEID", col:8, row:8, extrafunc:true},
{name:"CHIMETEST", col:9, row:8, extrafunc:true},
{name:"SELECTFREQ", col:0, row:8, extrafunc:true},
{name:"BASEBTN", col:1, row:8, extrafunc:true},
{name:"BTS", col:2, row:8, extrafunc:true},
{name:"BSS", col:3, row:8, extrafunc:true},
{name:"CRASHALARM", col:10, row:8, extrafunc:true},
{name:"LINE0", col:4, row:1}, //Si extrafunc = false entonces es un boton del dialpad
{name:"DIAL1", col:4, row:3,extrafunc:false},
{name:"DIAL2", col:5, row:3,extrafunc:false},
{name:"DIAL3", col:6, row:3,extrafunc:false},
{name:"DIAL4", col:4, row:4,extrafunc:false},
{name:"DIAL5", col:5, row:4,extrafunc:false},
{name:"DIAL6", col:6, row:4,extrafunc:false},
{name:"DIAL7", col:4, row:5,extrafunc:false},
{name:"DIAL8", col:5, row:5,extrafunc:false},
{name:"DIAL9", col:6, row:5,extrafunc:false},
{name:"DIAL0", col:5, row:6,extrafunc:false},
];


//var allEntities = [new radioChannel(120),new radioChannel(140),new radioChannel(200),new radioChannel(250),new radioChannel(300)];

// This listens for key presses and sends the keys to your
// TSP.handleInput() method.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    TSP.handleInput(allowedKeys[e.keyCode]);
});
