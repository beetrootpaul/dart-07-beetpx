import { AnimatedSprite } from "../misc/AnimatedSprite";

import { v_ } from "@beetpx/beetpx";
import { Game } from "../game/Game";
import { b, c, g } from "../globals";
import { Easing } from "../misc/Easing";
import { Movement } from "../movement/Movement";
import { MovementFixed } from "../movement/MovementFixed";
import { MovementSequence } from "../movement/MovementSequence";
import { MovementToTarget } from "../movement/MovementToTarget";

function hudSprite(
  spriteW: number,
  spriteH: number,
  spriteX: number,
  spriteY: number
): AnimatedSprite {
  return new AnimatedSprite(
    g.assets.mainSpritesheetUrl,
    spriteW,
    spriteH,
    [spriteX],
    spriteY,
    true
  );
}

export class Hud {
  // we draw HUD area 20 px bigger on the outside in order to compensate for a player damage camera shake
  private static readonly _safetyBorder = 20;

  private static readonly _barSize = v_(16, g.viewportSize.y);
  // TODO
  // local boss_health_bar_margin = 2

  private readonly _heart = hudSprite(6, 5, 40, 24);
  private readonly _healthBarStart = hudSprite(8, 5, 40, 19);
  private readonly _healthBarSegmentFull = hudSprite(8, 9, 40, 10);
  private readonly _healthBarSegmentEmpty = hudSprite(1, 9, 40, 10);

  private readonly _shockwave = hudSprite(7, 6, 48, 24);
  private readonly _shockwaveBarStart = hudSprite(8, 1, 48, 23);
  private readonly _shockwaveBarSegmentFull = hudSprite(8, 11, 48, 12);
  private readonly _shockwaveBarSegmentEmpty = hudSprite(2, 11, 54, 12);
  // TODO
  //         local ship_indicator = new_hud_sprite "3,5,32,15"
  //         local boss_health_bar_start, boss_health_bar_end = new_hud_sprite "4,4,27,20", new_hud_sprite "4,4,31,20"
  //         -- these sprites are defined globally, because we want to access it through "_ENV"
  //         fast_movement_off, fast_movement_on, fast_shoot_off, fast_shoot_on, triple_shoot_off, triple_shoot_on = new_hud_sprite "7,4,96,24", new_hud_sprite "7,4,96,28", new_hud_sprite "7,4,104,24", new_hud_sprite "7,4,104,28", new_hud_sprite "7,4,112,24", new_hud_sprite "7,4,112,28"

  private readonly _slideInOffset: Movement;

  constructor(params: { waitFrames: number; slideInFrames: number }) {
    this._slideInOffset = MovementSequence.of([
      MovementFixed.of({ frames: params.waitFrames }),
      MovementToTarget.of({
        targetX: 0,
        frames: params.slideInFrames,
        easingFn: Easing.outQuartic,
      }),
    ])(v_(-20, 0));
  }

  update(): void {
    this._slideInOffset.update();
  }

  draw(game: Game): void {
    b.rectFilled(
      v_(0, 0).sub(Hud._safetyBorder),
      Hud._barSize.add(Hud._safetyBorder, 2 * Hud._safetyBorder),
      c._0_black
    );
    b.rectFilled(
      g.viewportSize.sub(Hud._barSize).sub(0, Hud._safetyBorder),
      Hud._barSize.add(Hud._safetyBorder, 2 * Hud._safetyBorder),
      c._0_black
    );
    if (b.debug) {
      b.rectFilled(v_(0, 0), Hud._barSize, c._5_blue_green);
      b.rectFilled(
        g.viewportSize.sub(Hud._barSize),
        Hud._barSize,
        c._5_blue_green
      );
    }

    //
    // health bar
    //
    let xy = this._slideInOffset.xy
      .add(-g.gameAreaOffset.x + 3, g.viewportSize.y - 16)
      .ceil();
    this._heart.draw(xy.add(1, 6));
    for (let segment = 0; segment < g.healthMax; segment++) {
      (game.health > segment
        ? this._healthBarSegmentFull
        : this._healthBarSegmentEmpty
      ).draw(xy.sub(0, 10 + segment * 6));
    }
    // we have to draw health_bar_start after health_bar_segment_full in order to cover 1st segment's joint with black pixels
    this._healthBarStart.draw(xy.sub(0, 4));

    // TODO
    //                 -- mission progress
    //                 local mission_progress_h, mission_progress_x = 35, _gaox + xy.x + 5
    //                 line(
    //                     mission_progress_x,
    //                     4,
    //                     mission_progress_x,
    //                     3 + mission_progress_h,
    //                     _color_13_lavender
    //                 )
    //                 ship_indicator._draw(xy.minus(
    //                     -4,
    //                     77 + game.mission_progress_fraction() * (mission_progress_h - 3)
    //                 -- DEBUG:
    //                 --    77 + .25 * (mission_progress_h - 3)
    //                 ))

    //
    // shockwave charges
    //
    xy = v_(g.gameAreaSize.x + 5, g.viewportSize.y - 16)
      .sub(this._slideInOffset.xy)
      .floor();
    this._shockwave.draw(xy.add(0, 6));
    this._shockwaveBarStart.draw(xy);
    for (let segment = 0; segment < g.shockwaveChargesMax; segment++) {
      if (game.shockwaveCharges > segment) {
        this._shockwaveBarSegmentFull.draw(xy.sub(0, 11 + segment * 11));
      } else {
        this._shockwaveBarSegmentEmpty.draw(xy.sub(-6, 11 + segment * 11));
      }
    }

    //
    // score
    //
    // TODO: param: true
    game.score.draw(v_(xy.x + 17, 4), c._6_light_grey, c._2_darker_purple);

    // TODO
    //                 -- powerups
    //                 for index, powerup in pairs { "fast_movement", "fast_shoot", "triple_shoot" } do
    //                     _ENV[powerup .. (game[powerup] and "_on" or "_off")]._draw(xy.x - 1, 40 + 6 * index)
    //                 end
    //
    //
    //                 -- boss health
    //                 -- (hack to optimize tokens: we set game.boss_health_max only when boss enters
    //                 -- fight phase, even if we update game.boss_health earlier on every frame;
    //                 -- thanks to that we can easily detect if it's time to show boss' health bar)
    //                 if game.boss_health_max then
    //                     local health_fraction = game.boss_health / game.boss_health_max
    //                     boss_health_bar_start._draw(boss_health_bar_margin, boss_health_bar_margin)
    //                     boss_health_bar_end._draw(_gaw - boss_health_bar_margin - 4, boss_health_bar_margin)
    //                     line(
    //                         _gaox + boss_health_bar_margin + 2,
    //                         boss_health_bar_margin + 2,
    //                         _gaox + _gaw - boss_health_bar_margin - 3,
    //                         boss_health_bar_margin + 2,
    //                         _color_14_mauve
    //                     )
    //                     if health_fraction > 0 then
    //                         line(
    //                             _gaox + boss_health_bar_margin + 2,
    //                             boss_health_bar_margin + 1,
    //                             _gaox + boss_health_bar_margin + 2 + flr(health_fraction * (_gaw - 2 * boss_health_bar_margin - 4)) - 1,
    //                             boss_health_bar_margin + 1,
    //                             _color_8_red
    //                         )
    //                     end
    //                 end
  }
}
