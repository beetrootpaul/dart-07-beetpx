import { b_, BpxVector2d, u_ } from "@beetpx/beetpx";
import { c } from "../globals";
import { PauseMenuEntry } from "./PauseMenuEntry";

export class PauseMenuEntrySimple implements PauseMenuEntry {
  private readonly _text: string;
  private readonly _onExecute: () => void;

  private _isFocused: boolean = false;

  readonly size: BpxVector2d;

  constructor(text: string, onExecute: () => void) {
    this._text = text;
    this._onExecute = onExecute;

    this.size = u_.measureText(text)[1];
  }

  execute() {
    this._onExecute();
  }

  update(isFocused: boolean): void {
    this._isFocused = isFocused;
  }

  draw(xy: BpxVector2d): void {
    b_.print(this._text, xy, this._isFocused ? c.white : c.lavender);
  }
}
