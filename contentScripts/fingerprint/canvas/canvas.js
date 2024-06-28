
/* CANVAS FP */
const canvas = document.createElement('canvas')
const ctx = canvas.getContext('2d');
canvas.width = 240;
canvas.height = 60;
// Text with lowercase/uppercase/punctuation symbols
var txt = "BrowserLeaks,com <canvas> 1.0";
ctx.textBaseline = "top";
// The most common type
ctx.font = "14px 'Arial'";
ctx.textBaseline = "alphabetic";
ctx.fillStyle = "#f60";
ctx.fillRect(125,1,62,20);
// Some tricks for color mixing to increase the difference in rendering
ctx.fillStyle = "#069";
ctx.fillText(txt, 2, 15);
ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
ctx.fillText(txt, 4, 17);
console.log(canvas.toDataURL());
// Example usage
const div = document.createElement('div');
div.style.fontFamily = 'Arial'; // Logs: Font family changed from undefined to Arial
div.style.fontFamily = 'Times New Roman';
