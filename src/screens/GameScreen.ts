export interface GameScreen {
  preUpdate(): GameScreen | undefined;

  pauseAnimationsAndTimers(): void;

  resumeAnimationsAndTimers(): void;

  update(): void;

  draw(): void;
}
