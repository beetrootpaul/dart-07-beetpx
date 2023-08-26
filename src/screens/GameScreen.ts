export interface GameScreen {
  update(): void;

  draw(): void;

  conclude(): GameScreen | undefined;
}
