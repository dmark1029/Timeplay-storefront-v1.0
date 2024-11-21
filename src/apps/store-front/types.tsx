import { GameCategory, GameDef } from 'ships-service-sdk';

import { GameGroups, GameIds } from '@/utils/types';

export type Game = GameDef | GameCategory;

export const isEntGame = (game: Game | null): boolean => {
  if (!game) {
    return false;
  }

  const cat = game as GameCategory;
  if (cat) {
    return (
      // check if any game under category belongs to ent group
      Object.entries(cat.game || {}).find(
        ([_, val]) => val.group?.name == GameGroups.Entertainment,
      ) != undefined
    );
  }

  const gg = game as GameDef;
  if (gg) {
    // check if the game belongs to ent group
    return gg.group?.name == GameGroups.Entertainment;
  }

  return false;
};

interface GamblingGames {
  [key: string]: boolean;
}

export const GamblingGames: GamblingGames = {
  [GameIds.BreakTheBank]: true,
  [GameIds.CruisingForCash]: true,
  [GameIds.OceanTreasure]: true,
  [GameIds.LuckyDragon]: true,
  [GameIds.Pick3]: true,
  [GameIds.Bingo]: true,
  [GameIds.WheelOfFortune]: true,
  [GameIds.FamilyFeud]: true,
  [GameIds.DealOrNoDeal]: true,
  [GameIds.Trivia]: false,
};
