const PLACING_OFFENSE = 0;
const PLACING_DEFENSE = 0;
const PLACING_ROUTE = 1;
const SIMULATING = 2;

const ACURATE = 0;
const SHAPES = 1;

// types
const RECIEVER = 0;
const RUNNING_BACK = 1;
const QB = 2;
const CENTER = 3;

let mode = PLACING_OFFENSE;
let drawMode = SHAPES;
let snapToGrid = false;

let players = {
  offense: [{
    name: 'C',
    x: 80,
    y: 183.5,
    type: CENTER
  }],
  defense: []
};
let lineOfScrimage = 50;

function drawAcuratePlayers() {}

function drawPlayer(x, y, name = '', type = 1, p) {
  if(type === RECIEVER && p.route.length > 0) {
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1 * camera.pixelsPerFoot;
    ctx.fillStyle = '#fff';

    let lastX = x;
    let lastY = y;
    for(let i = 0; i < p.route.length; i++) {
      camLine(lastX, lastY, p.route[i][0], p.route[i][1]);
      camCircle(p.route[i][0], p.route[i][1], 0.5);

      lastX = p.route[i][0];
      lastY = p.route[i][1];
    }
  }

  if (type === CENTER) {
    ctx.fillStyle = colors.ln;
    camRect(x - 3, y - 3, 6, 6);
    ctx.fillStyle = colors.bg;
    camRect(x - 3 + 1 / 3, y - 3 + 1 / 3, 5 + 1 / 3, 5 + 1 / 3);

    ctx.fillStyle = colors.names;
    camText(name, x, y, 3);
    return;
  }
  ctx.fillStyle = colors.ln;
  camCircle(x, y, 3);
  ctx.fillStyle = colors.bg;
  camCircle(x, y, 2 + 2 / 3);

  ctx.fillStyle = colors.names;
  camText(name, x, y, 3);
}

let hovered = false;
function drawShapePlayers() {
  hovered = false;

  let px = (mouseX - w / 2) / camera.pixelsPerFoot + camera.x;
  let py = (mouseY - h / 2) / camera.pixelsPerFoot + camera.y;

  for (let i = players.offense.length - 1; i >= 0; i--) {
    let player = players.offense[i];
    if (px >= player.x - 3 && px < player.x + 3 && py >= player.y - 3 && py < player.y + 3) {
      if (mode === PLACING_OFFENSE && player.type !== CENTER) {
        // delete
        for (let key of keys) {
          if (key[0] === 46 && key[1]) {
            players.offense.splice(i, 1);
            continue;
          }
        }
      }

      // hover
      hovered = true;
      ctx.fillStyle = '#fff';
      if (player.type === CENTER) camRect(player.x - 10 / 3, player.y - 10 / 3, 20 / 3, 20 / 3);
      else camCircle(player.x, player.y, 10 / 3);
    } else if (px >= player.x - 6 && px < player.x + 6 && py >= player.y - 6 && py < player.y + 6) {
      hovered = true;
    }
    drawPlayer(player.x, player.y, player.name, player.type, player);
  }

  if (mouseX < 0 || hovered) return;

  if (mode === PLACING_OFFENSE) {
    px = (mouseX - w / 2) / camera.pixelsPerFoot;
    py = (mouseY - h / 2) / camera.pixelsPerFoot;
    if (snapToGrid || holdingShift) {
      px = Math.round(px / snapSize) * snapSize;
      py = Math.round(py / snapSize) * snapSize;
    }
    px = Math.max(-80, Math.min(80, px)) + camera.x;
    py = Math.max(3.5, py) + camera.y;

    drawPlayer(px, py);
  }
}

function drawPlayers() {
  if (drawMode === ACURATE) drawAcuratePlayers();
  else drawShapePlayers();
}

