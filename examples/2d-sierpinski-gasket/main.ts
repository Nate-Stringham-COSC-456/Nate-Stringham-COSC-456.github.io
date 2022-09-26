import { initShaders } from "../../src/init-shaders";
import { flatten, mix, Vec2 } from "../../src/vector";
import vertexShaderSource from "./main.vert";
import fragmentShaderSource from "./main.frag";

const numTimesToSubdivide = 5;

const canvas = document.querySelector("canvas")!;
canvas.width = Math.floor(canvas.clientWidth * window.devicePixelRatio);
canvas.height = Math.floor(canvas.clientHeight * window.devicePixelRatio);

const gl = canvas.getContext("webgl2");

if (gl == undefined) {
  throw new Error("WebGL2 not supported");
}

const vertices = [new Vec2(-1, -1), new Vec2(0, 1), new Vec2(1, -1)] as const;

const positions = [...divideTriangle(...vertices, numTimesToSubdivide)];

gl.viewport(0, 0, canvas.width, canvas.height);
gl.clearColor(0.0, 0.0, 0.0, 0.0);

const program = initShaders(gl, vertexShaderSource, fragmentShaderSource);
gl.useProgram(program);

const buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, flatten(positions), gl.STATIC_DRAW);

const aPosition = gl.getAttribLocation(program, "aPosition");
gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(aPosition);

gl.clear(gl.COLOR_BUFFER_BIT);
gl.drawArrays(gl.TRIANGLES, 0, positions.length);

function* divideTriangle(a: Vec2, b: Vec2, c: Vec2, count: number): Generator<Vec2> {
  if (count === 0) {
    yield a;
    yield b;
    yield c;
  } else {
    const ab = mix(a, b, 0.5);
    const ac = mix(a, c, 0.5);
    const bc = mix(b, c, 0.5);

    yield* divideTriangle(a, ab, ac, count - 1);
    yield* divideTriangle(c, ac, bc, count - 1);
    yield* divideTriangle(b, bc, ab, count - 1);
  }
}
