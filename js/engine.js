/* Engine.js
 * This file provides the loop functionality (update entities and render),
 * draws the initial board on the screen, and then calls the update and
 * render methods on your objects (defined in your app.js).
 *
 * Works by drawing the entire screen over and over, kind of
 * like a flipbook you may have created as a kid. When your TSP moves across
 * the screen, it may look like just that image is moving or being
 * drawn but that is not the case. What's really happening is the entire "scene"
 * is being drawn over and over, presenting the illusion of animation.
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


        //Get the mouse position relative to the canvas
        //,not just to the screen, and return the X and Y position.
        function getMousePos(canvas, evt) 
        {
            var rect = canvas.getBoundingClientRect();
            return {x: evt.clientX - rect.left, y: evt.clientY - rect.top};
        }

    //CLICK
    //checks if the "try again" button has been clicked and completely 
    //restar the app if so. This button only appears after a mistake is make.
    canvas.addEventListener("click",function(event)
    {
        var mouse = getMousePos(canvas,event);
        var col = (mouse.x - mouse.x%65)/65;
        var row =  (mouse.y - mouse.y%65)/65;
        if(col == 11 && row == 8){row = 7}
            
        
        console.log( "columna: " + col + " fila: " + row);
        checkIfRadioPress(row, col);
        checkIfPtt(row, col);
        checkIfButtons(row, col);

        if(gameOver&&getMousePos(canvas,event).x > 312 && getMousePos(canvas,event).x < 488 && getMousePos(canvas,event).y > 403 && getMousePos(canvas,event).y < 463)
        {
            console.log("you made a mistake");
        } 
    });

    doc.body.appendChild(canvas);

    //CLOCK
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
    function checkIfRadioPress(row, col){
        var radios = allElements[0].radioChannels;
                if(col < 4 && row > 0 && row < 8){
                    console.log("Radio clicked");

                
                    radios.forEach(function(radioChannel) {
                        //row-1 because starts at row 1 instead of row 0
                        if(radioChannel.col == col && radioChannel.row == row-1){
                            console.log("matchRX");
                            radioChannel.selected = false;
                            if (radioChannel.sprite == 'images/BASERX.png') {radioChannel.sprite = 'images/radioElement.png' }
                                else{radioChannel.sprite = 'images/BASERX.png';}
                            
                        }
                        if(radioChannel.col == col-1 && radioChannel.row == row-1){
                            console.log("matchTX");
                            radioChannel.sprite = 'images/BASETX.png';
                            radioChannel.selected = true;
                        }   
                });
            }
    }

    //PTT
    function checkIfPtt(row, col){

        var radios = allElements[0].radioChannels;
        if(col < 2 && row > 8 ){
            if(TSP.PTT == true){
                TSP.PTT = false;
                TSP.PTTSRC ='images/ptt.png';
            }else{TSP.PTTSRC ='images/pttdown.png';TSP.PTT = true;}
            console.log("PTT");
        }
    }

    //SPEAKER
    function checkIfLoudSpeaker(row, col){

        var radios = allElements[0].radioChannels;
        if(col == 0 && row == 8 ){
            if(TSP.loudSpeaker == true){
                TSP.loudSpeaker = false;
                TSP.loudSpeakerSrc ='images/speakeroff.png';
            }else{TSP.loudSpeakerSrc ='images/speakeron.png';TSP.loudSpeaker = true;}
            console.log("SPK");
        }
    }

    //BUTTONS
    function checkIfButtons(row, col){
        var RButtons = allButtons[0].buttons;

        RButtons.forEach(function(button) {
                    //row-1 because starts at row 1 instead of row 0
                if(button.visible){
                    if(button.col == col && button.row == row){
                        if(!button.pressed){
                            button.sprite = button.on;
                            button.pressed = true;
                        }
                        else{
                            if(button.name == "SELECTROLE"){
                                for (var i = 0; i < 15; i++) {
                            allButtons[0].buttons[i+7].visible = true;
                            }
                                allButtons[0].buttons[2].visible = true;
                            }
                            button.sprite = button.off;
                            button.pressed = false;}
                    } 
                }else if(button.col == col && button.row == row && (button.name == "DA" || button.name == "REPLAY") ){
                    var volpad = allButtons[0].buttons[0];
                    volpad.sprite = volpad.off;
                    volpad.pressed = false;
                    volpad.visible=true;
                    allButtons[0].buttons[8].visible = true;
                    allButtons[0].buttons[7].visible = true;
                }
                else if(button.col == col && button.row == row && (button.name == "ENDCALL" || button.name == "CONF" ) ){
                    var volpad = allButtons[0].buttons[1];
                    volpad.sprite = volpad.off;
                    volpad.pressed = false;
                    volpad.visible=true;
                    for (var i = 0; i < 15; i++) {
                        allButtons[0].buttons[i+7].visible = true;
                    }
                    allButtons[0].buttons[2].visible = true;
                }
                else if(button.col == col && button.row == row && (button.name == "LOCKSCREEN" || button.name == "POSMON") ){
                    console.log("voll");
                    //var volpad = allButtons[0].buttons[1];
                    button.sprite = 'images/volumecontrol.png';
                    button.visible = true;
                    allButtons[0].buttons[7].visible = true;  
                }

        });
    }


    function setEmbiroment(){
        allElements[0]['radioChannels'][0].onuse = true;
        allElements[0]['radioChannels'][2].onuse = true;
        allElements[0]['radioChannels'][0].multiple = true;
        allElements[0]['radioChannels'][2].multiple = true;
        allElements[0]['radioChannels'][5].multiple = true;
        allElements[0]['radioChannels'][9].multiple = true;
    }

    /* This function serves as the kickoff point for the  loop itself
     * and handles properly calling the update and render methods.
     */
    function main() {
        /* Get our time delta information which is required if you
         * requires smooth animation. Because everyone's computer processes
         * instructions at different speeds we need a constant value that
         * would be the same for everyone (regardless of how fast their
         * computer is) - hurray time!
         */
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
     * particularly setting the lastTime variable that is required for the
     * game loop.
     */
    function init() {
        reset();
        lastTime = Date.now();
        main();
        //setRadioChannels();
        createAllButtons();
        setEmbiroment();
    }
    
 
    /* This function is called by main (our loop) and itself calls all
     * of the functions which may need to update entity's data. Based on how
     * you implement your collision detection (when two entities occupy the
     * same space), you may find the need to add an additional
     * function call here. For now you may or may not want to implement this
     * functionality this way (you could just implement collision detection
     * on the entities themselve within your app.js file).
     */
    function update(dt) {
        //updateEntities(dt);
    }
    
    //This function set the game over screen and make visible an "try again"
    //button
    function Over(){
        if(gameOver)
            {
                ctx.drawImage(Resources.get("images/gameOver.png"), 0,50);
                ctx.fillStyle="green";
                ctx.fillRect(312, 403, 176, 60);
                ctx.fillStyle="black";
                ctx.fillText("Try Again",322,450);
            }
    }

    function updateEntities(dt) {
      allEntities.forEach(function(radioChannel) {
            radioChannel.update(dt);
            radioChannel.grab();
        });
        TSP.update(dt);
    }

    //Draws everything on screen
    function render() {
        //getClock();
        Over();
        //Background
        ctx.drawImage(Resources.get('images/tspBase.png'),0,0);
        //PTT BUTTON
        ctx.drawImage(Resources.get(TSP.PTTSRC),0,600);

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
        
        for (var rows = 0; rows < TSP.radioRows; rows++) {
            var elements= radios[rows].elementsToAdd;
            
            radios.forEach(function(radioChannel) {

                ctx.drawImage(Resources.get(radioChannel.sprite),radioChannel.col/2*130,(radioChannel.row+1)*66);
                ctx.drawImage(Resources.get(elements.volume.src),radioChannel.col/2*130+elements.volume.positionx,(radioChannel.row+1)*66+elements.volume.positiony);
                

                if (radioChannel.selected) {
                    if(radioChannel.onuse && !TSP.PTT){
                        ctx.drawImage(Resources.get(elements.arrow.src2),radioChannel.col/2*130+elements.arrow.positionx,(radioChannel.row+1)*66+elements.arrow.positiony);
                    }
                    if(TSP.PTT && !radioChannel.onuse){
                        ctx.drawImage(Resources.get(elements.arrow.src),radioChannel.col/2*130+elements.arrow.positionx,(radioChannel.row+1)*66+elements.arrow.positiony);
                        ctx.drawImage(Resources.get("images/downarrow.png"),radioChannel.col/2*130+elements.arrow.positionx-60,(radioChannel.row+1)*66+elements.arrow.positiony);
                    }
                    if(radioChannel.multiple){
                        ctx.drawImage(Resources.get(elements.multiple.src),radioChannel.col/2*130+elements.multiple.positionx,(radioChannel.row+1)*66+elements.multiple.positiony);
                        
                    }
                    if(TSP.PTT && radioChannel.onuse){
                        window.alert("You shoud not PTT while a Channel is been used.");
                        TSP.PTT = false;
                    TSP.PTTSRC ='images/ptt.png';}

                    //ctx.drawImage(Resources.get(elements.arrow.src2),radioChannel.col/2*130+elements.arrow.positionx,(radioChannel.row+1)*66+elements.arrow.positiony);
                    //ctx.drawImage(Resources.get("images/downarrow.png"),radioChannel.col/2*130+elements.arrow.positionx-60,(radioChannel.row+1)*66+elements.arrow.positiony);
                }
                ctx.fillText(radioChannel.frecuency,radioChannel.col/2*130+elements.frecuency.positionx,(radioChannel.row+1)*66+elements.frecuency.positiony); 
          

                //ctx.drawImage(Resources.get(TSP.loudSpeakerSrc),0,8*66);
                });
        }
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
        'images/ptt.png',
        'images/speakeron.png',
        'images/speakeroff.png',
        'images/pttdown.png',
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
        'images/gameOver.png',
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
