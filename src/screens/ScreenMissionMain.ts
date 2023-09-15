import { Game } from "../game/Game";
import { b } from "../globals";
import { Hud } from "../gui/Hud";
import { SlidingInfo } from "../gui/SlidingInfo";
import { CurrentMission } from "../missions/CurrentMission";
import { GameScreen } from "./GameScreen";
import { ScreenDefeat } from "./ScreenDefeat";
import { ScreenMissionBoss } from "./ScreenMissionBoss";

export class ScreenMissionMain implements GameScreen {
  private readonly _game: Game;
  private readonly _hud: Hud;
  private _missionInfo: SlidingInfo | null;

  // TODO
  // function new_screen_mission_main(health, shockwave_charges, fast_movement, fast_shoot, triple_shoot, score)
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

    // TODO: REVERT
    // const fadeInFrames = 30;
    // const slidingInfoSlideFrames = 50;
    // const screenFrames = 200;
    const fadeInFrames = 30;
    const slidingInfoSlideFrames = 50;
    const screenFrames = 100;

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

    // TODO
    // local fade_in, screen = new_fade("in", fade_in_frames), {}

    // TODO
    // function screen._init()
    //     music(_m_mission_main_music)
    // end
  }

  preUpdate(): GameScreen | undefined {
    this._game.preUpdate();

    // TODO
    // if fade_in.has_finished() then
    //     fade_in = _noop_game_object
    // end

    if (this._missionInfo?.hasFinished) {
      this._missionInfo = null;
      this._game.enterEnemiesPhase();
    }

    if (this._game.isReadyToEnterBossPhase()) {
      return new ScreenMissionBoss({ game: this._game, hud: this._hud });
    }

    if (this._game.health <= 0) {
      return new ScreenDefeat({ game: this._game, hud: this._hud });
    }
  }

  update(): void {
    this._game.update();
    this._hud.update();

    this._missionInfo?.update();
    // TODO
    // fade_in._update()
  }

  draw(): void {
    b.clearCanvas(CurrentMission.m.bgColor);

    this._game.draw();
    this._hud.draw(this._game);

    this._missionInfo?.draw();
    // TODO
    // fade_in._draw()
  }
}
