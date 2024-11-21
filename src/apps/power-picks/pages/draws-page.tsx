import { useEffect, useState } from 'react';

import { Button, CircularProgress, Tab, Tabs } from '@nextui-org/react';
import { FiPlus } from 'react-icons/fi';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { AnimateTransition } from '@/components';

import DrawCountdown from '../components/draw-countdown';
import Draws from '../components/draws';
import PicksModal from '../components/picks-modal';
import { useGameContext } from '../context/game-context';
import { ships_service } from '../services/ships-service';
import { Draw } from '../types';

const DrawsPage = () => {
  const { hash } = useLocation();
  const {
    draws,
    setDraws,
    userPaticipatingdraws,
    setPaticipatingDraws,
    getUserParticipatingDraws,
  } = useGameContext();
  const [visible, setVisible] = useState(false);
  const { category } = useParams();
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState<string | number>(
    hash.length === 0 ? 'all-draws' : hash,
  );

  const [completedParticipatingDraws, setCPD] = useState<Draw[]>([]);
  const [upcomingParticipatingDraws, setUPD] = useState<Draw[]>([]);

  useEffect(() => {
    const now = new Date();
    const completedDraws: Draw[] = [];
    const upcomingDraws: Draw[] = [];

    userPaticipatingdraws?.forEach((draw) => {
      if (draw.draw_time < now) {
        completedDraws.push(draw);
      } else {
        upcomingDraws.push(draw);
      }
    });

    setCPD(completedDraws);
    setUPD(upcomingDraws);
  }, [userPaticipatingdraws]);

  useEffect(() => {
    switch (category) {
      case 'pick3':
        ships_service.getP3Draws().then((data) => {
          setDraws(data);
        });
        getUserParticipatingDraws('pick3').then((data) => {
          setPaticipatingDraws(data);
        });
        return;
      case 'pick4':
        ships_service.getP4Draws().then((data) => {
          setDraws(data);
        });
        getUserParticipatingDraws('pick4').then((data) => {
          setPaticipatingDraws(data);
        });
        return;
      default:
        return;
    }
  }, [category, selectedTab]);

  if (!draws)
    return (
      <div className='flex h-full w-full items-center justify-center'>
        <CircularProgress aria-label='Loading...' />
      </div>
    );

  const timeToShowLiveDraw = 60 * 60 * 1000 * 1; // 1 hour
  let time_difference = null;
  if (draws.length !== 0) {
    const now = new Date();
    time_difference = draws[0].draw_time.getTime() - now.getTime();
  }

  return (
    <AnimateTransition initial={true} className='h-full w-full' duration={0.5}>
      <div className='flex h-full w-full flex-col gap-4 overflow-y-auto px-4 py-4'>
        {draws.length !== 0 ? (
          <DrawCountdown targetDate={draws[0].draw_time}></DrawCountdown>
        ) : (
          <></>
        )}
        <Tabs
          classNames={{
            base: 'justify-center',
            tabList: 'w-full',
            panel: 'p-0',
          }}
          aria-label='Draw Options'
          selectedKey={selectedTab}
          onSelectionChange={setSelectedTab}
        >
          <Tab key='#your-draws' title='Your Draws'>
            <div className='flex flex-col gap-2'>
              <div className='flex items-center gap-2'>
                <span className='ml-2'>Upcoming</span>
                <hr className='flex-1 border-t border-gray-500' />
              </div>
              <Draws draws={upcomingParticipatingDraws} />
              <div className='flex items-center gap-2'>
                <span className='ml-2'>Completed</span>
                <hr className='flex-1 border-t border-gray-500' />
              </div>
              <Draws draws={completedParticipatingDraws} isCompleted />
            </div>
          </Tab>
          <Tab key='#all-draws' title='All Draws'>
            <Draws draws={draws} />
          </Tab>
        </Tabs>
        <div className='min-h-[9rem]'></div>
      </div>
      <div className='absolute bottom-4 z-50 flex w-full flex-col gap-4 px-4 pointer-events-none'>
        <div className='flex flex-row-reverse'>
          <Button
            isIconOnly
            onClick={() => setVisible(true)}
            className='min-h-[4rem] min-w-[4rem] rounded-full bg-gradient-to-r from-user-menu-blue-gradient-light to-user-menu-blue-gradient-dark text-white shadow-user-menu-blue-shadow pointer-events-auto'
          >
            <FiPlus size='60%' />
          </Button>
          <PicksModal
            afterGenerationFunc={() => navigate('../lines')}
            visible={visible}
            setVisible={setVisible}
          />
        </div>
        {time_difference && time_difference <= timeToShowLiveDraw && (
          <Button
            className='min-h-[4rem] bg-gradient-to-r from-user-menu-blue-gradient-light to-user-menu-blue-gradient-dark font-tempo text-2xl text-white shadow-user-menu-blue-shadow pointer-events-auto'
            onClick={() => navigate(`../livedraw/${draws[0].id}`)}
          >
            Live Draw
          </Button>
        )}
      </div>
    </AnimateTransition>
  );
};
export default DrawsPage;
