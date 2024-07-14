import { b_, BpxTimer, timer_ } from "@beetpx/beetpx";
import { Fade } from "../Fade";
import { Game } from "../game/Game";
import { Hud } from "../gui/Hud";
import { Music } from "../misc/Music";
import { CurrentMission } from "../missions/CurrentMission";
import { GameScreen } from "./GameScreen";
import { ScreenMissionMain } from "./ScreenMissionMain";
import { ScreenOver } from "./ScreenOver";

export class ScreenMissionEnd implements GameScreen {
  private readonly _game: Game;
  private readonly _hud: Hud;

  private readonly _fadeOut: Fade;
  private readonly _screenTimer: BpxTimer;

  constructor(params: { game: Game; hud: Hud }) {
    this._game = params.game;
    this._hud = params.hud;

    this._fadeOut = new Fade("out", { waitFrames: 90, fadeFrames: 30 });
    this._screenTimer = timer_(120);

    Music.fadeOutCurrentMusic();
  }

  preUpdate(): GameScreen | undefined {
    this._game.preUpdate();

    if (this._screenTimer.hasJustFinished) {
      if (CurrentMission.current < CurrentMission.max) {
        return new ScreenMissionMain({
          mission: CurrentMission.next,
          health: this._game.health,
          shockwaveCharges: this._game.shockwaveCharges,
          fastMovement: this._game.fastMovement,
          fastShoot: this._game.fastShoot,
          tripleShoot: this._game.tripleShoot,
          score: this._game.score.rawValue,
        });
      } else {
        return new ScreenOver({ game: this._game, isWin: true });
      }
    }
  }

  update(): void {
    this._game.update();
    this._hud.update();
    this._fadeOut.update();
  }

  draw(): void {
    b_.clearCanvas(CurrentMission.m.bgColor);
    this._game.draw();
    this._hud.draw(this._game);
    this._fadeOut.draw();
  }
}
