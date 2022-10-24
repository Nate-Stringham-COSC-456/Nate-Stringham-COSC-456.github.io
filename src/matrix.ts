import { Vec2, Vec3, Vec4 } from "./vector";

type fourNumbers = [number, number, number, number];
type nineNumbers = [number, number, number, number, number, number, number, number, number];
type sixteenNumbers = [...fourNumbers, ...fourNumbers, ...fourNumbers, ...fourNumbers];

export class Mat2 extends Array<Vec2> {
  static get identity(): Mat2 {
    return new Mat2(new Vec2(1, 0), new Vec2(0, 1));
  }

  constructor(...args: [] | [Mat2] | [Vec2, Vec2] | fourNumbers) {
    if (args.length === 0) {
      super(new Vec2(), new Vec2());
    } else if (args.length === 1) {
      super(new Vec2(args[0][0]), new Vec2(args[0][1]));
    } else if (args.length === 2) {
      super(new Vec2(args[0]), new Vec2(args[1]));
    } else if (args.length === 4) {
      super(new Vec2(args[0], args[1]), new Vec2(args[2], args[3]));
    } else {
      throw new Error("Invalid number of arguments");
    }
  }

  transpose(): Mat2 {
    return new Mat2(new Vec2(this[0][0], this[1][0]), new Vec2(this[0][1], this[1][1]));
  }

  multiply(other: Mat2): Mat2 {
    const result = new Mat2();
    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < 2; j++) {
        result[i][j] = this[i][0] * other[0][j] + this[i][1] * other[1][j];
      }
    }
    return result;
  }
}

export class Mat3 extends Array<Vec3> {
  static get identity(): Mat3 {
    return new Mat3(new Vec3(1, 0, 0), new Vec3(0, 1, 0), new Vec3(0, 0, 1));
  }

  constructor(...args: [] | [Mat3] | [Vec3, Vec3, Vec3] | nineNumbers) {
    if (args.length === 0) {
      super(new Vec3(), new Vec3(), new Vec3());
    } else if (args.length === 1) {
      super(new Vec3(args[0][0]), new Vec3(args[0][1]), new Vec3(args[0][2]));
    } else if (args.length === 3) {
      super(new Vec3(args[0]), new Vec3(args[1]), new Vec3(args[2]));
    } else if (args.length === 9) {
      super(
        new Vec3(args[0], args[1], args[2]),
        new Vec3(args[3], args[4], args[5]),
        new Vec3(args[6], args[7], args[8])
      );
    } else {
      throw new Error("Invalid number of arguments");
    }
  }

  transpose(): Mat3 {
    return new Mat3(
      new Vec3(this[0][0], this[1][0], this[2][0]),
      new Vec3(this[0][1], this[1][1], this[2][1]),
      new Vec3(this[0][2], this[1][2], this[2][2])
    );
  }

  multiply(other: Mat3): Mat3 {
    const result = new Mat3();
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        result[i][j] = this[i][0] * other[0][j] + this[i][1] * other[1][j] + this[i][2] * other[2][j];
      }
    }
    return result;
  }
}

export class Mat4 extends Array<Vec4> {
  static get identity(): Mat4 {
    return new Mat4(new Vec4(1, 0, 0, 0), new Vec4(0, 1, 0, 0), new Vec4(0, 0, 1, 0), new Vec4(0, 0, 0, 1));
  }

  constructor(...args: [] | [Mat4] | [Vec4, Vec4, Vec4, Vec4] | sixteenNumbers) {
    if (args.length === 0) {
      super(new Vec4(), new Vec4(), new Vec4(), new Vec4());
    } else if (args.length === 1) {
      super(new Vec4(args[0][0]), new Vec4(args[0][1]), new Vec4(args[0][2]), new Vec4(args[0][3]));
    } else if (args.length === 4) {
      super(new Vec4(args[0]), new Vec4(args[1]), new Vec4(args[2]), new Vec4(args[3]));
    } else if (args.length === 16) {
      super(
        new Vec4(args[0], args[1], args[2], args[3]),
        new Vec4(args[4], args[5], args[6], args[7]),
        new Vec4(args[8], args[9], args[10], args[11]),
        new Vec4(args[12], args[13], args[14], args[15])
      );
    } else {
      throw new Error("Invalid number of arguments");
    }
  }

