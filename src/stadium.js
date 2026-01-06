let camera = {
  x: 80,
  y: 180,
  pixelsPerFoot: 5
};
let showGrid = false;
let snapSize = 3;
let hashWidth = 40;

let football = {
  x: 80,
  y: 180,
  z: 0
};

const colors = {
  bg: '#224',
  fg: '#448',
  qb: '#f00',
  rb: '#f80',
  rc: '#8af',
  ln: '#78a',
  grid: '#336',
  names: '#fff',
  football: '#815337',
  shadow: '#0005',
};

function camText(txt, x, y, size = 3) {
  ctx.textAlign = 'center';
  ctx.font = `${size * camera.pixelsPerFoot}px Open Sans`;
  ctx.fillText(txt,
    w / 2 + (x - camera.x) * camera.pixelsPerFoot,
    h / 2 + (y - camera.y + size/3) * camera.pixelsPerFoot);
}

function camRect(x, y, width, height) {
  ctx.fillRect(
    w / 2 + (x - camera.x) * camera.pixelsPerFoot,
    h / 2 + (y - camera.y) * camera.pixelsPerFoot,
    width * camera.pixelsPerFoot,
    height * camera.pixelsPerFoot);
}

function camCircle(x, y, r) {
  ctx.beginPath();
  ctx.arc(
    w / 2 + (x - camera.x) * camera.pixelsPerFoot,
    h / 2 + (y - camera.y) * camera.pixelsPerFoot,
    r * camera.pixelsPerFoot,
    0,
    Math.PI * 2);
  ctx.fill();
}

function drawAcurateFootball() {
  ctx.lineWidth = camera.pixelsPerFoot / 3;
  ctx.fillStyle = colors.football;
  ctx.strokeStyle = colors.football;
  ctx.beginPath();
  ctx.arc(
    w / 2 + (football.x + 1/3 - camera.x) * camera.pixelsPerFoot,
    h / 2 + (football.y - camera.y) * camera.pixelsPerFoot,
    0.5 * camera.pixelsPerFoot,
    Math.PI * 2/3,
    Math.PI * 4/3);
  ctx.fill();
  ctx.beginPath();
    ctx.arc(
      w / 2 + (football.x - 1/3 - camera.x) * camera.pixelsPerFoot,
      h / 2 + (football.y - camera.y) * camera.pixelsPerFoot,
      0.5 * camera.pixelsPerFoot,
      Math.PI * 5/3,
      Math.PI * 7/3);
  ctx.fill();
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(
    w / 2 + (football.x + 1/3 - camera.x) * camera.pixelsPerFoot,
    h / 2 + (football.y - camera.y) * camera.pixelsPerFoot,
    0.5 * camera.pixelsPerFoot,
    Math.PI * 2/3,
    Math.PI * 4/3);
  ctx.stroke();
}

function drawFootball() {
  ctx.lineWidth = camera.pixelsPerFoot / 3;

  // shadow
  ctx.fillStyle = colors.shadow;
  ctx.beginPath();
  ctx.arc(
    w / 2 + (football.x - 0.77 - camera.x) * camera.pixelsPerFoot,
    h / 2 + (football.y - camera.y) * camera.pixelsPerFoot,
    2 * camera.pixelsPerFoot,
    Math.PI * 13/8,
    Math.PI * 19/8);
  ctx.arc(
    w / 2 + (football.x + 0.77 - camera.x) * camera.pixelsPerFoot,
    h / 2 + (football.y - camera.y) * camera.pixelsPerFoot,
    2 * camera.pixelsPerFoot,
    Math.PI * 5/8,
    Math.PI * 11/8);
  ctx.fill();

  // ball
  ctx.fillStyle = colors.football;
  ctx.beginPath();
  ctx.arc(
    w / 2 + (football.x - 0.77 - camera.x) * camera.pixelsPerFoot,
    h / 2 + (football.y - football.z/2 - camera.y) * camera.pixelsPerFoot,
    2 * camera.pixelsPerFoot,
    Math.PI * 13/8,
    Math.PI * 19/8);
  ctx.arc(
    w / 2 + (football.x + 0.77 - camera.x) * camera.pixelsPerFoot,
    h / 2 + (football.y - football.z/2 - camera.y) * camera.pixelsPerFoot,
    2 * camera.pixelsPerFoot,
    Math.PI * 5/8,
    Math.PI * 11/8);
  ctx.fill();
}

function camStrokeCircle(x, y, r, thickness = 1/3) {
  ctx.lineWidth = camera.pixelsPerFoot * thickness;
  ctx.beginPath();
  ctx.arc(
    w / 2 + (x - camera.x) * camera.pixelsPerFoot,
    h / 2 + (y - camera.y) * camera.pixelsPerFoot,
    r * camera.pixelsPerFoot,
    0,
    Math.PI * 2);
  ctx.stroke();
}

