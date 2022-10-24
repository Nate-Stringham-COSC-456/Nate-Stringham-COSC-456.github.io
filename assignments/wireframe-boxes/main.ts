import { initShaders } from "../../src/init-shaders";
import { flatten, Vec3 } from "../../src/vector";
import { flattenColumnMajor, lookAt, perspectiveMatrix } from "../../src/matrix";
import { colors, points, axes } from "./shapes";
import vertexShaderSource from "./main.vert";
import fragmentShaderSource from "./main.frag";

const canvas = document.querySelector("canvas")!;

const gl = canvas.getContext("webgl2")!;

if (gl == null) {
  throw new Error("WebGL2 not supported");
}

gl.enable(gl.DEPTH_TEST);
gl.clearColor(0, 0, 0, 0);
gl.enable(gl.CULL_FACE);

const program = initShaders(gl, vertexShaderSource, fragmentShaderSource);
gl.useProgram(program);

const vertexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

const aPosition = gl.getAttribLocation(program, "aPosition");
gl.vertexAttribPointer(aPosition, 4, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(aPosition);

const colorBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

const aColor = gl.getAttribLocation(program, "aColor");
gl.vertexAttribPointer(aColor, 4, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(aColor);

const uModelView = gl.getUniformLocation(program, "uModelView");

const eye = new Vec3(0.0, 0.0, 10.0);
const at = new Vec3(0.0, 0.0, 0.0);
const up = new Vec3(0.0, 1.0, 0.0);

const modelView = lookAt(eye, at, up);
gl.uniformMatrix4fv(uModelView, false, flattenColumnMajor(modelView));

const uPerspective = gl.getUniformLocation(program, "uPerspective");

function resize() {
  const width = Math.floor(canvas.clientWidth * window.devicePixelRatio);
  const height = Math.floor(canvas.clientHeight * window.devicePixelRatio);

  canvas.width = width;
  canvas.height = height;

  gl.viewport(0, 0, width, height);

  const perspective = perspectiveMatrix(Math.PI / 4, canvas.width / canvas.height, 0.1, 100.0);
  gl.uniformMatrix4fv(uPerspective, false, flattenColumnMajor(perspective));
  requestAnimationFrame(render);
}

resize();

window.addEventListener("resize", resize);

function render() {
  gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
  gl.drawArrays(axes.type, axes.start, axes.size);
  gl.drawArrays(whiteCube.type, whiteCube.start, whiteCube.size);
  gl.drawArrays(magentaCube.type, magentaCube.start, magentaCube.size);
}
