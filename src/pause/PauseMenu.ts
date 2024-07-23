import {
  $,
  $d,
  $u,
  $v,
  $v_0_0,
  BpxPixels,
  BpxSpriteColorMapping,
  BpxVector2d,
} from "@beetpx/beetpx";
import { Fade } from "../Fade";
import { c, g } from "../globals";
import { Sprite, StaticSprite } from "../misc/Sprite";
import { Pico8Colors } from "../pico8/Pico8Color";
import { PauseMenuEntry } from "./PauseMenuEntry";
import { PauseMenuEntrySimple } from "./PauseMenuEntrySimple";
import { PauseMenuEntryToggle } from "./PauseMenuEntryToggle";

// TODO: pause menu: input tester

// TODO: pause menu: add full screen enter/exit if full screen supported

export class PauseMenu {
  private static _padding = {
    left: 12,
    right: 22,
    top: 12,
    bottom: 12,
  };
  private static _gapBetweenEntries = 6;

  private static _arrowPixels = BpxPixels.from(`
    #--
    ##-
    ###
    ##-
    #--
  `);

  private readonly _cSprite: Sprite = new StaticSprite(
    g.assets.mainSpritesheetUrl,
    15,
    6,
    56,
    0,
    true,
  );
  private readonly _cSpritePressed: Sprite = new StaticSprite(
    g.assets.mainSpritesheetUrl,
    15,
    6,
    56,
    6,
    true,
  );

  private readonly _entries: PauseMenuEntry[];
  private _focusedEntry: number = 0;

  private _restartFadeOut: Fade | null = null;

  constructor() {
    this._entries = [
      new PauseMenuEntrySimple("continue", () => {
        $.resume();
      }),
      new PauseMenuEntryToggle(
        "sounds:",
        () => !$.isAudioMuted(),
        newValue => {
          if (newValue) {
            $.unmuteAudio();
          } else {
            $.muteAudio();
          }
        },
      ),
      new PauseMenuEntrySimple("restart game", () => {
        // $.restart();
        this._restartFadeOut = new Fade("out", {
          fadeFrames: 30,
          ignoreGamePause: true,
        });
      }),
    ];
  }

  update(): void {
    if ($.wasButtonJustPressed("a")) {
      this._entries[this._focusedEntry]!.execute();
    }

    if ($.wasButtonJustPressed("up")) {
      this._focusedEntry =
        (this._focusedEntry - 1 + this._entries.length) % this._entries.length;
    }
    if ($.wasButtonJustPressed("down")) {
      this._focusedEntry = (this._focusedEntry + 1) % this._entries.length;
    }

    this._entries.forEach((entry, index) => {
      entry.update(this._focusedEntry === index);
    });

    this._restartFadeOut?.update();
    if (this._restartFadeOut?.hasFinished) {
      this._restartFadeOut = null;
      $.restart();
    }
  }

  draw(): void {
    this._dimContentBehind();

    let wh = this._entries.reduce(
      (whTotal, entry, index) =>
        $v(
          Math.max(
            whTotal.x,
            PauseMenu._padding.left + entry.size.x + PauseMenu._padding.right,
          ),
          whTotal.y +
            entry.size.y +
            (index < this._entries.length - 1 ?
              PauseMenu._gapBetweenEntries
            : 0),
        ),
      $v(
        PauseMenu._padding.left + PauseMenu._padding.right,
        PauseMenu._padding.top + PauseMenu._padding.bottom,
      ),
    );
    // make sure the width is even, therefore the pause menu will be placed horizontally in the center
    wh = $v(wh.x % 2 ? wh.x + 1 : wh.x, wh.y);
    let xy = g.viewportSize.sub(wh).div(2);

    this._drawMenuBox(xy, wh);

    this._entries.forEach((entry, index) => {
      this._drawEntry(entry, index, xy, wh);
      xy = xy.add(0, entry.size.y + PauseMenu._gapBetweenEntries);
    });

    this._restartFadeOut?.draw();
  }

  private _dimContentBehind(): void {
    $d.takeCanvasSnapshot();
    $d.rectFilled($v_0_0, g.viewportSize, g.snapshotDarker);
  }

  private _drawMenuBox(xy: BpxVector2d, wh: BpxVector2d): void {
    $d.rectFilled(xy.sub(2), wh.add(4), c.black);

    $d.rect(xy.sub(1), wh.add(2), c.lightGrey);
  }

  private _drawEntry(
    entry: PauseMenuEntry,
    entryIndex: number,
    xy: BpxVector2d,
    wh: BpxVector2d,
  ): void {
    xy = xy.add(PauseMenu._padding.left);

    entry.draw(xy);

    if (this._focusedEntry === entryIndex) {
      $d.pixels(PauseMenu._arrowPixels, xy.sub(7, 0), c.white);
      const sprite =
        $u.booleanChangingEveryNthFrame(g.fps / 3, { onGamePause: "ignore" }) ?
          this._cSprite
        : this._cSpritePressed;
      const prevMapping = $d.setSpriteColorMapping(
        BpxSpriteColorMapping.of((color, x, y) =>
          color?.cssHex === Pico8Colors.pink.cssHex ?
            c.darkerPurple
          : g.baseSpriteMapping.getMappedColor(color, x, y),
        ),
      );
      sprite.draw(
        xy
          .add(
            wh.x - PauseMenu._padding.left - PauseMenu._padding.right + 4,
            -1,
          )
          .sub(g.gameAreaOffset),
      );
      $d.setSpriteColorMapping(prevMapping);
    }
  }
}

// TODO: rename back to title to restart game if outside mission?
