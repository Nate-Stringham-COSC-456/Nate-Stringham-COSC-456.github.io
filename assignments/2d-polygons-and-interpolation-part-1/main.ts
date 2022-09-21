import { initShaders } from "../../src/init-shaders";
import vertexShaderSource from "./main.vert";
import fragmentShaderSource from "./main.frag";
import { flatten, Vec3 } from "../../src/mv";
import { Shape } from "../../src/shape";

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

function drawShape(gl: WebGL2RenderingContext, points: Shape, color: Vec3 | Vec3[]) {
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

const triangle = Shape.regularPolygon(3, Math.PI / 2);

triangle.scale(1 / 3);

triangle.translate(0, 2 / 3);

drawShape(gl, triangle, [red, green, blue]);

for (let i = 0; i < 7; i++) {
  const square = Shape.regularPolygon(4, Math.PI / 4);

  square.scale(((Math.sqrt(2) * 2) / 3) * ((7 - i) / 7));

  square.translate(0, -1 / 3);

  drawShape(gl, square, i % 2 == 0 ? black : white);
}

const numberOfSidesOfCircle = 512;

const ellipse = Shape.regularPolygon(numberOfSidesOfCircle);

ellipse.scale(1 / 3, 1 / 5);

ellipse.translate(-2 / 3, 2 / 3);

drawShape(gl, ellipse, red);

const circle = Shape.regularPolygon(numberOfSidesOfCircle);

circle.scale(1 / 4);

circle.translate(2 / 3, 2 / 3);

const fadeFRomBlackToRed: Vec3[] = [];
for (let i = 0; i < numberOfSidesOfCircle; i++) {
  fadeFRomBlackToRed.push(new Vec3(i / numberOfSidesOfCircle, 0, 0));
}

drawShape(gl, circle, fadeFRomBlackToRed);
