import {
  CompositeColor,
  FillPattern,
  Timer,
  v_,
  Vector2d,
} from "@beetpx/beetpx";
import { b, c, g, u } from "../globals";

function randNegPos05(): number {
  return Math.random() - 0.5;
}

type Particle = {
  // angle: 0 = right, .25 = down, .5 = left, .75 = up
  angle: number;
  xy: Vector2d;
  r: number;
};

export class Explosion {
  private readonly _waitTimer: Timer;
  private readonly _magnitude: number;
  private readonly _particles: Particle[] = [];

  // TODO: params: on_started
  constructor(params: {
    startXy: Vector2d;
    magnitude: number;
    waitFrames?: number;
  }) {
    this._waitTimer = new Timer({ frames: params.waitFrames ?? 0 });

    this._magnitude = params.magnitude;

    u.repeatN(9, () => {
      this._particles.push({
        angle: 0.75 + 0.5 * randNegPos05(),
        xy: params.startXy.add(
          v_(randNegPos05(), randNegPos05()).mul(params.magnitude)
        ),
        r: params.magnitude / 2 + Math.random() * (params.magnitude / 2),
      });
    });
  }

  get hasFinished(): boolean {
    return this._particles.every((p) => p.r <= 0);
  }

  update(): void {
    this._waitTimer.update();
    if (this._waitTimer.hasFinished) {
      // TODO
      //  (on_started or _noop)()
      for (const p of this._particles) {
        if (p.r > 0) {
          p.angle = p.angle + 0.1 * randNegPos05();
          const speed = Math.random();
          p.xy = p.xy.add(
            // TODO: consider extracting a helper (here or in BeetPx) which does PI*2 by default. Remember that `+ Math.PI` might be needed as well
            speed * Math.cos(p.angle * Math.PI * 2),
            speed * Math.sin(p.angle * Math.PI * 2)
          );
          p.r = Math.max(0, p.r - (this._magnitude * Math.random()) / 20);
        }
      }
    }
  }

  draw(): void {
    if (this._waitTimer.hasFinished) {
      b.setFillPattern(FillPattern.of(0xa5a5));
      for (const p of this._particles) {
        if (p.r > 0) {
          let color = new CompositeColor(c._9_dark_orange, c._8_red);
          if (p.r < this._magnitude * 0.2) {
            color = new CompositeColor(c._13_lavender, c._14_mauve);
          } else if (p.r < this._magnitude * 0.4) {
            color = new CompositeColor(c._6_light_grey, c._13_lavender);
          } else if (p.r < this._magnitude * 0.6) {
            color = new CompositeColor(c._6_light_grey, c._15_peach);
          } else if (p.r < this._magnitude * 0.8) {
            color = new CompositeColor(c._15_peach, c._9_dark_orange);
          }
          b.ellipseFilled(g.gameAreaOffset.add(p.xy), v_(2, 2).mul(p.r), color);
        }
      }
      b.setFillPattern(FillPattern.primaryOnly);
    }
  }
}
