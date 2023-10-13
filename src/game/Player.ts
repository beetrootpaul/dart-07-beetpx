import {
  b_,
  BpxColorMapping,
  BpxTimer,
  BpxVector2d,
  timer_,
  transparent_,
  u_,
  v2d_,
  v_,
} from "@beetpx/beetpx";
import { CollisionCircle } from "../collisions/CollisionCircle";
import { c, g } from "../globals";
import { AnimatedSprite, Sprite, StaticSprite } from "../misc/Sprite";
import { Throttle } from "../misc/Throttle";
import { Pico8Colors } from "../pico8/Pico8Color";
import { PlayerBullet } from "./PlayerBullet";
import { Shockwave } from "./Shockwave";

export class Player {
  private static readonly _invincibilityFlashFrames: number = 5;
  private static readonly _size: BpxVector2d = v2d_(10, 12);

  private readonly _onBulletsSpawned: Throttle<
    (bullets: PlayerBullet[]) => void
  >;
  private readonly _onShockwaveTriggered: Throttle<
    (shockwave: Shockwave) => void
  >;
  private readonly _onDamaged: () => void;
  private readonly _onDestroyed: (playerCc: CollisionCircle) => void;

  private readonly _shipSpriteNeutral: Sprite = new StaticSprite(
    g.assets.mainSpritesheetUrl,
    10,
    10,
    19,
    0
  );
  private readonly _shipSpriteFlyingLeft: Sprite = new StaticSprite(
    g.assets.mainSpritesheetUrl,
    10,
    10,
    9,
    0
  );
  private readonly _shipSpriteFlyingRight: Sprite = new StaticSprite(
    g.assets.mainSpritesheetUrl,
    10,
    10,
    29,
    0
  );
  private _shipSpriteCurrent: Sprite = this._shipSpriteNeutral;

  private readonly _jetSpriteVisible: Sprite = new AnimatedSprite(
    g.assets.mainSpritesheetUrl,
    4,
    20,
    [0, 0, 0, 0, 4, 4, 4, 4],
    9
  );
  private _jetSprite: Sprite | null = null;

  private _xy: BpxVector2d;

  private _invincibleAfterDamageTimer: BpxTimer | null = null;

  private _isDestroyed: boolean = false;

  constructor(params: {
    onBulletsSpawned: (bullets: PlayerBullet[]) => void;
    onShockwaveTriggered: (shockwave: Shockwave) => void;
    onDamaged: () => void;
    onDestroyed: (playerCc: CollisionCircle) => void;
  }) {
    this._onBulletsSpawned = new Throttle(params.onBulletsSpawned);
    this._onShockwaveTriggered = new Throttle(params.onShockwaveTriggered);
    this._onDamaged = params.onDamaged;
    this._onDestroyed = params.onDestroyed;

    this._xy = v2d_(g.gameAreaSize[0] / 2, g.gameAreaSize[1] - 28);
  }

  get collisionCircle(): CollisionCircle {
    return {
      center: v_.add(this._xy, [0, 1]),
      r: 3,
    };
  }

  private _createSingleBullet(): PlayerBullet[] {
    return [new PlayerBullet(v_.add(this._xy, [0, -4]))];
  }

  private _createTripleBullet(): PlayerBullet[] {
    return [
      new PlayerBullet(v_.add(this._xy, [0, -4])),
      new PlayerBullet(v_.add(this._xy, [-5, -2])),
      new PlayerBullet(v_.add(this._xy, [5, -2])),
    ];
  }

  private _createShockwave(): Shockwave {
    return new Shockwave(this._xy);
  }

  get hasFinished(): boolean {
    return this._isDestroyed;
  }

  setMovement(
    left: boolean,
    right: boolean,
    up: boolean,
    down: boolean,
    fastMovement: boolean
  ) {
    this._shipSpriteCurrent = left
      ? this._shipSpriteFlyingLeft
      : right
      ? this._shipSpriteFlyingRight
      : this._shipSpriteNeutral;

    this._jetSprite = down ? null : this._jetSpriteVisible;

    const speed = fastMovement ? 1.5 : 1;
    let diff = v2d_(
      right ? speed : left ? -speed : 0,
      down ? speed : up ? -speed : 0
    );
    if (diff[0] !== 0 && diff[1] !== 0) {
      // normalization of diagonal speed
      diff = v_.div(diff, 1.44);
    }
    // TODO: use `v_.clamp(…)`
    this._xy = v_.add(this._xy, diff);
    this._xy = [
      u_.clamp(
        Player._size[0] / 2 + 1,
        this._xy[0],
        g.gameAreaSize[0] - (Player._size[0] / 2 + 1)
      ),
      u_.clamp(
        Player._size[1] / 2 + 1,
        this._xy[1],
        g.gameAreaSize[1] - (Player._size[1] / 2 + 1)
      ),
    ];
  }

  fire(fastShoot: boolean, tripleShoot: boolean): void {
    this._onBulletsSpawned.invokeIfReady(
      tripleShoot ? (fastShoot ? 10 : 16) : fastShoot ? 8 : 12,
      (tripleShoot ? this._createTripleBullet : this._createSingleBullet).bind(
        this
      )
    );
  }

  triggerShockwave(): void {
    this._onShockwaveTriggered.invokeIfReady(
      60,
      this._createShockwave.bind(this)
    );
  }

  isInvincibleAfterDamage(): boolean {
    return !!this._invincibleAfterDamageTimer;
  }

  takeDamage(updatedHealth: number): void {
    if (updatedHealth > 0) {
      this._invincibleAfterDamageTimer = timer_(
        5 * Player._invincibilityFlashFrames
      );
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
    this._onShockwaveTriggered.update();

    this._jetSprite?.update();
  }

  draw(): void {
    let prevMapping: BpxColorMapping | undefined;
    if (
      this._invincibleAfterDamageTimer &&
      this._invincibleAfterDamageTimer.framesLeft %
        (2 * Player._invincibilityFlashFrames) <
        Player._invincibilityFlashFrames
    ) {
      prevMapping = b_.mapSpriteColors([
        { from: Pico8Colors._0_black, to: c.white },
        { from: Pico8Colors._1_darkBlue, to: c.darkerBlue },
        { from: Pico8Colors._2_darkPurple, to: c.white },
        { from: Pico8Colors._3_darkGreen, to: c.white },
        { from: Pico8Colors._4_brown, to: c.white },
        { from: Pico8Colors._5_darkGrey, to: c.white },
        { from: Pico8Colors._6_lightGrey, to: c.white },
        { from: Pico8Colors._7_white, to: c.white },
        { from: Pico8Colors._8_red, to: c.white },
        { from: Pico8Colors._9_orange, to: c.white },
        { from: Pico8Colors._10_yellow, to: transparent_ },
        { from: Pico8Colors._11_green, to: transparent_ },
        { from: Pico8Colors._12_blue, to: c.white },
        { from: Pico8Colors._13_lavender, to: c.white },
        { from: Pico8Colors._14_pink, to: c.white },
        { from: Pico8Colors._15_lightPeach, to: c.white },
      ]);
    }

    this._shipSpriteCurrent.draw(this._xy);

    this._jetSprite?.draw(this._xy);

    if (prevMapping) {
      b_.mapSpriteColors(prevMapping);
    }
  }
}
