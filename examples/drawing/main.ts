import { initShaders } from "../../src/init-shaders";
import { Vec2, Vec3 } from "../../src/vector";
import vertexShaderSource from "./main.vert";
import fragmentShaderSource from "./main.frag";

const maxPoints = 2048;

function hexToRgb(hex: string) {
  const int = parseInt(hex.substring(1), 16);
  return new Vec3((int >> 16) / 255, ((int >> 8) & 0xff) / 255, (int & 0xff) / 255);
}

const colorInput = document.querySelector("#color") as HTMLInputElement;

let color = hexToRgb(colorInput.value);

colorInput.addEventListener("input", () => {
  color = hexToRgb(colorInput.value);
});

const canvas = document.querySelector("canvas")!;
canvas.width = Math.floor(canvas.clientWidth * window.devicePixelRatio);
canvas.height = Math.floor(canvas.clientHeight * window.devicePixelRatio);

const gl = canvas.getContext("webgl2")!;

if (gl == undefined) {
  throw new Error("WebGL2 not supported");
}

gl.viewport(0, 0, canvas.width, canvas.height);
gl.clearColor(0, 0, 0, 0);

const program = initShaders(gl, vertexShaderSource, fragmentShaderSource);
gl.useProgram(program);

const uPointSize = gl.getUniformLocation(program, "uPointSize");
gl.uniform1f(uPointSize, window.devicePixelRatio * 12);

const colorBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.bufferData(gl.ARRAY_BUFFER, 3 * 4 * maxPoints, gl.STATIC_DRAW);

const aColor = gl.getAttribLocation(program, "aColor");
gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(aColor);

const vertexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
gl.bufferData(gl.ARRAY_BUFFER, 2 * 4 * maxPoints, gl.STATIC_DRAW);

const aPosition = gl.getAttribLocation(program, "aPosition");
gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(aPosition);

let index = 0;
function addPoint(point: Vec2) {
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferSubData(gl.ARRAY_BUFFER, color.byteLength * (index % maxPoints), color);
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferSubData(gl.ARRAY_BUFFER, point.byteLength * (index % maxPoints), point);
  index++;
}

let animationFrameRequest: number;
function render() {
  cancelAnimationFrame(animationFrameRequest);

  requestAnimationFrame(() => {
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.POINTS, 0, Math.min(index, maxPoints));
  });
}

function addPointFromEvent(event: { clientX: number; clientY: number }) {
  const x = (2 * event.clientX) / canvas.clientWidth - 1;
  const y = (2 * (canvas.clientHeight - event.clientY)) / canvas.clientHeight - 1;
  addPoint(new Vec2(x, y));
  render();
}

let drawing = false;

canvas.addEventListener("pointerdown", (event) => {
  addPointFromEvent(event);
  render();
  drawing = true;
});

canvas.addEventListener("pointerup", () => {
  drawing = false;
});

canvas.addEventListener("pointermove", (events) => {
  if (drawing) {
    for (const event of events.getCoalescedEvents()) {
      addPointFromEvent(event);
    }
    render();
  }
});

canvas.addEventListener("touchmove", (event) => {
  event.preventDefault();
  for (let i = 0; i < event.touches.length; i++) {
    addPointFromEvent(event.touches[i]);
  }
  render();
});
