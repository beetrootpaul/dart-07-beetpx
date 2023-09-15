import { Game } from "../game/Game";
import { b, c, g, h } from "../globals";
import { GameScreen } from "./GameScreen";

export class ScreenOver implements GameScreen {
  private readonly _game: Game;
  private readonly _isWin: boolean;

  constructor(params: { game: Game; isWin: boolean }) {
    this._game = params.game;
    this._isWin = params.isWin;

    // TODO
    //     local got_high_score, fade_in, fade_out, retry, proceed, screen = false, new_fade("in", 30), new_fade("out", 30), true, false, {}

    if (params.isWin) {
      // TODO
      //             _sfx_play(_sfx_game_win)
    }

    // TODO
    //         local current_score = game.score.raw_value()
    //         local high_score_so_far = dget(0)
    //         got_high_score = current_score > high_score_so_far
    //         dset(0, max(high_score_so_far, current_score))
  }

  // TODO
  //     local function draw_button(text, y, selected)
  //         local w, x = 80, 24
  //
  //         -- button shape
  //         sspr(
  //             selected and (is_win and 37 or 35) or 36, 12,
  //             1, 12,
  //             x, y,
  //             w, 12
  //         )
  //
  //         -- button text
  //         print(
  //             text,
  //             x + 4, y + 3,
  //             is_win and _color_5_blue_green or _color_14_mauve
  //         )
  //
  //         -- "x" press incentive
  //         if selected then
  //             new_static_sprite(
  //                 "15,6,56," .. (is_win and 12 or 0) + _alternating_0_and_1() * 6,
  //                 true
  //             )._draw(x + w - 16 - _gaox, y + 13)
  //         end
  //     end

  preUpdate(): GameScreen | undefined {
    // TODO: TMP
    if (b.wasJustPressed("x") || b.wasJustPressed("o")) {
      b.restart();
    }

    // TODO
    //         if fade_out.has_finished() then
    //             if not is_win and retry then
    //                 extcmd("reset")
    //             else
    //                 _load_main_cart(_m_mission_number)
    //             end
    //         end

    return;
  }

  update(): void {
    // TODO
    //         if not is_win then
    //             if btnp(_button_up) or btnp(_button_down) then
    //                 _sfx_play(_sfx_options_change)
    //                 retry = not retry
    //             end
    //         end
    //
    // TODO
    //         if btnp(_button_x) then
    //             _music_fade_out()
    //             _sfx_play(_sfx_options_confirm)
    //             proceed = true
    //         end
    //
    // TODO
    //         if proceed then
    //             fade_out._update()
    //         else
    //             fade_in._update()
    //         end
  }

  draw(): void {
    b.clearCanvas(this._isWin ? c._3_dark_green : c._2_darker_purple);

    // heading
    h.printCentered(
      this._isWin ? "you made it!" : "game over",
      g.gameAreaSize.div(2).x,
      22,
      this._isWin ? c._5_blue_green : c._8_red
    );

    // TODO
    //         -- score
    //         local score_base_y = got_high_score and 42 or 47
    //         _centered_print("your \-fscore", score_base_y, _color_7_white)
    //         game.score._draw(52, score_base_y + 10, _color_7_white, is_win and _color_5_blue_green or _color_14_mauve)
    //         if got_high_score then
    //             _centered_print("new \-fhigh \-fscore!", score_base_y + 20, is_win and _color_15_peach or _color_9_dark_orange)
    //         end
    //
    // TODO
    //         -- buttons
    //         if not is_win then
    //             draw_button("try \-fmission \-f" .. _m_mission_number .. " \-fagain", 81, retry)
    //         end
    //         draw_button("go \-fto \-ftitle \-fscreen", is_win and 85 or 103, not retry or is_win)
    //
    // TODO
    //         fade_in._draw()
    //         fade_out._draw()
  }
}
