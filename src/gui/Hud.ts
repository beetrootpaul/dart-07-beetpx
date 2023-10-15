import { b_, BpxEasing, v_ } from "@beetpx/beetpx";
import { Game } from "../game/Game";
import { c, g } from "../globals";
import { Sprite, StaticSprite } from "../misc/Sprite";
import { Movement } from "../movement/Movement";
import { MovementFixed } from "../movement/MovementFixed";
import { MovementSequence } from "../movement/MovementSequence";
import { MovementToTarget } from "../movement/MovementToTarget";

function hudSprite(
  spriteW: number,
  spriteH: number,
  spriteX: number,
  spriteY: number
): Sprite {
  return new StaticSprite(
    g.assets.mainSpritesheetUrl,
    spriteW,
    spriteH,
    spriteX,
    spriteY,
    true
  );
}

export class Hud {
  // we draw HUD area 20 px bigger on the outside in order to compensate for a player damage camera shake
  private static readonly _safetyBorder = 20;

  private static readonly _barSize = v_(16, g.viewportSize.y);

  private readonly _heart = hudSprite(6, 5, 40, 24);
  private readonly _healthBarStart = hudSprite(8, 5, 40, 19);
  private readonly _healthBarSegmentFull = hudSprite(8, 9, 40, 10);
  private readonly _healthBarSegmentEmpty = hudSprite(1, 9, 40, 10);

  private readonly _shockwave = hudSprite(7, 6, 48, 24);
  private readonly _shockwaveBarStart = hudSprite(8, 1, 48, 23);
  private readonly _shockwaveBarSegmentFull = hudSprite(8, 11, 48, 12);
  private readonly _shockwaveBarSegmentEmpty = hudSprite(2, 11, 54, 12);

  private readonly _bossHealthBarStart = hudSprite(4, 4, 27, 20);
  private readonly _bossHealthBarEnd = hudSprite(4, 4, 31, 20);

  private readonly _shipIndicator = hudSprite(3, 5, 32, 15);

  private readonly _powerups = {
    fastMovement: { off: hudSprite(7, 4, 96, 24), on: hudSprite(7, 4, 96, 28) },
    fastShoot: { off: hudSprite(7, 4, 104, 24), on: hudSprite(7, 4, 104, 28) },
    tripleShoot: {
      off: hudSprite(7, 4, 112, 24),
      on: hudSprite(7, 4, 112, 28),
    },
  };

  private readonly _slideInOffset: Movement;

  constructor(params: { waitFrames: number; slideInFrames: number }) {
    this._slideInOffset = MovementSequence.of([
      MovementFixed.of({ frames: params.waitFrames }),
      MovementToTarget.of({
        targetX: 0,
        frames: params.slideInFrames,
        easingFn: BpxEasing.outQuartic,
      }),
    ])(v_(-20, 0));
  }

  update(): void {
    this._slideInOffset.update();
  }

  draw(game: Game): void {
    b_.rectFilled(
      v_(0, 0).sub(Hud._safetyBorder),
      Hud._barSize.add(Hud._safetyBorder, 2 * Hud._safetyBorder),
      c.black
    );
    b_.rectFilled(
      g.viewportSize.sub(Hud._barSize).sub(0, Hud._safetyBorder),
      Hud._barSize.add(Hud._safetyBorder, 2 * Hud._safetyBorder),
      c.black
    );
    if (b_.debug) {
      b_.rectFilled(v_(0, 0), Hud._barSize, c.blueGreen);
      b_.rectFilled(
        g.viewportSize.sub(Hud._barSize),
        Hud._barSize,
        c.blueGreen
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

    //
    // mission progress
    //
    const missionProgressH = 35;
    const missionProgressX = g.gameAreaOffset.x + xy.x + 5;
    b_.line(v_(missionProgressX, 4), v_(1, missionProgressH), c.lavender);
    this._shipIndicator.draw(
      xy.sub(-4, 77 + game.missionProgressFraction * (missionProgressH - 3))
    );

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
    game.score.draw(v_(xy.x + 17, 4), c.lightGrey, c.darkerPurple, true);

    //
    // powerups
    //
    (["fastMovement", "fastShoot", "tripleShoot"] as const).forEach(
      (prop, i) => {
        this._powerups[prop][game[prop] ? "on" : "off"].draw(
          v_(xy.x - 1, 46 + 6 * i)
        );
      }
    );

    //
    // boss health
    //
    const bossHealthFraction = game.bossHealthFraction;
    if (bossHealthFraction != null) {
      const bossHealthBarMargin = 2;
      const bossHealthW = g.gameAreaSize.x - 2 * bossHealthBarMargin - 4;
      this._bossHealthBarStart.draw(
        v_(bossHealthBarMargin, bossHealthBarMargin)
      );
      this._bossHealthBarEnd.draw(
        v_(g.gameAreaSize.x - bossHealthBarMargin - 4, bossHealthBarMargin)
      );
      b_.line(
        g.gameAreaOffset.add(bossHealthBarMargin).add(2, 2),
        v_(bossHealthW, 1),
        c.mauve
      );
      if (bossHealthFraction > 0) {
        b_.line(
          g.gameAreaOffset.add(bossHealthBarMargin).add(2, 1),
          v_(bossHealthFraction * bossHealthW, 1),
          c.red
        );
      }
    }
  }
}
