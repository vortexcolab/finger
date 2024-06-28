// https://plaperdr.github.io/morellian-canvas/Prototype/webpage/picassauth.html

function getData(challenge){
    //var canvas = document.createElement("canvas");
    var canvas = document.getElementById("canvas1");
    canvas.width = 1900;
    canvas.height = 300;
    var ctx = canvas.getContext("2d");
    canvas.style.display = "inline";
    ctx.textBaseline = "alphabetic";

    for (var i = 0; i < challenge.glyphs.length; i++) {
        var st = challenge.glyphs[i];
        ctx.translate(st.rX, st.rY);
        ctx.rotate(Math.PI * st.rA);
        ctx.fillStyle = getGradient(ctx,st.gr,canvas.width);
        ctx.shadowBlur = st.sb;
        ctx.shadowColor = st.sc;
        ctx.font = st.si+"pt no-real-font-123";
        ctx.fillText(st.str, 0, 0);
        ctx.rotate(-Math.PI * st.rA);
        ctx.translate(-st.rX,-st.rY);
    }

    for (var k = 0; k < challenge.curves.length; k++) {
        var cu = challenge.curves[k];
        ctx.translate(cu.rX, cu.rY);
        ctx.beginPath();
        ctx.lineWidth = cu.width;
        ctx.strokeStyle = getGradient(ctx,cu.gr,canvas.width);
        ctx.shadowBlur = cu.sb;
        ctx.shadowColor = cu.sc;
        if(cu.points.length == 4){
            ctx.quadraticCurveTo(cu.points[0],cu.points[1],cu.points[2],cu.points[3]);
        } else {
            ctx.bezierCurveTo(cu.points[0],cu.points[1],cu.points[2],cu.points[3],cu.points[4],cu.points[5]);
        }
        ctx.stroke();
        ctx.translate(-cu.rX,-cu.rY);
    }

    var data = canvas.toDataURL();
    //canvas.remove();

    return data;
}

function getGradient(ctx,gr,width){
    var grX = gr.x;
    var grY = gr.y;
    var gradient = ctx.createRadialGradient(grX, grY, 0, grX, grY, width-grY);
    for (var j = 0; j < gr.colors.length; j++) {
        var color = gr.colors[j];
        gradient.addColorStop(color.pos,color.col);
    }
    return gradient;
}


// aux

/// MurmurHash3 related functions

//
// Given two 64bit ints (as an array of two 32bit ints) returns the two
// added together as a 64bit int (as an array of two 32bit ints).
//
function x64Add (m, n) {
    m = [m[0] >>> 16, m[0] & 0xffff, m[1] >>> 16, m[1] & 0xffff];
    n = [n[0] >>> 16, n[0] & 0xffff, n[1] >>> 16, n[1] & 0xffff];
    var o = [0, 0, 0, 0];
    o[3] += m[3] + n[3];
    o[2] += o[3] >>> 16;
    o[3] &= 0xffff;
    o[2] += m[2] + n[2];
    o[1] += o[2] >>> 16;
    o[2] &= 0xffff;
    o[1] += m[1] + n[1];
    o[0] += o[1] >>> 16;
    o[1] &= 0xffff;
    o[0] += m[0] + n[0];
    o[0] &= 0xffff;
    return [(o[0] << 16) | o[1], (o[2] << 16) | o[3]];
}

