import { BpxVector2d } from "@beetpx/beetpx";

export interface PauseMenuEntry {
  get size(): BpxVector2d;
  execute(): void;
  update(isFocused: boolean): void;
  draw(xy: BpxVector2d): void;
}
