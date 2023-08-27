import { SolidColor, v_ } from "@beetpx/beetpx";
import { CurrentMission } from "../CurrentMission";
import { b, g } from "../globals";
import { Easing } from "../misc/Easing";
import { printCentered } from "../misc/helpers";
import { Movement } from "../movement/Movement";
import { MovementFixed } from "../movement/MovementFixed";
import { MovementSequence } from "../movement/MovementSequence";
import { MovementToTarget } from "../movement/MovementToTarget";

export class SlidingInfo {
  private readonly _text1: string;
  private readonly _text2: string;
  private readonly _mainColor: SolidColor;
  private readonly _movement: Movement;
  private _roundingFn: "ceil" | "floor";

  constructor(params: {
    text1: string;
    text2: string;
    waitDuration: number;
    slideInDuration: number;
    presentDuration: number;
    slideOutDuration: number;
    mainColor: SolidColor;
  }) {
    this._text1 = params.text1;
    this._text2 = params.text2;
    this._mainColor = params.mainColor;
    this._roundingFn = "ceil";

    this._movement = MovementSequence.of([
      MovementFixed.of({
        // TODO
        duration: params.waitDuration,
        // frames = params.wait_frames or 0,
      }),
      MovementToTarget.of({
        targetY: g.gameAreaSize.y / 2,
        duration: params.slideInDuration,
        easingFn: Easing.outQuartic,
        onFinished: () => {
          this._roundingFn = "floor";
        },
      }),
      MovementFixed.of({
        duration: params.presentDuration,
      }),
      MovementToTarget.of({
        targetY: g.gameAreaSize.y + 18,
        duration: params.slideOutDuration,
        easingFn: Easing.inQuartic,
      }),
    ])(v_(g.gameAreaOffsetX, -18));
  }

  // TODO
  //   has_finished = movement.has_finished,

  update(): void {
    this._movement.update();
  }

  draw(): void {
    const xy = this._movement.xy[this._roundingFn]();
    // TODO
    //  if params.text_1 then
    printCentered(
      this._text1,
      xy.y - 17,
      CurrentMission.bgColor,
      this._mainColor
    );
    // TODO
    // end
    printCentered(
      this._text2,
      xy.y - 8,
      CurrentMission.bgColor,
      this._mainColor
    );
    b.line(xy, v_(g.gameAreaSize.x, 1), this._mainColor);
  }
}
