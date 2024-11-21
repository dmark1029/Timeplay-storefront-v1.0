import { Button } from '@nextui-org/react';
import { useNavigate } from 'react-router-dom';

import { AnimateTransition } from '@/components';

const ChooseGamePage = () => {
  const navigate = useNavigate();

  return (
    <AnimateTransition initial={true} className='h-full w-full' duration={0.5}>
      <div className='flex h-full w-full flex-col items-center justify-around px-4 py-4'>
        <h1 className='text-center text-5xl font-bold text-slate-600'>
          POWER
          <br />
          PICKS
        </h1>
        <div className='flex w-9/12 flex-col justify-items-stretch gap-4'>
          <Button
            className='bg-gradient-to-r from-user-menu-blue-gradient-light to-user-menu-blue-gradient-dark font-bold text-white'
            onClick={() => navigate('./pick3')}
          >
            Pick 3
          </Button>
          <Button
            className='bg-gradient-to-r from-user-menu-blue-gradient-light to-user-menu-blue-gradient-dark font-bold text-white'
            onClick={() => navigate('./pick4')}
          >
            Pick 4
          </Button>
        </div>
      </div>
    </AnimateTransition>
  );
};
export default ChooseGamePage;
