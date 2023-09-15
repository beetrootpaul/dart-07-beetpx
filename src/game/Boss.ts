import { Timer, v_, Vector2d } from "@beetpx/beetpx";
import { CollisionCircle } from "../collisions/CollisionCircle";
import { g } from "../globals";
import { Easing } from "../misc/Easing";
import { CurrentMission } from "../missions/CurrentMission";
import { Movement } from "../movement/Movement";
import { MovementToTarget } from "../movement/MovementToTarget";
import { BossProperties } from "./BossProperties";

export class Boss {
  private readonly _properties: BossProperties =
    CurrentMission.m.bossProperties();

  private readonly _movement: Movement;

  private readonly _onBulletsSpawned: () => void;
  private readonly _onDamaged: () => void;
  private readonly _onEnteredNextPhase: () => void;
  private readonly _onDestroyed: (collisionCircles: CollisionCircle[]) => void;

  private _invincibleDuringIntro: boolean = true;
  get invincibleDuringIntro(): boolean {
    return this._invincibleDuringIntro;
  }

  private _health: number;
  private _isDestroyed: boolean = false;
  private _flashingAfterDamageTimer: Timer | null = null;

  constructor(params: {
    onBulletsSpawned: () => void;
    onDamaged: () => void;
    onEnteredNextPhase: () => void;
    onDestroyed: (collisionCircles: CollisionCircle[]) => void;
  }) {
    // TODO
    //     local phases = boss_properties.phases

    this._movement = MovementToTarget.of({
      targetX: g.gameAreaSize.x / 2,
      targetY: 20,
      frames: 180,
      easingFn: Easing.outQuartic,
    })(v_(g.gameAreaSize.x / 2, -120));

    this._onBulletsSpawned = params.onBulletsSpawned;
    this._onDamaged = params.onDamaged;
    this._onEnteredNextPhase = params.onEnteredNextPhase;
    this._onDestroyed = params.onDestroyed;

    // TODO
    //     local current_phase_number, flashing_after_damage_timer = 0, nil

    this._health = this._properties.health;
  }

  get healthFraction(): number | null {
    return this._invincibleDuringIntro
      ? null
      : this._health / this._properties.health;
  }

  get hasFinished(): boolean {
    return this._isDestroyed;
  }

  startFirstPhase(): void {
    // TODO
    //         current_phase_number = 1
    //         movement = phases[current_phase_number][5](movement.xy)
    this._invincibleDuringIntro = false;
  }

  get collisionCircles(): CollisionCircle[] {
    return this._properties.collisionCirclesProps.map(({ r, offset }) => ({
      center: this._movement.xy.add(offset ?? Vector2d.zero),
      r,
    }));
  }

  takeDamage(damage: number): void {
    this._health = Math.max(0, this._health - damage);
    if (this._health > 0) {
      this._flashingAfterDamageTimer = new Timer({ frames: 4 });
      this._onDamaged();
    } else {
      this._isDestroyed = true;
      // TODO
      //   on_destroyed(collision_circles(), phases[#phases][2])
      this._onDestroyed(this.collisionCircles);
    }
  }

  update(): void {
    // TODO
    //         if current_phase_number > 0 and current_phase_number < #phases then
    //             if phases[current_phase_number + 1][1] >= boss.health / boss.health_max then
    //                 on_entered_next_phase(collision_circles(), phases[current_phase_number][2])
    //                 current_phase_number = current_phase_number + 1
    //                 movement = phases[current_phase_number][5](movement.xy)
    //             end
    //         end

    this._movement.update();

    // TODO
    //         if current_phase_number > 0 then
    //             local current_phase = phases[current_phase_number]
    //             local bullet_fire_timer = current_phase[3] or new_fake_timer()
    //             bullet_fire_timer._update()
    //             if bullet_fire_timer.ttl <= 0 then
    //                 bullet_fire_timer.restart()
    //                 on_bullets_spawned(current_phase[4], movement)
    //             end
    //         end

    if (this._flashingAfterDamageTimer?.hasFinished) {
      this._flashingAfterDamageTimer = null;
    }
    this._flashingAfterDamageTimer?.update();
  }

  draw(): void {
    this._properties.spriteMain.draw(this._movement.xy);

    if (!(this._flashingAfterDamageTimer?.hasFinished ?? true)) {
      this._properties.spriteFlash.draw(this._movement.xy);
    }
  }
}
