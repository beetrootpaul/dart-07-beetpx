import { BpxVector2d } from "@beetpx/beetpx";

// TODO: __NEW_BEETPX__ unit tests for various movements

export interface MovementFactory {
  (startXy: BpxVector2d): Movement;
}

export interface Movement {
  get xy(): BpxVector2d;

  get speed(): BpxVector2d;

  get hasFinished(): boolean;

  update(): void;
}
