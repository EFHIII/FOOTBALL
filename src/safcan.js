// initialize canvas
const c = document.getElementById("canvas");
const ctx = c.getContext("2d", { alpha: false });
c.style.backgroundColor = "red";
c.width = window.innerWidth;
c.height = window.innerHeight;
// check for mobile
function isMobile() {
  let prefixes = ' -webkit- -moz- -o- -ms- '.split(' ');
  let mq = function(query) {
    return window.matchMedia(query).matches;
  }

  if(('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
    return true;
  }
  let query = ['(', prefixes.join('touch-enabled),('), 'heartz', ')'].join('');
  return mq(query);
}

// initialize variables and constants
let w = c.width,
  h = c.height,
  mobile = isMobile(),
  mouseIsPressed = false;
let mouseX = 0,
  mouseY = 0;

// button
let last = false;
function button(x, y, w, h, callback, img, imgb) {
  if(img) {
    if(mouseX > x &&
      mouseX < x + w &&
      mouseY > y &&
      mouseY < y + h) {
      document.body.style.cursor = 'pointer';
      if(!last && mouseIsPressed) {
        callback();
        last = true;
      }
      ctx.drawImage(imgb, x >> 0, y >> 0, w >> 0, h >> 0);
    } else {
      ctx.drawImage(img, x >> 0, y >> 0, w >> 0, h >> 0);
    }
    return;
  }

  if(mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h) {
    ctx.fillStyle = "rgba(0,0,0,0.3)";
    document.body.style.cursor = 'pointer';
    if(!last && mouseIsPressed) {
      callback();
      last = true;
    }
    ctx.fillRect(x >> 0, y >> 0, w >> 0, h >> 0);
  } else if(!img) {
    ctx.fillStyle = colors[2];
    ctx.fillRect(x >> 0, y >> 0, w >> 0, h >> 0);
  }
}

/**
 * callWithinAR - Calls the callback function with parameters for a rect of the specified aspect ratio within the rect provided
 *
 * @param  {number} x        x
 * @param  {number} y        y
 * @param  {number} width    width
 * @param  {number} height   height
 * @param  {number} ar       aspect ratio
 * @param  {function} callback callback
 */
function callWithinAR(x, y, width, height, ar, callback) {
  if(height * ar < width) {
    //wide
    callback(((x + width / 2 - height / 2 * ar) >> 0) - 1, (y >> 0) - 1, ((height * ar) >> 0) + 2, (height >> 0) + 3);
  } else {
    //tall
    callback((x >> 0) - 1, ((y + height / 2 - width / 2 / ar) >> 0) - 1, (width >> 0) + 2, ((width / ar) >> 0) + 3);
  }
}

function imgaeWithinAR(img, ar, x, y, w, h) {
  callWithinAR(x, y, w, h, ar, (x, y, w, h) => ctx.drawImage(img, x, y, w, h));
}

//event listeners
window.onresize = () => {
  c.width = window.innerWidth;
  c.height = window.innerHeight;
  w = c.width;
  h = c.height;

  //callWithinAR(0, 0, w, h, 1920 / 1080, positionMidiInput);
}

window.onmouseleave = (event) => {
  mouseIsPressed = false;
  last = true;
  mouseX = -1;
  mouseY = -1;
}

window.onmouseout = (event) => {
  mouseIsPressed = false;
  last = true;
  mouseX = -1;
  mouseY = -1;
}


let ltouch = [0, 0];
window.ontouchstart = (event) => {
  mouseX = event.touches[0].clientX;
  mouseY = event.touches[0].clientY;
  ltouch = [mouseX, mouseY];
  mouseIsPressed = true;
}

window.ontouchend = (event) => {
  mouseIsPressed = true;
  last = false;
  //drawCanvas(false);
  mouseIsPressed = false;
  last = true;
  mouseX = -1;
  mouseY = -1;
}

window.ontouchmove = (event) => {
  if(mouseIsPressed) {
    mouseX = event.touches[0].clientX;
    mouseY = event.touches[0].clientY;
  }
}

let scrollV = 0;

document.onwheel = (event) => {
  scrollV += event.deltaY;
}

// document.body.onblur = (event) => {}
