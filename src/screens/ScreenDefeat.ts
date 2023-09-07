import { Timer } from "@beetpx/beetpx";
import { Game } from "../game/Game";
import { b } from "../globals";
import { Hud } from "../gui/Hud";
import { CurrentMission } from "../missions/CurrentMission";
import { GameScreen } from "./GameScreen";
import { ScreenOver } from "./ScreenOver";

export class ScreenDefeat implements GameScreen {
  private readonly _game: Game;
  private readonly _hud: Hud;

  private readonly _screenTimer: Timer;

  constructor(params: { game: Game; hud: Hud }) {
    this._game = params.game;
    this._hud = params.hud;

    // TODO: REVERT
    // const screenFrames = 120;
    const screenFrames = 30;
    const fadeOutFrames = 30;
    // TODO
    //     local fade_out, screen_timer = new_fade("out", fade_out_frames, screen_frames - fade_out_frames), new_timer(screen_frames)
    this._screenTimer = new Timer({ frames: screenFrames });

    // TODO
    //         _music_fade_out()
  }

  preUpdate(): GameScreen | undefined {
    this._game.preUpdate();

    if (this._screenTimer.hasFinished) {
      return new ScreenOver({ game: this._game, isWin: false });
    }
  }

  update(): void {
    this._game.update();
    this._hud.update();
    // TODO
    //         fade_out._update()
    this._screenTimer.update();
  }

  draw(): void {
    b.clearCanvas(CurrentMission.m.bgColor);

    this._game.draw();
    this._hud.draw(this._game);
    // TODO
    //         fade_out._draw()
  }
}
