export interface GameScreen {
  preUpdate(): GameScreen | undefined;

  update(): void;

  draw(): void;
}
