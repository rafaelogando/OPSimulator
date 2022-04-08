//Improve error checking and code restrictions.
"use strict";

// Radio Channel our TSP must have
var radioChannel = function(row, col) {
    this.onuse = false;                             //Indicates channel been selected in a diferent position
    this.selected = false;                          //Active when channel TX has been selected
    this.activePTT = false;                         //Channel has an active PTT signal
    this.row = row;
    this.col = col;
    this.vol = 4;
    this.frecuency = 110 +row+col*4+" LON";
    this.sprite = 'images/radioElement.png';        //Radio Channel background image
    this.RXsrc = 'images/BASERX.png';
    this.TXsrc = 'images/BASETX.png';
    this.BASEsrc = 'images/radioElement.png';
    this.visible = true;
    this.toDrawOver = [
    {status:true,name:"volume",src:'images/radioVolume4.png',positionx:5,positiony:25},
    {status:true,name:110+ row+col+" LON",src:'',positionx:50,positiony:20},
    {status:false,name:"hollow",src:'images/uphollow.png',positionx:75,positiony:30},
    {status:false,name:"indicator",src:'images/multiple.png',positionx:121,positiony:25},
    {status:false,name:"downarrow",src:'images/downarrow.png',positionx:20,positiony:30},
    {status:false,name:"arrow",src:'images/uparrow.png',positionx:75,positiony:30},
    ];
};

// Update the radioChannel
// Parameter: dt, a time delta
radioChannel.prototype.update = function(dt) 
{
    var icon = this.toDrawOver[3];
    var downarrow = this.toDrawOver[4];
    var uparrow = this.toDrawOver[5];
    var hArrow = this.toDrawOver[2];
    var volume = this.toDrawOver[0];
    var PTTButton = allButtons[0].buttons[23];

    //ICON
    if(this.onuse){
        this.toDrawOver[3].status = true;
    }
    else{
        this.toDrawOver[3].status = false;
    }

    //DOWN ARROW
    if(this.activePTT && this.sprite != this.BASEsrc){
        downarrow.status = true;
    }
    else{downarrow.status = false};

    //UP ARROW
    if(this.sprite == this.TXsrc && !this.activePTT && TSP.PTT){
        uparrow.status = true;
        this.activePTT = true;
    }else if(!TSP.PTT || this.sprite == this.RXsrc){
        if(uparrow.status == true){ 
            uparrow.status = false;this.activePTT = false;
        }
    }

    //HOLLOW  UP ARROW 
    if(this.onuse && this.sprite == this.TXsrc && this.activePTT){
        hArrow.status = true;
    }else{
        hArrow.status = false
    }

    //PTT on busy channel
    if(this.sprite == this.TXsrc &&  hArrow.status && this.activePTT && TSP.PTT){
        window.alert("You shoud not PTT while a Channel is been used.");
        TSP.PTT = false;
        PTTButton.sprite = PTTButton.off;
        TSP.PTTSRC ='images/ptt.png';
    }
};

// Draw the radioChannel on the screen, required method. 
radioChannel.prototype.render = function() 
{
    var ch = this;
    var col = this.col/2*130;

    ctx.drawImage(Resources.get(this.sprite),col,(this.row+1)*66);
    this.toDrawOver.forEach(function(draw) {
        if(draw.status){
            if(draw.src != ''){
                ctx.drawImage(Resources.get(draw.src),col+draw.positionx,(ch.row+1)*66+draw.positiony);
            }else{
                ctx.fillText(ch.frecuency,col+draw.positionx,(ch.row+1)*66+draw.positiony); 
            }
        }
    });
    
};

//Checks if the Channel has been touched
//Them checks if is an RX or TX
radioChannel.prototype.grab = function(row,col) {
    if((this.col == col || this.col == col-1 )&& this.row == row-1 ){
        console.log("Radio " + this.toDrawOver[1].name);
    }

    //row-1 because starts at row 1 instead of row 0
    //Si es un RX
    if(this.col == col && this.row == row-1){
        //console.log("matchRX");
        this.selected = false;
        if (this.sprite == this.RXsrc) {
            this.sprite = this.BASEsrc;}
            else{
                this.sprite = this.RXsrc;
            }
    }

    //If TX selected
    if(this.col == col-1 && this.row == row-1){
        //console.log("matchTX");
        this.sprite = this.TXsrc;
        this.selected = true;
    } 
};


