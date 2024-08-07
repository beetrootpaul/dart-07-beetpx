import { $d, $timer, BpxTimer } from "@beetpx/beetpx";
import { Game } from "../game/Game";
import { c } from "../globals";
import { Hud } from "../gui/Hud";
import { SlidingInfo } from "../gui/SlidingInfo";
import { Music } from "../misc/Music";
import { CurrentMission } from "../missions/CurrentMission";
import { GameScreen } from "./GameScreen";
import { ScreenMissionDefeat } from "./ScreenMissionDefeat";
import { ScreenMissionEnd } from "./ScreenMissionEnd";

export class ScreenMissionBoss implements GameScreen {
  private readonly _game: Game;
  private readonly _hud: Hud;

  private _bossInfo: SlidingInfo | null;

  private _musicStartTimer: BpxTimer | null;

  constructor(params: { game: Game; hud: Hud }) {
    this._game = params.game;
    this._hud = params.hud;

    const bossInfoFrames = 180;
    const bossInfoSlideFrames = 50;

    this._bossInfo = new SlidingInfo({
      text2: CurrentMission.m.bossName,
      mainColor: c.red,
      slideInFrames: bossInfoSlideFrames,
      presentFrames: bossInfoFrames - 2 * bossInfoSlideFrames,
      slideOutFrames: bossInfoSlideFrames,
    });

    Music.fadeOutCurrentMusic();
    this._musicStartTimer = $timer(60);

    this._game.enterBossPhase();
  }

  preUpdate(): GameScreen | undefined {
    this._game.preUpdate();

    if (this._bossInfo?.hasFinished) {
      this._bossInfo = null;
      this._game.startBossFight();
    }

    if (this._game.health <= 0) {
      return new ScreenMissionDefeat({ game: this._game, hud: this._hud });
    }

    if (this._game.isBossDefeated()) {
      return new ScreenMissionEnd({ game: this._game, hud: this._hud });
    }
  }

  update(): void {
    if (this._musicStartTimer?.hasJustFinished) {
      this._musicStartTimer = null;
      Music.playLevelMusicBoss();
    }

    this._game.update();
    this._hud.update();
    this._bossInfo?.update();
  }

  draw(): void {
    $d.clearCanvas(CurrentMission.m.bgColor);
    this._game.draw();
    this._hud.draw(this._game);
    this._bossInfo?.draw();
  }
}
