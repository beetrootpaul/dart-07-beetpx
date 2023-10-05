import { b_, u_, v_ } from "@beetpx/beetpx";
import { c, g } from "../globals";

export class DebugGameInfo {
  private readonly _updateCallsData = {
    history: Array.from(
      { length: Math.floor((g.viewportSize.x - 1) / 2) },
      () => 0
    ),
    index: 0,
  };

  private readonly _fpsData = {
    history: Array.from(
      { length: Math.floor((g.viewportSize.x - 1) / 2) },
      () => 0
    ),
    index: 0,
  };

  update() {
    this._updateCallsData.history[this._updateCallsData.index] += 1;
  }

  preDraw(): void {
    this._fpsData.history[this._updateCallsData.index] = b_.renderFps;
  }

  draw(): void {
    this._drawUpdateCalls();
    this._drawFps();
    this._drawAudioState();
  }

  postDraw(): void {
    this._fpsData.index =
      (this._fpsData.index + 1) % this._fpsData.history.length;

    this._updateCallsData.index =
      (this._updateCallsData.index + 1) % this._updateCallsData.history.length;
    this._updateCallsData.history[this._updateCallsData.index] = 0;
  }

  private _drawUpdateCalls(): void {
    for (
      let column = 0;
      column < this._updateCallsData.history.length;
      column++
    ) {
      const calls = this._updateCallsData.history[column]!;
      for (let dot = 0; dot < calls; dot++) {
        b_.pixel(
          v_(1 + column * 2, 1 + dot * 2),
          column === this._updateCallsData.index ? c.white : c.lavender
        );
      }
    }
  }

  private _drawFps(): void {
    this._fpsData.history[this._fpsData.index] = b_.renderFps;

    for (let column = 0; column < this._fpsData.history.length; column++) {
      const tensOfFps = Math.round(this._fpsData.history[column]! / 10);
      for (let dot = 0; dot < tensOfFps; dot++) {
        b_.pixel(
          v_(1 + column * 2, g.viewportSize.y - 2 - dot * 2),
          column === this._fpsData.index
            ? c.white
            : (dot + 1) % 3 === 0
            ? c.peach
            : c.lavender
        );
      }
    }

    this._fpsData.index++;
    this._fpsData.index %= this._fpsData.history.length;
  }

  private _drawAudioState(): void {
    const audioState = b_.audioContext.state;
    const audioStateText =
      audioState === "suspended"
        ? "s"
        : audioState === "running"
        ? "r"
        : audioState === "closed"
        ? "c"
        : "@";
    b_.print(
      audioStateText,
      v_(g.viewportSize.x - u_.measureText(audioStateText).x, 0),
      c.white
    );
  }
}
