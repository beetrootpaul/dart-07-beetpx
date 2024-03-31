import { BeetPx, u_, v_, v_0_0_ } from "@beetpx/beetpx";
import { beforeEach, describe, expect, jest, test } from "@jest/globals";
import { MovementLine } from "./MovementLine";

describe("MovementLine", () => {
  let stubbedFrameNumber = 1;

  function incrementFrameNumber(): void {
    stubbedFrameNumber += 1;
  }

  beforeEach(() => {
    jest
      .spyOn(BeetPx, "frameNumber", "get")
      .mockImplementation(() => stubbedFrameNumber);
  });

  [
    {
      caseName: "right",
      startXy: v_(123, -4.56),
      angle: 0,
      angledSpeed: 2,
      expectedSpeed: v_(2, 0),
    },
    {
      caseName: "left",
      startXy: v_(123, -4.56),
      angle: 0.5,
      angledSpeed: 2,
      expectedSpeed: v_(-2, 0),
    },
    {
      caseName: "down",
      startXy: v_(123, -4.56),
      angle: 0.25,
      angledSpeed: 2,
      expectedSpeed: v_(0, 2),
    },
    {
      caseName: "up",
      startXy: v_(123, -4.56),
      angle: 0.75,
      angledSpeed: 2,
      expectedSpeed: v_(0, -2),
    },
    {
      caseName: "up, but defined with a negative turn",
      startXy: v_(123, -4.56),
      angle: -0.25,
      angledSpeed: 2,
      expectedSpeed: v_(0, -2),
    },
    {
      caseName: "up, but defined with a turn over 1",
      startXy: v_(123, -4.56),
      angle: 987.75,
      angledSpeed: 2,
      expectedSpeed: v_(0, -2),
    },
    {
      caseName: "up, but defined with a turn over 1",
      startXy: v_(123, -4.56),
      angle: 987.75,
      angledSpeed: 2,
      expectedSpeed: v_(0, -2),
    },
    {
      caseName: "left-down (45deg)",
      startXy: v_(123, -4.56),
      angle: 3 / 8,
      angledSpeed: 2,
      expectedSpeed: v_(-Math.sqrt(2), Math.sqrt(2)),
    },
  ].forEach(({ caseName, startXy, angle, angledSpeed, expectedSpeed }) => {
    test(`angle-based movement (case: ${caseName})`, () => {
      const movement = MovementLine.of({
        angle,
        angledSpeed,
      })(startXy);

      expect(movement.xy).toEqual(startXy);
      expect(movement.speed.x).toBeCloseTo(expectedSpeed.x, 11);
      expect(movement.speed.y).toBeCloseTo(expectedSpeed.y, 11);
      expect(movement.hasFinished).toBe(false);

      incrementFrameNumber();
      movement.update();

      expect(movement.xy.x).toBeCloseTo(startXy.x + expectedSpeed.x, 11);
      expect(movement.xy.y).toBeCloseTo(startXy.y + expectedSpeed.y, 11);
      expect(movement.speed.x).toBeCloseTo(expectedSpeed.x, 11);
      expect(movement.speed.y).toBeCloseTo(expectedSpeed.y, 11);
      expect(movement.hasFinished).toBe(false);
    });
  });

  test(`angle-based movement + base speed`, () => {
    const movement = MovementLine.of({
      baseSpeedXy: v_(9.87, -654),
      angle: 3 / 8,
      angledSpeed: 2,
    })(v_(10, 200));

    expect(movement.xy).toEqual(v_(10, 200));
    expect(movement.speed.x).toBeCloseTo(9.87 - Math.sqrt(2), 11);
    expect(movement.speed.y).toBeCloseTo(-654 + Math.sqrt(2), 11);
    expect(movement.hasFinished).toBe(false);

    incrementFrameNumber();
    movement.update();

    expect(movement.xy.x).toBeCloseTo(10 + 9.87 - Math.sqrt(2), 11);
    expect(movement.xy.y).toBeCloseTo(200 - 654 + Math.sqrt(2), 11);
    expect(movement.speed.x).toBeCloseTo(9.87 - Math.sqrt(2), 11);
    expect(movement.speed.y).toBeCloseTo(-654 + Math.sqrt(2), 11);
    expect(movement.hasFinished).toBe(false);

    incrementFrameNumber();
    movement.update();
    incrementFrameNumber();
    movement.update();

    expect(movement.xy.x).toBeCloseTo(10 + 3 * (9.87 - Math.sqrt(2)), 11);
    expect(movement.xy.y).toBeCloseTo(200 + 3 * (-654 + Math.sqrt(2)), 11);
    expect(movement.speed.x).toBeCloseTo(9.87 - Math.sqrt(2), 11);
    expect(movement.speed.y).toBeCloseTo(-654 + Math.sqrt(2), 11);
    expect(movement.hasFinished).toBe(false);
  });

  test(`angle-based movement + limit of N frames`, () => {
    const movement = MovementLine.of({
      angle: 0,
      angledSpeed: 2,
      frames: 10,
    })(v_(10, 200));

    expect(movement.xy).toEqual(v_(10, 200));
    expect(movement.speed).toEqual(v_(2, 0));
    expect(movement.hasFinished).toBe(false);

    incrementFrameNumber();
    movement.update();

    expect(movement.xy).toEqual(v_(12, 200));
    expect(movement.speed).toEqual(v_(2, 0));
    expect(movement.hasFinished).toBe(false);

    u_.range(8).forEach(() => {
      incrementFrameNumber();
      movement.update();
    });

    expect(movement.xy).toEqual(v_(28, 200));
    expect(movement.speed).toEqual(v_(2, 0));
    expect(movement.hasFinished).toBe(false);

    incrementFrameNumber();
    movement.update();

    expect(movement.xy).toEqual(v_(30, 200));
    expect(movement.speed).toEqual(v_0_0_);
    expect(movement.hasFinished).toBe(true);

    incrementFrameNumber();
    movement.update();
    incrementFrameNumber();
    movement.update();
    incrementFrameNumber();
    movement.update();

    expect(movement.xy).toEqual(v_(30, 200));
    expect(movement.speed).toEqual(v_0_0_);
    expect(movement.hasFinished).toBe(true);
  });

  test(`angle-based movement + limit of 1 frame`, () => {
    const movement = MovementLine.of({
      angle: 0,
      angledSpeed: 2,
      frames: 1,
    })(v_(10, 200));

    expect(movement.xy).toEqual(v_(10, 200));
    expect(movement.speed).toEqual(v_(2, 0));
    expect(movement.hasFinished).toBe(false);

    incrementFrameNumber();
    movement.update();

    expect(movement.xy).toEqual(v_(12, 200));
    expect(movement.speed).toEqual(v_0_0_);
    expect(movement.hasFinished).toBe(true);

    incrementFrameNumber();
    movement.update();
    incrementFrameNumber();
    movement.update();
    incrementFrameNumber();
    movement.update();

    expect(movement.xy).toEqual(v_(12, 200));
    expect(movement.speed).toEqual(v_0_0_);
    expect(movement.hasFinished).toBe(true);
  });

  test(`angle-based movement + limit of 0 frames`, () => {
    const movement = MovementLine.of({
      angle: 0,
      angledSpeed: 2,
      frames: 0,
    })(v_(10, 200));

    expect(movement.xy).toEqual(v_(10, 200));
    expect(movement.speed).toEqual(v_0_0_);
    expect(movement.hasFinished).toBe(true);

    incrementFrameNumber();
    movement.update();
    incrementFrameNumber();
    movement.update();
    incrementFrameNumber();
    movement.update();

    expect(movement.xy).toEqual(v_(10, 200));
    expect(movement.speed).toEqual(v_0_0_);
    expect(movement.hasFinished).toBe(true);
  });

  test(`angle-based movement + limit of -N frames`, () => {
    const movement = MovementLine.of({
      angle: 0,
      angledSpeed: 2,
      frames: -123,
    })(v_(10, 200));

    expect(movement.xy).toEqual(v_(10, 200));
    expect(movement.speed).toEqual(v_0_0_);
    expect(movement.hasFinished).toBe(true);

    incrementFrameNumber();
    movement.update();
    incrementFrameNumber();
    movement.update();
    incrementFrameNumber();
    movement.update();

    expect(movement.xy).toEqual(v_(10, 200));
    expect(movement.speed).toEqual(v_0_0_);
    expect(movement.hasFinished).toBe(true);
  });

  [
    {
      caseName: "right",
      startXy: v_(123, -4.56),
      targetXy: v_(999_000, -4.56),
      angledSpeed: 2,
      expectedSpeed: v_(2, 0),
    },
    {
      caseName: "left",
      startXy: v_(123, -4.56),
      targetXy: v_(-999_000, -4.56),
      angledSpeed: 2,
      expectedSpeed: v_(-2, 0),
    },
    {
      caseName: "down",
      startXy: v_(123, -4.56),
      targetXy: v_(123, 999_000),
      angledSpeed: 2,
      expectedSpeed: v_(0, 2),
    },
    {
      caseName: "up",
      startXy: v_(123, -4.56),
      targetXy: v_(123, -999_000),
      angledSpeed: 2,
      expectedSpeed: v_(0, -2),
    },
    {
      caseName:
        "up, but with a target near to the start (movement should continue past it)",
      startXy: v_(123, -4.56),
      targetXy: v_(123, -4.57),
      angledSpeed: 2,
      expectedSpeed: v_(0, -2),
    },
    {
      caseName: "left-down (45deg)",
      startXy: v_(123, -4.56),
      targetXy: v_(-999_000 + 123, 999_000 - 4.56),
      angledSpeed: 2,
      expectedSpeed: v_(-Math.sqrt(2), Math.sqrt(2)),
    },
  ].forEach(({ caseName, startXy, targetXy, angledSpeed, expectedSpeed }) => {
    test(`target-based movement (case: ${caseName})`, () => {
      const movement = MovementLine.of({
        targetXy,
        angledSpeed,
      })(startXy);

      expect(movement.xy).toEqual(startXy);
      expect(movement.speed.x).toBeCloseTo(expectedSpeed.x, 11);
      expect(movement.speed.y).toBeCloseTo(expectedSpeed.y, 11);
      expect(movement.hasFinished).toBe(false);

      incrementFrameNumber();
      movement.update();

      expect(movement.xy.x).toBeCloseTo(startXy.x + expectedSpeed.x, 11);
      expect(movement.xy.y).toBeCloseTo(startXy.y + expectedSpeed.y, 11);
      expect(movement.speed.x).toBeCloseTo(expectedSpeed.x, 11);
      expect(movement.speed.y).toBeCloseTo(expectedSpeed.y, 11);
      expect(movement.hasFinished).toBe(false);
    });
  });

  // TODO: __NEXT__ more tests for target-based movement
});
