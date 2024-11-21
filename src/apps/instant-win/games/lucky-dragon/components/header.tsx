import { AnimatePresence, motion } from 'framer-motion';

import { useGameContext } from '@/apps/instant-win/context/game-context';
import { cn } from '@/utils/cn';

import { gameLogo } from '../assets';

type HeaderProps = {
  className?: string;
  children?: React.ReactNode;
};
const Header: React.FC<HeaderProps> = ({ className }) => {
  const { topPrize } = useGameContext();

  return (
    <header className={cn(`flex h-full w-full flex-col items-center justify-center`, className)}>
      <img
        src={gameLogo}
        className='aspect-auto h-[60%] object-contain'
        aria-label='deal or no deal title'
      />
      <svg className='h-10 w-full'>
        <defs>
          <linearGradient id='gradient-1' x1='0' y1='0' x2='1' y2='0'>
            <stop offset='0%' stopColor='#F7DC44' />
            <stop offset='100%' stopColor='#FDF6BE' />
          </linearGradient>
        </defs>
        <g>
          <text
            x='50%'
            y='50%'
            textAnchor='end'
            dominantBaseline='middle'
            style={{ fill: 'url(#gradient-1)' }}
            className='dondDefaultText h-12 stroke-amber-200 stroke-[0.5] text-xl font-black uppercase tracking-tight drop-shadow-[3px_3px_5px_rgba(0,0,0,0.9)]'
          >
            Win up to
          </text>
          <AnimatePresence mode='wait'>
            <motion.text
              key={topPrize}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              x='53%'
              y='50%'
              textAnchor='start'
              dominantBaseline='middle'
              style={{ fill: 'url(#gradient-1)' }}
              className='dondDefaultText h-12 stroke-amber-200 stroke-[0.5] text-xl font-black tracking-wide drop-shadow-[3px_3px_5px_rgba(0,0,0,0.9)]'
            >
              {`${topPrize}!`}
            </motion.text>
          </AnimatePresence>
        </g>
      </svg>
    </header>
  );
};

export default Header;
