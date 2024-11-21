import { useEffect, useRef, useState } from 'react';

import { Button, CircularProgress } from '@nextui-org/react';
import clsx from 'clsx';
import { FiPlus } from 'react-icons/fi';
import { useNavigate, useParams } from 'react-router-dom';

import { AnimateTransition } from '@/components';

import { pick3LogoLong, pick4LogoLong } from '../assets';
import '../components/animation-code/animation.css';
import DateCountdown from '../components/date-countdown';
import LottoBall from '../components/lotto-ball';
import PicksModal from '../components/picks-modal';
import Tickets from '../components/tickets';
import { useGameContext } from '../context/game-context';
import { ships_service } from '../services/ships-service';
import { Draw, LottoBallAnimation } from '../types';

type BallStates = {
  hidden: boolean;
  fireball: boolean;
  number: string;
};

const LiveDrawPage = () => {
  const ballDelay = 600;
  const { category, setSelectedDraw, liveDrawTickets } = useGameContext();
  const [outcome, setOutcome] = useState<number[] | undefined>(undefined);
  const [isDrawComplete, setDrawComplete] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [draw, setDraw] = useState<Draw>();
  const [drawID, setDrawID] = useState<number>();
  const [intervalID, setIntervalID] = useState<NodeJS.Timeout>();
  const [visible, setVisible] = useState(false);
  const [ballStates, setBallStates] = useState<BallStates[] | undefined>(undefined);
  const [isFadingOut, setIsFadingOut] = useState<boolean>(false);
  const [isDrawFound, setIsDrawFound] = useState<boolean>(true); // only set to false if no draw found
  const hasRevealedBalls = useRef(false);
  let getDraw = ships_service.getDrawById;

  const params = useParams();
  const navigate = useNavigate();

  const getMockOutcome = (category: string) => {
    const ballStates: BallStates[] = [];
    switch (category) {
      case 'pick3':
        ballStates.push(
          { fireball: false, hidden: false, number: '?' },
          { fireball: false, hidden: false, number: '?' },
          { fireball: false, hidden: false, number: '?' },
          { fireball: true, hidden: false, number: '?' },
        );
        break;
      case 'pick4':
        ballStates.push(
          { fireball: false, hidden: false, number: '?' },
          { fireball: false, hidden: false, number: '?' },
          { fireball: false, hidden: false, number: '?' },
          { fireball: false, hidden: false, number: '?' },
          { fireball: true, hidden: false, number: '?' },
        );
        break;
    }
    return ballStates;
  };

  const revealBalls = () => {
    if (ballStates) {
      ballStates.forEach((_, index) => {
        setTimeout(() => {
          setBallStates(
            (prevStates) =>
              prevStates?.map((state, idx) =>
                idx === index ? { ...state, hidden: false } : state,
              ),
          );
        }, index * ballDelay);
      });
    }
  };

  const renderUpcomingDrawDisplay = (
    <>
      {!isLoading ? (
        getMockOutcome(category).map((state, idx) => (
          <LottoBall
            key={idx}
            number={state.number}
            scale='small'
            fireball={state.fireball}
            hidden={state.hidden}
            ballContainerAnimation={isFadingOut ? LottoBallAnimation.FADE : undefined}
          />
        ))
      ) : (
        <div className='flex w-full items-center justify-center'>
          <CircularProgress aria-label='Loading...' />
        </div>
      )}
    </>
  );

  const renderCompletedDrawDisplay = (
    <>
      {ballStates?.map((state, idx) => (
        <LottoBall
          key={idx}
          number={state.number}
          scale='small'
          fireball={state.fireball}
          ballAnimation={LottoBallAnimation.ROLL}
          ballContainerAnimation={LottoBallAnimation.SLIDE}
          hidden={state.hidden}
        />
      ))}
    </>
  );

  const renderDrawDisplay = () => {
    return !!ballStates ? renderCompletedDrawDisplay : renderUpcomingDrawDisplay;
  };

  useEffect(() => {
    let { drawID } = params;
    if (drawID) {
      let dID = parseInt(drawID);
      setDrawID(dID);
    }
  }, [params]);

  useEffect(() => {
    if (drawID) {
      setSelectedDraw(`${drawID}`);
      const intervalId = setInterval(async () => {
        let getDrawResponse = await getDraw(drawID);
        if (getDrawResponse.status === 200) {
          let currentDraw = getDrawResponse.data.data;
          setDraw(currentDraw);
          setLoading(false);
          if (currentDraw?.outcome) {
            setOutcome(currentDraw.outcome);
            setDrawComplete(true);
          }
        } else if (getDrawResponse.status === 404) {
          console.error(`Draw [${drawID}] not found`);
          setIsDrawFound(false);
          clearInterval(intervalId);
        }
      }, 1000);
      setIntervalID(intervalId);
      return () => clearInterval(intervalId);
    }
  }, [drawID]);

  const payoutSum = liveDrawTickets.reduce((total, ticket) => {
    return (
      total +
      ticket.lines.reduce((lineTotal, line) => {
        const payout = line.prizes?.find((prize) => prize.draw_id === drawID)?.amount || 0;
        return lineTotal + payout;
      }, 0)
    );
  }, 0);

  // creates an array of ballstates
  useEffect(() => {
    if (isDrawComplete && outcome) {
      const initBallStates = () => {
        // iterate the outcome and create a ballstate object for each number, then add to array
        const ballStates = outcome.map((number) => {
          const state: BallStates = { hidden: true, fireball: false, number: number.toString() };
          return state;
        });

        // add the fireball
        if (draw?.fireball_outcome !== undefined || draw?.fireball_outcome !== null) {
          ballStates.push({ hidden: true, fireball: true, number: `${draw?.fireball_outcome}` });
        }

        setBallStates(ballStates);
        setIsFadingOut(false);
      };
      clearInterval(intervalID);
      setIsFadingOut(true);

      if (!isLoading) {
        initBallStates();
      } else {
        setTimeout(() => {
          initBallStates();
        }, 750);
      }
    }
  }, [isDrawComplete, outcome]);

  // once ballStates is set, if we havent toggled the animaton, do
  useEffect(() => {
    if (!hasRevealedBalls.current && !!ballStates) {
      hasRevealedBalls.current = true;
      setTimeout(() => {
        revealBalls();
      }, 500);
    }
  }, [ballStates]);

  return (
    <AnimateTransition initial={true} className='h-full w-full' duration={0.5}>
      <div className='flex h-full w-full flex-col gap-4 p-4'>
        <div className='box-border flex flex-col items-center gap-2 rounded-large bg-white p-4'>
          {category === 'pick3' && <img className='px-6 py-2' src={pick3LogoLong} />}
          {category === 'pick4' && <img className='px-6 py-2' src={pick4LogoLong} />}
          {isDrawFound ? (
            <>
              <p className='font-tempo text-lg uppercase text-pp-text-dark'>Next Draw In</p>
              {draw && (
                <h1 className='text-lg font-bold'>
                  <DateCountdown targetDate={new Date(draw.draw_time)}></DateCountdown>
                </h1>
              )}
              <div className='flex w-full justify-center overflow-x-clip'>
                <div className='flex flex-row gap-2'>{renderDrawDisplay()}</div>
              </div>
            </>
          ) : (
            <p className='font-tempo text-2xl'>Draw not found or was cancelled.</p>
          )}
          {isDrawComplete && (
            <>
              {payoutSum !== 0 && <p className='font-tempo text-2xl'>Congratulations!</p>}
              {liveDrawTickets.length !== 0 && (
                <>
                  {payoutSum !== 0 ? (
                    <p className='font-bold text-pp-ball-match-dark'>You Won ${payoutSum}</p>
                  ) : (
                    <p>Better Luck Next Time...</p>
                  )}
                </>
              )}
            </>
          )}
        </div>
        <div
          className={clsx(
            { 'mb-[8rem]': isDrawComplete },
            { 'h-full': true },
            { 'overflow-y-auto': true },
          )}
        >
          <div className='relative flex h-full flex-col gap-2'>
            {drawID && outcome !== null ? (
              <Tickets
                useContext
                key={`${isDrawComplete}`}
                classNames={{ lines: 'bg-pp-background' }}
                match_lines={{
                  outcome: outcome as number[],
                  fireball: draw?.fireball_outcome as number,
                }}
                drawID={drawID}
              ></Tickets>
            ) : (
              <div className='flex h-full items-center justify-center'>
                <CircularProgress aria-label='Loading...' />
              </div>
            )}
          </div>
        </div>
      </div>
      <div className='absolute bottom-0 z-50 flex w-full flex-col'>
        {isDrawComplete ? (
          <div className='flex min-h-[8rem] flex-col items-center justify-center gap-2 rounded-t-2xl bg-white'>
            <h1 className='text-lg font-bold text-blue-950'>Game Complete!</h1>
            <Button
              onClick={() => navigate(-1)}
              className='h-[3.25rem] w-10/12 bg-gradient-to-r from-user-menu-blue-gradient-light to-user-menu-blue-gradient-dark text-xl font-bold text-white shadow-lg'
            >
              Play On
            </Button>
          </div>
        ) : (
          <div className='flex flex-row-reverse p-4'>
            <Button
              isIconOnly
              onClick={() => setVisible(true)}
              className='min-h-[4rem] min-w-[4rem] rounded-full bg-gradient-to-r from-user-menu-blue-gradient-light to-user-menu-blue-gradient-dark text-white'
            >
              <FiPlus size='60%' />
            </Button>
            <PicksModal
              afterGenerationFunc={() => navigate('../lines')}
              visible={visible}
              setVisible={setVisible}
            />
          </div>
        )}
      </div>
    </AnimateTransition>
  );
};
export default LiveDrawPage;
