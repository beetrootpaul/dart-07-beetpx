import { b_, BpxAudioPlaybackId } from "@beetpx/beetpx";
import { g } from "../globals";
import { CurrentMission } from "../missions/CurrentMission";

export class Music {
  private static _playbackId: BpxAudioPlaybackId | null = null;

  // TODO: There are gaps between sequence entries. Would need to rework an entire
  //       audio sequence playback and make it synced with audioContext time :-(
  static playTitleMusic(opts: { withIntro: boolean }): void {
    const halfDuration = (fullSoundDurationMs: number) =>
      (fullSoundDurationMs * 16) / 32;
    Music._playbackId = b_.playSoundSequence({
      sequence: opts.withIntro
        ? [
            [{ url: g.assets.music32, durationMs: halfDuration }],
            [{ url: g.assets.music33, durationMs: halfDuration }],
          ]
        : [],
      sequenceLooped: [
        [{ url: g.assets.music34 }, { url: g.assets.music36 }],
        [{ url: g.assets.music35 }, { url: g.assets.music37 }],
      ],
    });
  }

  // TODO: There are gaps between sequence entries. Would need to rework an entire
  //       audio sequence playback and make it synced with audioContext time :-(
  static playLevelMusicMain(): void {
    Music._playbackId = b_.playSoundSequence(
      CurrentMission.m.audioSequenceMain
    );
  }

  // TODO: There are gaps between sequence entries. Would need to rework an entire
  //       audio sequence playback and make it synced with audioContext time :-(
  static playLevelMusicBoss(): void {
    Music._playbackId = b_.playSoundSequence(
      CurrentMission.m.audioSequenceBoss
    );
  }

  static fadeOutCurrentMusic(): void {
    if (Music._playbackId) {
      b_.stopSound(Music._playbackId, { fadeOutMillis: 500 });
    }
  }
}
