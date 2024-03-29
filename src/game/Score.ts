import { b_, BpxRgbColor, BpxVector2d } from "@beetpx/beetpx";

export class Score {
  private static _valueLimit: number = 999_999;
  private static _multiplier: number = 10;

  private _value: number;
  private _text: string;

  constructor(initialScore: number) {
    this._value = initialScore;
    this._text = this._as6DigitsTextWithExtraZero();
  }

  get rawValue(): number {
    return this._value;
  }

  private _as6DigitsTextWithExtraZero(): string {
    return this._value.toFixed(0).padStart(6, " ");
  }

  add(scoreToAdd: number): void {
    this._value = Math.min(
      Score._valueLimit,
      this._value + scoreToAdd * Score._multiplier,
    );
    this._text = this._as6DigitsTextWithExtraZero();
  }

  draw(
    xy: BpxVector2d,
    digitColor: BpxRgbColor,
    blankColor: BpxRgbColor,
    vertical: boolean,
  ) {
    for (let i = 0; i < this._text.length; i++) {
      const digitXy = xy.add((vertical ? 0 : i) * 4, (vertical ? i : 0) * 6);
      b_.drawText("8", digitXy, blankColor);
      b_.drawText(this._text[i]!, digitXy, digitColor);
    }
  }
}
