import { $, $d, $spr, $u, $v } from "@beetpx/beetpx";
import { c, g } from "../globals";
import { Sprite, StaticSprite } from "../misc/Sprite";
import { GameScreen } from "./GameScreen";
import { ScreenTitle } from "./ScreenTitle";

// TODO: rework controls? Rework them in general in BeetPx? Also no longer show both keyboard and gamepad

export class ScreenControls implements GameScreen {
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
  private readonly _xSprite: Sprite = new StaticSprite(
    g.assets.mainSpritesheetUrl,
    15,
    6,
    56,
    24,
    true,
  );
  private readonly _pauseSprite: Sprite = new StaticSprite(
    g.assets.mainSpritesheetUrl,
    15,
    6,
    41,
    0,
    true,
  );

  private _proceed: boolean = false;

  preUpdate(): GameScreen | undefined {
    if (this._proceed) {
      return new ScreenTitle({ startMusic: false, startFadeIn: false });
    }
  }

  update(): void {
    if ($.wasButtonJustPressed("a")) {
      $.startPlayback(g.assets.sfxOptionsConfirm);
      this._proceed = true;
    }
  }

  private _drawBackButton(baseX: number, baseY: number): void {
    const w = g.viewportSize.x - 2 * baseX;

    // button shape
    $d.sprite(
      $spr(g.assets.mainSpritesheetUrl)(1, 12, !$.isPaused ? 35 : 36, 12),
      $v(baseX, baseY),
      { scaleXy: $v(w, 1) },
    );

    // button text
    $d.text("back", $v(baseX + 4, baseY + 3), c.mauve);

    if (!$.isPaused) {
      // "x" press incentive
      const sprite =
        $u.booleanChangingEveryNthFrame(g.fps / 3) ?
          this._cSprite
        : this._cSpritePressed;
      sprite.draw($v(baseX + w - 16, baseY + 13).sub(g.gameAreaOffset));
    }
  }

  private _drawControls(baseX: number, baseY: number): void {
    let y = baseY;

    $d.text("in game:", $v(baseX, y), c.peach);
    y += 10;

    $d.text("use arrows to move", $v(baseX, y), c.lightGrey);
    y += 10;

    $d.text("press & hold", $v(baseX, y), c.lightGrey);
    this._cSprite.draw($v(baseX + 49, y - 1).sub(g.gameAreaOffset));
    $d.text("to fire", $v(baseX + 67, y), c.lightGrey);
    y += 10;

    $d.text("press", $v(baseX, y), c.lightGrey);
    this._xSprite.draw($v(baseX + 23, y - 1).sub(g.gameAreaOffset));
    $d.text("to trigger", $v(baseX + 41, y), c.lightGrey);
    $d.text("a schockwave", $v(baseX, y + 7), c.lightGrey);
    y += 20;

    $d.text("other:", $v(baseX, y), c.peach);
    y += 10;

    $d.text("press", $v(baseX, y), c.lightGrey);
    this._pauseSprite.draw($v(baseX + 23, y - 1).sub(g.gameAreaOffset));
    $d.text("to open", $v(baseX + 41, y), c.lightGrey);
    $d.text("the pause menu", $v(baseX, y + 7), c.lightGrey);
    y += 17;

    $d.text("press", $v(baseX, y), c.lightGrey);
    this._cSprite.draw($v(baseX + 23, y - 1).sub(g.gameAreaOffset));
    $d.text("to confirm", $v(baseX + 41, y), c.lightGrey);
  }

  draw(): void {
    $d.clearCanvas(c.darkerBlue);

    this._drawControls(15, 15);
    this._drawBackButton(15, 104);
  }
}
