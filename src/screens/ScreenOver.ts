import { spr_, v_ } from "@beetpx/beetpx";
import { Fade } from "../Fade";
import { Game } from "../game/Game";
import { b, c, g, u } from "../globals";
import { Sprite, StaticSprite } from "../misc/Sprite";
import { CurrentMission } from "../missions/CurrentMission";
import { GameScreen } from "./GameScreen";
import { ScreenMissionMain } from "./ScreenMissionMain";
import { ScreenTitle } from "./ScreenTitle";

export class ScreenOver implements GameScreen {
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
  private readonly _xSpriteWin: Sprite = new StaticSprite(
    g.assets.mainSpritesheetUrl,
    15,
    6,
    56,
    12,
    true
  );
  private readonly _xSpritePressedWin: Sprite = new StaticSprite(
    g.assets.mainSpritesheetUrl,
    15,
    6,
    56,
    18,
    true
  );

  private readonly _game: Game;
  private readonly _isWin: boolean;

  private readonly _fadeIn: Fade;
  private readonly _fadeOut: Fade;

  private readonly _gotHighScore: boolean;

  private _proceed: boolean = false;
  private _retry: boolean = true;

  constructor(params: { game: Game; isWin: boolean }) {
    this._game = params.game;
    this._isWin = params.isWin;

    this._fadeIn = new Fade("in", { fadeFrames: 30 });
    this._fadeOut = new Fade("out", { fadeFrames: 30 });

    if (params.isWin) {
      b.playSoundOnce(g.assets.sfxGameWin);
    }

    const currentScore = this._game.score.rawValue;
    const highScoreSoFar = b.load<{ highScore: number }>()?.highScore ?? 0;
    this._gotHighScore = currentScore > highScoreSoFar;
    // TODO: fix BeetPx to NOT store at the same time to `game_stored_state` and `game_stored_state2`
    b.store<{ highScore: number }>({
      highScore: Math.max(highScoreSoFar, currentScore),
    });
  }

  preUpdate(): GameScreen | undefined {
    if (this._fadeOut.hasFinished) {
      if (!this._isWin && this._retry) {
        // TODO: instead of default values, use here values from the start of a last mission.
        //       This doesn't matter right now, but will start once we finish mission 2
        //       and add progression from mission 1 to 2.
        return new ScreenMissionMain({
          mission: CurrentMission.current,
          health: g.healthDefault,
          shockwaveCharges: g.shockwaveChargesDefault,
          fastMovement: false,
          fastShoot: false,
          tripleShoot: false,
          score: 0,
        });
      } else {
        // TODO: params: CurrentMission.current, true, false, false
        return new ScreenTitle();
      }
    }

    return;
  }

  update(): void {
    if (!this._isWin) {
      if (b.wasJustPressed("up") || b.wasJustPressed("down")) {
        b.playSoundOnce(g.assets.sfxOptionsChange);
        this._retry = !this._retry;
      }
    }

    if (b.wasJustPressed("x")) {
      // TODO: replace this with a fade out of a music only over 500 ms
      b.stopAllSounds();
      this._proceed = true;
    }

    if (this._proceed) {
      this._fadeOut.update();
    } else {
      this._fadeIn.update();
    }
  }

  private _drawButton(text: string, y: number, selected: boolean): void {
    const w = 80;
    const x = 24;

    // button shape
    b.sprite(
      spr_(g.assets.mainSpritesheetUrl)(
        selected ? (this._isWin ? 37 : 35) : 36,
        12,
        1,
        12
      ),
      v_(x, y),
      v_(w, 1)
    );

    // button text
    b.print(
      text,
      v_(x + 4, y + 3),
      this._isWin ? c._5_blue_green : c._14_mauve
    );

    // "x" press incentive
    if (selected) {
      const xSprite = this._isWin ? this._xSpriteWin : this._xSprite;
      const xSpritePressed = this._isWin
        ? this._xSpritePressedWin
        : this._xSpritePressed;
      const sprite = u.booleanChangingEveryNthFrame(g.fps / 3)
        ? xSprite
        : xSpritePressed;
      sprite.draw(v_(x + w - 16, y + 13).sub(g.gameAreaOffset));
    }
  }

  draw(): void {
    b.clearCanvas(this._isWin ? c._3_dark_green : c._2_darker_purple);

    // heading
    b.print(
      this._isWin ? "you made it!" : "game over",
      g.gameAreaOffset.add(g.gameAreaSize.x / 2, 22),
      this._isWin ? c._5_blue_green : c._8_red,
      [true, false]
    );

    // score
    const scoreBaseY = this._gotHighScore ? 42 : 47;
    b.print(
      "your score",
      g.gameAreaOffset.add(g.gameAreaSize.x / 2, scoreBaseY),
      c._7_white,
      [true, false]
    );
    this._game.score.draw(
      v_(52, scoreBaseY + 10),
      c._7_white,
      this._isWin ? c._5_blue_green : c._14_mauve,
      false
    );
    if (this._gotHighScore) {
      b.print(
        "new high score!",
        g.gameAreaOffset.add(g.gameAreaSize.x / 2, scoreBaseY + 20),
        this._isWin ? c._15_peach : c._9_dark_orange,
        [true, false]
      );
    }

    // buttons
    if (!this._isWin) {
      this._drawButton(
        `try mission ${CurrentMission.current} again`,
        81,
        this._retry
      );
    }
    this._drawButton(
      "go to title screen",
      this._isWin ? 85 : 103,
      !this._retry || this._isWin
    );

    this._fadeIn.draw();
    this._fadeOut.draw();
  }
}
