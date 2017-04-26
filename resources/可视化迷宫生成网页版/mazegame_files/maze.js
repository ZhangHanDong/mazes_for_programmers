function Maze(w,h){this.w=w;this.h=h;this.E=new Array(2*h*w+h+w);this.clearE();this.V=new Array(w);for(var i=0;i<w;i++){this.V[i]=new Array(h);for(var j=0;j<h;j++){this.V[i][j]=0;}}}
Maze.NORTH=0x1;Maze.SOUTH=0x2;Maze.WEST=0x4;Maze.EAST=0x8;Maze.E_BLOCK=0;Maze.E_ACCESS=1;Maze.prototype.clearE=function(){for(var i=0;i<this.E.length;i++){this.E[i]=Maze.E_BLOCK;}};Maze.prototype.clearV=function(){for(var i=0;i<this.w;i++){for(var j=0;j<this.h;j++){this.V[i][j]=0;}}};Maze.prototype.getEIndex=function(x,y,d){switch(d){case Maze.NORTH:return y*(2*this.w+1)+x;case Maze.WEST:return y*(2*this.w+1)+x+this.w;case Maze.EAST:return y*(2*this.w+1)+x+this.w+1;case Maze.SOUTH:return y*(2*this.w+1)+x+2*this.w+1;default:return-1;}};Maze.prototype.getEValue=function(x,y,d){return this.E[this.getEIndex(x,y,d)];};Maze.prototype.getVPair=function(eidx){var d;var x,y;var e=eidx%(2*this.w+1);var a=(eidx-e)/(2*this.w+1);if(e>=this.w){d=2;x=e-this.w;}else{d=1;x=e;}
y=a;if(d==1){if(y>0&&y<this.h){return[x,y-1,x,y,d];}
return null;}
if(d==2){if(x>0&&x<this.w){return[x-1,y,x,y,d];}
return null;}
return null;};function DFSGenerator(){this.speed=10;}
DFSGenerator.prototype.initialize=function(maze,painter){maze.clearE();maze.clearV();this.maze=maze;painter.paintMaze();this.painter=painter;this.vStack=new Array();this.k=1;console.log("initialize");}
DFSGenerator.prototype.generate=function(x,y){if(x==undefined)
x=0;if(y==undefined)
y=0;this.vStack.push([x,y]);setTimeout(DFSGenerator.step,0,this,compelete);}
DFSGenerator.prototype.adir=function(x,y){var i=Math.floor(Math.random()*4);var d;for(var j=i;j<i+4;j++){d=1<<(j%4);switch(d){case Maze.NORTH:if(y>0&&this.maze.V[x][y-1]==0){return d;}
break;case Maze.SOUTH:if(y<this.maze.h-1&&this.maze.V[x][y+1]==0){return d;}
break;case Maze.WEST:if(x>0&&this.maze.V[x-1][y]==0){return d;}
break;case Maze.EAST:if(x<this.maze.w-1&&this.maze.V[x+1][y]==0){return d;}
break;}}
return 0;}
DFSGenerator.step=function(that,callback){while(state=="gen"&&that.vStack.length>0){var date=new Date();var tmp=that.vStack[that.vStack.length-1];var x=tmp[0];var y=tmp[1];that.maze.V[x][y]=that.k++;var d=that.adir(x,y);if(d!=0){that.maze.E[that.maze.getEIndex(x,y,d)]=Maze.E_ACCESS;switch(d){case Maze.NORTH:that.vStack.push([x,y-1]);break;case Maze.SOUTH:that.vStack.push([x,y+1]);break;case Maze.WEST:that.vStack.push([x-1,y]);break;case Maze.EAST:that.vStack.push([x+1,y]);break;}
var delay=that.speed-(new Date()-date);if(delay>0){if(delay>ptime){that.painter.paintMaze();}else{that.painter.repaint(x,y,x,y);}
delay=that.speed-(new Date()-date);if(delay>0)
setTimeout(DFSGenerator.step,delay,that,callback);else
setTimeout(DFSGenerator.step,0,that,callback);return;}}else{that.vStack.pop();}}
that.painter.paintMaze();if(callback!=undefined)
callback();}
function KruskalGenerator(){this.speed=20;}
KruskalGenerator.prototype.initialize=function(maze,painter){maze.clearE();maze.clearV();this.maze=maze;painter.paintMaze();this.painter=painter;var l=maze.w*maze.h;this.dSet=new DisjointSet(l);this.dSet.init_set();this.eFlag=new Array(l);for(var i=0;i<l;i++){eFlag=false;}
console.log("initialize");}
KruskalGenerator.prototype.generate=function(){console.log("generate");setTimeout(KruskalGenerator.step,0,this,compelete);}
KruskalGenerator.prototype.nextRandEIndex=function(){var start=Math.floor(Math.random()*this.maze.E.length);for(var i=0;i<this.maze.E.length;i++){if(!this.eFlag[start]){this.eFlag[start]=true;return start;}
start=(start+1)%this.maze.E.length;}
return-1;}
KruskalGenerator.step=function(that,callback){var i=that.nextRandEIndex();var maze=that.maze;while(state=="gen"&&i!=-1){var date=new Date();var r=maze.getVPair(i);if(r!=null){var u=r[0]+r[1]*maze.w;var v=r[2]+r[3]*maze.w;if(that.dSet.find_set(u)!=that.dSet.find_set(v)){maze.E[i]=Maze.E_ACCESS;that.dSet.union(u,v);var delay=that.speed-(new Date()-date);if(delay>0){if(delay>ptime){that.painter.paintMaze();}else{that.painter.repaint(r[0],r[1],r[0],r[1]);}
delay=that.speed-(new Date()-date);console.log(delay);if(delay>0)
setTimeout(KruskalGenerator.step,delay,that,callback);else
setTimeout(KruskalGenerator.step,0,that,callback);return;}}}
i=that.nextRandEIndex();}
that.painter.paintMaze();if(callback!=undefined)
callback();}
function PrimGenerator(){this.speed=20;}
PrimGenerator.prototype.initialize=function(maze,painter){this.maze=maze;this.painter=painter;maze.clearE();maze.clearV();painter.paintMaze();this.randSet=new Array();console.log("initialize");}
PrimGenerator.prototype.generate=function(x,y){if(x==undefined)
x=0;if(y==undefined)
y=0;this.randSet.push(y*this.maze.w+x);console.log("generate :"+x+" "+y);setTimeout(PrimGenerator.step,0,this,compelete);}
PrimGenerator.step=function(that,callback){var maze=that.maze;while(state=="gen"&&that.randSet.length>0){var date=new Date();var i=Math.floor(that.randSet.length*Math.random());var tmp=that.randSet.splice(i,1)[0];var x=tmp%maze.w;var y=Math.floor(tmp/maze.w);var d=maze.V[x][y];maze.V[x][y]=-1;if(x>0&&maze.V[x-1][y]!=-1){if(maze.V[x-1][y]==0){that.randSet.push((y)*maze.w+(x-1));}
maze.V[x-1][y]=Maze.EAST;}
if(x<maze.w-1&&maze.V[x+1][y]!=-1){if(maze.V[x+1][y]==0){that.randSet.push((y)*maze.w+(x+1));}
maze.V[x+1][y]=Maze.WEST;}
if(y>0&&maze.V[x][y-1]!=-1){if(maze.V[x][y-1]==0){that.randSet.push((y-1)*maze.w+(x));}
maze.V[x][y-1]=Maze.SOUTH;}
if(y<maze.h-1&&maze.V[x][y+1]!=-1){if(maze.V[x][y+1]==0){that.randSet.push((y+1)*maze.w+(x));}
maze.V[x][y+1]=Maze.NORTH;}
if(d!=0){maze.E[maze.getEIndex(x,y,d)]=Maze.E_ACCESS;var delay=that.speed-(new Date()-date);if(delay>0){if(delay>ptime){that.painter.paintMaze();}else{that.painter.repaint(x,y,x,y);}
delay=that.speed-(new Date()-date);if(delay>0)
setTimeout(PrimGenerator.step,delay,that,callback);else
setTimeout(PrimGenerator.step,0,that,callback);return;}}}
that.painter.paintMaze();if(callback!=undefined)
callback();}
function BuildAndDig(){this.speed=10;}
BuildAndDig.prototype.setHcell=function(x,y,v){if(x==this.maze.h){this.maze.E[this.maze.getEIndex(y,x-1,Maze.SOUTH)]=v;}else{this.maze.E[this.maze.getEIndex(y,x,Maze.NORTH)]=v;}}
BuildAndDig.prototype.getHcell=function(x,y){if(x==this.maze.h){return this.maze.getEValue(y,x-1,Maze.SOUTH);}else{return this.maze.getEValue(y,x,Maze.NORTH);}}
BuildAndDig.prototype.setVcell=function(x,y,v){if(x==this.maze.w){this.maze.E[this.maze.getEIndex(x-1,y,Maze.EAST)]=v;}else{this.maze.E[this.maze.getEIndex(x,y,Maze.WEST)]=v;}}
BuildAndDig.prototype.getVcell=function(x,y){if(x==this.maze.w){return this.maze.getEValue(x-1,y,Maze.EAST);}else{return this.maze.getEValue(x,y,Maze.WEST);}}
BuildAndDig.prototype.initialize=function(maze,painter){this.eQueue=new Array();this.maze=maze;this.painter=painter;for(var i=0;i<maze.E.length;i++){maze.E[i]=Maze.E_ACCESS;}
for(i=0;i<maze.h;i++){this.setVcell(0,i,Maze.E_BLOCK);this.setVcell(maze.w,i,Maze.E_BLOCK);}
for(i=0;i<maze.w;i++){this.setHcell(0,i,Maze.E_BLOCK);this.setHcell(maze.h,i,Maze.E_BLOCK);}}
BuildAndDig.step=function(that,callback){while(state=="gen"&&that.eQueue.length>0){var date=new Date();var tmp=that.eQueue.shift();var sx=tmp[0],sy=tmp[1],tx=tmp[2],ty=tmp[3];var betaX=tx-sx;var betaY=ty-sy;var s;var x,y;if(betaX>0&&betaY>0){s=Math.floor(Math.random()*2);x=sx+Math.floor(Math.random()*betaX)+1;for(var i=sy;i<=ty;i++){that.setVcell(x,i,Maze.E_BLOCK);}
y=sy+Math.floor(Math.random()*betaY)+1;for(i=sx;i<=tx;i++){that.setHcell(y,i,Maze.E_BLOCK);}
if(s==1){that.setVcell(x,sy+Math.floor(Math.random()*(y-sy)),Maze.E_ACCESS);that.setVcell(x,y+Math.floor(Math.random()*(ty-y+1)),Maze.E_ACCESS);that.setHcell(y,sx+Math.floor(Math.random()*(tx-sx+1)),Maze.E_ACCESS);}else{that.setHcell(y,sx+Math.floor(Math.random()*(x-sx)),Maze.E_ACCESS);that.setHcell(y,x+Math.floor(Math.random()*(tx-x+1)),Maze.E_ACCESS);that.setVcell(x,sy+Math.floor(Math.random()*(ty-sy+1)),Maze.E_ACCESS);}
that.eQueue.push([sx,sy,x-1,y-1]);that.eQueue.push([x,sy,tx,y-1]);that.eQueue.push([sx,y,x-1,ty]);that.eQueue.push([x,y,tx,ty]);var delay=that.speed-(new Date()-date);if(delay>0){if(delay>ptime){that.painter.paintMaze();}else{that.painter.repaint(sx,sy,tx,ty);}
delay=that.speed-(new Date()-date);if(delay>0)
setTimeout(BuildAndDig.step,delay,that,callback);else
setTimeout(BuildAndDig.step,0,that,callback);return;}}}
console.log("callback");that.painter.paintMaze();if(callback!=undefined)
callback();}
BuildAndDig.prototype.generate=function(){var maze=this.maze;this.eQueue.push([0,0,maze.w-1,maze.h-1]);setTimeout(BuildAndDig.step,0,this,compelete);}
function changeSize(){attr=document.getElementById("attr");var tmp=attr["size"].value.split('*');var w=parseInt(tmp[0]);var h=parseInt(tmp[1]);var canvas=document.getElementById("myCanvas");maze=new Maze(w,h);painter=new MazePainter(maze,canvas);painter.clearCanvas();var date=new Date();painter.paintMaze();ptime=new Date()-date;console.log(w,h);}
var ptime;var maze;var painter;var generator={"BuildAndDig":new BuildAndDig(),"DFSGenerator":new DFSGenerator(maze,painter),"KruskalGenerator":new KruskalGenerator(maze,painter),"PrimGenerator":new PrimGenerator(maze,painter)};var state="init";function compelete(){var attr=document.getElementById("attr");console.log("compelete");state="cmpl"
attr["btn"].value="生成";attr["size"].disabled=false;}
function stop(){state="stop";attr["size"].disabled=false;}
function btnClick(){console.log("click");if(state!="gen"){generate();}else{stop();}}
function generate(){if(state=="init"){changeSize();}
var attr=document.getElementById("attr");var speed=parseInt(attr["speed"].value);var type=attr["generator"].value;painter.paintMaze();generator[type].speed=speed;generator[type].initialize(maze,painter);state="gen";attr["btn"].value="\u505c止";attr["size"].disabled=true;generator[type].generate();}
function MazePainter(maze,canvas){this.canvas=canvas;this.maze=maze;this.g2d=canvas.getContext("2d");console.log(this.g2d);this.my=this.mx=4;this.size=Math.min((canvas.height-2*this.my)/maze.h,(canvas.width-2*this.mx)/maze.w);}
MazePainter.prototype.clearCanvas=function(){this.g2d.clearRect(0,0,this.canvas.width,this.canvas.height);}
MazePainter.prototype.paintWall=function(sx,sy,tx,ty){this.g2d.moveTo(this.mx+sx*this.size,this.my+sy*this.size);this.g2d.lineTo(this.mx+tx*this.size,this.my+ty*this.size);}
MazePainter.prototype.repaint=function(sx,sy,tx,ty){var maze=this.maze;var canvas=this.canvas;var g=this.g2d;g.clearRect(this.mx+sx*this.size,this.my+sy*this.size,this.mx+(tx+1-sx)*this.size,this.my+(ty+1-sy)*this.size);g.beginPath();var i;var j;for(i=sy;i<ty;i++){for(j=sx;j<tx;j++){if(maze.getEValue(j,i,Maze.NORTH)==Maze.E_BLOCK){this.paintWall(j,i,j+1,i);}
if(maze.getEValue(j,i,Maze.WEST)==Maze.E_BLOCK){this.paintWall(j,i,j,i+1);}}}
for(i=sy;i<ty;i++){if(maze.getEValue(j,i,Maze.NORTH)==Maze.E_BLOCK){this.paintWall(j,i,j+1,i);}
if(maze.getEValue(j,i,Maze.WEST)==Maze.E_BLOCK){this.paintWall(j,i,j,i+1);}
if(maze.getEValue(j,i,Maze.EAST)==Maze.E_BLOCK){this.paintWall(j+1,i,j+1,i+1);}}
for(j=sx;j<tx;j++){if(maze.getEValue(j,i,Maze.NORTH)==Maze.E_BLOCK){this.paintWall(j,i,j+1,i);}
if(maze.getEValue(j,i,Maze.WEST)==Maze.E_BLOCK){this.paintWall(j,i,j,i+1);}
if(maze.getEValue(j,i,Maze.SOUTH)==Maze.E_BLOCK){this.paintWall(j,i+1,j+1,i+1);}}
if(maze.getEValue(j,i,Maze.NORTH)==Maze.E_BLOCK){this.paintWall(j,i,j+1,i);}
if(maze.getEValue(j,i,Maze.WEST)==Maze.E_BLOCK){this.paintWall(j,i,j,i+1);}
if(maze.getEValue(j,i,Maze.EAST)==Maze.E_BLOCK){this.paintWall(j+1,i,j+1,i+1);}
if(maze.getEValue(j,i,Maze.SOUTH)==Maze.E_BLOCK){this.paintWall(j,i+1,j+1,i+1);}
g.lineWidth=this.size/2;g.lineCap="round";g.fillStyle="#000000";g.stroke();}
MazePainter.prototype.repaintLines=function(lines){}
MazePainter.prototype.paintMaze=function(){this.repaint(0,0,this.maze.w-1,this.maze.h-1);}
function DisjointSet(x){this.p=new Array(x);this.rank=new Array(x);}
DisjointSet.prototype.init_set=function(){for(var i=0;i<this.p.length;i++){this.make_set(i);}}
DisjointSet.prototype.make_set=function(x){this.p[x]=x;this.rank[x]=0;}
DisjointSet.prototype.union=function(x,y){this.link(this.find_set(x),this.find_set(y));}
DisjointSet.prototype.link=function(x,y){if(this.rank[x]>this.rank[y]){this.p[y]=x;}else if(this.rank[x]<this.rank[y]){this.p[x]=y;}else if(this.rank[x]==this.rank[y]){this.p[x]=y;this.rank[y]++;}}
DisjointSet.prototype.find_set=function(x){if(x!=this.p[x]){this.p[x]=this.find_set(this.p[x]);}
return this.p[x];}