import { Game } from "../game/Game";
import { b, c } from "../globals";
import { Hud } from "../gui/Hud";
import { SlidingInfo } from "../gui/SlidingInfo";
import { CurrentMission } from "../missions/CurrentMission";
import { GameScreen } from "./GameScreen";
import { ScreenDefeat } from "./ScreenDefeat";
import { ScreenMissionEnd } from "./ScreenMissionEnd";

export class ScreenMissionBoss implements GameScreen {
  private readonly _game: Game;
  private readonly _hud: Hud;

  private _bossInfo: SlidingInfo | null;

  constructor(params: { game: Game; hud: Hud }) {
    this._game = params.game;
    this._hud = params.hud;

    // TODO
    //     local music_start_timer =  _noop_game_object

    const bossInfoFrames = 180;
    const bossInfoSlideFrames = 50;

    this._bossInfo = new SlidingInfo({
      text2: CurrentMission.m.bossName,
      mainColor: c._8_red,
      slideInFrames: bossInfoSlideFrames,
      presentFrames: bossInfoFrames - 2 * bossInfoSlideFrames,
      slideOutFrames: bossInfoSlideFrames,
    });

    // TODO
    //         _music_fade_out()
    //         music_start_timer = new_timer(60, function()
    //             music(_m_mission_boss_music)
    //         end)
    //
    this._game.enterBossPhase();
  }

  preUpdate(): GameScreen | undefined {
    this._game.preUpdate();

    if (this._bossInfo?.hasFinished) {
      this._bossInfo = null;
      this._game.startBossFight();
    }

    if (this._game.health <= 0) {
      return new ScreenDefeat({ game: this._game, hud: this._hud });
    }

    if (this._game.isBossDefeated()) {
      return new ScreenMissionEnd({ game: this._game, hud: this._hud });
    }
  }

  update(): void {
    this._game.update();
    this._hud.update();
    this._bossInfo?.update();
    // TODO
    //         music_start_timer._update()
  }

  draw(): void {
    b.clearCanvas(CurrentMission.m.bgColor);
    this._game.draw();
    this._hud.draw(this._game);
    this._bossInfo?.draw();
  }
}