//BUTTON
var Button = function(name) {
    this.name = name.name;
    this.row = name.row;
    this.col = name.col;
    this.pressed = false;
    this.visible = true;
    this.y=0;
    this.x=0;
    this.blink = false;
    this.on = 'images/'+name.name+'on.png';
    this.off = 'images/'+name.name+'.png';
    this.sprite = 'images/'+name.name+'.png';
};

Button.prototype.render = function() 
{
    ctx.drawImage(Resources.get(this.sprite), this.col*66, this.row*66);
};

//Checks if the button has been touched
Button.prototype.grab = function(row,col) {
    if(this.col == col && this.row == row){
        console.log(this.name);
    }
    //row-1 because starts at row 1 instead of row 0
    if(this.visible){
        if(this.col == col && this.row == row){
            if(!this.pressed){
                this.sprite = this.on;
                this.pressed = true;
            }
            else{
                if(this.name == "SELECTROLE"){
                    for (var i = 0; i < 15; i++) {
                        allthiss[0].thiss[i+7].visible = true;
                    }
                    allthiss[0].thiss[2].visible = true;
                }
                this.sprite = this.off;
                this.pressed = false;}
            }

        }else if(this.col == col && this.row == row && (this.name == "DA" || this.name == "REPLAY") ){
            var volpad = allButtons[0].buttons[0];
            volpad.sprite = volpad.off;
            volpad.pressed = false;
            volpad.visible=true;
            allButtons[0].buttons[8].visible = true;
            allButtons[0].buttons[7].visible = true;
        }
        else if(this.col == col && this.row == row && (this.name == "ENDCALL" || this.name == "CONF" ) ){
            var volpad = allButtons[0].buttons[1];
            volpad.sprite = volpad.off;
            volpad.pressed = false;
            volpad.visible=true;
            for (var i = 0; i < 15; i++) {
                allButtons[0].buttons[i+7].visible = true;
            }
            allButtons[0].buttons[2].visible = true;
        }
        else if(this.col == col && this.row == row && (this.name == "LOCKSCREEN" || this.name == "POSMON") ){
            console.log("voll");
                    this.sprite = 'images/volumecontrol.png';
                    this.visible = true;
                    allButtons[0].buttons[7].visible = true;  
                }
};

// Ower hero/es class.
var MAINSCREEN = function() {
    this.extrafunc = false;
    this.loudSpeaker = true;
    this.loudSpeakerSrc ='images/speakeron.png';
    this.radioColums = 2;
    this.radioRows = 7;
    this.hearts =3;
    this.points =0;
    this.charpic = 'images/char-boy.png';
    this.chardead = 'images/dead.png';
    this.PTTSRC = 'images/PTT.png';
    this.PTT = false;
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
            el.toDrawOver[0].src = 'images/radioVolume'+ el.vol + '.png';
        }
    }
    if(key ==  "down"&&TSP.y<395){
        this.y+=83;
        allElements[0].radioChannels[0].radiosLeft[0].sprite = 'images/BASERX.png';
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
    this.y = 312;
    this.x = 202;
};

//Sets the MAINSCREEN points status, resest its status and
//increase dificulty.
MAINSCREEN.prototype.update = function() {

};

// Draw the TSP on the screen and change TSP appeal if 
//not alive, required method for game.
MAINSCREEN.prototype.render = function() {
    ctx.drawImage(Resources.get(this.charpic), this.x, this.y);
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
        allButtons[0].buttons.push(new Button(button));
    });
}

var allButtons = [{buttons:[]}];
var buttons = 
[
{name:"VOLPAD", col:4, row:0},
{name:"SELECTROLE", col:11, row:0},
{name:"DIALPAD", col:11, row:6},
{name:"LOUDSPEAKER", col:0, row:8},
{name:"FREQLOCK", col:1, row:8},
{name:"COUPLE", col:2, row:8},
{name:"ONCHANNEL", col:3, row:8},
{name:"DA", col:4, row:7},
{name:"REPLAY", col:5, row:7},
{name:"CHIME", col:6, row:7},
{name:"CALLDIVERT", col:7, row:7},
{name:"PRIO", col:8, row:7},
{name:"IC", col:9, row:7},
{name:"PHONELIST", col:10, row:7},
{name:"ENDCALL", col:11, row:7},
{name:"SPLIT", col:4, row:8},
{name:"LOCKSCREEN", col:5, row:8},
{name:"POSMON", col:6, row:8},
{name:"EXTRAFUNC", col:7, row:8},
{name:"HOLD", col:8, row:8},
{name:"XFER", col:9, row:8},
{name:"CONF", col:10, row:8},
{name:"LOUDSPEAKER", col:0, row:8},
{name:"PTT", col:0, row:9},
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
