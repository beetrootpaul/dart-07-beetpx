// TODO: move to BeetPx
import { SolidColor, v_ } from "@beetpx/beetpx";
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
  const xy = v_(
    g.gameAreaOffsetX + g.gameAreaSize.div(2).x - textSize.x / 2,
    y
  );

  // TODO
  // if outline_color then
  u.printWithOutline(text, xy, textColor, outlineColor);
  // TODO
  // end
}