//
// Given two 64bit ints (as an array of two 32bit ints) returns the two
// multiplied together as a 64bit int (as an array of two 32bit ints).
//
function x64Multiply(m, n) {
    m = [m[0] >>> 16, m[0] & 0xffff, m[1] >>> 16, m[1] & 0xffff];
    n = [n[0] >>> 16, n[0] & 0xffff, n[1] >>> 16, n[1] & 0xffff];
    var o = [0, 0, 0, 0];
    o[3] += m[3] * n[3];
    o[2] += o[3] >>> 16;
    o[3] &= 0xffff;
    o[2] += m[2] * n[3];
    o[1] += o[2] >>> 16;
    o[2] &= 0xffff;
    o[2] += m[3] * n[2];
    o[1] += o[2] >>> 16;
    o[2] &= 0xffff;
    o[1] += m[1] * n[3];
    o[0] += o[1] >>> 16;
    o[1] &= 0xffff;
    o[1] += m[2] * n[2];
    o[0] += o[1] >>> 16;
    o[1] &= 0xffff;
    o[1] += m[3] * n[1];
    o[0] += o[1] >>> 16;
    o[1] &= 0xffff;
    o[0] += (m[0] * n[3]) + (m[1] * n[2]) + (m[2] * n[1]) + (m[3] * n[0]);
    o[0] &= 0xffff;
    return [(o[0] << 16) | o[1], (o[2] << 16) | o[3]];
}
//
// Given a 64bit int (as an array of two 32bit ints) and an int
// representing a number of bit positions, returns the 64bit int (as an
// array of two 32bit ints) rotated left by that number of positions.
//
function x64Rotl(m, n) {
    n %= 64;
    if (n === 32) {
        return [m[1], m[0]];
    }
    else if (n < 32) {
        return [(m[0] << n) | (m[1] >>> (32 - n)), (m[1] << n) | (m[0] >>> (32 - n))];
    }
    else {
        n -= 32;
        return [(m[1] << n) | (m[0] >>> (32 - n)), (m[0] << n) | (m[1] >>> (32 - n))];
    }
}
//
// Given a 64bit int (as an array of two 32bit ints) and an int
// representing a number of bit positions, returns the 64bit int (as an
// array of two 32bit ints) shifted left by that number of positions.
//
function x64LeftShift(m, n) {
    n %= 64;
    if (n === 0) {
        return m;
    }
    else if (n < 32) {
        return [(m[0] << n) | (m[1] >>> (32 - n)), m[1] << n];
    }
    else {
        return [m[1] << (n - 32), 0];
    }
}
//
// Given two 64bit ints (as an array of two 32bit ints) returns the two
// xored together as a 64bit int (as an array of two 32bit ints).
//
function x64Xor(m, n) {
    return [m[0] ^ n[0], m[1] ^ n[1]];
}
//
// Given a block, returns murmurHash3's final x64 mix of that block.
// (`[0, h[0] >>> 1]` is a 33 bit unsigned right shift. This is the
// only place where we need to right shift 64bit ints.)
//
function x64Fmix(h) {
    h = this.x64Xor(h, [0, h[0] >>> 1]);
    h = this.x64Multiply(h, [0xff51afd7, 0xed558ccd]);
    h = this.x64Xor(h, [0, h[0] >>> 1]);
    h = this.x64Multiply(h, [0xc4ceb9fe, 0x1a85ec53]);
    h = this.x64Xor(h, [0, h[0] >>> 1]);
    return h;
}

