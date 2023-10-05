import { b_ } from "@beetpx/beetpx";
import { Fade } from "../Fade";
import { Game } from "../game/Game";
import { Hud } from "../gui/Hud";
import { SlidingInfo } from "../gui/SlidingInfo";
import { CurrentMission } from "../missions/CurrentMission";
import { GameScreen } from "./GameScreen";
import { ScreenMissionBoss } from "./ScreenMissionBoss";
import { ScreenMissionDefeat } from "./ScreenMissionDefeat";

export class ScreenMissionMain implements GameScreen {
  private readonly _game: Game;
  private readonly _hud: Hud;
  private _missionInfo: SlidingInfo | null;
  private _fadeIn: Fade | null;

  constructor(params: {
    mission: number;
    health: number;
    shockwaveCharges: number;
    fastMovement: boolean;
    fastShoot: boolean;
    tripleShoot: boolean;
    score: number;
  }) {
    CurrentMission.changeTo(params.mission);

    this._game = new Game({
      health: params.health,
      shockwaveCharges: params.shockwaveCharges,
      fastMovement: params.fastMovement,
      fastShoot: params.fastShoot,
      tripleShoot: params.tripleShoot,
      score: params.score,
    });

    const fadeInFrames = 30;
    const slidingInfoSlideFrames = 50;
    const screenFrames = 200;

    this._hud = new Hud({
      waitFrames: screenFrames - 10,
      slideInFrames: 40,
    });

    this._missionInfo = new SlidingInfo({
      text1: `mission ${CurrentMission.current}`,
      text2: CurrentMission.m.missionName,
      mainColor: CurrentMission.m.missionInfoColor,
      waitFrames: fadeInFrames,
      slideInFrames: slidingInfoSlideFrames,
      presentFrames: screenFrames - fadeInFrames - 2 * slidingInfoSlideFrames,
      slideOutFrames: slidingInfoSlideFrames,
    });

    this._fadeIn = new Fade("in", { fadeFrames: fadeInFrames });

    // TODO
    //     music(_m_mission_main_music)
  }

  preUpdate(): GameScreen | undefined {
    this._game.preUpdate();

    if (this._fadeIn?.hasFinished) {
      this._fadeIn = null;
    }

    if (this._missionInfo?.hasFinished) {
      this._missionInfo = null;
      this._game.enterEnemiesPhase();
    }

    if (this._game.isReadyToEnterBossPhase()) {
      return new ScreenMissionBoss({ game: this._game, hud: this._hud });
    }

    if (this._game.health <= 0) {
      return new ScreenMissionDefeat({ game: this._game, hud: this._hud });
    }
  }

  update(): void {
    this._game.update();
    this._hud.update();

    this._missionInfo?.update();
    this._fadeIn?.update();
  }

  draw(): void {
    b_.clearCanvas(CurrentMission.m.bgColor);

    this._game.draw();
    this._hud.draw(this._game);

    this._missionInfo?.draw();
    this._fadeIn?.draw();
  }
}
