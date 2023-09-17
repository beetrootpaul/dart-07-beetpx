import { SolidColor, v_ } from "@beetpx/beetpx";
import { b, g, h } from "../globals";
import { Easing } from "../misc/Easing";
import { CurrentMission } from "../missions/CurrentMission";
import { Movement } from "../movement/Movement";
import { MovementFixed } from "../movement/MovementFixed";
import { MovementSequence } from "../movement/MovementSequence";
import { MovementToTarget } from "../movement/MovementToTarget";

export class SlidingInfo {
  private readonly _text1: string | undefined;
  private readonly _text2: string;
  private readonly _mainColor: SolidColor;
  private readonly _movement: Movement;
  private _roundingFn: "ceil" | "floor" = "ceil";

  constructor(params: {
    text1?: string;
    text2: string;
    waitFrames?: number;
    slideInFrames: number;
    presentFrames: number;
    slideOutFrames: number;
    mainColor: SolidColor;
  }) {
    this._text1 = params.text1;
    this._text2 = params.text2;
    this._mainColor = params.mainColor;

    this._movement = MovementSequence.of([
      ...(params.waitFrames
        ? [
            MovementFixed.of({
              frames: params.waitFrames,
            }),
          ]
        : []),
      MovementToTarget.of({
        targetY: g.gameAreaSize.y / 2,
        frames: params.slideInFrames,
        easingFn: Easing.outQuartic,
        onFinished: () => {
          this._roundingFn = "floor";
        },
      }),
      MovementFixed.of({
        frames: params.presentFrames,
      }),
      MovementToTarget.of({
        targetY: g.gameAreaSize.y + 18,
        frames: params.slideOutFrames,
        easingFn: Easing.inQuartic,
      }),
    ])(g.gameAreaOffset.sub(0, 18));
  }

  get hasFinished(): boolean {
    return this._movement.hasFinished;
  }

  update(): void {
    this._movement.update();
  }

  draw(): void {
    const xy = this._movement.xy[this._roundingFn]();

    if (this._text1) {
      h.printCentered(
        this._text1,
        g.gameAreaSize.x / 2,
        xy.y - 17,
        CurrentMission.m.bgColor,
        this._mainColor
      );
    }

    h.printCentered(
      this._text2,
      g.gameAreaSize.x / 2,
      xy.y - 8,
      CurrentMission.m.bgColor,
      this._mainColor
    );

    b.line(xy, v_(g.gameAreaSize.x, 1), this._mainColor);
  }
}