//
// Given a string and an optional seed as an int, returns a 128 bit
// hash using the x64 flavor of MurmurHash3, as an unsigned hex.
//
function x64hash128(key, seed) {
    key = key || "";
    seed = seed || 0;
    var remainder = key.length % 16;
    var bytes = key.length - remainder;
    var h1 = [0, seed];
    var h2 = [0, seed];
    var k1 = [0, 0];
    var k2 = [0, 0];
    var c1 = [0x87c37b91, 0x114253d5];
    var c2 = [0x4cf5ad43, 0x2745937f];
    for (var i = 0; i < bytes; i = i + 16) {
        k1 = [((key.charCodeAt(i + 4) & 0xff)) | ((key.charCodeAt(i + 5) & 0xff) << 8) | ((key.charCodeAt(i + 6) & 0xff) << 16) | ((key.charCodeAt(i + 7) & 0xff) << 24), ((key.charCodeAt(i) & 0xff)) | ((key.charCodeAt(i + 1) & 0xff) << 8) | ((key.charCodeAt(i + 2) & 0xff) << 16) | ((key.charCodeAt(i + 3) & 0xff) << 24)];
        k2 = [((key.charCodeAt(i + 12) & 0xff)) | ((key.charCodeAt(i + 13) & 0xff) << 8) | ((key.charCodeAt(i + 14) & 0xff) << 16) | ((key.charCodeAt(i + 15) & 0xff) << 24), ((key.charCodeAt(i + 8) & 0xff)) | ((key.charCodeAt(i + 9) & 0xff) << 8) | ((key.charCodeAt(i + 10) & 0xff) << 16) | ((key.charCodeAt(i + 11) & 0xff) << 24)];
        k1 = this.x64Multiply(k1, c1);
        k1 = this.x64Rotl(k1, 31);
        k1 = this.x64Multiply(k1, c2);
        h1 = this.x64Xor(h1, k1);
        h1 = this.x64Rotl(h1, 27);
        h1 = this.x64Add(h1, h2);
        h1 = this.x64Add(this.x64Multiply(h1, [0, 5]), [0, 0x52dce729]);
        k2 = this.x64Multiply(k2, c2);
        k2 = this.x64Rotl(k2, 33);
        k2 = this.x64Multiply(k2, c1);
        h2 = this.x64Xor(h2, k2);
        h2 = this.x64Rotl(h2, 31);
        h2 = this.x64Add(h2, h1);
        h2 = this.x64Add(this.x64Multiply(h2, [0, 5]), [0, 0x38495ab5]);
    }
    k1 = [0, 0];
    k2 = [0, 0];
    switch(remainder) {
        case 15:
            k2 = this.x64Xor(k2, this.x64LeftShift([0, key.charCodeAt(i + 14)], 48));
        case 14:
            k2 = this.x64Xor(k2, this.x64LeftShift([0, key.charCodeAt(i + 13)], 40));
        case 13:
            k2 = this.x64Xor(k2, this.x64LeftShift([0, key.charCodeAt(i + 12)], 32));
        case 12:
            k2 = this.x64Xor(k2, this.x64LeftShift([0, key.charCodeAt(i + 11)], 24));
        case 11:
            k2 = this.x64Xor(k2, this.x64LeftShift([0, key.charCodeAt(i + 10)], 16));
        case 10:
            k2 = this.x64Xor(k2, this.x64LeftShift([0, key.charCodeAt(i + 9)], 8));
        case 9:
            k2 = this.x64Xor(k2, [0, key.charCodeAt(i + 8)]);
            k2 = this.x64Multiply(k2, c2);
            k2 = this.x64Rotl(k2, 33);
            k2 = this.x64Multiply(k2, c1);
            h2 = this.x64Xor(h2, k2);
        case 8:
            k1 = this.x64Xor(k1, this.x64LeftShift([0, key.charCodeAt(i + 7)], 56));
        case 7:
            k1 = this.x64Xor(k1, this.x64LeftShift([0, key.charCodeAt(i + 6)], 48));
        case 6:
            k1 = this.x64Xor(k1, this.x64LeftShift([0, key.charCodeAt(i + 5)], 40));
        case 5:
            k1 = this.x64Xor(k1, this.x64LeftShift([0, key.charCodeAt(i + 4)], 32));
        case 4:
            k1 = this.x64Xor(k1, this.x64LeftShift([0, key.charCodeAt(i + 3)], 24));
        case 3:
            k1 = this.x64Xor(k1, this.x64LeftShift([0, key.charCodeAt(i + 2)], 16));
        case 2:
            k1 = this.x64Xor(k1, this.x64LeftShift([0, key.charCodeAt(i + 1)], 8));
        case 1:
            k1 = this.x64Xor(k1, [0, key.charCodeAt(i)]);
            k1 = this.x64Multiply(k1, c1);
            k1 = this.x64Rotl(k1, 31);
            k1 = this.x64Multiply(k1, c2);
            h1 = this.x64Xor(h1, k1);
    }
    h1 = this.x64Xor(h1, [0, key.length]);
    h2 = this.x64Xor(h2, [0, key.length]);
    h1 = this.x64Add(h1, h2);
    h2 = this.x64Add(h2, h1);
    h1 = this.x64Fmix(h1);
    h2 = this.x64Fmix(h2);
    h1 = this.x64Add(h1, h2);
    h2 = this.x64Add(h2, h1);
    return ("00000000" + (h1[0] >>> 0).toString(16)).slice(-8) + ("00000000" + (h1[1] >>> 0).toString(16)).slice(-8) + ("00000000" + (h2[0] >>> 0).toString(16)).slice(-8) + ("00000000" + (h2[1] >>> 0).toString(16)).slice(-8);
}


/*****************************
 *     Generator limits      *
 * ***************************/

var maxGradientPoints = 100;
var minStrings = 10;
var maxStrings = 50;
var minStringLength = 3;
var maxStringLength = 10;
var minSize = 30;
var maxSize = 78;
var minCurves = 1;
var maxCurves = 10;
var minCurveWidth = 2;
var maxCurveWidth = 10;
var minCurveXY = -200;
var maxCurveXY = 200;
var minShadowBlur = 0;
var maxShadowBlur = 50;
var canvasWidth = 1900;
var canvasHeight = 300;


