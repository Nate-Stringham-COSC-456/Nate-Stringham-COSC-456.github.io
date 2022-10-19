import { initShaders } from "../../src/init-shaders";
import { flatten, Vec3 } from "../../src/vector";
import { colors, positions } from "./cube";
import vertexShaderSource from "./main.vert";
import fragmentShaderSource from "./main.frag";

const rotateXButton = document.querySelector("button#rotate-x") as HTMLButtonElement;
const rotateYButton = document.querySelector("button#rotate-y") as HTMLButtonElement;
const rotateZButton = document.querySelector("button#rotate-z") as HTMLButtonElement;

let axis: 0 | 1 | 2 = 0;

function updateAxesButtons() {
  rotateXButton.disabled = axis === 0;
  rotateYButton.disabled = axis === 1;
  rotateZButton.disabled = axis === 2;
}

rotateXButton.addEventListener("click", () => {
  axis = 0;
  updateAxesButtons();
});
rotateYButton.addEventListener("click", () => {
  axis = 1;
  updateAxesButtons();
});
rotateZButton.addEventListener("click", () => {
  axis = 2;
  updateAxesButtons();
});

const canvas = document.querySelector("canvas")!;
canvas.width = Math.floor(canvas.clientWidth * window.devicePixelRatio);
canvas.height = Math.floor(canvas.clientHeight * window.devicePixelRatio);

const gl = canvas.getContext("webgl2")!;

if (gl == null) {
  throw new Error("WebGL2 not supported");
}

gl.viewport(0, 0, canvas.width, canvas.height);
gl.clearColor(0, 0, 0, 0);

gl.enable(gl.DEPTH_TEST);

const program = initShaders(gl, vertexShaderSource, fragmentShaderSource);
gl.useProgram(program);

const colorBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

const aColor = gl.getAttribLocation(program, "aColor");
gl.vertexAttribPointer(aColor, 4, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(aColor);

const vertexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
gl.bufferData(gl.ARRAY_BUFFER, flatten(positions), gl.STATIC_DRAW);

const aPosition = gl.getAttribLocation(program, "aPosition");
gl.vertexAttribPointer(aPosition, 4, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(aPosition);

const uTheta = gl.getUniformLocation(program, "uTheta");

let previousTime = performance.now();

const theta = new Vec3();
function render(time: DOMHighResTimeStamp) {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  theta[axis] += (time - previousTime) / 10;
  gl.uniform3fv(uTheta, theta);

  gl.drawArrays(gl.TRIANGLES, 0, positions.length);

  requestAnimationFrame(render);
  previousTime = time;
}

requestAnimationFrame(render);
