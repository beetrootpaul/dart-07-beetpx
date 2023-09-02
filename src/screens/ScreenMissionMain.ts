import { Game } from "../game/Game";
import { b } from "../globals";
import { Hud } from "../gui/Hud";
import { SlidingInfo } from "../gui/SlidingInfo";
import { CurrentMission } from "../missions/CurrentMission";
import { Mission } from "../missions/Mission";
import { GameScreen } from "./GameScreen";

export class ScreenMissionMain implements GameScreen {
  private readonly _game: Game;
  private readonly _hud: Hud;
  private readonly _missionInfo: SlidingInfo;

  // TODO
  // function new_screen_mission_main(health, shockwave_charges, fast_movement, fast_shoot, triple_shoot, score)
  constructor(params: {
    mission: Mission;
    health: number;
    shockwaveCharges: number;
    fastMovement: boolean;
    fastShoot: boolean;
    tripleShoot: boolean;
    score: number;
  }) {
    CurrentMission.m = params.mission;

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
      text1: `mission ${CurrentMission.m.missionNumber}`,
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
    return;
    /*
            if fade_in.has_finished() then
                fade_in = _noop_game_object
            end

            if mission_info.has_finished() then
                mission_info = _noop_game_object
                game.enter_enemies_phase()
            end

            if game.is_ready_to_enter_boss_phase() then
                return new_screen_mission_boss(game, hud)
            end

            if game.health <= 0 then
                return new_screen_defeat(game, hud)
                -- DEBUG:
                --return new_screen_over(game, game.shockwave_charges == 0)
            end

            -- DEBUG:
            --return new_screen_over(game, false)
            --return new_screen_over(game, true)
        end

        return screen
    */
  }

  update(): void {
    this._game.update();
    this._hud.update();

    this._missionInfo.update();
    // TODO
    // fade_in._update()
  }

  draw(): void {
    b.clearCanvas(CurrentMission.m.bgColor);

    this._game.draw();
    this._hud.draw(this._game);

    this._missionInfo.draw();
    // TODO
    // fade_in._draw()
  }
}
