import { b_, spr_, u_, v_ } from "@beetpx/beetpx";
import { Fade } from "../Fade";
import { PauseMenu } from "../PauseMenu";
import { PersistedState } from "../PersistedState";
import { Game } from "../game/Game";
import { c, g } from "../globals";
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
      b_.playSoundOnce(g.assets.sfxGameWin);
    }

    const currentScore = this._game.score.rawValue;
    const highScoreSoFar = b_.load<PersistedState>()?.highScore ?? 0;
    this._gotHighScore = currentScore > highScoreSoFar;
    b_.store<PersistedState>({
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
        // TODO: params: false
        return new ScreenTitle({ startMusic: true });
      }
    }

    return;
  }

  update(): void {
    if (!this._isWin) {
      if (b_.wasJustPressed("up") || b_.wasJustPressed("down")) {
        b_.playSoundOnce(g.assets.sfxOptionsChange);
        this._retry = !this._retry;
      }
    }

    if (b_.wasJustPressed("x")) {
      // TODO: replace this with a fade out of a music only over 500 ms
      b_.stopAllSounds();
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
    b_.sprite(
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
    b_.print(text, v_(x + 4, y + 3), this._isWin ? c.blueGreen : c.mauve);

    // "x" press incentive
    if (selected) {
      const xSprite = this._isWin ? this._xSpriteWin : this._xSprite;
      const xSpritePressed = this._isWin
        ? this._xSpritePressedWin
        : this._xSpritePressed;
      const sprite = u_.booleanChangingEveryNthFrame(g.fps / 3)
        ? xSprite
        : xSpritePressed;
      sprite.draw(v_(x + w - 16, y + 13).sub(g.gameAreaOffset));
    }
  }

  draw(): void {
    b_.clearCanvas(this._isWin ? c.darkGreen : c.darkerPurple);

    // heading
    b_.print(
      this._isWin ? "you made it!" : "game over",
      g.gameAreaOffset.add(g.gameAreaSize.x / 2, 22),
      this._isWin ? c.blueGreen : c.red,
      [true, false]
    );

    // score
    const scoreBaseY = this._gotHighScore ? 42 : 47;
    b_.print(
      "your score",
      g.gameAreaOffset.add(g.gameAreaSize.x / 2, scoreBaseY),
      c.white,
      [true, false]
    );
    this._game.score.draw(
      v_(52, scoreBaseY + 10),
      c.white,
      this._isWin ? c.blueGreen : c.mauve,
      false
    );
    if (this._gotHighScore) {
      b_.print(
        "new high score!",
        g.gameAreaOffset.add(g.gameAreaSize.x / 2, scoreBaseY + 20),
        this._isWin ? c.peach : c.darkOrange,
        [true, false]
      );
    }

    // buttons
    if (!this._isWin) {
      this._drawButton(
        `try mission ${CurrentMission.current} again`,
        81,
        this._retry && !PauseMenu.isGamePaused
      );
    }
    this._drawButton(
      "go to title screen",
      this._isWin ? 85 : 103,
      (!this._retry || this._isWin) && !PauseMenu.isGamePaused
    );

    this._fadeIn.draw();
    this._fadeOut.draw();
  }
}
