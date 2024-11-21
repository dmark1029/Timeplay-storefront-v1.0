import { useEffect, useState } from 'react';

import { useAnimationContext } from '../context/animation-context';
import { GameStates, useGameContext } from '../context/game-context';

/**
 * this is a custom hook that manage the display state for the salmon background for the number sections
 * use this for conditional rendering, and adds a delay where required.
 * @param {boolean} allNumbersRevealed - whether all numbers are revealed.
 * @param {number} delay - ms delay before the background is displayed if not in autoplay or revealing by groups.
 * @returns {boolean} isDisplay - whether or not to display background
 */

export const useShowBGWithDelay = (allNumbersRevealed: boolean, delay: number) => {
  const { autoPlay, instance, gameState } = useGameContext();
  const { isRevealingAllByGroups } = useAnimationContext();
  const [isDisplay, setIsDisplay] = useState<boolean>(false);
  const [enabled, setEnabled] = useState<boolean>(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout | undefined = undefined;

    if (allNumbersRevealed) {
      // check to see if we're autoplaying or revealing if so reveal without delay
      if (!enabled || autoPlay || isRevealingAllByGroups) {
        setIsDisplay(true);
      } else {
        timeout = setTimeout(() => {
          setIsDisplay(true);
        }, delay);
      }
    }

    // remove the timeout
    return () => {
      if (!!timeout) {
        clearTimeout(timeout);
      }
    };
  }, [allNumbersRevealed]);

  // reset when instance changes
  useEffect(() => {
    if (!!instance) {
      setIsDisplay(false);
    }
  }, [instance]);

  // used to determine if the section was already fully open on load
  useEffect(() => {
    if (gameState === GameStates.STAND_BY) {
      setEnabled(!allNumbersRevealed);
    }
  }, [gameState]);

  return isDisplay;
};
