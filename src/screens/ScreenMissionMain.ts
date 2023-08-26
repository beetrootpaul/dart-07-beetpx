import { MissionMetadata } from "../MissionMetadata";
import { Game } from "../game/Game";
import { b } from "../globals";
import { Hud } from "../gui/Hud";
import { SlidingInfo } from "../gui/SlidingInfo";
import { GameScreen } from "./GameScreen";

export class ScreenMissionMain implements GameScreen {
  private readonly _metadata: MissionMetadata;

  private readonly _game: Game;
  private readonly _hud: Hud;
  private readonly _missionInfo: SlidingInfo;

  // TODO: migrate from Lua
  // function new_screen_mission_main(health, shockwave_charges, fast_movement, fast_shoot, triple_shoot, score)
  constructor(params: {
    metadata: MissionMetadata;
    health: number;
    shockwaveCharges: number;
    fastMovement: boolean;
    fastShoot: boolean;
    tripleShoot: boolean;
    score: number;
  }) {
    this._metadata = params.metadata;

    this._game = new Game({
      health: params.health,
      shockwaveCharges: params.shockwaveCharges,
      fastMovement: params.fastMovement,
      fastShoot: params.fastShoot,
      tripleShoot: params.tripleShoot,
      score: params.score,
    });

    // TODO: migrate from Lua
    // local fade_in_frames, sliding_info_slide_frames, screen_frames = _unpack_split "30,50,200"

    // TODO: migrate from Lua
    this._hud = new Hud();
    //   local hud = new_hud {
    //         wait_frames = screen_frames - 10,
    //         slide_in_frames = 40,
    //     }

    // TODO: migrate from Lua
    this._missionInfo = new SlidingInfo({
      // TODO: migrate from Lua
      text1: `mission ${this._metadata.missionNumber}`,
      // text_1 = "mission \-f" .. _m_mission_number,
      text2: this._metadata.missionName,
      mainColor: this._metadata.missionInfoColor,
      presentDuration: 2,
    });
    /*
    local mission_info = new_sliding_info {
        text_1 = "mission \-f" .. _m_mission_number,
        text_2 = _m_mission_name,
        main_color = _m_mission_info_color,
        wait_frames = fade_in_frames,
        slide_in_frames = sliding_info_slide_frames,
        present_frames = screen_frames - fade_in_frames - 2 * sliding_info_slide_frames,
        slide_out_frames = sliding_info_slide_frames,
        -- DEBUG:
        --slide_in_frames = 8,
        --present_frames = 0,
        --slide_out_frames = 8,
    }
     */

    // TODO: migrate from Lua
    // local fade_in, screen = new_fade("in", fade_in_frames), {}

    // TODO: migrate from Lua
    // function screen._init()
    //     music(_m_mission_main_music)
    // end
  }

  update(): void {
    this._game.update();
    this._hud.update();

    this._missionInfo.update();
    // TODO: migrate from Lua
    // fade_in._update()
  }

  draw(): void {
    b.clearCanvas(this._metadata.bgColor);

    this._game.draw();
    // TODO: migrate from Lua
    this._hud.draw();
    // hud._draw(game)

    this._missionInfo.draw();
    // TODO: migrate from Lua
    // fade_in._draw()
  }

  conclude(): GameScreen | undefined {
    this._game.conclude();

    // TODO: migrate from Lua
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
}
