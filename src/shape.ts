import { Vec2 } from "./mv";

export class Shape extends Array<Vec2> {
  constructor(...points: Vec2[]) {
    super(...points);
  }

  static regularPolygon(numberOfSides: number, startingAngle = 0): Shape {
    const angleIncrement = (2 * Math.PI) / numberOfSides;

    const points: Vec2[] = [];

    for (let i = 0; i < numberOfSides; i++) {
      const angle = startingAngle + i * angleIncrement;
      points.push(new Vec2(Math.cos(angle), Math.sin(angle)));
    }

    return new Shape(...points);
  }

  scale(scaleX: number, scaleY?: number) {
    scaleY ??= scaleX;

    for (const point of this) {
      point[0] *= scaleX;
      point[1] *= scaleY;
    }
  }

  translate(x: number, y: number) {
    for (const point of this) {
      point[0] += x;
      point[1] += y;
    }
  }

  rotate(radians: number) {
    const cos = Math.cos(radians);
    const sin = Math.sin(radians);

    for (const point of this) {
      const x = point[0];
      const y = point[1];

      point[0] = x * cos - y * sin;
      point[1] = x * sin + y * cos;
    }
  }
}
