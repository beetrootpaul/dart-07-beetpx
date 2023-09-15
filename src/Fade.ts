import { CompositeColor, FillPattern, transparent_, v_ } from "@beetpx/beetpx";
import { b, c, g } from "./globals";
import { Movement } from "./movement/Movement";
import { MovementSequence } from "./movement/MovementSequence";
import { MovementToTarget } from "./movement/MovementToTarget";

type FadeDirection = "in" | "out";

export class Fade {
  private readonly _direction: FadeDirection;

  private readonly _movement: Movement;

  // from fully transparent to fully black
  private readonly patterns: FillPattern[] = [
    FillPattern.of(0xffff),
    FillPattern.of(0xffdf),
    FillPattern.of(0x7fdf),
    FillPattern.of(0x5f5f),
    FillPattern.of(0x5b5e),
    FillPattern.of(0x5a5a),
    FillPattern.of(0x5852),
    FillPattern.of(0x5050),
    FillPattern.of(0x1040),
    FillPattern.of(0x0040),
    FillPattern.of(0x0000),
  ];
  private readonly _stripHs: number[] = [
    g.viewportSize.y,
    ...Array.from({ length: 9 }, () => 4),
    g.viewportSize.y,
  ];

  // TODO: params.waitFrames
  constructor(direction: FadeDirection, params: { fadeFrames: number }) {
    this._direction = direction;

    let yMin = 0;
    for (let i = 0; i < this._stripHs.length - 1; i++) {
      yMin -= this._stripHs[i]!;
    }

    this._movement = MovementSequence.of([
      // TODO
      //         new_movement_fixed_factory {
      //             frames = wait_frames or 0,
      //         },
      MovementToTarget.of({
        frames: params.fadeFrames,
        targetY: 0,
      }),
    ])(v_(0, yMin));
  }

  get hasFinished(): boolean {
    return this._movement.hasFinished;
  }

  update(): void {
    this._movement.update();
  }

  draw(): void {
    let y = this._movement.xy.y;
    let stripH = 0;
    for (let i = 0; i < this._stripHs.length; i++) {
      y += stripH;
      stripH = this._stripHs[i]!;

      const pattern =
        this.patterns[
          this._direction === "in" ? i : this.patterns.length - i - 1
        ]!;

      b.setFillPattern(pattern);
      b.rectFilled(
        v_(0, y),
        v_(g.viewportSize.x, stripH),
        new CompositeColor(c._0_black, transparent_)
      );
      b.setFillPattern(FillPattern.primaryOnly);
    }
  }
}
