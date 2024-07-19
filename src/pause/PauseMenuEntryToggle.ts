import { $d, BpxVector2d } from "@beetpx/beetpx";
import { c } from "../globals";
import { PauseMenuEntry } from "./PauseMenuEntry";

export class PauseMenuEntryToggle implements PauseMenuEntry {
  private readonly _label: string;
  private readonly _yes: string = "yes";
  private readonly _or: string = "/";
  private readonly _no: string = "no";

  private readonly _getValue: () => boolean;
  private readonly _onToggle: (newValue: boolean) => void;

  private _isFocused: boolean = false;

  private _value: boolean;

  private readonly _labelSize: BpxVector2d;
  private readonly _yesW: number;
  private readonly _orW: number;
  private readonly _noW: number;
  private readonly _gapLabelYes: number = 3;
  private readonly _gapYesOrNo: number = 2;
  readonly size: BpxVector2d;

  constructor(
    text: string,
    getValue: () => boolean,
    onToggle: (newValue: boolean) => void,
  ) {
    this._label = text;
    this._getValue = getValue;
    this._onToggle = onToggle;

    this._value = this._getValue();

    this._labelSize = $d.measureText(this._label).wh;
    this._yesW = $d.measureText(this._yes).wh.x;
    this._orW = $d.measureText(this._or).wh.x;
    this._noW = $d.measureText(this._no).wh.x;
    this.size = this._labelSize.add(
      this._gapLabelYes +
        this._yesW +
        this._gapYesOrNo +
        this._orW +
        this._gapYesOrNo +
        this._noW,
      0,
    );
  }

  execute() {
    this._onToggle(!this._value);
  }

  update(isFocused: boolean): void {
    this._isFocused = isFocused;
    this._value = this._getValue();
  }

  draw(xy: BpxVector2d): void {
    $d.text(this._label, xy, this._isFocused ? c.white : c.lavender);
    $d.text(
      this._yes,
      xy.add(this._labelSize.x + this._gapLabelYes, 0),
      this._value ?
        this._isFocused ?
          c.white
        : c.lavender
      : c.darkerPurple,
    );
    $d.text(
      this._or,
      xy.add(
        this._labelSize.x + this._gapLabelYes + this._yesW + this._gapYesOrNo,
        0,
      ),
      c.darkerPurple,
    );
    $d.text(
      this._no,
      xy.add(
        this._labelSize.x +
          this._gapLabelYes +
          this._yesW +
          this._gapYesOrNo +
          this._orW +
          this._gapYesOrNo,
        0,
      ),
      this._value ? c.darkerPurple
      : this._isFocused ? c.white
      : c.lavender,
    );
  }
}
