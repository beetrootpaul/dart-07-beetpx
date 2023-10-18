import {
  b_,
  BpxMappingColor,
  BpxVector2d,
  u_,
  v_,
  v_0_0_,
} from "@beetpx/beetpx";
import { c, g } from "../globals";
import { Sprite, StaticSprite } from "../misc/Sprite";
import { Pico8Colors } from "../pico8/Pico8Color";
import { PauseMenuEntry } from "./PauseMenuEntry";
import { PauseMenuEntrySimple } from "./PauseMenuEntrySimple";
import { PauseMenuEntryToggle } from "./PauseMenuEntryToggle";

// TODO: camera shake does not stop during pause menu AND affects pause menu. Both should NOT happen.

// TODO: add an ability to restart the current mission
// TODO: sounds of navigating through pause menu

// TODO: asymmetrical width

export class PauseMenu {
  static isGamePaused: boolean = false;

  private static _padding = v_(21, 12);
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
      // TODO: add an ability to restart current mission (available only if during a mission)
      new PauseMenuEntrySimple("exit to title", () => {
        b_.restart();
      }),
    ];
  }

  update(): void {
    if (b_.wasJustPressed("x")) {
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
  }

  draw(): void {
    this._dimContentBehind();

    const wh = this._entries.reduce(
      (whTotal, entry, index) =>
        v_(
          Math.max(whTotal.x, entry.size.x + 2 * PauseMenu._padding.x),
          whTotal.y +
            entry.size.y +
            (index < this._entries.length - 1
              ? PauseMenu._gapBetweenEntries
              : 0)
        ),
      PauseMenu._padding.mul(2)
    );
    let xy = g.viewportSize.sub(wh).div(2);

    this._drawMenuBox(xy, wh);

    this._entries.forEach((entry, index) => {
      this._drawEntry(entry, index, xy, wh);
      xy = xy.add(0, entry.size.y + PauseMenu._gapBetweenEntries);
    });
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
    xy = xy.add(PauseMenu._padding);

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
        xy.add(wh.x - 2 * PauseMenu._padding.x + 4, -1).sub(g.gameAreaOffset)
      );
      b_.mapSpriteColors(prevMapping);
    }
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
