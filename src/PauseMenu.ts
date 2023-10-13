import {
  b_,
  BpxMappingColor,
  BpxSolidColor,
  u_,
  v2d_,
  v_,
} from "@beetpx/beetpx";
import { c, g } from "./globals";

// TODO: add an ability to restart the current mission

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
      [0, 0],
      g.viewportSize,
      new BpxMappingColor(b_.takeCanvasSnapshot(), g.darkerColorMapping)
    );

    const wh = v2d_(
      Math.max(textContinueWh[0], textRestartWh[0]) + 2 * padding,
      textContinueWh[1] + textRestartWh[1] + 2 * padding + gapBetweenLines
    );
    const xy = v_.div(v_.sub(g.viewportSize, wh), 2);

    b_.rectFilled(
      v_.sub(xy, 2),
      v_.add(wh, 4),
      new BpxMappingColor(b_.takeCanvasSnapshot(), (canvasColor) =>
        canvasColor instanceof BpxSolidColor
          ? canvasColor.r + canvasColor.g + canvasColor.b >= (0xff * 3) / 2
            ? c.darkerBlue
            : c.black
          : canvasColor
      )
    );
    b_.rect(v_.sub(xy, 1), v_.add(wh, 2), c.white);
    b_.print(
      "continue",
      v_.add(
        xy,
        v2d_(
          padding + (this._selected === 0 ? 1 : 0),
          padding + (this._pressedIndex === 0 ? 1 : 0)
        )
      ),
      this._pressedIndex === 0 ? c.peach : c.white
    );
    b_.print(
      // TODO: make it clear it will restart the whole game / go to the main title
      "restart",
      v_.add(
        xy,
        v2d_(
          padding + (this._selected === 1 ? 1 : 0),
          padding +
            textContinueWh[1] +
            gapBetweenLines +
            (this._pressedIndex === 1 ? 1 : 0)
        )
      ),
      this._pressedIndex === 1 ? c.peach : c.white
    );
    b_.pixels(
      v_.sub(
        v_.add(
          xy,
          v2d_(
            padding,
            padding +
              (this._selected === 1 ? textContinueWh[1] + gapBetweenLines : 0)
          )
        ),
        v2d_(4, 0)
      ),
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
