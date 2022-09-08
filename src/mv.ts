export class Vec2 extends Float32Array {
  constructor(...args: [number?, number?] | [Vec2]) {
    if (args[0] instanceof Vec2) {
      super(args[0]);
    } else {
      super([args[0] ?? 0, args[1] ?? 0]);
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
export function mix<T extends number | Vec2>(u: T, v: T, s: number): T {
  const s_ = 1 - s;
  if (typeof u == "number" && typeof v == "number") {
    return (s_ * u + s * v) as T;
  } else if (u instanceof Vec2 && v instanceof Vec2) {
    return new Vec2(s_ * u[0] + s * v[0], s_ * u[1] + s * v[1]) as T;
  } else {
    throw new Error("Invalid arguments");
  }
}

export function flatten(list: Vec2[]) {
  const array = new Float32Array(list.length * 2);
  for (let i = 0; i < list.length; i++) {
    array.set(list[i], i * 2);
  }
  return array;
}
