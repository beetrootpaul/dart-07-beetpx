import { v_, Vector2d } from "@beetpx/beetpx";
import { b, c, g, u } from "../globals";

// TODO: update calls visualization

export class DebugGameInfo {
  static draw(): void {
    this._drawFps();
    this._drawAudioState();
  }

  private static _drawFps(): void {
    // TODO: average it to make numbers less flickery
    const fps = b.renderFps.toFixed(0);
    b.print(fps, Vector2d.zero, c._7_white);
  }

  private static _drawAudioState(): void {
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
      v_(g.viewportSize.x - u.measureText(audioStateText).x, 0),
      c._7_white
    );
  }
}
