import { describe, expect, test } from "@jest/globals";
import { Easing } from "./Easing";

describe("Easing", () => {
  test("#lerp", () => {
    expect(Easing.lerp(100, 200, 0)).toBe(100);
    expect(Easing.lerp(100, 200, 0.1)).toBe(110);
    expect(Easing.lerp(100, 200, 1)).toBe(200);
    expect(Easing.lerp(100, 200, 1.1)).toBe(210);
  });
});