function mainLoop() {
  if (scrollV !== 0) {
    if (Math.abs(scrollV) % 100 === 0) scrollV /= 10;
    camera.pixelsPerFoot *= 1 - scrollV * 0.01;
    scrollV = 0;
    if (camera.pixelsPerFoot < 1 / 3) camera.pixelsPerFoot = 1 / 3;
    if (camera.pixelsPerFoot > 50) camera.pixelsPerFoot = 50;
  }

  drawStadium();

  ctx.fillStyle = colors.ln;
  camLineX(0, 30 + lineOfScrimage * 3, 160, 1);

  drawPlayers();

  drawFootball();

  if (keys.length > 0) {
    for (let key of keys) {
      // move Center: WASD/Arrow Keys
      if ((key[0] === 87 || key[0] === 38) && key[1]) {
        if (camera.y < 30 + snapSize) continue;
        camera.y -= 3;
        lineOfScrimage--;
        players.offense[0].y -= 3;
        football.y -= 3;
        for (let i = 1; i < players.offense.length; i++) {
          players.offense[i].y -= 3;
          if(players.offense[i].hasOwnProperty('route')) {
            for(let j = 0; j < players.offense[i].route.length; j++) {
              players.offense[i].route[j][1] -= 3;
            }
          }
        }
      } else if ((key[0] === 65 || key[0] === 37) && key[1]) {
        if (camera.x < 80 - hashWidth / 2 + snapSize) continue;
        camera.x -= 3;
        players.offense[0].x -= 3;
        football.x -= 3;
        for (let i = 1; i < players.offense.length; i++) {
          players.offense[i].x -= 3;
          if(players.offense[i].hasOwnProperty('route')) {
            for(let j = 0; j < players.offense[i].route.length; j++) {
              players.offense[i].route[j][0] -= 3;
            }
          }
        }
      } else if ((key[0] === 83 || key[0] === 40) && key[1]) {
        if (camera.y > 330 - snapSize) continue;
        camera.y += 3;
        players.offense[0].y += 3;
        lineOfScrimage++;
        football.y += 3;
        for (let i = 1; i < players.offense.length; i++) {
          players.offense[i].y += 3;
          if(players.offense[i].hasOwnProperty('route')) {
            for(let j = 0; j < players.offense[i].route.length; j++) {
              players.offense[i].route[j][1] += 3;
            }
          }
        }
      } else if ((key[0] === 68 || key[0] === 39) && key[1]) {
        if (camera.x > 80 + hashWidth / 2 - snapSize) continue;
        camera.x += 3;
        players.offense[0].x += 3;
        football.x += 3;
        for (let i = 1; i < players.offense.length; i++) {
          players.offense[i].x += 3;

          if(players.offense[i].hasOwnProperty('route')) {
            for(let j = 0; j < players.offense[i].route.length; j++) {
              players.offense[i].route[j][0] += 3;
            }
          }
        }
      }

      // toggle lines: M
      else if (key[0] === 71 && !key[1]) {
        snapToGrid = !snapToGrid;
        showGrid = !showGrid;
      }
    }

    keys = [];
  }

  window.requestAnimationFrame(mainLoop);
}
window.requestAnimationFrame(mainLoop);

// event listeners
let draggingPlayer = false;
let movedPlayer = false;
let dragFromX;
let dragFromY;
let typingName = false;
let playerRoute = false;

