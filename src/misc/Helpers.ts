import { SolidColor, Vector2d } from "@beetpx/beetpx";
import { b, g, u } from "../globals";

// TODO: move to BeetPx?
export class Helpers {
  static printCentered(
    text: string,
    centerX: number,
    y: number,
    textColor: SolidColor,
    outlineColor?: SolidColor
  ): void {
    const textSize = u.measureText(text);
    const xy = g.gameAreaOffset.add(centerX - textSize.x / 2, y);

    if (outlineColor) {
      u.printWithOutline(text, xy, textColor, outlineColor);
    } else {
      b.print(text, xy, textColor);
    }
  }

  // calculations below assume xy is in relation to (_gaox, 0) point
  static isSafelyOutsideGameplayArea(xy: Vector2d): boolean {
    return (
      xy.x < -g.tileSize.x ||
      xy.x > g.gameAreaSize.x + g.tileSize.x ||
      xy.y < -g.tileSize.y ||
      xy.y > g.gameAreaSize.y + g.tileSize.y
    );
  }
}
