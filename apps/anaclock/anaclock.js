const p = Math.PI/2;
const PRad = Math.PI/180;

let intervalRefMin = null;
let intervalRefSec = null;

let minuteDate = new Date();
let secondDate = new Date();

function seconds(angle, r) {
  const a = angle*PRad;
  const x = 120+Math.sin(a)*r;
  const y = 134-Math.cos(a)*r;
  if (angle % 90 == 0) {
    g.setColor(0,1,1);
    g.fillRect(x-6,y-6,x+6,y+6);
  } else if (angle % 30 == 0){
    g.setColor(0,1,1);
    g.fillRect(x-4,y-4,x+4,y+4);
  } else {
    g.setColor(1,1,1);
    g.fillRect(x-1,y-1,x+1,y+1);
  }
}
function hand(angle, r1,r2, r3) {
  const a = angle*PRad;
  g.fillPoly([
    120+Math.sin(a)*r1,
    134-Math.cos(a)*r1,
    120+Math.sin(a+p)*r3,
    134-Math.cos(a+p)*r3,
    120+Math.sin(a)*r2,
    134-Math.cos(a)*r2,
    120+Math.sin(a-p)*r3,
    134-Math.cos(a-p)*r3]);
}

function drawAll() {
  secondDate = minuteDate = new Date();
  // draw seconds
  g.setColor(1,1,1);
  for (let i=0;i<60;i++)
    seconds(360*i/60, 100);
  onSecond();
}

function onSecond() {
  g.setColor(0,0,0);
  hand(360*secondDate.getSeconds()/60, -5, 90, 3);
  if (secondDate.getSeconds() === 0) {
    hand(360*(minuteDate.getHours() + (minuteDate.getMinutes()/60))/12, -16, 60, 7);
    hand(360*minuteDate.getMinutes()/60, -16, 86, 7);
    minuteDate = new Date();
  }
  g.setColor(1,1,1);
  hand(360*(minuteDate.getHours() + (minuteDate.getMinutes()/60))/12, -16, 60, 7);
  hand(360*minuteDate.getMinutes()/60, -16, 86, 7);
  g.setColor(0,1,1);
  secondDate = new Date();
  hand(360*secondDate.getSeconds()/60, -5, 90, 3);
  g.setColor(0,0,0);
  g.fillCircle(120,134,2);
}

function stopdraw() {
  if(intervalRefSec) {clearInterval(intervalRefSec);}
}

function startdraw() {
  g.clear();
  Bangle.drawWidgets();
  minuteDate = new Date();
  secondDate = new Date();
  intervalRefSec = setInterval(onSecond,1000);
  drawAll();
}

function setButtons(){
  function myload(clockapp){
     if (require("Storage").read(clockapp)) load(clockapp);
  }
  setWatch(Bangle.showLauncher, BTN2, {repeat:false,edge:"falling"});
  setWatch(function(){myload("digiclock.app.js");}, BTN1, {repeat:false,edge:"rising"});
  setWatch(function(){myload("bigclock.app.js");}, BTN3, {repeat:false,edge:"rising"});
};

var SCREENACCESS = {
      withApp:true,
      request:function(){
        this.withApp=false;
        stopdraw();
        clearWatch();
      },
      release:function(){
        this.withApp=true;
        startdraw(); 
        setButtons();
      }
} 

Bangle.on('lcdPower',function(on) {
  if (!SCREENACCESS.withApp) return;
  if (on) {
    startdraw();
  } else {
    stopdraw();
  }
});

g.clear();
Bangle.setLCDBrightness(1);
Bangle.loadWidgets();
startdraw();
setButtons();

