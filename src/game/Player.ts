import { v_, Vector2d } from "@beetpx/beetpx";
import { CollisionCircle } from "../collisions/CollisionCircle";
import { g } from "../globals";
import { AnimatedSprite } from "../misc/AnimatedSprite";
import { Throttle } from "../misc/Throttle";
import { PlayerBullet } from "./PlayerBullet";

export class Player {
  private readonly _onBulletsSpawned: Throttle<
    (bullets: PlayerBullet[]) => void
  >;
  private readonly _onDamaged: () => void;
  private readonly _onDestroyed: (playerCc: CollisionCircle) => void;

  private readonly _shipSpriteNeutral: AnimatedSprite;
  private readonly _shipSpriteFlyingLeft: AnimatedSprite;
  private readonly _shipSpriteFlyingRight: AnimatedSprite;
  private _shipSpriteCurrent: AnimatedSprite;

  private _xy: Vector2d;

  private _isDestroyed: boolean = false;

  constructor(params: {
    onBulletsSpawned: (bullets: PlayerBullet[]) => void;

    onDamaged: () => void;
    onDestroyed: (playerCc: CollisionCircle) => void;
  }) {
    // TODO
    // local on_bullets_spawned, on_shockwave_triggered = new_throttle(params.on_bullets_spawned), new_throttle(params.on_shockwave_triggered)
    this._onBulletsSpawned = new Throttle(params.onBulletsSpawned);
    this._onDamaged = params.onDamaged;
    this._onDestroyed = params.onDestroyed;
    // TODO
    // local w, h = 10, 12

    this._shipSpriteNeutral = new AnimatedSprite(
      g.assets.mainSpritesheetUrl,
      10,
      10,
      [19],
      0
    );
    this._shipSpriteFlyingLeft = new AnimatedSprite(
      g.assets.mainSpritesheetUrl,
      10,
      10,
      [9],
      0
    );
    this._shipSpriteFlyingRight = new AnimatedSprite(
      g.assets.mainSpritesheetUrl,
      10,
      10,
      [29],
      0
    );
    // TODO
    // local jet_sprite_visible = new_animated_sprite(
    //     4,
    //     20,
    //     split("0,0,0,0,4,4,4,4"),
    //     9
    // )
    // local jet_sprite_hidden = _noop_game_object
    //
    this._shipSpriteCurrent = this._shipSpriteNeutral;
    // TODO
    // local jet_sprite = jet_sprite_visible

    // TODO
    // local invincible_after_damage_timer, invincibility_flash_duration, is_destroyed = nil, 6, false
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
    // TODO
    //     jet_sprite = down and jet_sprite_hidden or jet_sprite_visible
    //     ship_sprite_current = left and ship_sprite_flying_left or (right and ship_sprite_flying_right or ship_sprite_neutral)
    this._shipSpriteCurrent = left
      ? this._shipSpriteFlyingLeft
      : right
      ? this._shipSpriteFlyingRight
      : this._shipSpriteNeutral;

    // TODO
    const speed = 1;
    //     local speed = fast_movement and 1.5 or 1
    // TODO
    let diff = v_(
      right ? speed : left ? -speed : 0,
      down ? speed : up ? -speed : 0
    );
    if (diff.x !== 0 && diff.y !== 0) {
      // fix for a diagonal movement speed
      diff = diff.div(1.44);
    }
    // TODO
    this._xy = this._xy.add(diff);
    //     xy = _xy(
    //         mid(w / 2 + 1, xy.x + x_diff, _gaw - w / 2 - 1),
    //         mid(h / 2 + 1, xy.y + y_diff, _gah - h / 2 - 1)
    //     )
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
  //
  // is_invincible_after_damage = function()
  //     return invincible_after_damage_timer ~= nil
  // end,

  takeDamage(updatedHealth: number): void {
    if (updatedHealth > 0) {
      // TODO
      //         -- we start with "-1" in order to avoid 1 frame of non-flash due to how "%" works (see "_draw()")
      //         invincible_after_damage_timer = new_timer(5 * invincibility_flash_duration - 1)
      this._onDamaged();
    } else {
      this._isDestroyed = true;
      this._onDestroyed(this.collisionCircle);
    }
  }

  update(): void {
    // TODO
    // if invincible_after_damage_timer then
    //     if invincible_after_damage_timer.ttl <= 0 then
    //         invincible_after_damage_timer = nil
    //     else
    //         invincible_after_damage_timer._update()
    //     end
    // end

    this._onBulletsSpawned.update();
    // TODO
    // on_shockwave_triggered._update()
    //
    // TODO
    // jet_sprite._update()
  }

  draw(): void {
    // TODO
    // if invincible_after_damage_timer and invincible_after_damage_timer.ttl % (2 * invincibility_flash_duration) < invincibility_flash_duration then
    //     pal(split "1,7,7,7,7,7,7,7,7,7,7,7,7,7,7")
    // end
    this._shipSpriteCurrent.draw(this._xy);
    // TODO
    // jet_sprite._draw(xy)
    // pal()
  }
}
