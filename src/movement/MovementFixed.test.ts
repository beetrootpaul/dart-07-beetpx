import { u_, v_, v_0_0_ } from "@beetpx/beetpx";
import { describe, expect, test } from "@jest/globals";
import { MovementFixed } from "./MovementFixed";

describe("MovementFixed", () => {
  [
    v_(0, 0),
    v_(1, 2),
    v_(-1, -2),
    v_(-999_999, 999_999),
    v_(1.234, 5.678),
  ].forEach((startXy) => {
    test(`without frames limit (${startXy.x},${startXy.y})`, () => {
      const movement = MovementFixed.of({})(startXy);

      expect(movement.xy).toEqual(startXy);
      expect(movement.speed).toEqual(v_0_0_);
      expect(movement.hasFinished).toBe(false);

      movement.update();

      expect(movement.xy).toEqual(startXy);
      expect(movement.speed).toEqual(v_0_0_);
      expect(movement.hasFinished).toBe(false);

      movement.update();

      expect(movement.xy).toEqual(startXy);
      expect(movement.speed).toEqual(v_0_0_);
      expect(movement.hasFinished).toBe(false);
    });

    test(`for a limit of N frames (${startXy.x},${startXy.y})`, () => {
      const movement = MovementFixed.of({ frames: 123 })(startXy);

      expect(movement.xy).toEqual(startXy);
      expect(movement.speed).toEqual(v_0_0_);
      expect(movement.hasFinished).toBe(false);

      u_.range(122).forEach(() => {
        movement.update();
      });

      expect(movement.xy).toEqual(startXy);
      expect(movement.speed).toEqual(v_0_0_);
      expect(movement.hasFinished).toBe(false);

      movement.update();

      expect(movement.xy).toEqual(startXy);
      expect(movement.speed).toEqual(v_0_0_);
      expect(movement.hasFinished).toBe(true);

      movement.update();

      expect(movement.xy).toEqual(startXy);
      expect(movement.speed).toEqual(v_0_0_);
      expect(movement.hasFinished).toBe(true);
    });

    test(`for a limit of 1 frame (${startXy.x},${startXy.y})`, () => {
      const movement = MovementFixed.of({ frames: 1 })(startXy);

      expect(movement.xy).toEqual(startXy);
      expect(movement.speed).toEqual(v_0_0_);
      expect(movement.hasFinished).toBe(false);

      movement.update();

      expect(movement.xy).toEqual(startXy);
      expect(movement.speed).toEqual(v_0_0_);
      expect(movement.hasFinished).toBe(true);

      movement.update();

      expect(movement.xy).toEqual(startXy);
      expect(movement.speed).toEqual(v_0_0_);
      expect(movement.hasFinished).toBe(true);
    });

    test(`for a limit of 0 frames (${startXy.x},${startXy.y})`, () => {
      const movement = MovementFixed.of({ frames: 0 })(startXy);

      expect(movement.xy).toEqual(startXy);
      expect(movement.speed).toEqual(v_0_0_);
      expect(movement.hasFinished).toBe(true);

      movement.update();

      expect(movement.xy).toEqual(startXy);
      expect(movement.speed).toEqual(v_0_0_);
      expect(movement.hasFinished).toBe(true);
    });

    test(`for a limit of -N frames (${startXy.x},${startXy.y})`, () => {
      const movement = MovementFixed.of({ frames: -123 })(startXy);

      expect(movement.xy).toEqual(startXy);
      expect(movement.speed).toEqual(v_0_0_);
      expect(movement.hasFinished).toBe(true);

      movement.update();

      expect(movement.xy).toEqual(startXy);
      expect(movement.speed).toEqual(v_0_0_);
      expect(movement.hasFinished).toBe(true);
    });
  });
});
