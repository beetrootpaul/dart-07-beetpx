import { BpxVector2d } from "@beetpx/beetpx";
import { g } from "../globals";

export class Helpers {
  // calculations below assume xy is in relation to (_gaox, 0) point
  static isSafelyOutsideGameplayArea(xy: BpxVector2d): boolean {
    return (
      xy.x < -g.tileSize.x ||
      xy.x > g.gameAreaSize.x + g.tileSize.x ||
      xy.y < -g.tileSize.y ||
      xy.y > g.gameAreaSize.y + g.tileSize.y
    );
  }
}
