import { spr_, v_ } from "@beetpx/beetpx";
import { b, c, g, u } from "../globals";
import { AnimatedSprite } from "../misc/AnimatedSprite";
import { GameScreen } from "./GameScreen";
import { ScreenTitle } from "./ScreenTitle";

// TODO: rework controls? Rework them in general in BeetPx?

export class ScreenControls implements GameScreen {
  private readonly _xSprite: AnimatedSprite = new AnimatedSprite(
    g.assets.mainSpritesheetUrl,
    15,
    6,
    [56],
    0,
    true
  );
  private readonly _xSpritePressed: AnimatedSprite = new AnimatedSprite(
    g.assets.mainSpritesheetUrl,
    15,
    6,
    [56],
    6,
    true
  );
  private readonly _coSprite: AnimatedSprite = new AnimatedSprite(
    g.assets.mainSpritesheetUrl,
    15,
    6,
    [56],
    24,
    true
  );
  private readonly _pauseSprite: AnimatedSprite = new AnimatedSprite(
    g.assets.mainSpritesheetUrl,
    15,
    6,
    [41],
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
    if (b.wasJustPressed("x")) {
      // TODO
      //             _sfx_play(_sfx_options_confirm)
      this._proceed = true;
    }
  }

  private _drawBackButton(baseX: number, baseY: number): void {
    const w = g.viewportSize.x - 2 * baseX;

    // button shape
    b.sprite(
      spr_(g.assets.mainSpritesheetUrl)(35, 12, 1, 12),
      // TODO: stretch to `w`
      v_(baseX, baseY)
    );

    // button text
    b.print("back", v_(baseX + 4, baseY + 3), c._14_mauve);

    // "x" press incentive
    const sprite = u.booleanChangingEveryNthFrame(g.fps / 3)
      ? this._xSprite
      : this._xSpritePressed;
    sprite.draw(v_(baseX + w - 16, baseY + 13).sub(g.gameAreaOffset));
  }

  private _drawControls(baseX: number, baseY: number): void {
    let y = baseY;

    b.print("in game:", v_(baseX, y), c._15_peach);
    y += 10;

    b.print("use arrows to move", v_(baseX, y), c._6_light_grey);
    y += 10;

    b.print("press & hold", v_(baseX, y), c._6_light_grey);
    this._xSprite.draw(v_(baseX + 49, y - 1).sub(g.gameAreaOffset));
    b.print("to fire", v_(baseX + 67, y), c._6_light_grey);
    y += 10;

    b.print("press", v_(baseX, y), c._6_light_grey);
    this._coSprite.draw(v_(baseX + 23, y - 1).sub(g.gameAreaOffset));
    b.print("to trigger", v_(baseX + 41, y), c._6_light_grey);
    b.print("a schockwave", v_(baseX, y + 7), c._6_light_grey);
    y += 20;

    b.print("other:", v_(baseX, y), c._15_peach);
    y += 10;

    b.print("press", v_(baseX, y), c._6_light_grey);
    this._pauseSprite.draw(v_(baseX + 23, y - 1).sub(g.gameAreaOffset));
    b.print("to open", v_(baseX + 41, y), c._6_light_grey);
    b.print("the pause menu", v_(baseX, y + 7), c._6_light_grey);
    y += 17;

    b.print("press", v_(baseX, y), c._6_light_grey);
    this._xSprite.draw(v_(baseX + 23, y - 1).sub(g.gameAreaOffset));
    b.print("to confirm", v_(baseX + 41, y), c._6_light_grey);
  }

  draw(): void {
    b.clearCanvas(c._1_darker_blue);

    this._drawControls(15, 15);
    this._drawBackButton(15, 104);
  }
}
