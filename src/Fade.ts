import {
  b_,
  BpxCompositeColor,
  BpxFillPattern,
  transparent_,
  u_,
  v_,
} from "@beetpx/beetpx";
import { c, g } from "./globals";
import { Movement } from "./movement/Movement";
import { MovementFixed } from "./movement/MovementFixed";
import { MovementSequence } from "./movement/MovementSequence";
import { MovementToTarget } from "./movement/MovementToTarget";

type FadeDirection = "in" | "out";

export class Fade {
  private readonly _direction: FadeDirection;

  private readonly _movement: Movement;

  // from fully transparent to fully black
  private readonly patterns: BpxFillPattern[] = [
    BpxFillPattern.of(0xffff),
    BpxFillPattern.of(0xffdf),
    BpxFillPattern.of(0x7fdf),
    BpxFillPattern.of(0x5f5f),
    BpxFillPattern.of(0x5b5e),
    BpxFillPattern.of(0x5a5a),
    BpxFillPattern.of(0x5852),
    BpxFillPattern.of(0x5050),
    BpxFillPattern.of(0x1040),
    BpxFillPattern.of(0x0040),
    BpxFillPattern.of(0x0000),
  ];
  private readonly _stripHs: number[] = [
    g.viewportSize.y,
    ...u_.range(9).map(() => 4),
    g.viewportSize.y,
  ];

  constructor(
    direction: FadeDirection,
    params: { waitFrames?: number; fadeFrames: number }
  ) {
    this._direction = direction;

    let yMin = 0;
    for (let i = 0; i < this._stripHs.length - 1; i++) {
      yMin -= this._stripHs[i]!;
    }

    this._movement = MovementSequence.of([
      ...(params.waitFrames
        ? [
            MovementFixed.of({
              frames: params.waitFrames,
            }),
          ]
        : []),
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

      b_.setFillPattern(pattern);
      b_.rectFilled(
        v_(0, y),
        v_(g.viewportSize.x, stripH),
        new BpxCompositeColor(c.black, transparent_)
      );
      b_.setFillPattern(BpxFillPattern.primaryOnly);
    }
  }
}
