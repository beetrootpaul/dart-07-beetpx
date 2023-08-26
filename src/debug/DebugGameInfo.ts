import { v_, Vector2d } from "@beetpx/beetpx";
import { b, c, g, u } from "../globals";

export class DebugGameInfo {
  static draw(): void {
    const fps = b.averageFps.toFixed(0);
    b.print(fps, Vector2d.zero, c.white);

    const audioState = b.audioContext.state;
    const audioStateText =
      audioState === "suspended"
        ? "s"
        : audioState === "running"
        ? "r"
        : audioState === "closed"
        ? "c"
        : "@";
    b.print(
      audioStateText,
      v_(g.canvasSize.x - u.measureText(audioStateText).x, 0),
      c.white
    );
  }
}