  transpose(): Mat4 {
    return new Mat4(
      new Vec4(this[0][0], this[1][0], this[2][0], this[3][0]),
      new Vec4(this[0][1], this[1][1], this[2][1], this[3][1]),
      new Vec4(this[0][2], this[1][2], this[2][2], this[3][2]),
      new Vec4(this[0][3], this[1][3], this[2][3], this[3][3])
    );
  }

  multiply(other: Mat4): Mat4 {
    const result = new Mat4();
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        result[i][j] =
          this[i][0] * other[0][j] + this[i][1] * other[1][j] + this[i][2] * other[2][j] + this[i][3] * other[3][j];
      }
    }
    return result;
  }
}

/**
 * generate a matrix that performs a transformation in 3d space
 * @param x the translation along x
 * @param y the translation along y
 * @param z the translation along z
 * @returns a matrix that translates by (x, y, z)
 */
export function translationMatrix(x: number, y: number, z: number): Mat4 {
  return new Mat4(1, 0, 0, x, 0, 1, 0, y, 0, 0, 1, z, 0, 0, 0, 1);
}

/**
 * converts a matrix to a single Float32Array using column major order
 * @param matrix a matrix
 * @returns matrix as a single buffer in column major order
 */
export function flattenColumnMajor(matrix: Mat2 | Mat3 | Mat4): Float32Array {
  const size = matrix.length;
  const array = new Float32Array(matrix.length * size);
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      array[i * size + j] = matrix[j][i];
    }
  }
  return array;
}

/**
 * define camera space in terms of camera position, target, and up vector
 * @param eye the position of the camera
 * @param at the position the camera is looking at
 * @param up the up direction of the camera
 * @returns a transformation matrix that transforms from world space to camera space
 */
export function lookAt(eye: Vec3, at: Vec3, up: Vec3): Mat4 {
  if (eye.equals(at)) {
    throw new Error("eye and at cannot be the same");
  }

  const view = at.subtract(eye).normalize();
  const right = view.cross(up).normalize();
  const newUp = right.cross(view).normalize();

  return new Mat4(
    new Vec4(right[0], right[1], right[2], -right.dot(eye)),
    new Vec4(newUp[0], newUp[1], newUp[2], -newUp.dot(eye)),
    new Vec4(-view[0], -view[1], -view[2], view.dot(eye)),
    new Vec4(0, 0, 0, 1)
  );
}

/**
 * generate a matrix that performs a orthographic projection
 */
export function orthographic(left: number, right: number, bottom: number, top: number, near: number, far: number) {
  if (left == right) {
    throw new Error("left and right cannot be equal");
  }
  if (bottom == top) {
    throw new Error("bottom and top cannot be equal");
  }
  if (near == far) {
    throw new Error("near and far cannot be equal");
  }

  const w = right - left;
  const h = top - bottom;
  const d = far - near;

  const result = new Mat4();

  result[0][0] = 2.0 / w;
  result[1][1] = 2.0 / h;
  result[2][2] = -2.0 / d;

  result[0][3] = -(left + right) / w;
  result[1][3] = -(top + bottom) / h;
  result[2][3] = -(near + far) / d;
  result[3][3] = 1.0;

  return result;
}

/**
 * define a perspective projection matrix
 * @param fovy the vertical field of view in radians
 * @param aspect the aspect ratio of the viewport (width/height)
 * @param near the near clipping plane
 * @param far the far clipping plane
 * @returns a matrix that transforms from camera space to clip space
 */
export function perspectiveMatrix(fovy: number, aspect: number, near: number, far: number) {
  const f = 1.0 / Math.tan(fovy / 2);
  const d = far - near;

  const result = new Mat4();
  result[0][0] = f / aspect;
  result[1][1] = f;
  result[2][2] = -(near + far) / d;
  result[2][3] = (-2 * near * far) / d;
  result[3][2] = -1;

  return result;
}
