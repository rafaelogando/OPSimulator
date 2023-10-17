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
    var radio1sound = new Audio("sounds/121.5.mp3");
    var chimetestsound = new Audio("sounds/chimetest.wav");
    //var ringtone = new Audio("sounds/ringtone.mp3");
    radio1sound.loop = true;        
    radio1sound.volume = 0.3;
    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        lastTime;

        const mapNumRange = (num, inMin, inMax, outMin, outMax) =>
        ((num - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
        canvas.width = 927;
        canvas.height = 730;
        
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
    12 colums and 9 rows.
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
    */

    //MOUSE UP
    //So far used for vol pad HS/HND controls
    canvas.addEventListener("mouseup",function(event)
    {
        var mouse = getMousePos(canvas,event);
        var col = (mouse.x - mouse.x%65)/65;
        var row =  (mouse.y - mouse.y%65)/65;
        var thincol = (mouse.x - mouse.x%22)/22;
        var thinrow =  (mouse.y - mouse.y%22)/22;

        console.log('col '+col+" "+'row '+row);

        //Updates HS and HND on screen
        if(volpad.pressed){
            //HS column
            if(col == hs.col && thinrow > 8 && thinrow < 25){
                
               hs.y = (1/hs.row)*mouse.y;
               if(hs.y < 41.2){hs.y = 41.2}
               console.log(hs.y);
               radio1sound.volume = Math.abs(1 - mapNumRange(mouse.y,200,560,0.5,1));
           }
            //HND column
            if(col == hnd.col && row > 2 && thinrow < 25){
               hnd.y = (1/hnd.row)*mouse.y;
               if(hnd.y < 41.2){hnd.y = 41.2}
               
               twr.sound.volume = line0.sound.volume = lineTimeout.volume = Math.abs(1 - mapNumRange(mouse.y,200,560,0.5,1));
           }
       }

       //Updates vol on screen
       var vols = [row1,row2,row3,row4,row5,row6,row7];
       
       if(volleftrow.pressed){

        vols.forEach(function(vol){
        if(row == vol.row && col > 2){
                if(thincol > 15){
                    vol.col = 4.2;
                }else{
                    vol.x = (1/vol.col)*mouse.x;
                }  
           }
       });

        }
        if(volrightrow.pressed){

        vols.forEach(function(vol){
        if(row == vol.row && thincol > 14){
                if(thincol > 21){
                    vol.col = 6.2;
                }else{
                    vol.x = (1/vol.col)*mouse.x;
                }  
           }
       });
        }
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
        if(hour >= 20){
            hour = hour - 24;
        }
        hour = hour + 4;
        
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

            radios.forEach(function(radioChannel){
                if(!lockscreen.pressed && !freqlock.pressed && radioChannel.row == row-1 && radioChannel.col == col |radioChannel.col+1 == col){
                    radioChannel.grab(row,col); 
                    if(radioChannel.name == 'radio1'){
                       if(radioChannel.sprite =="BASERX.png" | radioChannel.sprite =="BASETX.png"){
                        radio1sound.play(); 
                       }else{radio1sound.pause();console.log("pausing")}
                       
                       console.log(radioChannel.sprite)
                       
                    }
                    console.log(radioChannel.name);
                
                    
                }
            })
        
        
    }

    //BUTTONS
    /*Checks if a button has been pressed*/
    function checkIfButtons(row, col){

        var RButtons = allButtons[0].buttons;
        var extrabuttons = allButtons[1].extrabuttons;
        var dialpadbuttons = allButtons[2].dialpadbuttons;

        RButtons.forEach(function(button) {
            if( !lockscreen.pressed && button.row == row && button.col == col){

                //DA PAGES
                if(button.name == "DA"){
                   if(button.pressed){
                    button.pressed = undefined;button.sprite="lastpage.png";
                   }
                   else if(button.pressed == undefined){
                    console.log("undefin")
                    button.pressed = true;
                   }
                }

                //END CALL
                if(button.name == "ENDCALL"){
                   
                    if(endcall.pressed){
                        if(line0.pressed){line0.pressed = false; line0.sound.pause();}
                    }else{
                        endcall.pressed=true;
                    }
                    if(endcall.pressed){
                        if(twr.pressed){twr.pressed = false; twr.sound.pause();}
                    }else{
                        endcall.pressed=true;
                    }
                    
                }
                
                //LINE0
                if(button.name =="LINE0" ){
                    if(calldivert.pressed){
                        button.pressed=true;
                        button.sound.pause();
                        calldivert.pressed = false;
                        setTimeout(() => {
                            window.alert("You cant call divert to this line");
                        }, 100);
                        
                    }
                        if(line0.pressed){
                            endcall.pressed = false;
                        }else{
                            endcall.pressed = true;
                             line0.sound.pause();
                            }
                   
                        lineTimeout.pause();
                    
                        if(button.sound){
                            if (button.pressed){
                                button.sound.pause()
                            }

                            //Add sound after line tone timeout
                            button.sound.onended= function() {myFunction()};

                            function myFunction() {
                                lineTimeout.loop = true;
                                lineTimeout.play();
                            }
                        }
                
                    
                }

                //TWR
                if(button.name =="TWR" ){
                   if(calldivert.pressed){
                    calldivert.pressed = undefined;
                    calldivert.sprite = "CALLDIVERTTWR.png";
                    twr.pressed = true;
                    
                   }
                        if(twr.pressed){
                            
                            endcall.pressed = false;
                        }else{
                            endcall.pressed = true;
                             line0.sound.pause();
                            }
                   
                        if(button.sound){
                            if (button.pressed){
                                button.sound.pause()
                            }

                        }
                
                }

                //CALL DIVERT
                if(button.name == "CALLDIVERT"){
                    if(button.sprite == "CALLDIVERTTWR.png"){
                        calldivert.pressed = true;
                    }
                }

                
                
                button.grab(row,col);
                
                if(typeof button.popup === "function" && button.visible){
                    button.popup();
                }
                button.popupstoclose.forEach(function(funt){
                    funt.close();
                });
            }
            else{
                if(button == allButtons[0].buttons[11] && button.row == row && button.col == col){
                    button.grab(row,col);
                }
            }
        });

        extrabuttons.forEach(function(button) {
            
            if(button.row == row && button.col == col && button.visible){
                button.grab(row,col);

                //ROLE ID
                if(button.name == "ROLEID"){
                    audiolevel.pressed ? audiolevel.pressed = false : audiolevel.pressed = true;
            
                    setTimeout(function(){
                        button.pressed = false;
                    },100)
                }

                //CHIME
                if(button.name =="CHIMETEST"){
                    if(!chime.pressed){
                        chimetestsound.play();
                    }else{window.alert("Chime is OFF");}
                    
                    setTimeout(function(){
                        button.pressed = false;
                    },100)
                    
                }

              
                //POPUP
                if(typeof button.popup === "function" && button.visible){
                    button.popup();
                }
                button.popupstoclose.forEach(function(funt){
                    funt.close();
                });
            }
        });

        dialpadbuttons.forEach(function(button) {
            if(button.row == row && button.col == col && !hs.visible && !hnd.visible){
                button.grab(row,col);
                setTimeout(function(){
                    button.pressed = false;
                },10)
                //DIAL PAD
                //Stop line sound when any dial key is pressed
                line0.sound.pause();
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
                        clientX: simulate.col*simulate.x,
                        clientY: simulate.row*simulate.y,
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

        //VOLPAD HS HND
        if(volpad.pressed){
            hs.visible=true;
            hnd.visible = true;
        }else{
            hs.visible=false;
            hnd.visible = false;
        }

        var vols = [row1,row2,row3,row4,row5,row6,row7];
        
        if(volleftrow.pressed){
            vols.forEach(function(vol){vol.visible = true;vol.col = 3});
        }
        if(volrightrow.pressed){
            vols.forEach(function(vol){vol.visible = true;vol.col = 5;});
        }

        if(!volrightrow.pressed && !volleftrow.pressed){
            vols.forEach(function(vol){vol.visible = false;});
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

        // Audio files
        
        this.lineTone = new Audio("sounds/dialTone.wav");
        this.lineTimeout = new Audio("sounds/linetimeout.mp3")
        this.lineTimeout.volume=1;
        this.lineTone.volume =1;

        this.lineTone.load();

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
        allButtons[1].extrabuttons.forEach(function(button) {
            button.update(dt);
            //button.grab();
        });
        allButtons[2].dialpadbuttons.forEach(function(button) {
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
        var radios = allElements[0].radioChannels;
        var RButtons = allButtons[0].buttons;
        var extrabuttons = allButtons[1].extrabuttons;
        var dialpadbuttons = allButtons[2].dialpadbuttons;
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
        "CALLDIVERTTWR.png"

    ]);
    Resources.onReady(init);

    /* Assign the canvas' context object to the global variable (the window
     * object when run in a browser) so that developer's can use it more easily
     * from within their app.js files.
     */
    global.ctx = ctx;
})(this);
