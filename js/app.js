
// Place the MAINSCREEN object in a variable called TSP
var TSP = new MAINSCREEN();

var allButtons = {buttons:[],extrabuttons:[],dialpadbuttons:[],radioChannels:[]};

//ALL RADIOS
/*Create all Channels to be used on the TSP
Place all radioChannel objects in an array called allElements*/


frequencies.forEach(radio => {
    var rad = new radioChannel(radio);
    allButtons.radioChannels.push(rad);

    window[radio.name.toLowerCase()] = rad;
});

//ALL BUTTONS
/*Create all button to be used on the TSP*/

function createAllButtons(){
    buttons.forEach(function(button) {
        button.col = button.col+1;
        button.row = button.row+1;
        var newbutton = new Button(button);
        if(typeof button.extrafunc === 'undefined'){
            if(newbutton.soundsource){
                newbutton.sound = new Audio(newbutton.soundsource);
            }
            allButtons.buttons.push(newbutton);
        }
        else{
                if(button.extrafunc){
                    newbutton.visible = false;
                    allButtons.extrabuttons.push(newbutton);
            
                }
                if(!button.extrafunc){
                    newbutton.visible = false;
                    newbutton.soundsource = "sounds/dtmf/"+newbutton.name+".wav";
                    newbutton.sound = new Audio(newbutton.soundsource);
                    allButtons.dialpadbuttons.push(newbutton);
                }
            }
        
        window[button.name.toLowerCase()] = newbutton;
        //eval("var " + button.name + " = 2");
    });
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

  //MOUSE
/*Get the mouse position relative to the canvas
,not just to the screen, and return the X and Y position.*/
function getMousePos(canvas, evt)
{
    var rect = canvas.getBoundingClientRect();
    return {x: evt.clientX - rect.left, y: evt.clientY - rect.top};
}

//CLOCK
/*Display a 24H format clock on the screen*/

function getClock(){

    d = new Date();
    str = Calculate(d.getHours(), d.getMinutes(), d.getSeconds());
}

//BUTTONS
    /*Checks if a button has been pressed*/
    function checkIfButtons(row, col){
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

         //Updates HS and HND on screen
         if(volpad.pressed){
            //HS column
            if(col == hs.col && thinrow > 8 && thinrow < 25){
                
               hs.y = (1/hs.row)*mouse.y;
               if(hs.y < 41.2){hs.y = 41.2}
               radio1sound.volume = Math.abs(1 - mapNumRange(mouse.y,200,560,0.5,1));
               radio4sound.volume = Math.abs(1 - mapNumRange(mouse.y,200,560,0.5,1));
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

        var RButtons = allButtons.buttons;
        var extrabuttons = allButtons.extrabuttons;
        var dialpadbuttons = allButtons.dialpadbuttons;

        RButtons.forEach(function(button) {
            if( !lockscreen.pressed && button.row == row && button.col == col){

                //DIAL PAD
                if(button.name == "DIALPAD"){
                    volpad.pressed ? volpad.close() : "volpad";
                    replay.pressed ? replay.close() : "replay";
                 }

                 //VOLPAD
                 if(button.name == "VOLPAD"){
                    volleftrow.pressed ? volleftrow.close() : "replay";
                    volrightrow.pressed ? volrightrow.close() : "volrightrow";
                    replay.pressed ? replay.close() : "replay";
                    dialpad.pressed ?  dialpad.close() :"dialpad";
                    selectrole.pressed ?  selectrole.close() :"selectrole";
                 }

                 //SELECT ROLE
                 if(button.name == "SELECTROLE"){
                    volpad.pressed ? volpad.close() : "volpad";
                 }

                //DA PAGES
                if(button.name == "DA"){
                   if(button.pressed){
                    line0.visible = false;
                    twr.visible = false;
                    button.pressed = undefined;button.sprite="lastpage.png";
                   }
                   else if(button.pressed == undefined){
                    console.log("undefin")
                    button.pressed = true;
                    line0.visible = true;
                    twr.visible = true;
                   }else{
                    line0.visible = false;
                    twr.visible = false;
                   }
                }

                //END CALL
                if(button.name == "ENDCALL"){
                   
                    if(endcall.pressed){
                        if(line0.pressed && line0.visible){line0.pressed = false; line0.sound.pause();}
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
                if(button.name =="LINE0" && line0.visible){
                    if(calldivert.pressed){
                        button.pressed=true;
                        button.sound.pause();
                        calldivert.pressed = false;
                        setTimeout(() => {
                            window.alert("You cant call divert to this line");
                        }, 100);
                        
                    }

                    if(posmon.pressed){
                        button.pressed=true;
                        button.sound.pause();
                        posmon.pressed = false;
                        setTimeout(() => {
                            window.alert("You cant monitor a line");
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
                if(button.name =="TWR" && twr.visible){
                   if(calldivert.pressed){
                    calldivert.pressed = undefined;
                    calldivert.sprite = "CALLDIVERTTWR.png";
                    twr.pressed = true;
                   }

                   if(posmon.pressed){
                   posmon.pressed = undefined;
                   posmon.sprite = "POSMONTWR.png";
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

                //PIS MON
                if(button.name == "POSMON"){
                    if(button.sprite == "POSMONTWR.png"){
                        posmon.pressed = true;
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
                if(button == lockscreen && button.row == row && button.col == col){
                    button.grab(row,col);
                }
            }
        });

        extrabuttons.forEach(function(button) {
            
            if(button.row == row && button.col == col ){
                button.grab(row,col);

                //VOL LEFT
                if(button.name == "VOLLEFTROW"){
                    volpad.pressed ? volpad.close() : "volpad";
                    dialpad.pressed ? dialpad.close() : "dialpad";
                 }

                 //VOL LEFT
                if(button.name == "VOLRIGHTROW"){
                    volpad.pressed ? volpad.close() : "volpad";
                    dialpad.pressed ? dialpad.close() : "dialpad";
                 }

                //ROLE ID
                if(button.name == "ROLEID"){
                    audiolevel.pressed ? audiolevel.pressed = false : audiolevel.pressed = true;
            
                    setTimeout(function(){
                        button.pressed = false;
                    },100)
                }

                //CHIME
                if(button.name =="CHIMETEST" && !xfer.visible){
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
        if(volleftrow.pressed | volrightrow.pressed){freqlock.pressed = true;}
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