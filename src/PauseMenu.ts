import {
  b_,
  BpxMappingColor,
  BpxSolidColor,
  BpxVector2d,
  u_,
  v_,
} from "@beetpx/beetpx";
import { c, g } from "./globals";

// TODO: add an ability to restart the current mission
// TODO: sounds of navigating through pause menu

export class PauseMenu {
  static isGamePaused: boolean = false;

  // TODO: better arrows? There are some glyphs ready on the font's image
  private static _arrowPixels = ["#_", "##", "##", "#_"];

  private _selected = 0;
  private _pressedIndex = -1;

  update(): void {
    if (b_.isPressed("x") || b_.isPressed("o")) {
      this._pressedIndex = this._selected;
    } else {
      this._pressedIndex = -1;
    }

    if (b_.wasJustPressed("up")) {
      this._selected = Math.max(0, this._selected - 1);
    }
    if (b_.wasJustPressed("down")) {
      this._selected = Math.min(1, this._selected + 1);
    }

    if (b_.wasJustReleased("x") || b_.wasJustReleased("o")) {
      if (this._selected === 0) {
        PauseMenu.isGamePaused = false;
      } else if (this._selected === 1) {
        b_.restart();
      }
    }
  }

  draw(): void {
    const textContinue = "continue";
    const textRestart = "restart";
    const textContinueWh = u_.measureText(textContinue);
    const textRestartWh = u_.measureText(textRestart);

    const padding = 6;
    const gapBetweenLines = 4;

    b_.rectFilled(
      BpxVector2d.zero,
      g.viewportSize,
      new BpxMappingColor(b_.takeCanvasSnapshot(), g.darkerColorMapping)
    );

    const wh = v_(
      Math.max(textContinueWh.x, textRestartWh.x) + 2 * padding,
      textContinueWh.y + textRestartWh.y + 2 * padding + gapBetweenLines
    );
    const xy = g.viewportSize.sub(wh).div(2);

    b_.rectFilled(
      xy.sub(2),
      wh.add(4),
      new BpxMappingColor(b_.takeCanvasSnapshot(), (canvasColor) =>
        canvasColor instanceof BpxSolidColor
          ? canvasColor.r + canvasColor.g + canvasColor.b >= (0xff * 3) / 2
            ? c.darkerBlue
            : c.black
          : canvasColor
      )
    );
    b_.rect(xy.sub(1), wh.add(2), c.white);
    b_.print(
      "continue",
      xy.add(
        padding + (this._selected === 0 ? 1 : 0),
        padding + (this._pressedIndex === 0 ? 1 : 0)
      ),
      this._pressedIndex === 0 ? c.peach : c.white
    );
    b_.print(
      // TODO: make it clear it will restart the whole game / go to the main title
      "restart",
      xy.add(
        padding + (this._selected === 1 ? 1 : 0),
        padding +
          textContinueWh.y +
          gapBetweenLines +
          (this._pressedIndex === 1 ? 1 : 0)
      ),
      this._pressedIndex === 1 ? c.peach : c.white
    );
    b_.pixels(
      xy
        .add(
          padding,
          padding +
            (this._selected === 1 ? textContinueWh.y + gapBetweenLines : 0)
        )
        .sub(4, 0),
      c.white,
      PauseMenu._arrowPixels
    );
  }
}

// TODO
// function _init()
//     menuitem(1, "exit to title", function()
//         fade_out = new_fade("out", 30)
//     end)
// end

// TODO
// function _update60()
//     if fade_out.has_finished() then
//         _load_main_cart(_m_mission_number)
//     end
//
//     ...
//
//     fade_out._update()
// end

// TODO
// function _draw()
//     fade_out._draw()
// end
