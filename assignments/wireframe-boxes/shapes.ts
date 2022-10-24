import { Vec3, Vec4 } from "../../src/vector";

const gl = WebGL2RenderingContext;

type Shape = {
  points: Vec4[];
  colors: Vec4[];
  type: GLenum;
};

type LoadedShape = {
  start: GLint;
  size: GLint;
  type: GLenum;
};

export const points: Vec4[] = [];
export const colors: Vec4[] = [];

export function loadShape(shape: Shape): LoadedShape {
  const start = points.length;
  points.push(...shape.points);
  colors.push(...shape.colors);
  return {
    start,
    size: points.length - start,
    type: shape.type,
  };
}

const darkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;

const red = new Vec4(1, 0, 0, 1);
const green = new Vec4(0, 1, 0, 1);
const blue = new Vec4(0, 0, 1, 1);
const white = darkMode ? new Vec4(1, 1, 1, 1) : new Vec4(0, 0, 0, 1);
const magenta = new Vec4(1, 0, 1, 1);

export const axes = loadShape({
  points: [
    new Vec4(2.0, 0.0, 0.0, 1.0),
    new Vec4(-2.0, 0.0, 0.0, 1.0),
    new Vec4(0.0, 2.0, 0.0, 1.0),
    new Vec4(0.0, -2.0, 0.0, 1.0),
    new Vec4(0.0, 0.0, 2.0, 1.0),
    new Vec4(0.0, 0.0, -2.0, 1.0),
  ],
  colors: [green, green, red, red, blue, blue],
  type: gl.LINES,
});

const cubeVertexes = [
  new Vec4(0.5, 0.5, 0.5, 1),
  new Vec4(0.5, 0.5, -0.5, 1),
  new Vec4(0.5, -0.5, 0.5, 1),
  new Vec4(0.5, -0.5, -0.5, 1),
  new Vec4(-0.5, 0.5, 0.5, 1),
  new Vec4(-0.5, 0.5, -0.5, 1),
  new Vec4(-0.5, -0.5, 0.5, 1),
  new Vec4(-0.5, -0.5, -0.5, 1),
];

const wireCubeIndexes = [0, 1, 5, 1, 3, 7, 3, 2, 6, 2, 0, 4, 5, 7, 6, 4];

export const whiteCube = loadShape({
  points: wireCubeIndexes.map((i) => cubeVertexes[i]),
  colors: new Array(wireCubeIndexes.length).fill(white),
  type: gl.LINE_STRIP,
});

export const magentaCube = loadShape({
  points: wireCubeIndexes.map((i) => cubeVertexes[i]),
  colors: new Array(wireCubeIndexes.length).fill(magenta),
  type: gl.LINE_STRIP,
});

// export const solidCube = loadShape({ points: [], colors: [], type: gl.TRIANGLES });
