import {
  SolidColor,
  spr_,
  Sprite,
  transparent_,
  v_,
  Vector2d,
} from "@beetpx/beetpx";
import { Fade } from "../Fade";
import { Score } from "../game/Score";
import { b, c, g, h, u } from "../globals";
import { AnimatedSprite } from "../misc/AnimatedSprite";
import { Pico8Colors } from "../pico8/Pico8Color";
import { GameScreen } from "./GameScreen";
import { ScreenControls } from "./ScreenControls";
import { ScreenSelectMission } from "./ScreenSelectMission";

export class ScreenTitle implements GameScreen {
  // TODO: still needed?
  private static readonly _cartLabelMode: boolean = false;

  private readonly _brpLogo: Sprite = spr_(g.assets.mainSpritesheetUrl)(
    99,
    114,
    29,
    14
  );
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

  private readonly _fadeIn: Fade = new Fade("in", { fadeFrames: 30 });

  private readonly _highScore: Score;

  private _stars: Array<{
    xy: Vector2d;
    color: SolidColor;
    speed: number;
  }> = [];

  private _proceed: boolean = false;
  private _play: boolean = true;

  // TODO: params: preselected_mission, start_music, start_fade_in, select_controls
  constructor() {
    // TODO
    //     local play = not select_controls
    //
    // TODO
    //         if start_music then
    //             music(2)
    //         end

    // TODO: use better names for storage API. `load` is very unclear in context of `BeetPx`
    this._highScore = new Score(
      // TODO: extract storage type
      b.load<{ highScore: number }>()?.highScore ?? 0
    );

    for (let y = 0; y < g.viewportSize.y; y++) {
      this._maybeAddStar(y);
    }
  }

  private _maybeAddStar(y: number): void {
    if (Math.random() < 0.1) {
      // TODO: introduce a BeetPx util to pick a random array element
      const speed = [0.25, 0.5, 0.75][Math.floor(Math.random() * 3)]!;
      const star = {
        xy: v_(Math.ceil(1 + Math.random() * g.viewportSize.x - 3), y),
        speed: speed,
        color:
          speed >= 0.75
            ? c._6_light_grey
            : speed >= 0.5
            ? c._13_lavender
            : c._14_mauve,
      };
      this._stars.push(star);
    }
  }

  preUpdate(): GameScreen | undefined {
    if (this._proceed) {
      return this._play
        ? // TODO: param: preselected_mission
          new ScreenSelectMission()
        : // TODO: param: preselected_mission
          new ScreenControls();
    }
  }

  update(): void {
    if (b.wasJustPressed("up") || b.wasJustPressed("down")) {
      b.playSoundOnce(g.assets.sfxOptionsChange);
      this._play = !this._play;
    }

    if (b.wasJustPressed("x")) {
      b.playSoundOnce(g.assets.sfxOptionsConfirm);
      this._proceed = true;
    }

    for (const star of this._stars) {
      star.xy = star.xy.add(0, star.speed);
    }

    this._stars = this._stars.filter((s) => s.xy.y <= g.gameAreaSize.y);

    this._maybeAddStar(0);

    this._fadeIn.update();
  }

  private _drawVersion(baseY: number): void {
    h.printCentered(g.gameVersion, g.gameAreaSize.x / 2, baseY, c._14_mauve);
  }

  private _drawTitle(baseY: number): void {
    const prevMapping = b.mapSpriteColors([
      { from: Pico8Colors._0_black, to: transparent_ },
    ]);
    b.sprite(
      spr_(g.assets.mainSpritesheetUrl)(96, 32, 32, 26),
      v_((g.viewportSize.x - 96) / 2, baseY)
    );
    b.sprite(
      spr_(g.assets.mainSpritesheetUrl)(96, 58, 32, 26),
      v_((g.viewportSize.x - 96) / 2 + 32, baseY)
    );
    b.sprite(
      spr_(g.assets.mainSpritesheetUrl)(96, 84, 32, 26),
      v_((g.viewportSize.x - 96) / 2 + 64, baseY)
    );
    b.mapSpriteColors(prevMapping);
  }

  private _drawHighScore(baseY: number): void {
    h.printCentered("high score", g.gameAreaSize.x / 2, baseY, c._6_light_grey);
    this._highScore.draw(v_(52, baseY + 10), c._7_white, c._14_mauve, false);
  }

  private _drawButton(
    text: string,
    w: number,
    baseX: number,
    baseY: number,
    selected: boolean
  ): void {
    // button shape
    b.sprite(
      spr_(g.assets.mainSpritesheetUrl)(selected ? 35 : 36, 12, 1, 12),
      // TODO: stretch to `w`
      v_(baseX, baseY)
    );

    // button text
    b.print(text, v_(baseX + 4, baseY + 3), c._14_mauve);

    // "x" press incentive
    if (selected) {
      const sprite = u.booleanChangingEveryNthFrame(g.fps / 3)
        ? this._xSprite
        : this._xSpritePressed;
      sprite.draw(v_(baseX + w - 16, baseY + 13).sub(g.gameAreaOffset));
    }
  }

  draw(): void {
    b.clearCanvas(c._1_darker_blue);

    for (const star of this._stars) {
      b.pixel(star.xy, star.color);
    }

    // TODO
    //         map(cart_label_mode and 16 or 0, 0, 0, 0, 16, 16)

    if (ScreenTitle._cartLabelMode) {
      // TODO
      //             map(16, 0, 0, 0, 16, 16)

      // BRP
      const prevMapping = b.mapSpriteColors([
        { from: Pico8Colors._0_black, to: transparent_ },
        { from: Pico8Colors._10_yellow, to: c._14_mauve },
      ]);
      b.sprite(
        this._brpLogo,
        v_((g.viewportSize.x - this._brpLogo.size().x * 2) / 2, 6)
        // TODO: scale x2
      );
      b.mapSpriteColors(prevMapping);

      this._drawTitle(55);

      // ship
      new AnimatedSprite(g.assets.mainSpritesheetUrl, 10, 10, [18], 0).draw(
        v_(g.gameAreaSize.x / 2, 110)
      );
    } else {
      // TODO
      //             map(0, 0, 0, 0, 16, 16)
      this._drawVersion(1);
      this._drawTitle(15);
      this._drawHighScore(57);
      this._drawButton("play", 98, 15, 82, this._play);
      this._drawButton("controls", 98, 15, 104, !this._play);
    }

    // TODO: `&& start_fade_in` inside `if`
    if (!ScreenTitle._cartLabelMode) {
      this._fadeIn.draw();
    }
  }
}
