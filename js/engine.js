/* Engine.js
 * This file provides the loop functionality (update entities and render),
 * draws the initial board on the screen, and then calls the update and
 * render methods.
 *
 * This engine is available globally via the Engine variable and it also makes
 * the canvas' context (ctx) object globally available to make writing app.js
 * a little simpler to work with.
 */

var Engine = (function(global) {
    /* Predefine the variables we'll be using within this scope,
     * create the canvas element, grab the 2D context for that canvas
     * set the canvas elements height/width and add it to the DOM.
     */
    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        lastTime;

        canvas.width = 800;
        canvas.height = 665;
        
        doc.body.appendChild(canvas);

        //MOUSE
        /*Get the mouse position relative to the canvas
        ,not just to the screen, and return the X and Y position.*/
        function getMousePos(canvas, evt)
        {
            var rect = canvas.getBoundingClientRect();
            return {x: evt.clientX - rect.left, y: evt.clientY - rect.top};
        }

    //CLICK
    /*The TSP Screen is divided into rows an colums each one with a size of 65px
    we figure out wich part of the screen was clicked dividing the screen on 
    12 colums and 9 rows.*/
    canvas.addEventListener("click",function(event)
    {
        var mouse = getMousePos(canvas,event);
        var col = (mouse.x - mouse.x%65)/65;
        var row =  (mouse.y - mouse.y%65)/65;

        //ENDCALL button expanded 1 square down
        var callnumber =  allButtons[0].buttons[14];
        if(col == callnumber.col && row == callnumber.row+1){
            row = callnumber.row;
        }

        //PTT button expanded one square to the left
        var pttpos =  allButtons[0].buttons[23];
        if(col == pttpos.col+1 && row == pttpos.row){
            col = pttpos.col;
        }
        
        if(col == 1 && row == 9){col = 0}

            
        //console.log( "columna: " + col + " fila: " + row);
        checkIfRadioPress(row, col);
        //checkIfPtt(row, col);
        checkIfButtons(row, col);
    });


    //CLOCK
    /*Display a 24H format clock on the screen*/

    var d;
    var str;
    function getClock(){
    
        d = new Date();
        str = Calculate(d.getHours(), d.getMinutes(), d.getSeconds());
    
        //context = clock.getContext("2d");
        ctx.clearRect(600, 300, 500, 200);
        ctx.font = "40pt calibri";
        ctx.fillStyle = "white";
        ctx.fillText(str, 600, 300);
    }

    function Calculate(hour, min, sec){
        var curTime;
        hour = hour-4;
        if(hour < 10)
        curTime = "0"+hour.toString();
        else
        curTime = hour.toString();

        if(min < 10)
        curTime += ":0"+min.toString();
        else
        curTime += ":"+min.toString();

        if(sec < 10)
        curTime += ":0"+sec.toString();
        else
        curTime += ":"+sec.toString();
        return curTime;
    }


    //RADIOS
    /*Checks if a channel button has been pressed*/
    function checkIfRadioPress(row, col){
        var radios = allElements[0].radioChannels;
        if(col < 4 && row > 0 && row < 8){

            radios.forEach(function(radioChannel) {
                radioChannel.grab(row,col);  
            });
        }
    }

    //PTT
    /*Checks if the PTT button has been pressed*/
    function checkIfPtt(row, col){
        if (allButtons[0].buttons[23].pressed) {console.log("PTT");}
     }

    //BUTTONS
    /*Checks if a button has been pressed*/
    function checkIfButtons(row, col){

        var RButtons = allButtons[0].buttons;

        RButtons.forEach(function(button) {
            button.grab(row,col);
        });
        TSP.PTT = allButtons[0].buttons[23].pressed;
    }

    //ENVIROMENT
    /*Sets the initial scenario*/
    function setEmbiroment(){
        allElements[0]['radioChannels'][0].activePTT = true;
        allElements[0]['radioChannels'][2].activePTT = true;
        allElements[0].radioChannels[0].onuse = true;
        allElements[0].radioChannels[2].onuse = true;
        allElements[0].radioChannels[1].onuse = true;
        allElements[0].radioChannels[5].onuse = true;
        allElements[0].radioChannels[11].onuse = true;
    }

    //MAIN

    /* This function serves as the kickoff point for the loop itself
     * and handles properly calling the update and render methods.
     */
    function main() {
        /* Get our time delta information which is required if you
         * requires smooth animation. Because everyone's computer processes
         * instructions at different speeds we need a constant value that
         * would be the same for everyone (regardless of how fast their
         * computer is)*/

        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;

        /* Call our update/render functions, pass along the time delta to
         * our update function since it may be used for smooth animation.
         */
        update(dt);
        render();

        /* Set our lastTime variable which is used to determine the time delta
         * for the next time this function is called.
         */
        lastTime = now;

        /* Use the browser's requestAnimationFrame function to call this
         * function again as soon as the browser is able to draw another frame.
         */
        win.requestAnimationFrame(main);
    }

    /* This function does some initial setup that should only occur once,
     * particularly setting the lastTime variable that is required.*/
    function init() {
        reset();
        lastTime = Date.now();
        main();
        createAllButtons();
        setEmbiroment();
    }
    
 
    /* This function is called by main (our loop) and itself calls all
     * of the functions which may need to update entity's data.*/
    function update(dt) {
        updateEntities(dt);
    }
    
    //This function set the game over screen and make visible an "try again"
    //button
    function Over(){
    }

    function updateEntities(dt) {
      allElements[0].radioChannels.forEach(function(radioChannel) {
            radioChannel.update(dt);
            //radioChannel.grab();
        });
        TSP.update(dt);
    }

    //Draws everything on screen
    function render() {
        Over();

        //Background
        ctx.drawImage(Resources.get('images/tspBase.png'),0,0);



        //Draw Radio Channels
        var radios = allElements[0].radioChannels;
        var RButtons = allButtons[0].buttons;
        ctx.fillStyle="black";
        ctx.font = "9pt impact"
        renderRadios(radios);
        renderButtons(RButtons);
        renderClock();
    }

    function renderRadios(radios){ 
            
        radios.forEach(function(radioChannel) {

            radioChannel.render();

            if (radioChannel.selected) {


            
                
            }
            });
        
        //CLOCK
        ctx.font = "40pt calibri";
        ctx.fillText(str, 30, 50);
    }

    function renderButtons(Rbuttons){
        Rbuttons.forEach(function(button) {
            if(button.visible){
                button.render();

                if(button.name == "VOLPAD" && button.pressed){
                    button.sprite = 'images/VOLPADWINDOW.png';
                    allButtons[0].buttons[8].visible = false;
                    allButtons[0].buttons[7].visible = false;
                }
                else if(button.name == "SELECTROLE" && button.pressed){
                    button.sprite = 'images/ROLEWINDOW.png';
                    button.row = 1;
                    button.col = 4;
                    button.render();
                    
                    button.sprite = button.on;
                    button.row = 0;
                    button.col = 11;
                    button.render();
                
                    for (var i = 0; i < 15; i++) {
                        allButtons[0].buttons[i+7].visible = false;
                    }
                    allButtons[0].buttons[2].visible = false;
                }

                else if(button.name == "EXTRAFUNC" && button.pressed){
                    TSP.extrafunc = true;
                    button.sprite = 'images/EXTRAFUNCWINDOW.png';
                    button.row = 7;
                    button.col = 0;
                    button.render();
                    
                    button.sprite = button.on;
                    button.row = 8;
                    button.col = 7;
                    button.render();
                
                    for (var i = 0; i < 19; i++) {
                        allButtons[0].buttons[i+3].visible = false;
                    }
                    allButtons[0].buttons[18].visible = true;
                    allButtons[0].buttons[16].visible = true;
                    allButtons[0].buttons[17].visible = true;

                }
                 else if((button.name == "LOCKSCREEN" || button.name == "POSMON") && allButtons[0].buttons[18].pressed && button.pressed){
                    button.sprite = 'images/volumecontrol.png';
                    button.row = 0;
                    button.col = 2;
                    button.render();
                    
                    button.sprite = button.on;
                    if(button.name == "LOCKSCREEN"){
                        button.row = 8;
                        button.col = 5;
                    }
                    if(button.name == "POSMON"){
                        button.row = 8;
                        button.col = 6;
                    }
                    button.render();
                    allButtons[0].buttons[7].visible = false;
                }

            }
        });
    }

    function renderClock(){
        d = new Date();
        str = Calculate(d.getHours(), d.getMinutes(), d.getSeconds());
        ctx.font = "10pt impact";
        ctx.fillStyle = "Black";
          
    }

    //  handle game reset states. It's only called once by the init() method.
     
    function reset() {

        TSP.reset();
    }

/*
        function setRadioChannels() {
        allEntities.forEach(function(radioChannel) {
            for (var rows = TSP.radioRows - 1; rows >= 0; rows--) {

            for(colRadio=0;colRadio<TSP.radioColums;colRadio++)
            {
            this.x = colRadio*130;
            this.y = rows*65;
                //ctx.drawImage(Resources.get("images/radioElement.png"),colRadio*130,rows*65);
            }
            }
        });
    }
    */

    /* Go ahead and load all of the images we know we're going to need to
     * draw our game level. Then set init as the callback method, so that when
     * all of these images are properly loaded our game will start.
     */
    Resources.load([
        'images/EXTRAFUNCWINDOW.png',
        'images/ROLEWINDOW.png',
        'images/VOLPADWINDOW.png',
        'images/VOLPAD.png',
        'images/VOLPADon.png',
        'images/SELECTROLE.png',
        'images/SELECTROLEon.png',
        'images/DIALPAD.png',
        'images/DIALPADon.png',
        'images/LOUDSPEAKER.png',
        'images/LOUDSPEAKERon.png',
        'images/FREQLOCK.png',
        'images/FREQLOCKon.png',
        'images/COUPLE.png',
        'images/COUPLEon.png',
        'images/ONCHANNEL.png',
        'images/ONCHANNELon.png',
        'images/CHIME.png',
        'images/CHIMEon.png',
        'images/CALLDIVERT.png',
        'images/CALLDIVERTon.png',
        'images/PRIO.png',
        'images/PRIOon.png',
        'images/IC.png',
        'images/ICon.png',
        'images/PHONELIST.png',
        'images/PHONELISTon.png',
        'images/ENDCALL.png',
        'images/SPLIT.png',
        'images/SPLITon.png',
        'images/ENDCALLon.png',
        'images/LOCKSCREEN.png',
        'images/LOCKSCREENon.png',
        'images/POSMON.png',
        'images/POSMONon.png',
        'images/EXTRAFUNC.png',
        'images/EXTRAFUNCon.png',
        'images/HOLD.png',
        'images/HOLDon.png',
        'images/XFER.png',
        'images/XFERon.png',
        'images/CONF.png',
        'images/CONFon.png',
        'images/DA.png',
        'images/DAon.png',
        'images/REPLAY.png',
        'images/REPLAYon.png',
        'images/tspBase.png',
        'images/PTT.png',
        'images/PTTon.png',
        'images/BASERX.png',
        'images/BASETX.png',
        'images/uparrow.png',
        'images/downarrow.png',
        'images/uphollow.png',
        'images/radioElement.png',
        'images/radioVolume4.png',
        'images/radioVolume5.png',
        'images/radioVolume6.png',
        'images/radioVolume7.png',
        'images/radioVolume8.png',
        'images/radioVolume9.png',
        'images/radioVolume10.png',
        'images/radioVolume11.png',
        'images/multiple.png',
        'images/dead.png',
        'images/volumecontrol.png',
    ]);
    Resources.onReady(init);

    /* Assign the canvas' context object to the global variable (the window
     * object when run in a browser) so that developer's can use it more easily
     * from within their app.js files.
     */
    global.ctx = ctx;
})(this);
