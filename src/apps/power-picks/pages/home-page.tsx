import { useState } from 'react';

import { Button } from '@nextui-org/react';
import { useNavigate } from 'react-router-dom';

import { AnimateTransition } from '@/components';

import { balls, burst, pick3LogoWithBall, pick4LogoWithBall } from '../assets';
import PicksModal from '../components/picks-modal';
import { useGameContext } from '../context/game-context';

const HomePage = () => {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const { category } = useGameContext();

  return (
    <AnimateTransition initial={true} className='h-full w-full' duration={0.5}>
      <PicksModal
        afterGenerationFunc={() => navigate('lines')}
        visible={visible}
        setVisible={setVisible}
      />
      <img className='absolute top-0 z-0 h-full w-full blur-[2px]' src={burst} alt='' />
      <img className='absolute top-0 z-0 h-full w-full' src={balls} alt='powerpick lotto balls' />
      <div className='z-20 flex h-full w-full flex-col items-center justify-around px-4 py-4 font-tempo'>
        {/* <h1 className='text-center text-5xl text-slate-600'>{category}</h1> */}
        <div className='mt-24'>
          { category === 'pick3' && <img src={pick3LogoWithBall} alt='pick 3 logo' />}
          { category === 'pick4' && <img src={pick4LogoWithBall} alt='pick 3 logo' />}
        </div>
        <div className='flex w-9/12 flex-col justify-items-stretch gap-4'>
          <Button
            className='bg-gradient-to-r from-pp-button-light to-pp-button-dark text-xl font-bold text-white'
            onClick={() => setVisible(true)}
          >
            Buy Tickets
          </Button>
          <Button
            className='bg-gradient-to-r from-pp-button-light to-pp-button-dark text-xl font-bold text-white'
            onClick={() => navigate('./draws#your-draws')}
          >
            My Tickets
          </Button>
          <Button
            className='bg-gradient-to-r from-pp-button-light to-pp-button-dark text-xl font-bold text-white'
            onClick={() => navigate('./draws#all-draws')}
          >
            Draws
          </Button>
        </div>
      </div>
    </AnimateTransition>
  );
};
export default HomePage;
