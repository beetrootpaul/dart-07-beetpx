import { u } from "../globals";
import { Mission } from "./Mission";
import { Mission1 } from "./Mission1";
import { Mission2 } from "./Mission2";
import { Mission3 } from "./Mission3";

export class CurrentMission {
  static readonly first: number = 1;

  private static _current: number = CurrentMission.first;
  private static _m: Mission = new Mission1();

  static get current(): number {
    return this._current;
  }

  // TODO: where used?
  static get next(): number {
    // TODO: how to handle the mission after the last one?
    return (this.current % 3) + 1;
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
        : u.throwError(`Unexpected mission number: ${mission}`);
  }
}
