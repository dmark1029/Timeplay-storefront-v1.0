export enum GameStatesEnum {
  STAND_BY = 'STAND_BY',
  PRE_DRAW = 'PRE_DRAW',
  DRAWING = 'DRAWING',
  POST_DRAW = 'POST_DRAW',
}

export type GameStates = `${GameStatesEnum}`;
