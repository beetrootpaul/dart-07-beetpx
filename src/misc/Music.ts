import { b_, BpxAudioPlaybackId } from "@beetpx/beetpx";
import { g } from "../globals";
import { CurrentMission } from "../missions/CurrentMission";

export class Music {
  private static _playbackId: BpxAudioPlaybackId | null = null;

  static playTitleMusic(opts: { withIntro: boolean }): void {
    const halfDuration = (fullSoundDurationMs: number) =>
      (fullSoundDurationMs * 16) / 32;
    Music._playbackId = b_.startPlaybackSequence({
      intro: opts.withIntro
        ? [
            [{ url: g.assets.music32, durationMs: halfDuration }],
            [{ url: g.assets.music33, durationMs: halfDuration }],
          ]
        : [],
      loop: [
        [g.assets.music34, g.assets.music36],
        [g.assets.music35, g.assets.music37],
      ],
    });
    // TODO: why do I need to unmute immediately?
    b_.unmutePlayback(Music._playbackId);
  }

  static playLevelMusicMain(): void {
    Music._playbackId = b_.startPlaybackSequence(
      CurrentMission.m.audioSequenceMain,
    );
    // TODO: why do I need to unmute immediately?
    b_.unmutePlayback(Music._playbackId);
  }

  static playLevelMusicBoss(): void {
    Music._playbackId = b_.startPlaybackSequence(
      CurrentMission.m.audioSequenceBoss,
    );
    // TODO: why do I need to unmute immediately?
    b_.unmutePlayback(Music._playbackId);
  }

  static fadeOutCurrentMusic(): void {
    if (Music._playbackId) {
      b_.stopPlayback(Music._playbackId, { fadeOutMillis: 500 });
    }
  }
}
