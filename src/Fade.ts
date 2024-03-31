import {
  b_,
  BpxDrawingPattern,
  BpxPatternColors,
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
  private readonly patterns: BpxDrawingPattern[] = [
    BpxDrawingPattern.from(`
      ----
      ----
      ----
      ----
    `),
    BpxDrawingPattern.from(`
      ----
      ----
      --#-
      ----
    `),
    BpxDrawingPattern.from(`
      #---
      ----
      --#-
      ----
    `),
    BpxDrawingPattern.from(`
      #-#-
      ----
      #-#-
      ----
    `),
    BpxDrawingPattern.from(`
      #-#-
      -#--
      #-#-
      ---#
    `),
    BpxDrawingPattern.from(`
      #-#-
      -#-#
      #-#-
      -#-#
    `),
    BpxDrawingPattern.from(`
      #-#-
      -###
      #-#-
      ##-#
    `),
    BpxDrawingPattern.from(`
      #-#-
      ####
      #-#-
      ####
    `),
    BpxDrawingPattern.from(`
      ###-
      ####
      #-##
      ####
    `),
    BpxDrawingPattern.from(`
      ####
      ####
      #-##
      ####
    `),
    BpxDrawingPattern.from(`
      ####
      ####
      ####
      ####
    `),
  ];
  private readonly _stripHs: number[] = [
    g.viewportSize.y,
    ...u_.range(9).map(() => 4),
    g.viewportSize.y,
  ];

  constructor(
    direction: FadeDirection,
    params: { waitFrames?: number; fadeFrames: number },
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

  pause(): void {
    this._movement.pause();
  }

  resume(): void {
    this._movement.resume();
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

      b_.setDrawingPattern(pattern);
      b_.drawRectFilled(
        v_(0, y),
        v_(g.viewportSize.x, stripH),
        BpxPatternColors.of(c.black, null),
      );
    }
    b_.setDrawingPattern(BpxDrawingPattern.primaryOnly);
  }
}
