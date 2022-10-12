import { Vec2, Vec3, Vec4 } from "./vector";

type fourNumbers = [number, number, number, number];
type nineNumbers = [number, number, number, number, number, number, number, number, number];
type sixteenNumbers = [...fourNumbers, ...fourNumbers, ...fourNumbers, ...fourNumbers];

export class Mat2 extends Array<Vec2> {
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
}

export class Mat3 extends Array<Vec3> {
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
}

export class Mat4 extends Array<Vec4> {
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
