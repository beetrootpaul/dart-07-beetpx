import { SolidColor } from "@beetpx/beetpx";
import { MissionMetadata } from "./MissionMetadata";
import { g } from "./globals";

export class CurrentMission {
  static setFrom(metadata: MissionMetadata): void {
    CurrentMission.missionNumber = metadata.missionNumber;
    CurrentMission.missionName = metadata.missionName;
    CurrentMission.bgColor = metadata.bgColor;
    CurrentMission.missionInfoColor = metadata.missionInfoColor;
  }

  static missionNumber: number = g.missions[0]!.missionNumber;
  static missionName: string = g.missions[0]!.missionName;
  static bgColor: SolidColor = g.missions[0]!.bgColor;
  static missionInfoColor: SolidColor = g.missions[0]!.missionInfoColor;
}
