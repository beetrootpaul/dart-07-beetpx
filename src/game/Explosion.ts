import {
  $d,
  $timer,
  $u,
  $v,
  BpxDrawingPattern,
  BpxPatternColors,
  BpxTimer,
  BpxVector2d,
} from "@beetpx/beetpx";
import { c, g } from "../globals";

function randNegPos05(): number {
  return Math.random() - 0.5;
}

type Particle = {
  // angle: 0 = right, .25 = down, .5 = left, .75 = up
  angle: number;
  xy: BpxVector2d;
  r: number;
};

export class Explosion {
  private readonly _waitTimer: BpxTimer;
  private readonly _magnitude: number;
  private _onStarted: (() => void) | null;

  private readonly _particles: Particle[];

  constructor(params: {
    startXy: BpxVector2d;
    magnitude: number;
    waitFrames?: number;
    onStarted?: () => void;
  }) {
    this._waitTimer = $timer(params.waitFrames ?? 0);

    this._magnitude = params.magnitude;

    this._onStarted = params.onStarted ?? null;

    this._particles = $u.range(9).map(() => ({
      angle: 0.75 + 0.5 * randNegPos05(),
      xy: params.startXy.add(
        $v(randNegPos05(), randNegPos05()).mul(params.magnitude),
      ),
      r: params.magnitude / 2 + Math.random() * (params.magnitude / 2),
    }));
  }

  get hasFinished(): boolean {
    return this._particles.every(p => p.r <= 0);
  }

  update(): void {
    if (this._waitTimer.hasFinished) {
      if (this._onStarted) {
        this._onStarted();
        this._onStarted = null;
      }
      for (const p of this._particles) {
        if (p.r > 0) {
          p.angle = p.angle + 0.1 * randNegPos05();
          const speed = Math.random();
          p.xy = p.xy.add(BpxVector2d.unitFromAngle(p.angle).mul(speed));
          p.r = Math.max(0, p.r - (this._magnitude * Math.random()) / 20);
        }
      }
    }
  }

  draw(): void {
    if (this._waitTimer.hasFinished) {
      $d.setDrawingPattern(
        BpxDrawingPattern.from(`
          -#-#
          #-#-
          -#-#
          #-#-
        `),
      );
      for (const p of this._particles) {
        if (p.r > 0) {
          let color = BpxPatternColors.of(c.darkOrange, c.red);
          if (p.r < this._magnitude * 0.2) {
            color = BpxPatternColors.of(c.lavender, c.mauve);
          } else if (p.r < this._magnitude * 0.4) {
            color = BpxPatternColors.of(c.lightGrey, c.lavender);
          } else if (p.r < this._magnitude * 0.6) {
            color = BpxPatternColors.of(c.lightGrey, c.peach);
          } else if (p.r < this._magnitude * 0.8) {
            color = BpxPatternColors.of(c.peach, c.darkOrange);
          }
          $d.ellipseFilled(
            g.gameAreaOffset.add(p.xy).sub(p.r),
            $v(2, 2).mul(p.r),
            color,
          );
        }
      }
      $d.setDrawingPattern(BpxDrawingPattern.primaryOnly);
    }
  }
}
