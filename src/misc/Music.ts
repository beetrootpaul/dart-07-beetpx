import { $x, BpxAudioPlaybackId } from "@beetpx/beetpx";
import { g } from "../globals";
import { CurrentMission } from "../missions/CurrentMission";

export class Music {
  private static _playbackId: BpxAudioPlaybackId | null = null;

  static playTitleMusic(opts: { withIntro: boolean }): void {
    const halfDuration = (fullSoundDurationMs: number) =>
      (fullSoundDurationMs * 16) / 32;
    Music._playbackId = $x.startPlaybackSequence({
      intro:
        opts.withIntro ?
          [
            [{ url: g.assets.music32, durationMs: halfDuration }],
            [{ url: g.assets.music33, durationMs: halfDuration }],
          ]
        : [],
      loop: [
        [g.assets.music34, g.assets.music36],
        [g.assets.music35, g.assets.music37],
      ],
    });
  }

  static playLevelMusicMain(): void {
    Music._playbackId = $x.startPlaybackSequence(
      CurrentMission.m.audioSequenceMain,
    );
  }

  static playLevelMusicBoss(): void {
    Music._playbackId = $x.startPlaybackSequence(
      CurrentMission.m.audioSequenceBoss,
    );
  }

  static fadeOutCurrentMusic(): void {
    if (Music._playbackId) {
      $x.stopPlayback(Music._playbackId, { fadeOutMillis: 500 });
    }
  }
}
