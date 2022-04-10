//SPECIAL FUNCTIONS HERE
function createPopups(){

    //Select Role 
    selectrole.popup = function popup() {   
    		rolecover(true);
    	}
        
    //SELECT ROLE Close button
    endcall.popup = function popup(){
    	if(!endcall.visible){
    		selectrole.pressed = false;
    		rolecover(false);
    	}
    }

    //HIDE BELOW ROLE 
    function rolecover(bol){
        if(!bol){
            for (var i = 0; i < 15; i++) {
                allButtons[0].buttons[i+7].visible = true;
            }
            dialpad.visible = true;
        }else{
            for (var i = 0; i < 15; i++) {
                allButtons[0].buttons[i+7].visible = false;
            }
            dialpad.visible = false;
        }
    }

    //VOLPAD
    volpad.popup = function popup() {
        volpadcover(volpad.pressed)// body...
    }

    selectrole.popuprender = function popuprender() {
        selectrole.sprite = 'ROLEWINDOW.png';
        selectrole.row = 1;
        selectrole.col = 4;
        selectrole.render();

        selectrole.sprite = selectrole.on;
        selectrole.row = 0;
        selectrole.col = 11;
        selectrole.render();
    }

    //HIDE BELOW VOLPAD
    function volpadcover(bol){
        if(!bol){
            hs.visible = true;
            hnd.visible = true;
            da.visible = false;
            replay.visible = false;
        }
        else{
            hs.visible = false;
            hnd.visible = false;
            da.visible = true;
            replay.visible = false;
        }
    }

    volpad.popuprender = function(){
        if(volpad.pressed){
        this.sprite = 'VOLPADWINDOW.png';
        volpad.render();
    }
    }
}




