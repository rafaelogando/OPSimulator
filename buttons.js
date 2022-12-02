
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
    ctx.drawImage(Resources.get(this.sprite), this.col*this.x, this.row*this.y);
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
    }
};