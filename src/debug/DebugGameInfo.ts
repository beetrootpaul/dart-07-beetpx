import { BeetPx, v_, Vector2d } from "@beetpx/beetpx";
import { c, g, u } from "../globals";

export class DebugGameInfo {
  static draw(): void {
    const fps = BeetPx.averageFps.toFixed(0);
    BeetPx.print(fps, Vector2d.zero, c.white);

    const audioState = BeetPx.audioContext.state;
    const audioStateText =
      audioState === "suspended"
        ? "s"
        : audioState === "running"
        ? "r"
        : audioState === "closed"
        ? "c"
        : "@";
    BeetPx.print(
      audioStateText,
      v_(g.canvasSize.x - u.measureTextSize(audioStateText).x, 0),
      c.white
    );
  }
}
