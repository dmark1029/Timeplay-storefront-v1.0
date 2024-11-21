import { useAnimationContext } from '@/apps/instant-win/context/animation-context';
import { cn } from '@/utils/cn';

import { useGameContext } from '../../../context/game-context';
import { userNumbersBg } from '../assets';
import UserNumbersItem from './user-numbers-item';

interface UserNumbersSectionProps {
  className?: string;
}

const UserNumbersSection: React.FC<UserNumbersSectionProps> = ({ className }) => {
  const { userNumbers, openUserNumber, isGame, userNumbersStates, autoPlay, revealAnimating } =
    useGameContext();
  const { isRevealingAllByGroups } = useAnimationContext();
  const userSymbols = userNumbers.slice(0, 12);

  const handleClick = (index: number) => {
    if (autoPlay || revealAnimating || isRevealingAllByGroups) {
      return;
    }

    openUserNumber(index);
  };

  return (
    <div
      className={cn(
        `relative flex w-full flex-col items-center justify-center pb-9 pt-1`,
        !isGame && 'pointer-events-none opacity-50',
        className,
      )}
    >
      {/* user numbers header */}
      <div className='lucky-symbols-header'>
        <p className='text-center align-middle uppercase'>Your Symbols</p>
      </div>
      <div className='pt-.5 flex w-[256px] items-center justify-center'>
        {/* background */}
        <img className='absolute w-[256px] max-w-[256px] object-contain' src={userNumbersBg} />
        {/* symbols grid*/}
        <div className='align-items-center relative grid h-full w-full max-w-[256px] grid-cols-4 grid-rows-3 justify-items-center gap-x-0 gap-y-[1px] px-[2px] pt-5'>
          {userSymbols.map((number, index) => {
            return (
              <UserNumbersItem
                data={number}
                onClick={() => handleClick(index)}
                key={index}
                index={index}
                state={userNumbersStates[index]}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default UserNumbersSection;
