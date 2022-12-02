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

    aplypop(selectrole,[xfer,conf],'ROLEWINDOW.png',4,1)
    let copy = allButtons[0].buttons;
    selectrole.buttonstocover = copy.slice(3,16).concat(extrafunc);
    

    aplypop(volpad, [split,lockscreen], 'VOLPADWINDOW.png',4,1);
    volpad.buttonstocover = [da,replay,split,lockscreen,line0];

    aplypop(dialpad,[da,replay], 'DIAL.png',4,2);
    dialpad.buttonstocover = [da,replay,chime,calldivert];
    dialpad.buttonstoshow = allButtons[2].dialpadbuttons;

    aplypop(replay,[conf],'REPLAYWINDOW.png',4,1);
    replay.buttonstocover = copy.slice(9,20).concat(extrafunc,chime,calldivert,prio,ic,line0);

    aplypop(extrafunc,[],'EXTRAFUNCon.png',extrafunc.col,extrafunc.row);
    extrafunc.buttonstocover = allButtons[0].buttons.slice(3,20).concat(da);
    extrafunc.buttonstoshow = allButtons[1].extrabuttons;

    aplypop(phonelist,[conf],'PHONELISTWINDOW.png',4,1);
    phonelist.buttonstocover = copy.slice(7,12).concat(extrafunc).concat(copy.slice(14,20));

    aplypop(volleftrow,[bts,bss,mainstby],'VOL.png',2,1);
    volleftrow.buttonstocover = [bts,bss,mainstby,line0];

    aplypop(volrightrow,[mainstby,volleftrow],'VOL.png',4,1);
    volrightrow.buttonstocover = [mainstby,volleftrow,line0];
}


