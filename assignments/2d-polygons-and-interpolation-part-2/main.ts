import { initShaders } from "../../src/init-shaders";
import vertexShaderSource from "./main.vert";
import fragmentShaderSource from "./main.frag";
import { flatten, Vec2, Vec3 } from "../../src/vector";
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
const yellow = new Vec3(1, 1, 0);
const darkYellow = new Vec3(0.5, 0.5, 0);
const green = new Vec3(0, 1, 0);
const cyan = new Vec3(0, 1, 1);
const darkCyan = new Vec3(0, 0.5, 0.5);
const blue = new Vec3(0, 0, 1);
const magenta = new Vec3(1, 0, 1);
const darkMagenta = new Vec3(0.5, 0, 0.5);
const white = new Vec3(1, 1, 1);

const hexagon = Shape.regularPolygon(6, Math.PI / 2);
hexagon.scale(1 / 2);
hexagon.translate(-1 / 2, 1 / 2);
drawShape(gl, hexagon, [red, darkYellow, green, darkCyan, blue, darkMagenta]);

const cubeFace1 = Shape.regularPolygon(4, 0);
cubeFace1.scale(Math.sqrt(3) / 4, 1 / 4);
cubeFace1.translate(0, 1 / 4);
cubeFace1.rotate((0 * Math.PI) / 2);
cubeFace1.translate(1 / 2, 1 / 2);
drawShape(gl, cubeFace1, [magenta, red, yellow, white]);

const cubeFace2 = Shape.regularPolygon(4, 0);
cubeFace2.scale(Math.sqrt(3) / 4, 1 / 4);
cubeFace2.translate(0, 1 / 4);
cubeFace2.rotate((2 * Math.PI) / 3);
cubeFace2.translate(1 / 2, 1 / 2);
drawShape(gl, cubeFace2, [yellow, green, cyan, white]);

const cubeFace3 = Shape.regularPolygon(4, 0);
cubeFace3.scale(Math.sqrt(3) / 4, 1 / 4);
cubeFace3.translate(0, 1 / 4);
cubeFace3.rotate((4 * Math.PI) / 3);
cubeFace3.translate(1 / 2, 1 / 2);
drawShape(gl, cubeFace3, [cyan, blue, magenta, white]);

const octagon = Shape.regularPolygon(6, Math.PI / 2);
octagon.push(new Vec2(octagon[0]));
octagon.unshift(new Vec2(0, 0));
octagon.scale(1 / 2);
octagon.translate(-1 / 2, -1 / 2);
drawShape(gl, octagon, [white, red, yellow, green, cyan, blue, magenta, red]);

const numberOfSidesOfCircle = 512;
const wheelColors = [white];
for (let i = 0; i < numberOfSidesOfCircle; i++) {
  const f = (n: number) => {
    const k = (n + 12 * (i / numberOfSidesOfCircle)) % 12;
    return 0.5 - 0.5 * Math.max(-1, Math.min(k - 3, 9 - k, 1));
  };
  wheelColors.push(new Vec3(f(0), f(8), f(4)));
}
wheelColors.push(red);
const wheel = Shape.regularPolygon(numberOfSidesOfCircle, Math.PI / 2);
wheel.push(new Vec2(wheel[0]));
wheel.unshift(new Vec2(0, 0));
wheel.scale(1 / 2);
wheel.translate(1 / 2, -1 / 2);
drawShape(gl, wheel, wheelColors);
