import { b_, BpxVector2d, u_ } from "@beetpx/beetpx";
import { c } from "../globals";
import { PauseMenuEntry } from "./PauseMenuEntry";

export class PauseMenuEntrySimple implements PauseMenuEntry {
  private readonly _text: string;
  private readonly _onExecute: () => void;

  readonly size: BpxVector2d;

  constructor(text: string, onExecute: () => void) {
    this._text = text;
    this._onExecute = onExecute;

    this.size = u_.measureText(text);
  }

  execute() {
    this._onExecute();
  }

  draw(xy: BpxVector2d): void {
    b_.print(this._text, xy, c.white);
  }
}
