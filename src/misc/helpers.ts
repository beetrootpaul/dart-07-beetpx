// TODO: move to BeetPx
import { SolidColor, Vector2d } from "@beetpx/beetpx";
import { g, u } from "../globals";

export function printCentered(
  text: string,
  y: number,
  textColor: SolidColor,
  outlineColor: SolidColor
): void {
  // TODO
  // forced_x

  const textSize = u.measureText(text);
  const xy = g.gameAreaOffset.add(g.gameAreaSize.div(2).x - textSize.x / 2, y);

  // TODO
  // if outline_color then
  u.printWithOutline(text, xy, textColor, outlineColor);
  // TODO
  // end
}

// calculations below assume xy is in relation to (_gaox, 0) point
export function isSafelyOutsideGameplayArea(xy: Vector2d): boolean {
  return (
    xy.x < -g.tileSize.x ||
    xy.x > g.gameAreaSize.x + g.tileSize.x ||
    xy.y < -g.tileSize.y ||
    xy.y > g.gameAreaSize.y + g.tileSize.y
  );
}
