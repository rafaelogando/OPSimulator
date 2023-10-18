/* Engine.js
 * This file provides the loop functionality (update entities and render),
 * draws the initial board on the screen(canvas context(ctx)), and then calls the update and
 * render methods.
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

        canvas.width = 927;
        canvas.height = 730;
        
        doc.body.appendChild(canvas);

    //MOUSE UP
    canvas.addEventListener("mouseup",function(event)
    {
        var rect = canvas.getBoundingClientRect();
        mouse.x = event.clientX - rect.left;
        mouse.y = event.clientY - rect.top;

        col = (mouse.x - mouse.x%65)/65;
        row =  (mouse.y - mouse.y%65)/65;
        thincol = (mouse.x - mouse.x%22)/22;
        thinrow =  (mouse.y - mouse.y%22)/22;

        checkIfRadioPress(row, col);
        checkIfButtons(row, col);
    });


    //RADIOS
    /*Checks if a channel button has been pressed*/
    function checkIfRadioPress(row, col){
        var radios = allButtons.radioChannels;

        radios.forEach(function(radioChannel){
            if(!lockscreen.pressed && !freqlock.pressed && radioChannel.row == row-1 && radioChannel.col == col |radioChannel.col+1 == col){
                radioChannel.grab(row,col); 
                if(radioChannel.name == 'radio1'){
                    if(radioChannel.sprite =="BASERX.png" | radioChannel.sprite =="BASETX.png"){
                    radio1sound.play(); 
                    }else{radio1sound.pause();console.log("pausing")}
                }

                if(radioChannel.name == 'radio4'){
                    if(radioChannel.sprite =="BASERX.png" | radioChannel.sprite =="BASETX.png"){
                    radio4sound.play(); 
                    }else{radio4sound.pause();console.log("pausing")}
                }
            }
        })
    }


    //ENVIROMENT
    /*Sets the initial scenario*/
    function setEmbiroment(){
        radio1.onuse = true;
        radio1.activePTT = true;
        radio4.AG = true;
        radio4.onuse = true;
        radio8.forecoupled = true;
        radio9.forecoupled = true;
        allButtons.radioChannels[2].onuse = true;
        allButtons.radioChannels[2].AG = true;
        allButtons.radioChannels[1].onuse = true;
        allButtons.radioChannels[5].onuse = true;
        allButtons.radioChannels[11].onuse = true;

        var vols = [row1,row2,row3,row4,row5,row6,row7];
        vols.forEach(function(vol){vol.visible = false;});

        //HS/HND Enbiroment
        /*Change button position on screen and hides them*/

        for (let index = 0; index < 7; index++){
            vols[index].y = vols[index].y + (10/(index+1));
        }

        hs.x = 68.5;
        hnd.x = 68;

        hs.visible = false;
        hnd.visible = false
    

        row1.on = ''+row1.name+'.png';
        row2.on = ''+row2.name+'.png';
        row3.on = ''+row3.name+'.png';
        row4.on = ''+row4.name+'.png';
        row5.on = ''+row5.name+'.png';
        row6.on = ''+row6.name+'.png';
        row7.on = ''+row7.name+'.png';
        
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
        allButtons.radioChannels.forEach(function(radioChannel) {
            radioChannel.update(dt);
            radioChannel.simulate(dt);
            //radioChannel.grab();
        });

        allButtons.buttons.forEach(function(button) {
            button.update(dt);
            //button.grab();
        });
        allButtons.extrabuttons.forEach(function(button) {
            button.update(dt);
            //button.grab();
        });
        allButtons.dialpadbuttons.forEach(function(button) {
            button.update(dt);
            //button.grab();
        });
        TSP.update(dt);

    }

    //Draws everything on screen
    function render() {
        Over();

        //Background
        TSP.render();

        //Draw Radio Channels
        var radios = allButtons.radioChannels;
        var RButtons = allButtons.buttons;
        var extrabuttons = allButtons.extrabuttons;
        var dialpadbuttons = allButtons.dialpadbuttons;
        ctx.fillStyle="black";
        ctx.font = "9pt impact"
        renderRadios(radios);
        renderButtons(extrabuttons);
        renderButtons(RButtons);
        renderButtons(dialpadbuttons);
        
        
        renderClock();
    }

    function renderRadios(radios){ 
            
        radios.forEach(function(radioChannel) {
            radioChannel.render();
        });
        
        //CLOCK
        ctx.font = "40pt calibri";
        ctx.fillText(str, 30+65, 50+65);
    }

    function renderButtons(Rbuttons){
        Rbuttons.forEach(function(button) {
            if(button.visible){
                button.render();
                if(typeof button.popuprender === "function" && button.pressed){
                    button.popuprender();
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
        'VOL.png',
        'HS.png',
        'HND.png',
        'HSon.png',
        'HNDon.png',
        'SIMULATE.png',
        'SIMULATEon.png',
        'DIAL.png',
        'REPLAYWINDOW.png',
        'CHIMEMULTI.png',
        'CHIMEMULTIon.png',
        "SIMULATE.png",
        "ENDCALL.png",
        "EXTRAFUNC.png",
        "CHIMEMULTI.png",
        "RADCONN.png",
        "CROSSCONN.png",
        "TELCONN.png",
        "CALLPICKUP.png",
        "MAINSTBY.png",
        "VOLLEFTROW.png",
        "VOLRIGHTROW.png",
        "ROLEID.png",
        "CHIMETEST.png",
        "SELECTFREQ.png",
        "BSS.png",
        "BTS.png",
        "BASEBTN.png",
        "ENDCALLon.png",
        "EXTRAFUNCon.png",
        "CHIMEMULTIon.png",
        "RADCONNon.png",
        "CROSSCONNon.png",
        "TELCONNon.png",
        "CALLPICKUPon.png",
        "MAINSTBYon.png",
        "VOLLEFTROWon.png",
        "VOLRIGHTROWon.png",
        "ROLEIDon.png",
        "CHIMETESTon.png",
        "SELECTFREQon.png",
        "BSSon.png",
        "BTSon.png",
        "BASEBTNon.png", 
        "CRASHALARMon.png",
        "CRASHALARM.png",
        "PHONELISTWINDOW.png",
        "LINE0.png",
        "LINE0on.png",
        "DIAL0.png",
        "DIAL0on.png",
        "DIAL1.png",
        "DIAL1on.png",
        "DIAL2.png",
        "DIAL2on.png",
        "DIAL3.png",
        "DIAL3on.png",
        "DIAL4.png",
        "DIAL4on.png",
        "DIAL5.png",
        "DIAL5on.png",
        "DIAL6.png",
        "DIAL6on.png",
        "DIAL7.png",
        "DIAL7on.png",
        "DIAL8.png",
        "DIAL8on.png",
        "DIAL9.png",
        "DIAL9on.png",
        "row1.png",
        "row2.png",
        "row3.png",
        "row4.png",
        "row5.png",
        "row6.png",
        "row7.png",
        "lastpage.png",
        "audiolevel.png",
        "audiolevelon.png",
        "roleiddisplay.png",
        "tsp.png",
        "tester.png",
        "TWR.png",
        "TWRon.png",
        "CALLDIVERTTWR.png",
        "POSMONTWR.png",
        "doubleuparrow.png",
        "singleuparrow.png",

    ]);
    Resources.onReady(init);

    /* Assign the canvas' context object to the global variable (the window
     * object when run in a browser) so that developer's can use it more easily
     * from within their app.js files.
     */
    global.ctx = ctx;
})(this);
