import { BeetPx, MappingColor, v_ } from "@beetpx/beetpx";
import { c, g, u } from "./globals";

// TODO: rework? It's just a copy paste from my another game
export class PauseMenu {
  static isGamePaused: boolean = false;

  // TODO: better arrows? There are some glyphs ready on the font's image
  static #arrowPixelsOffsets = [
    v_(0, 0),
    v_(0, 1),
    v_(0, 2),
    v_(0, 3),
    v_(1, 1),
    v_(1, 2),
  ];

  #selected = 0;
  #pressedIndex = -1;

  update(): void {
    if (BeetPx.isPressed("x") || BeetPx.isPressed("o")) {
      this.#pressedIndex = this.#selected;
    } else {
      this.#pressedIndex = -1;
    }

    if (BeetPx.wasJustPressed("up")) {
      this.#selected = Math.max(0, this.#selected - 1);
    }
    if (BeetPx.wasJustPressed("down")) {
      this.#selected = Math.min(1, this.#selected + 1);
    }

    if (BeetPx.wasJustReleased("x") || BeetPx.wasJustReleased("o")) {
      if (this.#selected === 0) {
        PauseMenu.isGamePaused = false;
      } else if (this.#selected === 1) {
        BeetPx.restart();
      }
    }
  }

  draw(): void {
    const textContinue = "continue";
    const textRestart = "restart";
    const textContinueWh = u.measureText(textContinue);
    const textRestartWh = u.measureText(textRestart);

    const padding = 6;
    const gapBetweenLines = 4;

    const wh = v_(
      Math.max(textContinueWh.x, textRestartWh.x) + 2 * padding,
      textContinueWh.y + textRestartWh.y + 2 * padding + gapBetweenLines
    );
    const xy = g.viewportSize.sub(wh).div(2);

    BeetPx.rectFilled(
      xy.sub(2),
      wh.add(4),
      new MappingColor(({ r, g, b, a }) =>
        r + g + b > (0x100 * 3) / 2 ? c.darkerBlue : c.black
      )
    );
    BeetPx.rect(xy.sub(1), wh.add(2), c.white);
    BeetPx.print(
      "continue",
      xy.add(
        padding + (this.#selected === 0 ? 1 : 0),
        padding + (this.#pressedIndex === 0 ? 1 : 0)
      ),
      this.#pressedIndex === 0 ? c.peach : c.white
    );
    BeetPx.print(
      "restart",
      xy.add(
        padding + (this.#selected === 1 ? 1 : 0),
        padding +
          textContinueWh.y +
          gapBetweenLines +
          (this.#pressedIndex === 1 ? 1 : 0)
      ),
      this.#pressedIndex === 1 ? c.peach : c.white
    );
    for (const offset of PauseMenu.#arrowPixelsOffsets) {
      BeetPx.pixel(
        xy
          .add(
            padding,
            padding +
              (this.#selected === 1 ? textContinueWh.y + gapBetweenLines : 0)
          )
          .sub(4, 0)
          .add(offset),
        c.white
      );
    }
  }
}
