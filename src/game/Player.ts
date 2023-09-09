import {
  ColorMapping,
  Timer,
  transparent_,
  v_,
  Vector2d,
} from "@beetpx/beetpx";
import { CollisionCircle } from "../collisions/CollisionCircle";
import { b, c, g } from "../globals";
import { AnimatedSprite } from "../misc/AnimatedSprite";
import { Throttle } from "../misc/Throttle";
import { Pico8Colors } from "../pico8/Pico8Color";
import { PlayerBullet } from "./PlayerBullet";

export class Player {
  private static readonly _invincibilityFlashFrames: number = 5;
  private static readonly _size: Vector2d = v_(10, 12);

  private readonly _onBulletsSpawned: Throttle<
    (bullets: PlayerBullet[]) => void
  >;
  private readonly _onDamaged: () => void;
  private readonly _onDestroyed: (playerCc: CollisionCircle) => void;

  private readonly _shipSpriteNeutral: AnimatedSprite = new AnimatedSprite(
    g.assets.mainSpritesheetUrl,
    10,
    10,
    [19],
    0
  );
  private readonly _shipSpriteFlyingLeft: AnimatedSprite = new AnimatedSprite(
    g.assets.mainSpritesheetUrl,
    10,
    10,
    [9],
    0
  );
  private readonly _shipSpriteFlyingRight: AnimatedSprite = new AnimatedSprite(
    g.assets.mainSpritesheetUrl,
    10,
    10,
    [29],
    0
  );
  private _shipSpriteCurrent: AnimatedSprite = this._shipSpriteNeutral;

  private readonly _jetSpriteVisible: AnimatedSprite = new AnimatedSprite(
    g.assets.mainSpritesheetUrl,
    4,
    20,
    [0, 0, 0, 0, 4, 4, 4, 4],
    9
  );
  private _jetSprite: AnimatedSprite | null = null;

  private _xy: Vector2d;

  private _invincibleAfterDamageTimer: Timer | null = null;

  private _isDestroyed: boolean = false;

  constructor(params: {
    onBulletsSpawned: (bullets: PlayerBullet[]) => void;

    onDamaged: () => void;
    onDestroyed: (playerCc: CollisionCircle) => void;
  }) {
    // TODO
    // local on_shockwave_triggered = new_throttle(params.on_shockwave_triggered)
    this._onBulletsSpawned = new Throttle(params.onBulletsSpawned);
    this._onDamaged = params.onDamaged;
    this._onDestroyed = params.onDestroyed;

    this._xy = v_(g.gameAreaSize.x / 2, g.gameAreaSize.y - 28);
  }

  get collisionCircle(): CollisionCircle {
    return {
      center: this._xy.add(0, 1),
      r: 3,
    };
  }

  private _createSingleBullet(): PlayerBullet[] {
    return [new PlayerBullet(this._xy.add(0, -4))];
  }

  // TODO
  // local function create_triple_bullets()
  //     return {
  //         new_player_bullet(xy.plus(0, -4)),
  //         new_player_bullet(xy.plus(-5, -2)),
  //         new_player_bullet(xy.plus(5, -2)),
  //     }
  // end
  //
  // local function create_shockwave()
  //     return new_shockwave(xy, 1)
  // end

  get hasFinished(): boolean {
    return this._isDestroyed;
  }

  // TODO params: fast_movement
  setMovement(left: boolean, right: boolean, up: boolean, down: boolean) {
    this._shipSpriteCurrent = left
      ? this._shipSpriteFlyingLeft
      : right
      ? this._shipSpriteFlyingRight
      : this._shipSpriteNeutral;

    this._jetSprite = down ? null : this._jetSpriteVisible;

    // TODO
    const speed = 1;
    //     local speed = fast_movement and 1.5 or 1
    // TODO
    let diff = v_(
      right ? speed : left ? -speed : 0,
      down ? speed : up ? -speed : 0
    );
    if (diff.x !== 0 && diff.y !== 0) {
      // normalization of diagonal speed
      diff = diff.div(1.44);
    }
    this._xy = this._xy
      .add(diff)
      .clamp(
        Player._size.div(2).add(1),
        g.gameAreaSize.sub(Player._size.div(2)).sub(1)
      );
  }

  // TODO
  // fire = function(fast_shoot, triple_shoot)
  fire(): void {
    // TODO
    this._onBulletsSpawned.invokeIfReady(
      12,
      this._createSingleBullet.bind(this)
    );
    //     on_bullets_spawned.invoke_if_ready(
    //         triple_shoot and (fast_shoot and 10 or 16) or (fast_shoot and 8 or 12),
    //         triple_shoot and create_triple_bullets or create_single_bullet
    //     )
  }

  // TODO
  // trigger_shockwave = function()
  //     on_shockwave_triggered.invoke_if_ready(
  //         6,
  //         create_shockwave
  //     )
  // end,
  //
  // collision_circle = collision_circle,

  isInvincibleAfterDamage(): boolean {
    return !!this._invincibleAfterDamageTimer;
  }

  takeDamage(updatedHealth: number): void {
    if (updatedHealth > 0) {
      this._invincibleAfterDamageTimer = new Timer({
        frames: 5 * Player._invincibilityFlashFrames,
      });
      this._onDamaged();
    } else {
      this._isDestroyed = true;
      this._onDestroyed(this.collisionCircle);
    }
  }

  update(): void {
    if (this._invincibleAfterDamageTimer?.hasFinished) {
      this._invincibleAfterDamageTimer = null;
    }
    this._invincibleAfterDamageTimer?.update();

    this._onBulletsSpawned.update();
    // TODO
    // on_shockwave_triggered._update()

    this._jetSprite?.update();
  }

  draw(): void {
    let prevMapping: ColorMapping | undefined;
    if (
      this._invincibleAfterDamageTimer &&
      this._invincibleAfterDamageTimer.framesLeft %
        (2 * Player._invincibilityFlashFrames) <
        Player._invincibilityFlashFrames
    ) {
      prevMapping = b.mapSpriteColors([
        { from: Pico8Colors._0_black, to: c._7_white },
        { from: Pico8Colors._1_darkBlue, to: c._1_darker_blue },
        { from: Pico8Colors._2_darkPurple, to: c._7_white },
        { from: Pico8Colors._3_darkGreen, to: c._7_white },
        { from: Pico8Colors._4_brown, to: c._7_white },
        { from: Pico8Colors._5_darkGrey, to: c._7_white },
        { from: Pico8Colors._6_lightGrey, to: c._7_white },
        { from: Pico8Colors._7_white, to: c._7_white },
        { from: Pico8Colors._8_red, to: c._7_white },
        { from: Pico8Colors._9_orange, to: c._7_white },
        { from: Pico8Colors._10_yellow, to: transparent_ },
        { from: Pico8Colors._11_green, to: transparent_ },
        { from: Pico8Colors._12_blue, to: c._7_white },
        { from: Pico8Colors._13_lavender, to: c._7_white },
        { from: Pico8Colors._14_pink, to: c._7_white },
        { from: Pico8Colors._15_lightPeach, to: c._7_white },
      ]);
    }

    this._shipSpriteCurrent.draw(this._xy);

    this._jetSprite?.draw(this._xy);

    if (prevMapping) {
      b.mapSpriteColors(prevMapping);
    }
  }
}
