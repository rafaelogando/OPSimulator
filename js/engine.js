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
        row = col == endcall.col && row == endcall.row+1 ? endcall.row: row ;
    

        //PTT button expanded one square to the left
        if(col == ptt.col+1 && row == ptt.row){
            col = ptt.col;
        }

        //SIMULATE button expanded one square to the left
        if(col == simulate.col+1 && row == simulate.row){
            col = simulate.col;
        }

            
        //console.log( "columna: " + col + " fila: " + row);
        checkIfRadioPress(row, col);
        checkIfButtons(row, col);
    });

    //MOUSE UP
    //So far used for vol pad HS/HND controls
    canvas.addEventListener("mouseup",function(event)
    {
        console.log("volpad");
        var mouse = getMousePos(canvas,event);
        var col = (mouse.x - mouse.x%65)/65;
        var row =  (mouse.y - mouse.y%65)/65;

        //Updates HS and HND on screen
        if(volpad.pressed && hs.visible){

            //HS column
            if(col == hs.col && row > 0 && row < 7){
               hs.row = row; 
           }
            //HND column
            if(col == hnd.col && row > 0 && row < 7){
               hnd.row = row;
           }
       }
    });


    //CLOCK
    /*Display a 24H format clock on the screen*/
    var d;
    var str;
    function getClock(){
    
        d = new Date();
        str = Calculate(d.getHours(), d.getMinutes(), d.getSeconds());
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

    //BUTTONS
    /*Checks if a button has been pressed*/
    function checkIfButtons(row, col){

        var RButtons = allButtons[0].buttons;

        RButtons.forEach(function(button) {
            if(button.row == row && button.col == col){
                
                if(typeof button.popup === "function"){
                    button.popup();
                }

                button.grab(row,col);
            }
        });
        //Saves PTT button status value to TSP.PTT
        TSP.PTT = ptt.pressed;

        //Check if the SIMULATE ATC button has been pressed
        //if so then release the button and run the simulation
        if(simulate.pressed){
            setTimeout(function(){
                canvas.dispatchEvent(
                    new MouseEvent("click", 
                    {
                        clientX: simulate.col*simulate.constant,
                        clientY: simulate.row*simulate.constant,
                        bubbles: true
                    })
                );
            },500);
            if(!TSP.simulating){
                TSP.simulate(true);
                TSP.simulating = true;
            }else{
                TSP.simulate(false);
                TSP.simulating = false;
            }
        }
    }

    //ENVIROMENT
    /*Sets the initial scenario*/
    function setEmbiroment(){
        allElements[0].radioChannels[0].onuse = true;
        allElements[0]['radioChannels'][0].activePTT = true;
        allElements[0].radioChannels[2].onuse = true;
        allElements[0].radioChannels[2].AG = true;
        allElements[0].radioChannels[1].onuse = true;
        allElements[0].radioChannels[5].onuse = true;
        allElements[0].radioChannels[11].onuse = true;

        //HS/HND Enbiroment
        /*Change button position on screen and hides them*/
        hs.constant = 68.1;
        hnd.constant = 68.6;

        hs.visible = false;
        hnd.visible = false
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
        createPopups();
        setEmbiroment();
        
        TSP.count = 100;
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
            radioChannel.simulate(dt);
            //radioChannel.grab();
        });

        allButtons[0].buttons.forEach(function(button) {
            button.update(dt);
            //button.grab();
        });
        TSP.update(dt);

    }

    //Draws everything on screen
    function render() {
        Over();

        //Background
        ctx.drawImage(Resources.get('tspBase.png'),0,0);

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
        });
        
        //CLOCK
        ctx.font = "40pt calibri";
        ctx.fillText(str, 30, 50);
    }

    function renderButtons(Rbuttons){
        Rbuttons.forEach(function(button) {
            if(button.visible){
                button.render();
                if(typeof button.popuprender === "function" && button.pressed){
                    button.popuprender();
                }

                else if(button.name == "EXTRAFUNC" && button.pressed){
                    TSP.extrafunc = true;
                    button.sprite = 'EXTRAFUNCWINDOW.png';
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
                    button.sprite = 'volumecontrol.png';
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


    /* Go ahead and load all of the images we know we're going to need to
     * draw our game level. Then set init as the callback method, so that when
     * all of these images are properly loaded our game will start.
     */
    Resources.load([
        'EXTRAFUNCWINDOW.png',
        'ROLEWINDOW.png',
        'VOLPADWINDOW.png',
        'VOLPAD.png',
        'VOLPADon.png',
        'SELECTROLE.png',
        'SELECTROLEon.png',
        'DIALPAD.png',
        'DIALPADon.png',
        'LOUDSPEAKER.png',
        'LOUDSPEAKERon.png',
        'FREQLOCK.png',
        'FREQLOCKon.png',
        'COUPLE.png',
        'COUPLEon.png',
        'ONCHANNEL.png',
        'ONCHANNELon.png',
        'CHIME.png',
        'CHIMEon.png',
        'CALLDIVERT.png',
        'CALLDIVERTon.png',
        'PRIO.png',
        'PRIOon.png',
        'IC.png',
        'ICon.png',
        'PHONELIST.png',
        'PHONELISTon.png',
        'ENDCALL.png',
        'SPLIT.png',
        'SPLITon.png',
        'ENDCALLon.png',
        'LOCKSCREEN.png',
        'LOCKSCREENon.png',
        'POSMON.png',
        'POSMONon.png',
        'EXTRAFUNC.png',
        'EXTRAFUNCon.png',
        'HOLD.png',
        'HOLDon.png',
        'XFER.png',
        'XFERon.png',
        'CONF.png',
        'CONFon.png',
        'DA.png',
        'DAon.png',
        'REPLAY.png',
        'REPLAYon.png',
        'tspBase.png',
        'PTT.png',
        'PTTon.png',
        'BASERX.png',
        'BASE.png',
        'BASETX.png',
        'uparrow.png',
        'downarrow.png',
        'uphollow.png',
        'radioElement.png',
        'radioVolume4.png',
        'radioVolume5.png',
        'radioVolume6.png',
        'radioVolume7.png',
        'radioVolume8.png',
        'radioVolume9.png',
        'radioVolume10.png',
        'radioVolume11.png',
        'multiple.png',
        'dead.png',
        'volumecontrol.png',
        'HS.png',
        'HND.png',
        'HSon.png',
        'HNDon.png',
        'SIMULATE.png',
        'SIMULATEon.png',
    ]);
    Resources.onReady(init);

    /* Assign the canvas' context object to the global variable (the window
     * object when run in a browser) so that developer's can use it more easily
     * from within their app.js files.
     */
    global.ctx = ctx;
})(this);
