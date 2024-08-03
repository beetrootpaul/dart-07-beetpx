import { $u, $v, $v_0_0 } from "@beetpx/beetpx";
import { describe, expect, test } from "vitest";
import { incrementFrameNumber } from "../test-setup/stub-frame-number";
import { MovementFixed } from "./MovementFixed";

describe("MovementFixed", () => {
  [
    $v(0, 0),
    $v(1, 2),
    $v(-1, -2),
    $v(-999_999, 999_999),
    $v(1.234, 5.678),
  ].forEach(startXy => {
    test(`without frames limit (${startXy.x},${startXy.y})`, () => {
      const movement = MovementFixed.of({})(startXy);

      expect(movement.xy).toEqual(startXy);
      expect(movement.speed).toEqual($v_0_0);
      expect(movement.hasFinished).toBe(false);

      incrementFrameNumber();
      movement.update();

      expect(movement.xy).toEqual(startXy);
      expect(movement.speed).toEqual($v_0_0);
      expect(movement.hasFinished).toBe(false);

      incrementFrameNumber();
      movement.update();

      expect(movement.xy).toEqual(startXy);
      expect(movement.speed).toEqual($v_0_0);
      expect(movement.hasFinished).toBe(false);
    });

    test(`for a limit of N frames (${startXy.x},${startXy.y})`, () => {
      const movement = MovementFixed.of({ frames: 123 })(startXy);

      expect(movement.xy).toEqual(startXy);
      expect(movement.speed).toEqual($v_0_0);
      expect(movement.hasFinished).toBe(false);

      $u.range(122).forEach(() => {
        incrementFrameNumber();
        movement.update();
      });

      expect(movement.xy).toEqual(startXy);
      expect(movement.speed).toEqual($v_0_0);
      expect(movement.hasFinished).toBe(false);

      incrementFrameNumber();
      movement.update();

      expect(movement.xy).toEqual(startXy);
      expect(movement.speed).toEqual($v_0_0);
      expect(movement.hasFinished).toBe(true);

      incrementFrameNumber();
      movement.update();

      expect(movement.xy).toEqual(startXy);
      expect(movement.speed).toEqual($v_0_0);
      expect(movement.hasFinished).toBe(true);
    });

    test(`for a limit of 1 frame (${startXy.x},${startXy.y})`, () => {
      const movement = MovementFixed.of({ frames: 1 })(startXy);

      expect(movement.xy).toEqual(startXy);
      expect(movement.speed).toEqual($v_0_0);
      expect(movement.hasFinished).toBe(false);

      incrementFrameNumber();
      movement.update();

      expect(movement.xy).toEqual(startXy);
      expect(movement.speed).toEqual($v_0_0);
      expect(movement.hasFinished).toBe(true);

      incrementFrameNumber();
      movement.update();

      expect(movement.xy).toEqual(startXy);
      expect(movement.speed).toEqual($v_0_0);
      expect(movement.hasFinished).toBe(true);
    });

    test(`for a limit of 0 frames (${startXy.x},${startXy.y})`, () => {
      const movement = MovementFixed.of({ frames: 0 })(startXy);

      expect(movement.xy).toEqual(startXy);
      expect(movement.speed).toEqual($v_0_0);
      expect(movement.hasFinished).toBe(true);

      incrementFrameNumber();
      movement.update();

      expect(movement.xy).toEqual(startXy);
      expect(movement.speed).toEqual($v_0_0);
      expect(movement.hasFinished).toBe(true);
    });

    test(`for a limit of -N frames (${startXy.x},${startXy.y})`, () => {
      const movement = MovementFixed.of({ frames: -123 })(startXy);

      expect(movement.xy).toEqual(startXy);
      expect(movement.speed).toEqual($v_0_0);
      expect(movement.hasFinished).toBe(true);

      incrementFrameNumber();
      movement.update();

      expect(movement.xy).toEqual(startXy);
      expect(movement.speed).toEqual($v_0_0);
      expect(movement.hasFinished).toBe(true);
    });
  });
});
