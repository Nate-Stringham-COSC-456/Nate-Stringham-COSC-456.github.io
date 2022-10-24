import { initShaders } from "../../src/init-shaders";
import { flatten, Vec3 } from "../../src/vector";
import {
  flattenColumnMajor,
  lookAt,
  orthographic,
  translationMatrix,
  xRotationMatrix,
  yRotationMatrix,
} from "../../src/matrix";
import { colors, points, axes, whiteCube, magentaCube } from "./shapes";
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

const eye = new Vec3(0, 0, 10);
const at = new Vec3(0, 0, 0);
const up = new Vec3(0, 1, 0);

const worldToCamera = lookAt(eye, at, up);

const uPerspective = gl.getUniformLocation(program, "uPerspective");

function resize() {
  const width = Math.floor(canvas.clientWidth * window.devicePixelRatio);
  const height = Math.floor(canvas.clientHeight * window.devicePixelRatio);

  canvas.width = width;
  canvas.height = height;

  gl.viewport(0, 0, width, height);

  const aspectRatio = width / height;
  const perspective = orthographic(-3 * aspectRatio, 3 * aspectRatio, -3, 3, 5, 15);
  gl.uniformMatrix4fv(uPerspective, false, flattenColumnMajor(perspective));
  requestAnimationFrame(render);
}

resize();

window.addEventListener("resize", resize);

function render() {
  gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

  const axisModelView = worldToCamera.multiply(xRotationMatrix(Math.PI / 6)).multiply(yRotationMatrix(Math.PI / 7));
  gl.uniformMatrix4fv(uModelView, false, flattenColumnMajor(axisModelView));
  gl.drawArrays(axes.type, axes.start, axes.size);

  const whiteCubeModelView = axisModelView.multiply(translationMatrix(1, 0, 0));
  gl.uniformMatrix4fv(uModelView, false, flattenColumnMajor(whiteCubeModelView));
  gl.drawArrays(whiteCube.type, whiteCube.start, whiteCube.size);

  const magentaCubeModelView = axisModelView
    .multiply(translationMatrix(1, 1, 0))
    .multiply(yRotationMatrix(Math.PI / 4));
  gl.uniformMatrix4fv(uModelView, false, flattenColumnMajor(magentaCubeModelView));
  gl.drawArrays(magentaCube.type, magentaCube.start, magentaCube.size);
}
