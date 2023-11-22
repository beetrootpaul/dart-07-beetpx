import { b_, spr_, u_, v_ } from "@beetpx/beetpx";
import { c, g } from "../globals";
import { Sprite, StaticSprite } from "../misc/Sprite";
import { PauseMenu } from "../pause/PauseMenu";
import { GameScreen } from "./GameScreen";
import { ScreenTitle } from "./ScreenTitle";

// TODO: rework controls? Rework them in general in BeetPx? Also no longer show both keyboard and gamepad

// TODO: update controls sprites to match new BeetPx setup

export class ScreenControls implements GameScreen {
  private readonly _xSprite: Sprite = new StaticSprite(
    g.assets.mainSpritesheetUrl,
    15,
    6,
    56,
    0,
    true,
  );
  private readonly _xSpritePressed: Sprite = new StaticSprite(
    g.assets.mainSpritesheetUrl,
    15,
    6,
    56,
    6,
    true,
  );
  private readonly _coSprite: Sprite = new StaticSprite(
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
    if (b_.wasJustPressed("a")) {
      b_.playSoundOnce(g.assets.sfxOptionsConfirm);
      this._proceed = true;
    }
  }

  private _drawBackButton(baseX: number, baseY: number): void {
    const w = g.viewportSize.x - 2 * baseX;

    // button shape
    b_.sprite(
      spr_(g.assets.mainSpritesheetUrl)(
        !PauseMenu.isGamePaused ? 35 : 36,
        12,
        1,
        12,
      ),
      v_(baseX, baseY),
      { scaleXy: v_(w, 1) },
    );

    // button text
    b_.print("back", v_(baseX + 4, baseY + 3), c.mauve);

    if (!PauseMenu.isGamePaused) {
      // "x" press incentive
      const sprite = u_.booleanChangingEveryNthFrame(g.fps / 3)
        ? this._xSprite
        : this._xSpritePressed;
      sprite.draw(v_(baseX + w - 16, baseY + 13).sub(g.gameAreaOffset));
    }
  }

  private _drawControls(baseX: number, baseY: number): void {
    let y = baseY;

    b_.print("in game:", v_(baseX, y), c.peach);
    y += 10;

    b_.print("use arrows to move", v_(baseX, y), c.lightGrey);
    y += 10;

    b_.print("press & hold", v_(baseX, y), c.lightGrey);
    this._xSprite.draw(v_(baseX + 49, y - 1).sub(g.gameAreaOffset));
    b_.print("to fire", v_(baseX + 67, y), c.lightGrey);
    y += 10;

    b_.print("press", v_(baseX, y), c.lightGrey);
    this._coSprite.draw(v_(baseX + 23, y - 1).sub(g.gameAreaOffset));
    b_.print("to trigger", v_(baseX + 41, y), c.lightGrey);
    b_.print("a schockwave", v_(baseX, y + 7), c.lightGrey);
    y += 20;

    b_.print("other:", v_(baseX, y), c.peach);
    y += 10;

    b_.print("press", v_(baseX, y), c.lightGrey);
    this._pauseSprite.draw(v_(baseX + 23, y - 1).sub(g.gameAreaOffset));
    b_.print("to open", v_(baseX + 41, y), c.lightGrey);
    b_.print("the pause menu", v_(baseX, y + 7), c.lightGrey);
    y += 17;

    b_.print("press", v_(baseX, y), c.lightGrey);
    this._xSprite.draw(v_(baseX + 23, y - 1).sub(g.gameAreaOffset));
    b_.print("to confirm", v_(baseX + 41, y), c.lightGrey);
  }

  draw(): void {
    b_.clearCanvas(c.darkerBlue);

    this._drawControls(15, 15);
    this._drawBackButton(15, 104);
  }
}
