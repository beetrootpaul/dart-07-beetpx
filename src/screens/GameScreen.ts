export interface GameScreen {
  preUpdate(): GameScreen | undefined;

  pauseAnimations(): void;

  resumeAnimations(): void;

  update(): void;

  draw(): void;
}