/*****************************
 *    Generator functions    *
 * ***************************/

function getRandomColor() {
    var letters = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F'];
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function getRandomString(len, charSet) {
    charSet = charSet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var randomString = '';
    for (var i = 0; i < len; i++) {
        var randomPos = Math.floor(Math.random() * charSet.length);
        randomString += charSet.substring(randomPos,randomPos+1);
    }
    return randomString;
}

function getRandomInt(min,max) {//Min and max included
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomNbStrings(){
    return getRandomInt(minStrings,maxStrings);
}

function getRandomStringLength(){
    return getRandomInt(minStringLength,maxStringLength);
}

function getRandomSize(){
    return getRandomInt(minSize,maxSize);
}

function getRandomNbGradientPoints(){
    return getRandomInt(0,maxGradientPoints-2);
}

function getRandomShadowBlur(){
    return getRandomInt(minShadowBlur,maxShadowBlur);
}

function getRandomCurveWidth(){
    return getRandomInt(minCurveWidth,maxCurveWidth);
}

function getRandomNbCurves(){
    return getRandomInt(minCurves,maxCurves);
}

function getRandomCurvePoints(){
    var points = [];
    for(var i=0; i<4;i++){
        points.push(getRandomInt(minCurveXY,maxCurveXY));
    }

    //if quadratic curve is chosen,
    //generate two more points
    if(Math.random()>0.5){
        points.push(getRandomInt(minCurveXY,maxCurveXY));
        points.push(getRandomInt(minCurveXY,maxCurveXY));
    }

    return points;
}

function randomX(){
    return Math.floor(Math.random() * canvasWidth);
}

function randomY(){
    return Math.floor(Math.random() * canvasHeight);
}

function getRandomRadialGradient(){

    //Center of the gradient
    var rX = randomX();  //between 0 and canvasWidth
    var rY = randomY(); //between 0 and canvasHeight

    //Generation of the colors
    var colors = [];
    colors.push({pos: "0", col: getRandomColor()});
    colors.push({pos: "1", col: getRandomColor()});
    var nbRandomPoints = getRandomNbGradientPoints();
    for(var i=0; i<nbRandomPoints; i++){
        colors.push({pos: Math.random().toString(), col: getRandomColor()});
    }

    return { x:rX , y:rY, colors: colors};
}


/*****************************
 *    Challenge generation   *
 * ***************************/
//Generation of random parameters
function generateChallenge(){

    var glyphs = [];
    var nbGlyphs = getRandomNbStrings();
    for(var j=0; j<nbGlyphs; j++){
        var str = getRandomString(getRandomStringLength());
        var size = getRandomSize();
        var rX = randomX(); //Random X
        var rY = randomY(); //Random Y
        var rAngle = Math.floor(Math.random() * 360) / 360; //Random rotation
        var gr =  getRandomRadialGradient();
        var sb = getRandomShadowBlur();
        var sc = getRandomColor();
        glyphs.push({str:str,si:size,rX:rX,rY:rY,rA:rAngle,gr:gr,sb:sb,sc:sc});
    }

    var curves = [];
    var nbCurves = getRandomNbCurves();
    for(var k=0; k<nbCurves; k++){
        var rX = randomX(); //Random X
        var rY = randomY(); //Random Y
        var points = getRandomCurvePoints();//Return 4 or 6 points depending on the curve
        var width = getRandomCurveWidth();
        var gr =  getRandomRadialGradient();
        var sb = getRandomShadowBlur();
        var sc = getRandomColor();
        curves.push({rX:rX,rY:rY,points:points,width:width,gr:gr,sb:sb,sc:sc});
    }

    return {"glyphs": glyphs, "curves": curves};
}


function generateImage() {

    //Generating the challenge and the response
    var start = performance.now();
    var challenge = generateChallenge();
    var genTime = performance.now() - start;

    start = performance.now();
    var data = getData(challenge);
    var renderTime = performance.now() - start;

    start = performance.now();
    var ha = x64hash128(data);
    var hashTime = performance.now() - start;

}

generateImage();