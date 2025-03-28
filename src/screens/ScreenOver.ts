import { $d, $spr, $u, $v, $x } from "@beetpx/beetpx";
import { Fade } from "../Fade";
import { PersistedState } from "../PersistedState";
import { Game } from "../game/Game";
import { c, g } from "../globals";
import { Music } from "../misc/Music";
import { Sprite, StaticSprite } from "../misc/Sprite";
import { CurrentMission } from "../missions/CurrentMission";
import { GameScreen } from "./GameScreen";
import { ScreenMissionMain } from "./ScreenMissionMain";
import { ScreenTitle } from "./ScreenTitle";

export class ScreenOver implements GameScreen {
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
  private readonly _cSpriteWin: Sprite = new StaticSprite(
    g.assets.mainSpritesheetUrl,
    15,
    6,
    56,
    12,
    true,
  );
  private readonly _cSpritePressedWin: Sprite = new StaticSprite(
    g.assets.mainSpritesheetUrl,
    15,
    6,
    56,
    18,
    true,
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
      $x.startPlayback(g.assets.sfxGameWin);
    }

    const currentScore = this._game.score.rawValue;
    const highScoreSoFar =
      $x.loadPersistedState<PersistedState>()?.highScore ?? 0;
    this._gotHighScore = currentScore > highScoreSoFar;
    $x.savePersistedState<PersistedState>({
      highScore: Math.max(highScoreSoFar, currentScore),
    });
  }

  preUpdate(): GameScreen | undefined {
    if (this._fadeOut.hasFinished) {
      if (!this._isWin && this._retry) {
        // TODO: Once missions progression is done (after missions 2 and 3 are implemented),
        //       pass here values from the last mission (health, powerups, etc.) instead
        //       of defaults. So when the player retry mission 3, they start with what they
        //       had at that mission's beginning, let it be full health for example – in such
        //       case changing to defaults would be like a punishment :-(
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
        return new ScreenTitle({ startMusic: true, startFadeIn: true });
      }
    }

    return;
  }

  update(): void {
    if (!this._isWin) {
      if ($x.wasButtonJustPressed("up") || $x.wasButtonJustPressed("down")) {
        $x.startPlayback(g.assets.sfxOptionsChange);
        this._retry = !this._retry;
      }
    }

    if ($x.wasButtonJustPressed("O")) {
      $x.startPlayback(g.assets.sfxOptionsConfirm);
      Music.fadeOutCurrentMusic();
      this._proceed = true;
    }

    if (this._proceed) {
      this._fadeIn.pause();
      this._fadeOut.resume();
      this._fadeOut.update();
    } else {
      this._fadeOut.pause();
      this._fadeIn.resume();
      this._fadeIn.update();
    }
  }

  private _drawButton(text: string, y: number, selected: boolean): void {
    const w = 80;
    const x = 24;

    // button shape
    $d.sprite(
      $spr(g.assets.mainSpritesheetUrl)(
        1,
        12,
        selected ?
          this._isWin ?
            37
          : 35
        : 36,
        12,
      ),
      $v(x, y),
      { scaleXy: $v(w, 1) },
    );

    // button text
    $d.text(text, $v(x + 4, y + 3), this._isWin ? c.blueGreen : c.mauve);

    // "x" press incentive
    if (selected) {
      const xSprite = this._isWin ? this._cSpriteWin : this._cSprite;
      const xSpritePressed =
        this._isWin ? this._cSpritePressedWin : this._cSpritePressed;
      const sprite =
        $u.booleanChangingEveryNthFrame(g.fps / 3) ? xSprite : xSpritePressed;
      sprite.draw($v(x + w - 16, y + 13).sub(g.gameAreaOffset));
    }
  }

  draw(): void {
    $d.clearCanvas(this._isWin ? c.darkGreen : c.darkerPurple);

    // heading
    $d.text(
      this._isWin ? "you made it!" : "game over",
      g.gameAreaOffset.add(g.gameAreaSize.x / 2, 22),
      this._isWin ? c.blueGreen : c.red,
      { centerXy: [true, false] },
    );

    // score
    const scoreBaseY = this._gotHighScore ? 42 : 47;
    $d.text(
      "your score",
      g.gameAreaOffset.add(g.gameAreaSize.x / 2, scoreBaseY),
      c.white,
      { centerXy: [true, false] },
    );
    this._game.score.draw(
      $v(52, scoreBaseY + 10),
      c.white,
      this._isWin ? c.blueGreen : c.mauve,
      false,
    );
    if (this._gotHighScore) {
      $d.text(
        "new high score!",
        g.gameAreaOffset.add(g.gameAreaSize.x / 2, scoreBaseY + 20),
        this._isWin ? c.peach : c.darkOrange,
        { centerXy: [true, false] },
      );
    }

    // buttons
    if (!this._isWin) {
      this._drawButton(
        `try mission ${CurrentMission.current} again`,
        81,
        this._retry && !$x.isPaused,
      );
    }
    this._drawButton(
      "go to title screen",
      this._isWin ? 85 : 103,
      (!this._retry || this._isWin) && !$x.isPaused,
    );

    this._fadeIn.draw();
    this._fadeOut.draw();
  }
}
