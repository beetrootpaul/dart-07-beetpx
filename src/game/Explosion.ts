import { v_, Vector2d } from "@beetpx/beetpx";
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
  private readonly _magnitude: number;
  private readonly _particles: Particle[] = [];

  // TODO: params: wait_frames, on_started
  constructor(params: { startXy: Vector2d; magnitude: number }) {
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
  // TODO
  //     local wait_timer = new_timer(wait_frames or 0)

  get hasFinished(): boolean {
    return this._particles.every((p) => p.r <= 0);
  }

  update(): void {
    // TODO
    //             wait_timer._update()
    //             if wait_timer.ttl <= 0 then
    //                 (on_started or _noop)()
    for (const p of this._particles) {
      if (p.r > 0) {
        p.angle = p.angle + 0.1 * randNegPos05();
        const speed = Math.random();
        p.xy = p.xy.add(
          speed * Math.cos(p.angle * Math.PI * 2),
          speed * Math.sin(p.angle * Math.PI * 2)
        );
        p.r = Math.max(0, p.r - (this._magnitude * Math.random()) / 20);
      }
    }
    // TODO
    //             end
  }

  draw(): void {
    // TODO
    //             if wait_timer.ttl <= 0 then
    //                 fillp(0xa5a5)
    for (const p of this._particles) {
      // TODO: TMP
      b.ellipseFilled(
        g.gameAreaOffset.add(p.xy),
        v_(2, 2).mul(p.r),
        c._9_dark_orange
      );
      // TODO
      //                     local r = particle.r
      //                     if r > 0 then
      //                         local c1, c2 = _color_9_dark_orange, _color_8_red
      //                         if r < magnitude * .2 then
      //                             c1, c2 = _color_13_lavender, _color_14_mauve
      //                         elseif r < magnitude * .4 then
      //                             c1, c2 = _color_6_light_grey, _color_13_lavender
      //                         elseif r < magnitude * .6 then
      //                             c1, c2 = _color_6_light_grey, _color_15_peach
      //                         elseif r < magnitude * .8 then
      //                             c1, c2 = _color_15_peach, _color_9_dark_orange
      //                         end
      //                         circfill(
      //                             _gaox + particle.xy.x,
      //                             particle.xy.y,
      //                             r,
      //                             16 * c1 + c2
      //                         )
      //                     end
    }
    // TODO
    //                 fillp()
    //             end
  }
}
