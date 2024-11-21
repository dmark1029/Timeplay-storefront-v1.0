import { ReactElement, useEffect, useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';

import { useGameContext } from '../context/game-context';

type SwipeableTicketProps = {
  children: ReactElement<any>[];
  override?: number;
  motionDivClass?: string;
  className: string;
  mode?: SwipeMode;
  toggle?: boolean;
};

enum SwipeMode {
  Automatic = 0,
  Manual = 1,
}

const SwipeableTicket: React.FC<SwipeableTicketProps> = ({
  children,
  override,
  className,
  mode,
  toggle,
}) => {
  const { instance } = useGameContext();
  const variants = {
    default: { x: [0, 0] },
    out: { x: -500 },
  };

  const [direction, setDirection] = useState<'out' | 'default'>('default');
  const [key, setKey] = useState<string>('');

  function ticketReturn() {
    setDirection('default');
  }
  const getAnimateMode = () => {
    if (mode === SwipeMode.Manual) {
      if (toggle) {
        return 'out';
      }
      return 'default';
    } else {
      return 'out';
    }
  };

  useEffect(() => {
    if (mode === SwipeMode.Automatic) {
      if (direction == 'default') {
        setDirection('out');
      }
    }
  }, [instance, override]);

  // sets the key when theres a new instance.
  useEffect(() => {
    if (!!instance) {
      setKey(instance.instance_id);
    }
  }, [instance]);

  return (
    <div className='relative w-full overflow-hidden'>
      <AnimatePresence initial={false} mode='wait'>
        <motion.div
          key={`card'-${key}`}
          variants={variants}
          initial='default'
          exit={mode === SwipeMode.Automatic ? 'out' : 'default'}
          animate={getAnimateMode()}
          onAnimationComplete={ticketReturn}
          transition={{ duration: 0.75, type: 'spring' }}
          className={'m-0 flex flex-row p-0 '}
        >
          <div className={className}>{children}</div>
          <div
            style={{ position: 'absolute', left: 500 }}
            className={className}
            hidden={direction == 'default'}
          >
            {children}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
export default SwipeableTicket;
