import { Card } from '@nextui-org/react';

import { pick3LogoLong, pick4LogoLong } from '../assets';
import DateCountdown from './date-countdown';
import { useGameContext } from '../context/game-context';

interface DrawCountdownProps {
  targetDate: Date;
}

const DrawCountdown: React.FC<DrawCountdownProps> = ({ targetDate }) => {
  const { category } = useGameContext();

  return (
    <div>
      <Card className='items-center p-4'>
        { category === 'pick3' && <img className='px-6 py-2' src={pick3LogoLong} />}
        { category === 'pick4' && <img className='px-6 py-2' src={pick4LogoLong} />}
        <p className='font-tempo text-lg uppercase text-pp-text-dark'>Next Draw In</p>
        <h1 className='text-lg font-bold'>
          <DateCountdown targetDate={targetDate} />
        </h1>
      </Card>
    </div>
  );
};

export default DrawCountdown;
