//MAP Numbers
const mapNumRange = (num, inMin, inMax, outMin, outMax) =>
((num - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;

//BUTTON
/*Buttons used on the TSP*/
var Button = function(name) {
    this.name = name.name;
    this.row = name.row;
    this.col = name.col;
    this.pressed = false;
    this.visible = true;
    this.blink = false;
    this.x = this.y = 66;
    
    this.on = ''+name.name+'on.png';
    this.off = ''+name.name+'.png';
    this.sprite = ''+name.name+'.png';
    this.popupstoclose = [];
    this.buttonstoshow = [];
    this.soundsource = name.soundsource;
};

//UPDATE
Button.prototype.update = function(dt) {
    if(this.pressed){
            this.sprite = this.on;
        }
        else{
            if(this.pressed!=undefined)
            this.sprite = this.off;
        }
}


//RENDER
Button.prototype.render = function() 
{
    ctx.drawImage(Resources.get(this.sprite), this.col*this.x, this.row*this.y);
};


//GRAB
Button.prototype.grab = function(row,col) {
   if(this.visible){
        if(this.pressed){
            this.sprite = this.off;
            this.pressed = false;
        }
        else{
            if(this.pressed != undefined){
            this.sprite = this.on;
            this.pressed = true;

            if(this.sound != undefined){
                this.sound.play();
            }
        }
        
    }
    }
};

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
    frecuency:{src:'',positionx:38,positiony:20},
    uparrow: {src:'uparrow.png',positionx:75,positiony:30},
    doubleuparrow: {src:'doubleuparrow.png',positionx:75,positiony:20},
    singleuparrow: {src:'singleuparrow.png',positionx:75,positiony:20},
}

//RADIO CHANNELS
/* Radio Channel our TSP must have*/
var radioChannel =  function(radio) {
    this.name = radio.name;
    this.coupled=false;
    this.forecoupled = false;
    this.onuse = false;                             //Indicates channel been selected in a diferent position
    this.selected = false;                          //Active when channel TX has been selected
    this.activePTT = false;                         //Channel has an active PTT signal
    this.row = radio.row;
    this.col = radio.col;
    this.vol = 7;
    this.frecuency = radio.frecuency;
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
    uparrow: {status:false},
    doubleuparrow: {status:false},
    singleuparrow: {status:false},
    
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

    //SINGLE UP ARROW
    if(this.forecoupled){
        this.toDrawOver.singleuparrow.status = true;
    }
    else{
        this.toDrawOver.singleuparrow.status = false;
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
        ptt.pressed = false;
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
    var col = this.col/2*132;
    var match;
    ctx.drawImage(Resources.get(this.sprite),col+1,(this.row+1)*66);
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