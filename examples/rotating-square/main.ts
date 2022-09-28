import { initShaders } from "../../src/init-shaders";
import { flatten, Vec2 } from "../../src/vector";
import vertexShaderSource from "./main.vert";
import fragmentShaderSource from "./main.frag";

const changeDirectionButton = document.querySelector("#change-direction") as HTMLButtonElement;

let direction = 1;

changeDirectionButton.addEventListener("click", () => {
  direction *= -1;
});

const speedInput = document.querySelector("#speed") as HTMLInputElement;

let speed = parseFloat(speedInput.value);

speedInput.addEventListener("input", () => {
  speed = parseFloat(speedInput.value);
});

const canvas = document.querySelector("canvas")!;
canvas.width = Math.floor(canvas.clientWidth * window.devicePixelRatio);
canvas.height = Math.floor(canvas.clientHeight * window.devicePixelRatio);

const gl = canvas.getContext("webgl2")!;

if (gl == undefined) {
  throw new Error("WebGL2 not supported");
}

const vertices = [new Vec2(-0.5, -0.5), new Vec2(-0.5, 0.5), new Vec2(0.5, 0.5), new Vec2(0.5, -0.5)];

gl.viewport(0, 0, canvas.width, canvas.height);
gl.clearColor(0, 0, 0, 0);

const program = initShaders(gl, vertexShaderSource, fragmentShaderSource);
gl.useProgram(program);

const buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

const aPosition = gl.getAttribLocation(program, "aPosition");
gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(aPosition);

const uTheta = gl.getUniformLocation(program, "uTheta");

let theta = 0;

let previousTime = performance.now();

function render(time: DOMHighResTimeStamp) {
  gl.clear(gl.COLOR_BUFFER_BIT);

  theta += (direction * speed * (time - previousTime)) / 10_000;
  gl.uniform1f(uTheta, theta);

  gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);

  requestAnimationFrame(render);
  previousTime = time;
}

requestAnimationFrame(render);
