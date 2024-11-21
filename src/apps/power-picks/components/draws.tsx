import { useEffect, useState } from 'react';

import { Accordion, AccordionItem, CircularProgress } from '@nextui-org/react';

import { useGameContext } from '../context/game-context';
import { Draw } from '../types';
import DateCountdown from './date-countdown';
import LottoBall from './lotto-ball';
import Tickets from './tickets';

interface DrawsAccordionProps {
  draws: Draw[] | null;
  isCompleted?: boolean;
}

const Draws: React.FC<DrawsAccordionProps> = ({ draws = null, isCompleted = false }) => {
  const { setSelectedDraw, toLongDate } = useGameContext();
  const [selectedKeys, setSelectedKeys] = useState(
    isCompleted || draws === null || (draws !== null && draws.length === 0)
      ? new Set<string>()
      : new Set([`${draws[0].id}`]),
  );

  useEffect(() => {
    setSelectedDraw(selectedKeys.keys().next().value);
  }, [selectedKeys]);

  if (!draws)
    return (
      <div className='flex h-full w-full items-center justify-center'>
        <CircularProgress aria-label='Loading...' />
      </div>
    );
  else if (draws.length === 0 && isCompleted)
    return (
      <div className='flex w-full items-center justify-center'>
        <h1>No Completed Draws...</h1>
      </div>
    );
  else if (draws.length === 0 && !isCompleted)
    return (
      <div className='flex w-full items-center justify-center'>
        <h1>No Upcoming Draws...</h1>
      </div>
    );

  const now = new Date();

  return (
    <>
      <Accordion
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys as any}
        variant='splitted'
        className='p-0'
      >
        {draws.map((draw) => {
          const outcome_exists =
            draw.outcome !== null && draw.draw_time.getTime() - now.getTime() < 0;
          return (
            <AccordionItem
              className={`${
                selectedKeys.has(`${draw.id}`) ? '!bg-white' : '!bg-zinc-50'
              } !shadow-none`}
              key={`${draw.id}`}
              title={<p className='font-bold'>{toLongDate(draw.draw_time)}</p>}
              textValue={toLongDate(draw.draw_time)}
              subtitle={
                <>
                  <p>Draw: {draw.id}</p>
                  {outcome_exists && (
                    <div className='relative flex flex-row justify-center gap-2 pt-4'>
                      {draw.outcome.map((number, idx) => (
                        <LottoBall key={idx} number={number?.toString()} scale='small' />
                      ))}
                      <LottoBall
                        scale='small'
                        fireball={true}
                        number={draw.fireball_outcome.toString()}
                      />
                    </div>
                  )}
                </>
              }
            >
              {/* enforce minimum size of accordion */}
              <div
                className={`${
                  !outcome_exists ? 'min-h-[8rem]' : 'min-h-[5rem]'
                } flex flex-col justify-around`}
              >
                {!outcome_exists && (
                  <div className='flex max-h-[3rem] min-h-[3rem] items-center justify-center text-lg'>
                    <DateCountdown targetDate={draw.draw_time} />
                  </div>
                )}
                <div className='flex min-h-[5rem] items-center justify-center text-lg'>
                  <Tickets
                    className='!bg-pp-background'
                    match_lines={
                      draw.outcome && {
                        outcome: draw.outcome as number[],
                        fireball: draw.fireball_outcome as number,
                      }
                    }
                    drawID={draw.id}
                  ></Tickets>
                </div>
              </div>
            </AccordionItem>
          );
        })}
      </Accordion>
    </>
  );
};
export default Draws;
