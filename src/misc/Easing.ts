export type EasingFn = (t: number) => number;

// TODO: consider extracting lerp to a separate class/function. Or even adding it to Vector2d itself
// TODO: consider moving this to BeetPx
/**
 * In all functions below:
 *   - a: initial value, for t=0
 *   - b: final value, for t=1
 *   - t: a moment in time between 0 and 1
 */
export class Easing {
  // TODO: try to make available both number and Vector2d variants of lerp (or create Vector2d.lerp(…)?)
  static lerp(a: number, b: number, t: number): number {
    return a + (b - a) * t;
  }

  static linear: EasingFn = (t: number) => t;

  static inQuartic: EasingFn = (t: number) => t ** 4;

  static outQuartic: EasingFn = (t: number) => 1 - (t - 1) ** 4;
}

// TODO
// function _easing_easeinquad(t)
//     return t * t
// end
//
// function _easing_easeoutquad(t)
//     -- original implementation:
//     --t = t - 1
//     --return 1 - t * t
//
//     -- implementation optimised for tokens:
//     return 1 - (t-1)^2
// end
//
//
// --(finds the t value that would
// --return v in a lerp between a/b)
// function _easing_invlerp(a, b, v)
//     return (v - a) / (b - a)
// end
