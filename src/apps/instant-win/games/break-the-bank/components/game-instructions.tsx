import React, { useState } from 'react';

import { useStoreFrontContext } from '@/apps/store-front';
import { useAudioContext } from '@/contexts/audio-context';

const GameInstructions: React.FC = () => {
  const [isInstructionsOpen, setIsInstructionsOpen] = useState(false);
  const { handleGenericClickAudio } = useAudioContext();
  const { gameId } = useStoreFrontContext();

  const handleButtonClick = () => {
    setIsInstructionsOpen(!isInstructionsOpen);
  };

  const handleCloseModal = () => {
    if (gameId) {
      handleGenericClickAudio(gameId);
    }
    setIsInstructionsOpen(false);
  };

  interface BoldTextProp {
    children: string | JSX.Element | JSX.Element[];
  }

  const BoldText: React.FC<BoldTextProp> = ({ children }) => {
    return <span className='font-bold uppercase'>{children}</span>;
  };

  const modalVisibilityClass = isInstructionsOpen ? 'opacity-100' : 'opacity-0 pointer-events-none';
  const modalTransitionClass = isInstructionsOpen ? 'opacity-100' : 'opacity-0';

  return (
    <div className='relative z-50 w-full'>
      <button
        className='absolute bottom-16 right-10 h-6 w-6 rounded-3xl border-2 border-yellow-300 bg-black text-sm font-bold text-yellow-300 sm-h:bottom-12 md-h:bottom-16'
        onClick={handleButtonClick}
        aria-label='Open Instructions'
      >
        i
      </button>

      <div
        className={`fixed left-0 top-0 flex h-full w-full flex-col items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300 ${modalVisibilityClass}`}
      >
        <div className='relative top-2 h-11 w-28 rounded-t-3xl border-x-4 border-t-8 border-gray-300 bg-transparent'></div>
        <div
          className={`relative flex aspect-auto h-auto w-[90%] max-w-md flex-col justify-evenly rounded-3xl border-4 border-gray-400 bg-gradient-to-b from-gray-200 to-gray-400 text-black transition-opacity duration-300 ${modalTransitionClass}`}
        >
          <button
            className='absolute right-2 top-2 z-30 text-gray-500 hover:text-gray-700'
            onClick={handleCloseModal}
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-6 w-6'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M6 18L18 6M6 6l12 12'
              />
            </svg>
          </button>
          <div className='flex max-w-md flex-col justify-center rounded-t-3xl bg-gradient-to-b from-yellow-200 to-slate-300 p-4'>
            <h2 className='text-center text-xl font-bold uppercase'>How to play?</h2>
          </div>
          <div className='h-2 w-full bg-gradient-to-b from-gray-200 to-gray-400'></div>
          <div className='leading-5.5 flex max-w-md flex-col justify-center p-4'>
            <p>
              Tap each suitcase to open them one-by-one, or hit the <BoldText>reveal all</BoldText>{' '}
              button to show all cases at once.
            </p>
            <p>
              If any symbols in the <BoldText>lucky cases</BoldText> match those in{' '}
              <BoldText>your cases</BoldText> you win!
            </p>
            <p>
              <BoldText>Match 3</BoldText>: if all 3 match, you win the cash amount.
            </p>
            <p>
              Reveal the <BoldText>Banker's Bonus</BoldText> to see if you won a{' '}
              <BoldText>free cruise</BoldText> or a <BoldText>special prize</BoldText>.
            </p>
          </div>
          <div className='h-2 w-full bg-gradient-to-t from-gray-400 to-gray-200'></div>
          <div className='flex justify-center'>
            <button
              className='w-full rounded-b-3xl bg-gray-300 px-4 py-4 text-lg font-bold uppercase text-black hover:bg-gray-100'
              onClick={handleCloseModal}
              aria-label='Close Instructions'
            >
              I Understand
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameInstructions;
