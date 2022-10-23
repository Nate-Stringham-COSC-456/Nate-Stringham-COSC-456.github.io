import { initShaders } from "../../src/init-shaders";
import { flatten, Vec3 } from "../../src/vector";
import { flattenColumnMajor, lookAt, perspectiveMatrix } from "../../src/matrix";
import { colors, points, axes } from "./shapes";
import vertexShaderSource from "./main.vert";
import fragmentShaderSource from "./main.frag";

const canvas = document.querySelector("canvas")!;
canvas.width = Math.floor(canvas.clientWidth * window.devicePixelRatio);
canvas.height = Math.floor(canvas.clientHeight * window.devicePixelRatio);

const gl = canvas.getContext("webgl2")!;

if (gl == null) {
  throw new Error("WebGL2 not supported");
}

gl.viewport(0, 0, canvas.width, canvas.height);
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

const uPerspective = gl.getUniformLocation(program, "uPerspective");
const uModelView = gl.getUniformLocation(program, "uModelView");

const perspective = perspectiveMatrix(Math.PI / 4, 1.0, 0.1, 100.0);
gl.uniformMatrix4fv(uPerspective, false, flattenColumnMajor(perspective));

const eye = new Vec3(0.0, 0.0, 10.0);
const at = new Vec3(0.0, 0.0, 0.0);
const up = new Vec3(0.0, 1.0, 0.0);

const modelView = lookAt(eye, at, up);
gl.uniformMatrix4fv(uModelView, false, flattenColumnMajor(modelView));

gl.drawArrays(axes.type, axes.start, axes.size);
