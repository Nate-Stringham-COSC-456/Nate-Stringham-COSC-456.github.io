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
}
