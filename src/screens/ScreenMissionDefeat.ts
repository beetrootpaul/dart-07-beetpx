import { BpxTimer, timer_ } from "@beetpx/beetpx";
import { Fade } from "../Fade";
import { Game } from "../game/Game";
import { b } from "../globals";
import { Hud } from "../gui/Hud";
import { CurrentMission } from "../missions/CurrentMission";
import { GameScreen } from "./GameScreen";
import { ScreenOver } from "./ScreenOver";

export class ScreenMissionDefeat implements GameScreen {
  private readonly _game: Game;
  private readonly _hud: Hud;

  private readonly _fadeOut: Fade;
  private readonly _screenTimer: BpxTimer;

  constructor(params: { game: Game; hud: Hud }) {
    this._game = params.game;
    this._hud = params.hud;

    const screenFrames = 120;
    const fadeOutFrames = 30;
    this._fadeOut = new Fade("out", {
      waitFrames: screenFrames - fadeOutFrames,
      fadeFrames: fadeOutFrames,
    });
    this._screenTimer = timer_(screenFrames);

    // TODO: replace this with a fade out of a music only over 500 ms
    b.stopAllSounds();
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