import { BpxVector2d } from "@beetpx/beetpx";
import { g } from "../globals";

export class Helpers {
  // calculations below assume xy is in relation to (_gaox, 0) point
  static isSafelyOutsideGameplayArea(xy: BpxVector2d): boolean {
    return (
      xy[0] < -g.tileSize[0] ||
      xy[0] > g.gameAreaSize[0] + g.tileSize[0] ||
      xy[1] < -g.tileSize[1] ||
      xy[1] > g.gameAreaSize[1] + g.tileSize[1]
    );
  }
}
