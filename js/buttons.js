
//BUTTON
/*Buttons used on the TSP*/
var Button = function(name) {
    this.name = name.name;
    this.row = name.row;
    this.col = name.col;
    this.pressed = false;
    this.visible = true;
    this.blink = false;
    this.constant = 66;
    this.on = ''+name.name+'on.png';
    this.off = ''+name.name+'.png';
    this.sprite = ''+name.name+'.png';
};

//UPDATE
Button.prototype.update = function(dt) {
    if(this.pressed){
            this.sprite = this.on;
        }
        else{
            this.sprite = this.off;
        }
}


//RENDER
Button.prototype.render = function() 
{
    ctx.drawImage(Resources.get(this.sprite), this.col*this.constant, this.row*this.constant);
};


//GRAB
Button.prototype.grab = function(row,col) {

   if(this.visible){

        if(!this.pressed){
            this.sprite = this.on;
            this.pressed = true;
        }
        else{
            this.sprite = this.off;
            this.pressed = false;
        }

    //VOLPAD close button
    }else if(!selectrole.pressed && volpad.pressed && (this.name == "DA" || this.name == "REPLAY") ){
        
        volpad.sprite = volpad.off;
        volpad.pressed = false;
        volpad.visible=true;
        da.visible = true;
        replay.visible = true;
        hs.visible = false;
        hnd.visible = false;
    }
};