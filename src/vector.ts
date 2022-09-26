export class Vec2 extends Float32Array {
  constructor(...args: [] | [Vec2] | [number, number]) {
    if (args.length === 0) {
      super(2);
    } else if (args.length === 1) {
      super(args[0]);
    } else if (args.length === 2) {
      super(args);
    } else {
      throw new Error("Invalid number of arguments");
    }
  }
}

export class Vec3 extends Float32Array {
  constructor(...args: [] | [Vec3] | [number, number, number]) {
    if (args.length === 0) {
      super(3);
    } else if (args.length === 1) {
      super(args[0]);
    } else if (args.length === 3) {
      super(args);
    } else {
      throw new Error("Invalid number of arguments");
    }
  }
}

export class Vec4 extends Float32Array {
  constructor(...args: [] | [Vec4] | [number, number, number, number]) {
    if (args.length === 0) {
      super(4);
    } else if (args.length === 1) {
      super(args[0]);
    } else if (args.length === 4) {
      super(args);
    } else {
      throw new Error("Invalid number of arguments");
    }
  }
}

/**
 * linearly interpolate between two values
 * @param u the start of the range in which to interpolate
 * @param v the end of the range in which to interpolate
 * @param s value ued to interpolate between u and v
 * @returns the interpolated value
 */
export function mix<T extends number | Vec2 | Vec3 | Vec4>(u: T, v: T, s: number): T {
  const s_ = 1 - s;
  if (typeof u == "number" && typeof v == "number") {
    return (s_ * u + s * v) as T;
  } else if (u instanceof Vec2 && v instanceof Vec2) {
    return new Vec2(s_ * u[0] + s * v[0], s_ * u[1] + s * v[1]) as T;
  } else if (u instanceof Vec3 && v instanceof Vec3) {
    return new Vec3(s_ * u[0] + s * v[0], s_ * u[1] + s * v[1], s_ * u[2] + s * v[2]) as T;
  } else if (u instanceof Vec4 && v instanceof Vec4) {
    return new Vec4(s_ * u[0] + s * v[0], s_ * u[1] + s * v[1], s_ * u[2] + s * v[2], s_ * u[3] + s * v[3]) as T;
  } else {
    throw new Error("Invalid arguments");
  }
}

export function flatten(list: Float32Array[]) {
  const size = list[0].length;
  const array = new Float32Array(list.length * size);
  for (let i = 0; i < list.length; i++) {
    array.set(list[i], i * size);
  }
  return array;
}
