import {
  b_,
  BpxEasing,
  BpxSolidColor,
  BpxVector2d,
  u_,
  v2d_,
  v_,
} from "@beetpx/beetpx";
import { g } from "../globals";
import { CurrentMission } from "../missions/CurrentMission";
import { Movement } from "../movement/Movement";
import { MovementFixed } from "../movement/MovementFixed";
import { MovementSequence } from "../movement/MovementSequence";
import { MovementToTarget } from "../movement/MovementToTarget";

export class SlidingInfo {
  private readonly _text1: string | undefined;
  private readonly _text2: string;
  private readonly _mainColor: BpxSolidColor;
  private readonly _movement: Movement;
  private _roundingFn: "ceil" | "floor" = "ceil";

  constructor(params: {
    text1?: string;
    text2: string;
    waitFrames?: number;
    slideInFrames: number;
    presentFrames: number;
    slideOutFrames: number;
    mainColor: BpxSolidColor;
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
        targetY: g.gameAreaSize[1] / 2,
        frames: params.slideInFrames,
        easingFn: BpxEasing.outQuartic,
        onFinished: () => {
          this._roundingFn = "floor";
        },
      }),
      MovementFixed.of({
        frames: params.presentFrames,
      }),
      MovementToTarget.of({
        targetY: g.gameAreaSize[1] + 18,
        frames: params.slideOutFrames,
        easingFn: BpxEasing.inQuartic,
      }),
    ])(v_.sub(g.gameAreaOffset, v2d_(0, 18)));
  }

  get hasFinished(): boolean {
    return this._movement.hasFinished;
  }

  update(): void {
    this._movement.update();
  }

  draw(): void {
    // TODO: implement v_.ceil(…) and go back to `v_[this._roundingFn](…)`
    const xy: BpxVector2d =
      this._roundingFn === "ceil"
        ? [Math.ceil(this._movement.xy[0]), Math.ceil(this._movement.xy[1])]
        : v_.floor(this._movement.xy);

    if (this._text1) {
      u_.printWithOutline(
        this._text1,
        v_.add(g.gameAreaOffset, v2d_(g.gameAreaSize[0] / 2, xy[1] - 17)),
        CurrentMission.m.bgColor,
        this._mainColor,
        [true, false]
      );
    }

    u_.printWithOutline(
      this._text2,
      v_.add(g.gameAreaOffset, v2d_(g.gameAreaSize[0] / 2, xy[1] - 8)),
      CurrentMission.m.bgColor,
      this._mainColor,
      [true, false]
    );

    b_.line(xy, v2d_(g.gameAreaSize[0], 1), this._mainColor);
  }
}
