import { initShaders } from "../../src/init-shaders";
import vertexShaderSource from "./main.vert";
import fragmentShaderSource from "./main.frag";
import { flatten, Vec2, Vec3 } from "../../src/mv";

const canvas = document.querySelector("canvas")!;
canvas.width = Math.floor(canvas.clientWidth * window.devicePixelRatio);
canvas.height = Math.floor(canvas.clientHeight * window.devicePixelRatio);

const gl = canvas.getContext("webgl2");

if (gl == undefined) {
  throw new Error("WebGL2 not supported");
}

gl.viewport(0, 0, canvas.width, canvas.height);
gl.clearColor(0, 0, 0, 0);

const program = initShaders(gl, vertexShaderSource, fragmentShaderSource);
gl.useProgram(program);

gl.clear(gl.COLOR_BUFFER_BIT);

function createRegularPolygon(numberOfSides: number, startingAngle = 0): Vec2[] {
  const angleIncrement = (2 * Math.PI) / numberOfSides;

  const points: Vec2[] = [];

  for (let i = 0; i < numberOfSides; i++) {
    const angle = startingAngle + i * angleIncrement;
    points.push(new Vec2(Math.cos(angle), Math.sin(angle)));
  }

  return points;
}

function scaleShape(shape: Vec2[], scaleX: number, scaleY?: number) {
  scaleY ??= scaleX;

  for (const point of shape) {
    point[0] *= scaleX;
    point[1] *= scaleY;
  }
}

function translateShape(shape: Vec2[], x: number, y: number) {
  for (const point of shape) {
    point[0] += x;
    point[1] += y;
  }
}

function drawShape(gl: WebGL2RenderingContext, points: Vec2[], color: Vec3 | Vec3[]) {
  const colors = Array.isArray(color) ? color : new Array(points.length).fill(color);

  if (points.length !== colors.length) {
    throw new Error("Number of points and colors must be the same");
  }

  const aPositionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, aPositionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

  const aPositionLocation = gl.getAttribLocation(program, "aPosition");
  gl.vertexAttribPointer(aPositionLocation, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(aPositionLocation);

  const aColorBUffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, aColorBUffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

  const aColorLocation = gl.getAttribLocation(program, "aColor");
  gl.vertexAttribPointer(aColorLocation, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(aColorLocation);

  gl.drawArrays(gl.TRIANGLE_FAN, 0, points.length);
}

const red = new Vec3(1, 0, 0);
const green = new Vec3(0, 1, 0);
const blue = new Vec3(0, 0, 1);
const black = new Vec3(0, 0, 0);
const white = new Vec3(1, 1, 1);

const triangle = createRegularPolygon(3, Math.PI / 2);

scaleShape(triangle, 1 / 3);

translateShape(triangle, 0, 2 / 3);

drawShape(gl, triangle, [red, green, blue]);

for (let i = 0; i < 7; i++) {
  const square = createRegularPolygon(4, Math.PI / 4);

  scaleShape(square, ((Math.sqrt(2) * 2) / 3) * ((7 - i) / 7));

  translateShape(square, 0, -1 / 3);

  drawShape(gl, square, i % 2 == 0 ? black : white);
}

const numberOfSidesOfCircle = 512;

const ellipse = createRegularPolygon(numberOfSidesOfCircle);

scaleShape(ellipse, 1 / 3, 1 / 6);

translateShape(ellipse, -2 / 3, 2 / 3);

drawShape(gl, ellipse, red);

const circle = createRegularPolygon(numberOfSidesOfCircle);

scaleShape(circle, 1 / 4);

translateShape(circle, 2 / 3, 2 / 3);

const fadeFRomBlackToRed: Vec3[] = [];
for (let i = 0; i < numberOfSidesOfCircle; i++) {
  fadeFRomBlackToRed.push(new Vec3(i / numberOfSidesOfCircle, 0, 0));
}

drawShape(gl, circle, fadeFRomBlackToRed);
