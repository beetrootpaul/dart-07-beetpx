import { Timer } from "@beetpx/beetpx";
import { Fade } from "../Fade";
import { Game } from "../game/Game";
import { b } from "../globals";
import { Hud } from "../gui/Hud";
import { CurrentMission } from "../missions/CurrentMission";
import { GameScreen } from "./GameScreen";
import { ScreenOver } from "./ScreenOver";

export class ScreenMissionEnd implements GameScreen {
  private readonly _game: Game;
  private readonly _hud: Hud;

  private readonly _fadeOut: Fade;
  private readonly _screenTimer: Timer;

  constructor(params: { game: Game; hud: Hud }) {
    this._game = params.game;
    this._hud = params.hud;

    this._fadeOut = new Fade("out", { waitFrames: 90, fadeFrames: 30 });
    this._screenTimer = new Timer({ frames: 120 });

    // TODO
    //         _music_fade_out()
  }

  preUpdate(): GameScreen | undefined {
    this._game.preUpdate();

    if (this._screenTimer.hasFinished) {
      // TODO: change 1 to 2 once mission 2 is ready and 2 to 3 when mission 3 is ready as well
      if (CurrentMission.current < 1) {
        // TODO:
        //                 _load_mission_cart(
        //                     _m_mission_number + 1,
        //                     game.health,
        //                     game.shockwave_charges,
        //                     game.fast_movement,
        //                     game.fast_shoot,
        //                     game.triple_shoot,
        //                     game.score.raw_value()
        //                 )
      } else {
        return new ScreenOver({ game: this._game, isWin: true });
      }
    }
  }

  update(): void {
    this._game.update();
    this._hud.update();
    this._fadeOut.update();
    this._screenTimer.update();
  }

  draw(): void {
    b.clearCanvas(CurrentMission.m.bgColor);
    this._game.draw();
    this._hud.draw(this._game);
    this._fadeOut.draw();
  }
}
