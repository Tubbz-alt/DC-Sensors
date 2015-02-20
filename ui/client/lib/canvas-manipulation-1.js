/*!
 canvas-manipulation - v0.3.0 - 2013-09-22
 ssh://git@bitbucket.org/vogdb/canvas-manipulation.git
 Copyright (c) 2013 Sanin Aleksey aka vogdb; Licensed MIT
*/
;(function(){var g;function Matrix(a){if(!Array.isArray(a))throw Error("Array must be passed");if(a.length!==Matrix.j)throw Error("Matrix must have 3 rows");this.a=[];for(var c=0;c<Matrix.j;c++){if(a.length!==Matrix.g)throw Error("Matrix must have 3 cols on row: "+c);this.a[c]=[];for(var b=0;b<Matrix.g;b++)this.a[c][b]=a[c][b]}}Matrix.j=3;Matrix.g=3;
Matrix.prototype.multiply=function(a){Array.isArray(a)&&(a=new Matrix(a));if(!a instanceof Matrix)throw Error("Argument passed is not a valid Matrix object");var c=new Matrix([[1,0,0],[0,1,0],[0,0,1]]),b=this.a;a=a.a;for(var d=0;d<Matrix.j;d++)for(var e=0;e<Matrix.g;e++){for(var f=0,h=0;h<Matrix.g;h++)f+=b[d][h]*a[h][e];c.a[d][e]=f}delete this.a;this.a=c.a;c.a=null;return this};Matrix.prototype.clone=function(){return new Matrix(this.a)};
Matrix.prototype.inverse=function(){for(var a,c=Matrix.j,b=this.a,d=0;d<c;d++)for(var e=c;e<2*Matrix.g;e++)b[d][e]=d===e-c?1:0;for(d=0;d<c;d++)for(e=0;e<c;e++)if(d!==e){a=b[e][d]/b[d][d];for(var f=0;f<2*c;f++)b[e][f]-=a*b[d][f]}for(d=0;d<c;d++){a=b[d][d];for(e=0;e<2*c;e++)b[d][e]/=a}for(d=0;d<c;d++)b[d].splice(0,c);return this};function i(a){this.d=a?a:new Matrix([[1,0,0],[0,1,0],[0,0,1]])}function k(a,c,b,d,e,f,h){a=a.d.a;a[0][0]=c;a[1][0]=b;a[0][1]=d;a[1][1]=e;a[0][2]=f;a[1][2]=h}
i.prototype.translate=function(a,c){return l(this,[[1,0,a],[0,1,c],[0,0,1]])};i.prototype.rotate=function(a){return l(this,[[Math.cos(a),-Math.sin(a),0],[Math.sin(a),Math.cos(a),0],[0,0,1]])};function l(a,c){var b=new i(a.d.clone());b.d.multiply(new Matrix(c));return b}i.prototype.inverse=function(){var a=new i(this.d.clone());a.d.inverse();return a};function m(){this.x;this.y}
function n(a){var c=new i;a.getTransformMatrix=function(){return c};var b=[],d=a.save;a.save=function(){b.push(c.translate(0,0));return d.call(a)};var e=a.restore;a.restore=function(){c=b.pop();return e.call(a)};var f=a.scale;a.scale=function(b,d){c=l(c,[[b,0,0],[0,d,0],[0,0,1]]);return f.call(a,b,d)};var h=a.rotate;a.rotate=function(b){c=c.rotate(b);return h.call(a,b)};var v=a.translate;a.translate=function(b,d){c=c.translate(b,d);return v.call(a,b,d)};var w=a.transform;a.transform=function(b,d,
e,f,s,h){var j=new i;k(j,b,d,e,f,s,h);c=c.multiply(j);return w.call(a,b,d,e,f,s,h)};var t=a.setTransform;a.setTransform=function(b,d,e,f,h,j){k(c,b,d,e,f,h,j);return t.call(a,b,d,e,f,h,j)};a.setTransformMatrix=function(b){c=b;b=b.d.a;t.apply(a,[b[0][0],b[1][0],b[0][1],b[1][1],b[0][2],b[1][2]])};var j=new m;a.e=function(a,b){j.x=a;j.y=b;var d=c.inverse().d.clone().multiply(new Matrix([[j.x],[j.y],[1]])),e=new m;e.x=d.a[0][0];e.y=d.a[1][0];return e};a.w=function(b,c,d,e){var f=a.e(b,c);b=a.e(b+d,c+
e);a.clearRect(f.x,f.y,b.x-f.x,b.y-f.y)};a.clearCanvas=function(){a.save();a.setTransform(1,0,0,1,0,0);a.clearRect(0,0,a.canvas.width,a.canvas.height);a.restore()}}function p(a,c,b){this.k=c;this.c=a;a=b||{};this.h={};this.h.t=a.leftTop?a.leftTop:{x:0,y:0};this.h.u=a.rightBottom?a.rightBottom:{x:this.c.width,y:this.c.height};this.i=null}g=p.prototype;g.r=function(){this.b=this.c.getContext("2d");n(this.b)};g.s=function(){this.c.width=this.c.offsetWidth;this.c.height=this.c.offsetHeight};
g.p=function(a){this.i=this.b.e(a.x,a.y)};g.n=function(a){if(this.i){var c=this.b.e(a.x,a.y),b=this.i;a=this.h.t;var d=this.h.u,e=this.b.e(0,0),f=c.x-b.x;(e.x>=a.x||e.x<a.x&&0>f)&&(e.x<=d.x||e.x>d.x&&0<f)||(f=0);c=c.y-b.y;(e.y>=a.y||e.y<a.y&&0>c)&&(e.y<=d.y||e.y>d.y&&0<c)||(c=0);this.b.translate(f,c);this.k()}};g.o=function(){this.i=null};g.v=1.1;g.l=10;g.m=-10;g.f=1;
g.zoom=function(a,c){var b=this.b.e(a.x,a.y);this.b.translate(b.x,b.y);this.f+c>this.l&&(c=this.l-this.f);this.f+c<this.m&&(c=this.m-this.f);this.f+=c;var d=Math.pow(this.v,c);this.b.scale(d,d);this.b.translate(-b.x,-b.y);this.k()};g.rotate=function(a,c){var b=this.b.e(a.x,a.y);this.b.translate(b.x,b.y);this.b.rotate(c);this.b.translate(-b.x,-b.y);this.k()};g.q=function(){return this.c};var q=["CanvasManipulation"],r=window||this;!(q[0]in r)&&r.execScript&&r.execScript("var "+q[0]);for(var u;q.length&&(u=q.shift());)!q.length&&void 0!==p?r[u]=p:r=r[u]?r[u]:r[u]={};p.prototype.init=p.prototype.r;p.prototype.layout=p.prototype.s;p.prototype.dragStart=p.prototype.p;p.prototype.drag=p.prototype.n;p.prototype.dragEnd=p.prototype.o;p.prototype.rotate=p.prototype.rotate;p.prototype.zoom=p.prototype.zoom;p.prototype.getCanvas=p.prototype.q;}).call(this)