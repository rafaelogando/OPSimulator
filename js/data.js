var radio1sound = new Audio("sounds/121.5.mp3");
var radio4sound = new Audio("sounds/atis.mp3");
var chimetestsound = new Audio("sounds/chimetest.wav");
var lineTone = new Audio("sounds/dialTone.wav");
var lineTimeout = new Audio("sounds/linetimeout.mp3");
var thincol;
var thinrow;
var mouse={};
var col; 
var row;
var d;
var str;

var frequencies = 
[
    {name:"radio1",frecuency:"124.300 LON",row:1,col:1},
    {name:"radio2",frecuency:"124.600 LON",row:2,col:1},
    {name:"radio3",frecuency:"126.900 LON",row:3,col:1},
    {name:"radio4",frecuency:"127.650 LOA",row:4,col:1},
    {name:"radio5",frecuency:"121.500 LON",row:5,col:1},
    {name:"radio6",frecuency:"119.300 LON",row:6,col:1},
    {name:"radio7",frecuency:"123.100 LON",row:7,col:1},
    {name:"radio8",frecuency:"124.300 REN",row:1,col:3},
    {name:"radio9",frecuency:"124.600 REN",row:2,col:3},
    {name:"radio10",frecuency:"124.800 REN",row:3,col:3},
    {name:"radio11",frecuency:"126.900 REN",row:4,col:3},
    {name:"radio12",frecuency:"119.750 REN",row:5,col:3},
    {name:"radio13",frecuency:"119.000 REN",row:6,col:3},
    {name:"radio14",frecuency:"123.100 REN",row:7,col:3}]
;

var buttons = 
[
{name:"VOLPAD", col:4, row:0},
{name:"SELECTROLE", col:11, row:0},
{name:"DIALPAD", col:11, row:6},
{name:"DA", col:4, row:7, lastpage:"lastpage.png"},
{name:"REPLAY", col:5, row:7},
{name:"CHIME", col:6, row:7},
{name:"CALLDIVERT", col:7, row:7},
{name:"PRIO", col:8, row:7},
{name:"IC", col:9, row:7},
{name:"PHONELIST", col:10, row:7},
{name:"SPLIT", col:4, row:8},
{name:"LOCKSCREEN", col:5, row:8},
{name:"POSMON", col:6, row:8},
{name:"HOLD", col:8, row:8},
{name:"XFER", col:9, row:8},
{name:"CONF", col:10, row:8},
{name:"LOUDSPEAKER", col:0, row:8},
{name:"FREQLOCK", col:1, row:8},
{name:"COUPLE", col:2, row:8},
{name:"ONCHANNEL", col:3, row:8},
{name:"row1", col:3, row:1},
{name:"row2", col:3, row:2},
{name:"row3", col:3, row:3},
{name:"row4", col:3, row:4},
{name:"row5", col:3, row:5},
{name:"row6", col:3, row:6},
{name:"row7", col:3, row:7},
{name:"HS", col:4, row:4},
{name:"HND", col:5, row:4},
{name:"PTT", col:0, row:9},
{name:"SIMULATE", col:10, row:9},
{name:"ENDCALL", col:11, row:7},
{name:"EXTRAFUNC", col:7, row:8},
{name:"audiolevel", col:5, row:0},
{name:"CHIMEMULTI", col:5, row:7, extrafunc:true},
{name:"RADCONN", col:6, row:7, extrafunc:true},
{name:"CROSSCONN", col:7, row:7, extrafunc:true},
{name:"TELCONN", col:8, row:7, extrafunc:true},
{name:"CALLPICKUP", col:9, row:7, extrafunc:true},
{name:"MAINSTBY", col:4, row:8, extrafunc:true},
{name:"VOLLEFTROW", col:5, row:8, extrafunc:true},
{name:"VOLRIGHTROW", col:6, row:8, extrafunc:true},
{name:"ROLEID", col:8, row:8, extrafunc:true},
{name:"CHIMETEST", col:9, row:8, extrafunc:true},
{name:"SELECTFREQ", col:0, row:8, extrafunc:true},
{name:"BASEBTN", col:1, row:8, extrafunc:true},
{name:"BTS", col:2, row:8, extrafunc:true},
{name:"BSS", col:3, row:8, extrafunc:true},
{name:"CRASHALARM", col:10, row:8, extrafunc:true},
{name:"LINE0", col:4, row:1, soundsource:"sounds/dtmf/LINE0.wav",test:"aa"}, //Si extrafunc = false entonces es un boton del dialpad
{name:"TWR", col:5, row:1, soundsource:"sounds/twr.mp3"},
{name:"DIAL1", col:4, row:3,extrafunc:false,showtime:1},
{name:"DIAL2", col:5, row:3,extrafunc:false,showtime:1},
{name:"DIAL3", col:6, row:3,extrafunc:false,showtime:1},
{name:"DIAL4", col:4, row:4,extrafunc:false,showtime:1},
{name:"DIAL5", col:5, row:4,extrafunc:false,showtime:1},
{name:"DIAL6", col:6, row:4,extrafunc:false,showtime:1},
{name:"DIAL7", col:4, row:5,extrafunc:false,showtime:1},
{name:"DIAL8", col:5, row:5,extrafunc:false,showtime:1},
{name:"DIAL9", col:6, row:5,extrafunc:false,showtime:1},
{name:"DIAL0", col:5, row:6,extrafunc:false,showtime:1},
];
