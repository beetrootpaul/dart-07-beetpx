import { BpxAudioPlaybackId, u_ } from "@beetpx/beetpx";
import { Mission } from "./Mission";
import { Mission1 } from "./Mission1";
import { Mission2 } from "./Mission2";
import { Mission3 } from "./Mission3";

export class CurrentMission {
  static readonly first: number = 1;

  private static _current: number = CurrentMission.first;
  private static _m: Mission = new Mission1();

  static mainMusicPlaybackId: BpxAudioPlaybackId | undefined = undefined;

  static get current(): number {
    return this._current;
  }

  static get max(): number {
    // TODO: change 1 to 2 once mission 2 is ready and 2 to 3 when mission 3 is ready as well
    return 1;
  }

  static get next(): number {
    return (this.current % this.max) + 1;
  }

  static get m(): Mission {
    return this._m;
  }

  static changeTo(mission: number): void {
    this._current = mission;
    this._m =
      mission === 1
        ? new Mission1()
        : mission === 2
        ? new Mission2()
        : mission === 3
        ? new Mission3()
        : u_.throwError(`Unexpected mission number: ${mission}`);
  }
}
