import {
  $d,
  $timer,
  $v,
  BpxSpriteColorMapping,
  BpxTimer,
  BpxVector2d,
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
  private static readonly _size: BpxVector2d = $v(10, 12);

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
    0,
  );
  private readonly _shipSpriteFlyingLeft: Sprite = new StaticSprite(
    g.assets.mainSpritesheetUrl,
    10,
    10,
    9,
    0,
  );
  private readonly _shipSpriteFlyingRight: Sprite = new StaticSprite(
    g.assets.mainSpritesheetUrl,
    10,
    10,
    29,
    0,
  );
  private _shipSpriteCurrent: Sprite = this._shipSpriteNeutral;

  private readonly _jetSpriteVisible: Sprite = new AnimatedSprite(
    g.assets.mainSpritesheetUrl,
    4,
    20,
    [0, 0, 0, 0, 4, 4, 4, 4],
    9,
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

    this._xy = $v(g.gameAreaSize.x / 2, g.gameAreaSize.y - 28);
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

  private _createTripleBullet(): PlayerBullet[] {
    return [
      new PlayerBullet(this._xy.add(0, -4)),
      new PlayerBullet(this._xy.add(-5, -2)),
      new PlayerBullet(this._xy.add(5, -2)),
    ];
  }

  private _createShockwave(): Shockwave {
    return new Shockwave(this._xy);
  }

  get hasFinished(): boolean {
    return this._isDestroyed;
  }

  setMovement(directionVector: BpxVector2d, fastMovement: boolean) {
    this._shipSpriteCurrent =
      directionVector.x < 0 ? this._shipSpriteFlyingLeft
      : directionVector.x > 0 ? this._shipSpriteFlyingRight
      : this._shipSpriteNeutral;

    this._jetSprite = directionVector.y > 0 ? null : this._jetSpriteVisible;

    const speed = fastMovement ? 1.5 : 1;
    let diff = $v(
      directionVector.x > 0 ? speed
      : directionVector.x < 0 ? -speed
      : 0,
      directionVector.y > 0 ? speed
      : directionVector.y < 0 ? -speed
      : 0,
    );
    if (diff.x !== 0 && diff.y !== 0) {
      // normalization of diagonal speed
      diff = diff.div(1.44);
    }
    this._xy = this._xy
      .add(diff)
      .clamp(
        Player._size.div(2).add(1),
        g.gameAreaSize.sub(Player._size.div(2)).sub(1),
      );
  }

  fire(fastShoot: boolean, tripleShoot: boolean): void {
    this._onBulletsSpawned.invokeIfReady(
      tripleShoot ?
        fastShoot ? 10
        : 16
      : fastShoot ? 8
      : 12,
      (tripleShoot ? this._createTripleBullet : this._createSingleBullet).bind(
        this,
      ),
    );
  }

  triggerShockwave(): void {
    this._onShockwaveTriggered.invokeIfReady(
      60,
      this._createShockwave.bind(this),
    );
  }

  isInvincibleAfterDamage(): boolean {
    return !!this._invincibleAfterDamageTimer;
  }

  takeDamage(updatedHealth: number): void {
    if (updatedHealth > 0) {
      this._invincibleAfterDamageTimer = $timer(
        5 * Player._invincibilityFlashFrames,
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

    this._onBulletsSpawned.update();
    this._onShockwaveTriggered.update();
  }

  draw(): void {
    const flash = BpxSpriteColorMapping.from([
      [Pico8Colors.black, c.white],
      [Pico8Colors.storm, c.darkerBlue],
      [Pico8Colors.wine, c.white],
      [Pico8Colors.moss, c.white],
      [Pico8Colors.tan, c.white],
      [Pico8Colors.slate, c.white],
      [Pico8Colors.silver, c.white],
      [Pico8Colors.white, c.white],
      [Pico8Colors.ember, c.white],
      [Pico8Colors.orange, c.white],
      [Pico8Colors.lemon, null],
      [Pico8Colors.lime, null],
      [Pico8Colors.sky, c.white],
      [Pico8Colors.dusk, c.white],
      [Pico8Colors.pink, c.white],
      [Pico8Colors.peach, c.white],
    ]);

    let prevMapping: BpxSpriteColorMapping | undefined;
    if (
      this._invincibleAfterDamageTimer &&
      this._invincibleAfterDamageTimer.framesLeft %
        (2 * Player._invincibilityFlashFrames) <
        Player._invincibilityFlashFrames
    ) {
      prevMapping = $d.setSpriteColorMapping(flash);
    }

    this._shipSpriteCurrent.draw(this._xy);

    this._jetSprite?.draw(this._xy);

    if (prevMapping) {
      $d.setSpriteColorMapping(prevMapping);
    }
  }
}
