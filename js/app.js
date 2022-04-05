//Improve error checking and code restrictions.
"use strict";
//Sets end of game
var gameOver=false;

// Used to check if the TSP has moved left with an 
//radioChannel  too close.
var handle=false;

// Entities our TSP must avoid
var radioChannel = function(row, col) {
    this.PTT = false;
    this.y=0;
    this.x=0;
    this.row = row;
    this.col = col;
    this.speed = 100;
    //this.sprite = 'images/radioChannel-bug.png';
    this.sprite = 'images/radioElement.png';
    this.elementsToAdd = {
        volume:{src:'images/radioVolume4.png',positionx:5,positiony:25},
        frecuency:{name:"Radio",src:'',positionx:50,positiony:20},
        hollow:{name:"hollowArrow",src:'images/uparrow.png',positionx:80,positiony:30}
    };
    this.vol = 4;
    this.frecuency = "Radio";
};


//Generates a random position for the next time the bug 
//(radioChannel) appears on the screen.
radioChannel.prototype.randomPos = function()
    {
        this.x=-101;
        this.y=(Math.round((Math.random()*2)+1)*83)-20;
    };
    
// Update the radioChannel's position, required method for game
// Parameter: dt, a time delta between ticks
radioChannel.prototype.update = function(dt) 
{
    this.x=this.x+this.speed*dt;
    if(this.x >= 500)
    {
        this.randomPos();
    }
};

// Draw the radioChannel on the screen, required method for game
radioChannel.prototype.render = function() 
{
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//Checks if the TSP has been grabbed by a bug and if true 
//reset TSP position and set the game to over if TSP
// have no hearts(lifes) left.
radioChannel.prototype.grab = function() {
    if( (this.x+20) >= TSP.x && this.x <= (TSP.x+20) && TSP.y == this.y)
    {
            
        TSP.reset();
        TSP.hearts--;
        if(TSP.hearts<=0){gameOver=true;}
    }
    if((this.x+20)-TSP.x > 0 && (this.x+20)-TSP.x < 101 && handle && this.y== TSP.y)
    {
        //Checks for collitions made by moving towards an radioChannel.
        TSP.reset();
        TSP.hearts--;
        if(TSP.hearts<=0){gameOver=true;}
        handle=false;
    }
};

//BUTTON
var Button = function(name) {
    this.pressed = false;
    this.y=0;
    this.x=0;
    this.row = name.col;
    this.col = name.row;
    this.blink = false;
    this.on = 'images/'+name.name+'off.png';
    this.off = 'images/'+name.name+'off.png';
    this.sprite = 'images/'+name.name+'.png';
    this.name = name.name;
};

Button.prototype.render = function() 
{
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


// Ower hero/es class.
var MAINSCREEN = function() {
    this.loudSpeaker = true;
    this.loudSpeakerSrc ='images/speakeron.png';
    this.radioColums = 2;
    this.radioRows = 7;
    this.hearts =3;
    this.points =0;
    
    
 
    this.charpic = 'images/char-boy.png';
    this.chardead = 'images/dead.png';
    this.PTTSRC = 'images/ptt.png';
};

//Check user inputs to set TSP MAINSCREEN position.
//This function wont work if the game is over.
MAINSCREEN.prototype.handleInput = function(key)
    {
        if(!gameOver)
        {
            if(key ==  "up"){
                this.y-=83;
                var el = allElements[0].radioChannels[0].radiosLeft[0];
                
                if(el.vol < 11){
                    el.vol = el.vol+1;
                    el.elementsToAdd.volume.src = 'images/radioVolume'+ el.vol + '.png';
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
                handle =true;
            }
        }
    };

//Resets the MAINSCREEN starting posiion.
MAINSCREEN.prototype.reset = function()
    {
        this.y = 312;
        this.x = 202;
    };

//Sets the MAINSCREEN points status, resest its position and
//increase Entities speed.  Does not use dt because MAINSCREEN
// movement is not smoth like
//bugs do.
MAINSCREEN.prototype.update = function() {
    if(this.y <= -20)
    {
        this.points++;
        this.reset();
        allEntities.forEach(function(radioChannel) {radioChannel.speed=radioChannel.speed+25;
          });
    } 
};

// Draw the TSP on the screen and change TSP appeal if 
//not alive, required method for game.
MAINSCREEN.prototype.render = function() {
    if(!gameOver){ctx.drawImage(Resources.get(this.charpic), this.x, this.y);}
    else{ctx.drawImage(Resources.get(this.chardead), this.x, this.y);}
    
};



// Now instantiate your objects.
// Place all radioChannel objects in an array called allEntities
// Place the TSP object in a variable called TSP



var TSP = new MAINSCREEN();
var allEntities=[];
var allElements =[{radioChannels:[]}];

    for (var i = 0; i < TSP.radioRows; i++) {
        allElements[0].radioChannels.push(new radioChannel(i,0));
        allElements[0].radioChannels.push(new radioChannel(i,2));
    }


var allButtons = [];
var buttons = 
[
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
{name:"CHIMEMULT", col:6, row:7},
{name:"RADCONN", col:7, row:7},
{name:"CROSSCONN", col:8, row:7},
{name:"TELCONN", col:9, row:7},
{name:"CALLPICKUP", col:10, row:7},
{name:"MAINSTB", col:5, row:8},
{name:"VOLLEFT", col:6, row:8},
{name:"VOLRIGHT", col:7, row:8},
{name:"ROLEID", col:9, row:8},
{name:"CHIMETEST", col:10, row:8},
{name:"SELECTROLE", col:12, row:0},
{name:"CALLERQUEE", col:12, row:1},
{name:"DIALPAD", col:12, row:6}];

    function createAllButtons(){
        buttons.forEach(function(button) {
            allButtons.push(new Button(button));
        });
    }
    



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
