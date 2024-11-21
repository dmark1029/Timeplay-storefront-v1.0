import React from 'react';

import { useNavigate } from 'react-router-dom';

import { useDialogContext } from '@/contexts/dialog-context';
import { gameLocations } from '@/utils';
import { GameIds } from '@/utils/types';

import '../assets/game-intro-videos';
import {
  BreakTheBankIntroVideo,
  CruisingForCashIntroVideo,
  OceanTreasureIntroVideo,
  PowerPicksIntroVideo,
  TempIntroVideo,
} from '../assets/game-intro-videos';

type GameIntroProps = {
  gameId: GameIds | null;
};
const GameIntro: React.FC<GameIntroProps> = ({ gameId }) => {
  const navigate = useNavigate();
  const { handleSetDialog } = useDialogContext();

  if (!gameId) {
    return null;
  }

  const introVideo = introVideos[gameId];
  const location = gameLocations[gameId];
  var timeout: NodeJS.Timeout | undefined = undefined;

  function start() {
    if (timeout != undefined) {
      clearTimeout(timeout);
    }
    timeout = undefined;
    if (location) {
      console.log('navigating to:', location);
      navigate(location);
    }
    handleSetDialog(null);
  }

  function setTransition() {
    if (gameId !== GameIds.OceanTreasure) {
      if (timeout === undefined) {
        timeout = setTimeout(function () {
          start();
        }, 3000);
      }
    } else {
      start();
    }
  }

  return (
    <button className='h-full w-full' onClick={start} aria-label='Press to skip intro animation'>
      <video
        src={introVideo}
        onLoadedMetadata={setTransition}
        className='h-full w-full object-cover'
        autoPlay
        muted
        playsInline
        aria-label='Intro video'
      />
    </button>
  );
};

export default GameIntro;

const introVideos = {
  [GameIds.CruisingForCash]: CruisingForCashIntroVideo,
  [GameIds.BreakTheBank]: BreakTheBankIntroVideo,
  [GameIds.OceanTreasure]: OceanTreasureIntroVideo,
  [GameIds.LuckyDragon]: TempIntroVideo,
  [GameIds.Pick3]: PowerPicksIntroVideo,
  [GameIds.Pick4]: PowerPicksIntroVideo,
  // ent games should not get to this view so these are never use
  [GameIds.Trivia]: TempIntroVideo,
  [GameIds.Bingo]: TempIntroVideo,
  [GameIds.WheelOfFortune]: TempIntroVideo,
  [GameIds.FamilyFeud]: TempIntroVideo,
  [GameIds.DealOrNoDeal]: TempIntroVideo,
};
