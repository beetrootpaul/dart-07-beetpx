import { Timer } from "@beetpx/beetpx";
import { b, c } from "../globals";
import { GameScreen } from "./GameScreen";
import { ScreenMainMenuSelectMission } from "./ScreenMainMenuSelectMission";

export class ScreenMissionMain implements GameScreen {
  // TODO: remove this temporary code
  private _timer: Timer = new Timer({ frames: 120 });

  update(): GameScreen {
    // TODO: remove this temporary code
    this._timer.update();
    return this._timer.hasFinished ? new ScreenMainMenuSelectMission() : this;
  }

  draw(): void {
    // TODO: remove this temporary code
    b.clearCanvas(c.trueBlue);
  }
}

// TODO: migrate from Lua
/*
-- -- -- -- -- -- -- -- -- -- -- -- -- -- --
-- cart_mission/screen_mission_main.lua   --
-- -- -- -- -- -- -- -- -- -- -- -- -- -- --

function new_screen_mission_main(health, shockwave_charges, fast_movement, fast_shoot, triple_shoot, score)
    local game = new_game(health, shockwave_charges, fast_movement, fast_shoot, triple_shoot, score)

    local fade_in_frames, sliding_info_slide_frames, screen_frames = _unpack_split "30,50,200"

    local hud = new_hud {
        wait_frames = screen_frames - 10,
        slide_in_frames = 40,
    }
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
    local fade_in, screen = new_fade("in", fade_in_frames), {}

    --

    function screen._init()
        music(_m_mission_main_music)
    end

    function screen._update()
        game._update()
        hud._update()

        mission_info._update()
        fade_in._update()
    end

    function screen._draw()
        cls(_m_bg_color)
        game._draw()
        hud._draw(game)

        mission_info._draw()
        fade_in._draw()
    end

    function screen._post_draw()
        game._post_draw()

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
end
*/
