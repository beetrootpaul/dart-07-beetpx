import { Game } from "../game/Game";
import { b } from "../globals";
import { Hud } from "../gui/Hud";
import { CurrentMission } from "../missions/CurrentMission";
import { GameScreen } from "./GameScreen";

export class ScreenMissionBoss implements GameScreen {
  private readonly _game: Game;
  private readonly _hud: Hud;

  constructor(params: { game: Game; hud: Hud }) {
    this._game = params.game;
    this._hud = params.hud;

    // TODO
    //     local boss_info_frames, boss_info_slide_frames, music_start_timer, screen = 180, 50, _noop_game_object, {}
    //
    // TODO
    //     local boss_info = new_sliding_info {
    //         text_2 = _m_boss_name,
    //         main_color = _color_8_red,
    //         slide_in_frames = boss_info_slide_frames,
    //         present_frames = boss_info_frames - 2 * boss_info_slide_frames,
    //         slide_out_frames = boss_info_slide_frames,
    //         -- DEBUG:
    //         --slide_in_frames = 8,
    //         --present_frames = 0,
    //         --slide_out_frames = 8,
    //     }
    //
    // TODO
    //         _music_fade_out()
    //         music_start_timer = new_timer(60, function()
    //             music(_m_mission_boss_music)
    //         end)
    //
    this._game.enterBossPhase();
  }

  preUpdate(): GameScreen | undefined {
    // TODO
    //         game._post_draw()
    //
    //         if boss_info.has_finished() then
    //             boss_info = _noop_game_object
    //             game.start_boss_fight()
    this._game.startBossFight();
    //         end
    //
    //         if game.health <= 0 then
    //             return new_screen_defeat(game, hud)
    //         end
    //
    //         if game.is_boss_defeated() then
    //             return new_screen_mission_end(game, hud)
    //         end

    // TODO: tmp
    return undefined;
  }

  update(): void {
    this._game.update();
    this._hud.update();
    // TODO
    //         boss_info._update()
    //         music_start_timer._update()
  }

  draw(): void {
    b.clearCanvas(CurrentMission.m.bgColor);

    this._game.draw();
    this._hud.draw(this._game);

    // TODO
    //         boss_info._draw()
  }
}
