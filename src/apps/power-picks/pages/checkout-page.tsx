import { useEffect, useState } from 'react';

import { Button, Card, CardBody, CardHeader } from '@nextui-org/react';
import { FiPlus } from 'react-icons/fi';
import { MdDelete, MdEdit } from 'react-icons/md';

import { AnimateTransition } from '@/components';

import CheckoutModal from '../components/checkout-modal';
import LottoBall from '../components/lotto-ball';
import PicksModal from '../components/picks-modal';
import { useGameContext } from '../context/game-context';
import { CheckoutLine } from '../types';

const PicksPage = () => {
  const { p3LinesCheckout, p4LinesCheckout, category, deleteLine, calculateLineValue } =
    useGameContext();
  const [checkout, setCheckout] = useState<CheckoutLine[]>([]);
  const [visible, setVisible] = useState(false);
  const [isAutoPick, setAutoPick] = useState(false);
  const [lineIndex, setLineIndex] = useState(-1);

  useEffect(() => {
    if (!visible) {
      setAutoPick(false);
    }
  }, [visible]);

  const editLine = (idx: number) => {
    setLineIndex(idx);
    setVisible(true);
  };

  useEffect(() => {
    switch (category) {
      case 'pick3':
        setCheckout(p3LinesCheckout);
        break;
      case 'pick4':
        setCheckout(p4LinesCheckout);
        break;
      default:
        break;
    }
    setLineIndex(-1); // reset line selection index if line was edited
  }, [category, p3LinesCheckout, p4LinesCheckout]);

  const renderCheckout = () => {
    return checkout.map((line, idx) => {
      let picks_made = true;
      if (
        (line.picks as (number | null)[]).includes(null) ||
        line.stake <= 0 ||
        line.line_type === ''
      ) {
        picks_made = false;
      }
      return (
        <Card
          key={idx}
          className={`flex w-full flex-row items-center justify-between bg-white p-4`}
        >
          <div className='flex w-full flex-col gap-2'>
            <div className='flex w-full flex-row items-center justify-between'>
              <h1 className='text-pp-text-light font-tempo text-lg font-black uppercase'>
                Line {idx + 1}
              </h1>
              <h1 className='text-pp-text-dark'>
                Stake: ${line.stake} (${calculateLineValue(line)})
              </h1>
              <h1 className='text-pp-text-dark font-bold capitalize'>{line.line_type}</h1>
            </div>
            <div className='flex flex-row items-center justify-between gap-2'>
              <div className='w-full'>
                <div className='flex flex-row gap-2'>
                  {line.picks.map((number, idx) => {
                    if (number === null) return <LottoBall key={idx} scale='tiny' />;
                    return <LottoBall key={idx} number={number.toString()} scale='tiny' />;
                  })}
                  {line.fireball_picked && (
                    <LottoBall scale='tiny' fireball={line.fireball_picked} />
                  )}
                </div>
              </div>
              <div className='flex flex-col gap-2'>
                {picks_made && (
                  <>
                    <button
                      className='text-pp-button-light flex h-8 w-8 items-center justify-center rounded-full'
                      onClick={() => editLine(idx)}
                    >
                      <MdEdit />
                    </button>
                    <button
                      className='text-pp-button-light flex h-8 w-8 items-center justify-center rounded-full'
                      onClick={() => deleteLine(checkout, idx, category)}
                    >
                      <MdDelete />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </Card>
      );
    });
  };

  const EmptyLine = () => {
    return (
      <Card className={`flex w-full items-center justify-center bg-slate-100`}>
        <CardHeader>
          <div className='flex w-full flex-row justify-between'>
            <h1 className='text-pp-text-dark font-tempo text-lg font-black uppercase'>
              Line {checkout.length + 1}
            </h1>
            <Button
              onClick={() => {
                setVisible(true);
                setAutoPick(true);
              }}
              className='from-pp-button-light bg-gradient-to-r to-user-menu-blue-gradient-dark font-bold text-white shadow-user-menu-blue-shadow'
            >
              Auto Pick
            </Button>
          </div>
        </CardHeader>
        <CardBody>
          <div className='flex flex-row justify-between gap-2'>
            <div className='flex w-full flex-col gap-4'>
              <div className='flex flex-row gap-2 pb-2 opacity-50'>
                {Array(category === 'pick3' ? 3 : category === 'pick4' ? 4 : 0)
                  .fill(null)
                  .map((_number, idx) => {
                    return <LottoBall key={idx} scale='small' isDisabled={true} />;
                  })}
              </div>
              <div className='flex w-full flex-col items-center'>
                <Button
                  isIconOnly
                  onClick={() => {
                    setVisible(true);
                    setAutoPick(false);
                  }}
                  className='from-pp-button-light min-h-[3rem] min-w-[3rem] rounded-full bg-gradient-to-r to-user-menu-blue-gradient-dark text-white shadow-user-menu-blue-shadow'
                >
                  <FiPlus size='60%' />
                </Button>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    );
  };

  return (
    <AnimateTransition initial={true} className='h-full w-full' duration={0.5}>
      <div className='flex h-full w-full flex-col gap-4 overflow-y-auto px-4 py-4'>
        <div className='flex flex-col items-center justify-center gap-4'>
          {renderCheckout()}
          {EmptyLine()}
          <div className='min-h-[4rem]'></div> {/* blank space for checkout button */}
        </div>
        <div className='absolute bottom-4 right-4 z-50 flex w-[calc(100%-2rem)] gap-4'>
          <CheckoutModal checkout={checkout} />
        </div>
      </div>
      <PicksModal
        visible={visible}
        setVisible={setVisible}
        lineIndex={lineIndex}
        setLineIndex={setLineIndex}
        isAutoPick={isAutoPick}
      />
    </AnimateTransition>
  );
};
export default PicksPage;