window.onmouseup = (event) => {
  if(movedPlayer) {
    draggingPlayer = false;
    movedPlayer = false;
    mouseIsPressed = false;
    last = true;
    return;
  }

  if(mode === PLACING_ROUTE) {
    if(event.which !== 1) {
      mode = PLACING_OFFENSE;
      playerRoute = false;
    }
    else {
      playerRoute.route.push([playerRoute.route[0][0], playerRoute.route[0][1]]);
    }
    draggingPlayer = false;
    mouseIsPressed = false;
    last = true;
    return;
  }
  else if(draggingPlayer) {
    playerRoute = draggingPlayer;
    if(playerRoute.hasOwnProperty('route')) {
      while(playerRoute.route.length > 1) {
        playerRoute.route.pop();
      }
    }
    mode = PLACING_ROUTE;
    draggingPlayer = false;
    mouseIsPressed = false;
    last = true;
    return;
  }

  let px = (mouseX - w / 2) / camera.pixelsPerFoot;
  let py = (mouseY - h / 2) / camera.pixelsPerFoot;
  if (snapToGrid || holdingShift) {
    px = Math.round(px / snapSize) * snapSize;
    py = Math.round(py / snapSize) * snapSize;
  }
  px = Math.max(-80, Math.min(80, px)) + camera.x;
  py = Math.max(3.5, py) + camera.y;

  if (mode === PLACING_OFFENSE && !hovered) {
    players.offense.push({
      name: '',
      x: px,
      y: py,
      type: RECIEVER,
      route: []
    });
  }
  else if(mode === PLACING_OFFENSE && hovered) {
    // right click - change name
    if(event.button === 2) {
      typingName = draggingPlayer;
    }
  }

  draggingPlayer = false;
  mouseIsPressed = false;
  last = true;
}

window.onmousedown = (event) => {
  if(playerRoute) return;

  typingName = false;
  let px = (mouseX - w / 2) / camera.pixelsPerFoot;
  let py = (mouseY - h / 2) / camera.pixelsPerFoot;
  if (snapToGrid) {
    px = Math.round(px / snapSize) * snapSize;
    py = Math.round(py / snapSize) * snapSize;
  }
  px = Math.max(-80, Math.min(80, px)) + camera.x;
  py = Math.max(3.5, py) + camera.y;

  for (let i = players.offense.length - 1; i >= 1; i--) {
    let player = players.offense[i];
    if (px >= player.x - 3 && px < player.x + 3 && py >= player.y - 3 && py < player.y + 3) {
      draggingPlayer = player;
    }
  }
}

window.onmousemove = (event) => {
  mouseX = event.clientX;
  mouseY = event.clientY;

  let px = (mouseX - w / 2) / camera.pixelsPerFoot;
  let py = (mouseY - h / 2) / camera.pixelsPerFoot;

  if (snapToGrid || holdingShift) {
    px = Math.round(px / snapSize) * snapSize;
    py = Math.round(py / snapSize) * snapSize;
  }

  if(draggingPlayer) {
    px = Math.max(-80, Math.min(80, px)) + camera.x;
    py = Math.max(3.5, py) + camera.y;

    draggingPlayer.x = px;
    draggingPlayer.y = py;

    movedPlayer = true;
  }
  else if(playerRoute) {

    px += camera.x;
    py += camera.y;

    if(playerRoute.route.length === 0) {
      playerRoute.route = [[px, py]];
    }
    playerRoute.route[playerRoute.route.length-1] = [px, py];
  }
}

let keys = [];
const abcs = 'ABCDEFGHIJKLMNOPQRSTUVWXYZBACKSPACE ';

document.onkeydown = (event) => {
  keys.push([event.keyCode, true, Date.now()]);

  if(typingName) {
    if(abcs.indexOf(event.key.toUpperCase()) >= 0) {
      switch(event.key) {
        case 'Backspace':
        typingName.name = typingName.name.slice(0, -1);
        break;
        case ' ':
        typingName.name = typingName.name.slice(1);
        break;
        default:
          typingName.name += event.key.toUpperCase();
          if(typingName.name.length > 2) {
            typingName.name = typingName.name.slice(-2);
          }
      }
      keys = [];
    }
  }

  if(event.keyCode === 16) {
    holdingShift = true;
  }
}

document.onkeyup = (event) => {
  keys.push([event.keyCode, false, Date.now()]);
  if(typingName && abcs.indexOf(event.key.toUpperCase()) >= 0) keys = [];

  holdingShift = false;
}

canvas.oncontextmenu = _ => false;
