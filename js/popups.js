//SPECIAL FUNCTIONS HERE
function createPopups(){

    //button asociado, imagepopup, botton/es de cierre, 

    var pop = function pop(basebutton) {

        var name = basebutton.name.toLowerCase();
        eval(
            name+'.popup = function popup(){'+
           
            'buttonstocover('+ name +'.pressed,'+name+'.buttonstocover);'+
            'buttonstoshow('+ name +'.pressed,'+name+'.buttonstoshow);'+
            '}')
    }
    var popclose = function pop(basebutton, buttontoclose) {

        var name = basebutton.name.toLowerCase();
        var close = buttontoclose.name.toLowerCase();
        eval(
            name+'.popupstoclose.push('+
            '{close:function close(){'+
                close+'.close();'+
            '}'+
            '})');
    }

    var runclose = function runclose(basebutton) {
        var name = basebutton.name.toLowerCase();
        eval(
            name+ '.close = function close(){'+
            'if('+name+'.pressed){'+
                'buttonstocover(false,'+name+'.buttonstocover);'+
                'buttonstoshow(false,'+name+'.buttonstoshow);'+
                name+'.pressed = false;}'+
            '}')
    }

    function buttonstocover(bol, buttonstocove){
        buttonstocove.forEach(function(button){
            
            if(!bol){
                button.visible = true;
            }
            else{
                button.visible =false;
                }

        });
    }

        function buttonstoshow(bol, buttonstoshow){
        buttonstoshow.forEach(function(button){
            if(bol){
                button.visible = true;
                //console.log(true);
            
            }
            else{
                button.visible = false;
            }

        });
    }

        function render(basebutton,src,tempcol,temprow) {
        var name = basebutton.name.toLowerCase();
        var row = basebutton.row;
        var col = basebutton.col;
        var func =name+ '.popuprender = function pop(){\n'+
            name+'.sprite =\''+src+'\';\n'+
            name+'.row ='+temprow.toString()+';\n'+
            name+'.col ='+tempcol.toString()+';\n'+
            name+'.render();\n'+
            
            name+'.row ='+row.toString()+';\n'+
            name+'.col ='+col.toString()+';\n'+
         
            '}'
        eval(func);
    }

    function aplypop(basebutton, closebuttons, image,col ,row){
        pop(basebutton);
        runclose(basebutton);
        closebuttons.forEach(function(button){
            popclose(button, basebutton);
        });
        render(basebutton,image,col,row);
    }

    aplypop(selectrole,[xfer,conf],'ROLEWINDOW.png',5,2)
    let copy = allButtons.buttons;
    selectrole.buttonstocover = copy.slice(3,16).concat(extrafunc,line0,audiolevel,twr);
    

    aplypop(volpad, [split,lockscreen], 'VOLPADWINDOW.png',5,2);
    volpad.buttonstocover = [da,replay,split,lockscreen,line0,twr];

    aplypop(dialpad,[da,replay], 'DIAL.png',5,3);
    dialpad.buttonstocover = [da,replay,chime,calldivert,chimemulti, radconn,crossconn];
    dialpad.buttonstoshow = allButtons.dialpadbuttons;

    aplypop(replay,[conf],'REPLAYWINDOW.png',5,2);
    replay.buttonstocover = copy.slice(9,20).concat(extrafunc,chime,calldivert,prio,ic,line0,twr);

    aplypop(extrafunc,[],'EXTRAFUNCon.png',extrafunc.col,extrafunc.row);
    extrafunc.buttonstocover = [replay, chime,calldivert,prio,ic,split,lockscreen,posmon,hold,conf,xfer,onchannel,couple, freqlock,loudspeaker];
    extrafunc.buttonstoshow = allButtons.extrabuttons;

    aplypop(phonelist,[conf],'PHONELISTWINDOW.png',5,2);
    phonelist.buttonstocover = [extrafunc,split,lockscreen,posmon,hold,xfer,conf,line0,twr];

    aplypop(volleftrow,[bts,bss,mainstby],'VOL.png',3,2);
    volleftrow.buttonstocover = [bts,bss,mainstby,line0,da,twr];

    aplypop(volrightrow,[mainstby,volleftrow],'VOL.png',5,2);
    volrightrow.buttonstocover = [mainstby,volleftrow,line0,da,twr];

}


