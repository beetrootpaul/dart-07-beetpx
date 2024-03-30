import { BpxRgbColor, BpxSoundSequence } from "@beetpx/beetpx";
import { BossProperties } from "../game/BossProperties";
import { EnemyProperties } from "../game/EnemyProperties";

export interface Mission {
  readonly missionName: string;
  readonly bossName: string;

  readonly bgColor: BpxRgbColor;
  readonly missionInfoColor: BpxRgbColor;

  readonly scrollPerFrame: number;

  readonly ldtk: {
    level: string;
    tilesetPng: string;
    landLayer: string;
    enemiesLayer: string;
    progressionMarkersLayer: string;
  };

  pauseAnimations(): void;
  resumeAnimations(): void;

  levelBgUpdate(): void;
  levelBgDraw(): void;

  get audioSequenceMain(): BpxSoundSequence;
  get audioSequenceBoss(): BpxSoundSequence;

  enemyPropertiesFor(enemyId: string): EnemyProperties;
  bossProperties(): BossProperties;
}
