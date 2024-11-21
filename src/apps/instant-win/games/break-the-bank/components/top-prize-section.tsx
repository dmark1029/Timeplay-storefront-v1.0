import React from 'react';

import { useGameContext } from '../../../context/game-context';
import InstantWinTypography from './typography';

const TopPrizeSection: React.FC = () => {
  const gameData = useGameContext();

  return (
    <div className={`flex items-center justify-center gap-2`}>
      <InstantWinTypography type={'h4'}>Top Prize </InstantWinTypography>
      <InstantWinTypography type={'h1'}>${gameData?.topPrize}</InstantWinTypography>
      <InstantWinTypography type={'h4'}>Gros Lot</InstantWinTypography>
    </div>
  );
};

export default TopPrizeSection;
