import {
  b_,
  BpxMappingColor,
  BpxVector2d,
  u_,
  v_,
  v_0_0_,
} from "@beetpx/beetpx";
import { Fade } from "../Fade";
import { c, g } from "../globals";
import { Sprite, StaticSprite } from "../misc/Sprite";
import { Pico8Colors } from "../pico8/Pico8Color";
import { PauseMenuEntry } from "./PauseMenuEntry";
import { PauseMenuEntrySimple } from "./PauseMenuEntrySimple";
import { PauseMenuEntryToggle } from "./PauseMenuEntryToggle";

// TODO: pause menu: input tester

export class PauseMenu {
  static isGamePaused: boolean = false;

  private static _padding = {
    left: 12,
    right: 22,
    top: 12,
    bottom: 12,
  };
  private static _gapBetweenEntries = 6;

  private static _arrowPixels = ["#__", "##_", "###", "##_", "#__"];

  private readonly _xSprite: Sprite = new StaticSprite(
    g.assets.mainSpritesheetUrl,
    15,
    6,
    56,
    0,
    true
  );
  private readonly _xSpritePressed: Sprite = new StaticSprite(
    g.assets.mainSpritesheetUrl,
    15,
    6,
    56,
    6,
    true
  );

  private readonly _entries: PauseMenuEntry[];
  private _focusedEntry: number = 0;

  private _restartFadeOut: Fade | null = null;

  constructor() {
    this._entries = [
      new PauseMenuEntrySimple("continue", () => {
        PauseMenu.isGamePaused = false;
        b_.resumeAudio();
      }),
      new PauseMenuEntryToggle(
        "sounds:",
        () => !b_.isAudioMuted(),
        (newValue) => {
          if (newValue) {
            b_.unmuteAudio();
          } else {
            b_.muteAudio();
          }
        }
      ),
      new PauseMenuEntrySimple("exit to title", () => {
        this._restartFadeOut = new Fade("out", { fadeFrames: 30 });
      }),
    ];
  }

  update(): void {
    if (b_.wasJustPressed("a")) {
      this._entries[this._focusedEntry]!.execute();
    }

    if (b_.wasJustPressed("up")) {
      this._focusedEntry =
        (this._focusedEntry - 1 + this._entries.length) % this._entries.length;
    }
    if (b_.wasJustPressed("down")) {
      this._focusedEntry = (this._focusedEntry + 1) % this._entries.length;
    }

    this._entries.forEach((entry, index) => {
      entry.update(this._focusedEntry === index);
    });

    this._restartFadeOut?.update();
    if (this._restartFadeOut?.hasFinished) {
      this._restartFadeOut = null;
      b_.restart();
    }
  }

  draw(): void {
    this._dimContentBehind();

    let wh = this._entries.reduce(
      (whTotal, entry, index) =>
        v_(
          Math.max(
            whTotal.x,
            PauseMenu._padding.left + entry.size.x + PauseMenu._padding.right
          ),
          whTotal.y +
            entry.size.y +
            (index < this._entries.length - 1
              ? PauseMenu._gapBetweenEntries
              : 0)
        ),
      v_(
        PauseMenu._padding.left + PauseMenu._padding.right,
        PauseMenu._padding.top + PauseMenu._padding.bottom
      )
    );
    // make sure the width is even, therefore the pause menu will be placed horizontally in the center
    wh = v_(wh.x % 2 ? wh.x + 1 : wh.x, wh.y);
    let xy = g.viewportSize.sub(wh).div(2);

    this._drawMenuBox(xy, wh);

    this._entries.forEach((entry, index) => {
      this._drawEntry(entry, index, xy, wh);
      xy = xy.add(0, entry.size.y + PauseMenu._gapBetweenEntries);
    });

    this._restartFadeOut?.draw();
  }

  private _dimContentBehind(): void {
    b_.rectFilled(
      v_0_0_,
      g.viewportSize,
      new BpxMappingColor(b_.takeCanvasSnapshot(), g.darkerColorMapping)
    );
  }

  private _drawMenuBox(xy: BpxVector2d, wh: BpxVector2d): void {
    b_.rectFilled(xy.sub(2), wh.add(4), c.black);

    b_.rect(xy.sub(1), wh.add(2), c.lightGrey);
  }

  private _drawEntry(
    entry: PauseMenuEntry,
    entryIndex: number,
    xy: BpxVector2d,
    wh: BpxVector2d
  ): void {
    xy = xy.add(PauseMenu._padding.left);

    entry.draw(xy);

    if (this._focusedEntry === entryIndex) {
      b_.pixels(xy.sub(7, 0), c.white, PauseMenu._arrowPixels);
      const sprite = u_.booleanChangingEveryNthFrame(g.fps / 3)
        ? this._xSprite
        : this._xSpritePressed;
      const prevMapping = b_.mapSpriteColors([
        { from: Pico8Colors.pink, to: c.darkerPurple },
      ]);
      sprite.draw(
        xy
          .add(
            wh.x - PauseMenu._padding.left - PauseMenu._padding.right + 4,
            -1
          )
          .sub(g.gameAreaOffset)
      );
      b_.mapSpriteColors(prevMapping);
    }
  }
}
