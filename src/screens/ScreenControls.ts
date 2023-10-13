import { b_, spr_, u_, v2d_, v_ } from "@beetpx/beetpx";
import { PauseMenu } from "../PauseMenu";
import { c, g } from "../globals";
import { Sprite, StaticSprite } from "../misc/Sprite";
import { GameScreen } from "./GameScreen";
import { ScreenTitle } from "./ScreenTitle";

// TODO: rework controls? Rework them in general in BeetPx?

export class ScreenControls implements GameScreen {
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
  private readonly _coSprite: Sprite = new StaticSprite(
    g.assets.mainSpritesheetUrl,
    15,
    6,
    56,
    24,
    true
  );
  private readonly _pauseSprite: Sprite = new StaticSprite(
    g.assets.mainSpritesheetUrl,
    15,
    6,
    41,
    0,
    true
  );

  private _proceed: boolean = false;

  // TODO: params: preselected_mission
  constructor() {}

  preUpdate(): GameScreen | undefined {
    if (this._proceed) {
      // TODO: params: preselected_mission, false, false, true
      return new ScreenTitle();
    }
  }

  update(): void {
    if (b_.wasJustPressed("x")) {
      b_.playSoundOnce(g.assets.sfxOptionsConfirm);
      this._proceed = true;
    }
  }

  private _drawBackButton(baseX: number, baseY: number): void {
    const w = g.viewportSize[0] - 2 * baseX;

    // button shape
    b_.sprite(
      spr_(g.assets.mainSpritesheetUrl)(
        !PauseMenu.isGamePaused ? 35 : 36,
        12,
        1,
        12
      ),
      v2d_(baseX, baseY),
      v2d_(w, 1)
    );

    // button text
    b_.print("back", v2d_(baseX + 4, baseY + 3), c.mauve);

    if (!PauseMenu.isGamePaused) {
      // "x" press incentive
      const sprite = u_.booleanChangingEveryNthFrame(g.fps / 3)
        ? this._xSprite
        : this._xSpritePressed;
      sprite.draw(v_.sub(v2d_(baseX + w - 16, baseY + 13), g.gameAreaOffset));
    }
  }

  private _drawControls(baseX: number, baseY: number): void {
    let y = baseY;

    b_.print("in game:", v2d_(baseX, y), c.peach);
    y += 10;

    b_.print("use arrows to move", v2d_(baseX, y), c.lightGrey);
    y += 10;

    b_.print("press & hold", v2d_(baseX, y), c.lightGrey);
    this._xSprite.draw(v_.sub(v2d_(baseX + 49, y - 1), g.gameAreaOffset));
    b_.print("to fire", v2d_(baseX + 67, y), c.lightGrey);
    y += 10;

    b_.print("press", v2d_(baseX, y), c.lightGrey);
    this._coSprite.draw(v_.sub(v2d_(baseX + 23, y - 1), g.gameAreaOffset));
    b_.print("to trigger", v2d_(baseX + 41, y), c.lightGrey);
    b_.print("a schockwave", v2d_(baseX, y + 7), c.lightGrey);
    y += 20;

    b_.print("other:", v2d_(baseX, y), c.peach);
    y += 10;

    b_.print("press", v2d_(baseX, y), c.lightGrey);
    this._pauseSprite.draw(v_.sub(v2d_(baseX + 23, y - 1), g.gameAreaOffset));
    b_.print("to open", v2d_(baseX + 41, y), c.lightGrey);
    b_.print("the pause menu", v2d_(baseX, y + 7), c.lightGrey);
    y += 17;

    b_.print("press", v2d_(baseX, y), c.lightGrey);
    this._xSprite.draw(v_.sub(v2d_(baseX + 23, y - 1), g.gameAreaOffset));
    b_.print("to confirm", v2d_(baseX + 41, y), c.lightGrey);
  }

  draw(): void {
    b_.clearCanvas(c.darkerBlue);

    this._drawControls(15, 15);
    this._drawBackButton(15, 104);
  }
}
