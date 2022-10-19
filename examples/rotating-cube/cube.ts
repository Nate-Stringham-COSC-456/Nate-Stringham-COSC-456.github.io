import { Vec4 } from "../../src/vector";

const red = new Vec4(1, 0, 0, 1);
const yellow = new Vec4(1, 1, 0, 1);
const green = new Vec4(0, 1, 0, 1);
const cyan = new Vec4(0, 1, 1, 1);
const blue = new Vec4(0, 0, 1, 1);
const magenta = new Vec4(1, 0, 1, 1);

const vertices = [
  new Vec4(-0.5, -0.5, 0.5, 1.0),
  new Vec4(-0.5, 0.5, 0.5, 1.0),
  new Vec4(0.5, 0.5, 0.5, 1.0),
  new Vec4(0.5, -0.5, 0.5, 1.0),
  new Vec4(-0.5, -0.5, -0.5, 1.0),
  new Vec4(-0.5, 0.5, -0.5, 1.0),
  new Vec4(0.5, 0.5, -0.5, 1.0),
  new Vec4(0.5, -0.5, -0.5, 1.0),
] as const;

type Index = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

export const positions: Vec4[] = [];
export const colors: Vec4[] = [];

addQuad(1, 0, 3, 2, red);
addQuad(2, 3, 7, 6, yellow);
addQuad(3, 0, 4, 7, green);
addQuad(6, 5, 1, 2, cyan);
addQuad(4, 5, 6, 7, blue);
addQuad(5, 4, 0, 1, magenta);

function addQuad(a: Index, b: Index, c: Index, d: Index, color: Vec4) {
  const indices = [a, b, c, a, c, d];

  for (const i of indices) {
    positions.push(vertices[i]);
    colors.push(color);
  }
}
