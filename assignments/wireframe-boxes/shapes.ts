import { Vec4 } from "../../src/vector";

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

const red = new Vec4(1, 0, 0, 1);
const green = new Vec4(0, 1, 0, 1);
const blue = new Vec4(0, 0, 1, 1);

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

// export const wireCube = loadShape({ points: [], colors: [], type: gl.LINE_STRIP });

// export const solidCube = loadShape({ points: [], colors: [], type: gl.TRIANGLES });
