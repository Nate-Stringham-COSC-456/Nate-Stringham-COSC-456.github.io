import { initShaders } from "../../src/init-shaders";
import { flatten, mix, Vec3 } from "../../src/vector";
import vertexShaderSource from "./main.vert";
import fragmentShaderSource from "./main.frag";

const numTimesToSubdivide = 3;

const colorPalette = [
  new Vec3(1.0, 0.0, 0.0),
  new Vec3(0.0, 1.0, 0.0),
  new Vec3(0.0, 0.0, 1.0),
  new Vec3(0.0, 0.0, 0.0),
] as const;

const canvas = document.querySelector("canvas")!;
canvas.width = Math.floor(canvas.clientWidth * window.devicePixelRatio);
canvas.height = Math.floor(canvas.clientHeight * window.devicePixelRatio);

const gl = canvas.getContext("webgl2");

if (gl == null) {
  throw new Error("WebGL2 not supported");
}

const vertices = [
  new Vec3(0.0, 0.0, -1.0),
  new Vec3(0.0, 0.9428, 0.3333),
  new Vec3(-0.8165, -0.4714, 0.3333),
  new Vec3(0.8165, -0.4714, 0.3333),
] as const;

const positions = [...divideTetra(...vertices, numTimesToSubdivide)];

const colors: Vec3[] = [];
for (let i = 0; i < positions.length / 3; i++) {
  colors.push(colorPalette[i % 4]);
  colors.push(colorPalette[i % 4]);
  colors.push(colorPalette[i % 4]);
}

gl.viewport(0, 0, canvas.width, canvas.height);
gl.clearColor(0.0, 0.0, 0.0, 0.0);

gl.enable(gl.DEPTH_TEST);

const program = initShaders(gl, vertexShaderSource, fragmentShaderSource);
gl.useProgram(program);

const colorBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

const aColor = gl.getAttribLocation(program, "aColor");
gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(aColor);

const vertexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
gl.bufferData(gl.ARRAY_BUFFER, flatten(positions), gl.STATIC_DRAW);

const aPosition = gl.getAttribLocation(program, "aPosition");
gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(aPosition);

gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
gl.drawArrays(gl.TRIANGLES, 0, positions.length);

function* triangle(a: Vec3, b: Vec3, c: Vec3): Generator<Vec3> {
  yield a;
  yield b;
  yield c;
}

function* divideTetra(a: Vec3, b: Vec3, c: Vec3, d: Vec3, count: number): Generator<Vec3> {
  if (count === 0) {
    yield* triangle(a, c, b);
    yield* triangle(a, c, d);
    yield* triangle(a, b, d);
    yield* triangle(b, c, d);
  } else {
    const ab = mix(a, b, 0.5);
    const ac = mix(a, c, 0.5);
    const ad = mix(a, d, 0.5);
    const bc = mix(b, c, 0.5);
    const bd = mix(b, d, 0.5);
    const cd = mix(c, d, 0.5);

    yield* divideTetra(a, ab, ac, ad, count - 1);
    yield* divideTetra(ab, b, bc, bd, count - 1);
    yield* divideTetra(ac, bc, c, cd, count - 1);
    yield* divideTetra(ad, bd, cd, d, count - 1);
  }
}