function camTriangle(x, y, offset) {
  ctx.beginPath();
  ctx.moveTo(
    w / 2 + (x - offset / 2 - camera.x) * camera.pixelsPerFoot,
    h / 2 + (y - camera.y) * camera.pixelsPerFoot);
  ctx.lineTo(
    w / 2 + (x + offset / 2 - camera.x) * camera.pixelsPerFoot,
    h / 2 + (y - camera.y) * camera.pixelsPerFoot);
  ctx.lineTo(
    w / 2 + (x - camera.x) * camera.pixelsPerFoot,
    h / 2 + (y + offset - camera.y) * camera.pixelsPerFoot);
  ctx.fill();
}

function camLineX(x, y, length, thickness) {
  ctx.fillRect(
    w / 2 + (x - camera.x) * camera.pixelsPerFoot,
    h / 2 + (y - camera.y - thickness / 2) * camera.pixelsPerFoot,
    length * camera.pixelsPerFoot,
    thickness * camera.pixelsPerFoot);
}

function camLineY(x, y, length, thickness) {
  ctx.fillRect(
    w / 2 + (x - camera.x - thickness / 2) * camera.pixelsPerFoot,
    h / 2 + (y - camera.y) * camera.pixelsPerFoot,
    thickness * camera.pixelsPerFoot,
    length * camera.pixelsPerFoot);
}

function camLine(x1, y1, x2, y2) {
  ctx.beginPath();
  ctx.moveTo(w / 2 + (x1 - camera.x) * camera.pixelsPerFoot,
  h / 2 + (y1 - camera.y) * camera.pixelsPerFoot);
  ctx.lineTo(
    w / 2 + (x2 - camera.x) * camera.pixelsPerFoot,
    h / 2 + (y2 - camera.y) * camera.pixelsPerFoot);
  ctx.stroke();
}

let holdingShift = false;

function drawStadium() {
  ctx.fillStyle = colors.bg;
  ctx.fillRect(0, 0, w, h);

  if(showGrid || holdingShift) {
    ctx.fillStyle = colors.grid;
    for (let i = snapSize; i < 300; i += snapSize) {
      camLineX(0, 30 + i, 160, 1 / 8);
    }
    for (let i = 0; i < 160; i += snapSize) {
      camLineY(i + (80%snapSize), 30, 300, 1 / 8);
    }
  }
  ctx.fillStyle = colors.fg;

  // logo
  camCircle(80, 180, 14);
  ctx.fillStyle = colors.bg;
  camCircle(80, 180, 13 + 2 / 3);
  ctx.fillStyle = colors.fg;


  camRect(72, 188, 6, 2);
  camRect(80, 177, 2, 6);
  camRect(84, 170, 2, 6);
  camRect(74, 172, 2, 18);
  camRect(72, 172, 14, 2);
  camRect(74, 179, 8, 2);


  ctx.fillStyle = colors.bg;
  camCircle(72, 174, 2);
  camCircle(72, 188, 2);
  camCircle(78, 188, 2);
  camCircle(80, 177, 2);
  camCircle(80, 183, 2);
  camCircle(84, 170, 2);
  camCircle(84, 176, 2);
  ctx.fillStyle = colors.fg;

  // border
  camRect(-2, -2, 164, 2);
  camRect(-2, -2, 2, 364);
  camRect(-2, 360, 162, 2);
  camRect(160, -2, 2, 364);

  // end zone
  camLineX(0, 30, 160, 1 / 3);
  camLineX(0, 330, 160, 1 / 3);

  // main lines
  for (let i = 1; i < 20; i++) {
    camLineX(1 / 3, 30 + 15 * i, 159 + 1 / 3, 1 / 3);

    camLineY(80 - hashWidth / 2, 29 + 15 * i, 2, 1 / 3);
    camLineY(80 + hashWidth / 2, 29 + 15 * i, 2, 1 / 3);
  }

  for (let i = 1; i < 5; i++) {
    camLineX(1 / 3, 30 + 15 * i, 159 + 1 / 3, 1 / 3);
    camTriangle(30, 29 + i * 30, -2);
    camTriangle(130, 29 + i * 30, -2);

    camTriangle(30, 331 - i * 30, 2);
    camTriangle(130, 331 - i * 30, 2);
  }

  // thirds
  for (let i = 0; i < 300; i += 3) {
    camLineX(78 - hashWidth / 2, 30 + i, 2, 1 / 3);
    camLineX(80 + hashWidth / 2, 30 + i, 2, 1 / 3);

    camLineX(1 / 3, 30 + i, 2, 1 / 3);
    camLineX(158 - 1 / 3, 30 + i, 2, 1 / 3);
  }

  camLineX(79, 39, 2, 2 / 3);
  camLineX(79, 321, 2, 2 / 3);
}
