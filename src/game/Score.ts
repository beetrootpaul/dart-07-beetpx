import { SolidColor, Vector2d } from "@beetpx/beetpx";
import { b } from "../globals";

export class Score {
  private static _valueLimit: number = 999_999;
  private static _multiplier: number = 10;

  private _value: number;
  // TODO: maybe introduce some memoization instead of a need to manually make sure we do not recreate same text on every frame
  private _text: string;

  constructor(initialScore: number) {
    this._value = initialScore;
    this._text = this._as6DigitsTextWithExtraZero();
  }

  // TODO getter
  //         raw_value = function()
  //             return current
  //         end,

  private _as6DigitsTextWithExtraZero(): string {
    return this._value.toFixed(0).padStart(6, " ");
  }

  add(scoreToAdd: number): void {
    this._value = Math.min(
      Score._valueLimit,
      this._value + scoreToAdd * Score._multiplier
    );
    this._text = this._as6DigitsTextWithExtraZero();
  }

  // TODO: params: vertical
  draw(xy: Vector2d, digitColor: SolidColor, blankColor: SolidColor) {
    for (let i = 0; i < this._text.length; i++) {
      // TODO
      //       local x = start_x + (not vertical and i or 0) * 4
      //       local y = start_y + (vertical and i or 0) * 6
      const digitXy = xy.add(0, i * 6);
      b.print("8", digitXy, blankColor);
      b.print(this._text[i]!, digitXy, digitColor);
    }
  }
}