import { AnimatePresence, motion } from 'framer-motion';

import { useGameContext } from '@/apps/instant-win/context/game-context';
import { cn } from '@/utils/cn';

import { headerImg } from '../assets';

type HeaderProps = {
  className?: string;
  children?: React.ReactNode;
};
const Header: React.FC<HeaderProps> = ({ className }) => {
  const { topPrize } = useGameContext();

  return (
    <header
      className={cn(
        `flex w-full flex-col items-center justify-center gap-2 sm-h:gap-0 md-h:gap-6 md-h:pt-2`,
        className,
      )}
    >
      <h1>
        <img
          src={headerImg}
          className='aspect-auto h-20 object-contain md-h:h-32'
          alt='Ocean Treasure Hunt'
        />
      </h1>
      <div className='relative flex h-12 items-center justify-center text-nowrap text-center'>
        <p className='OTHpreviewTopPrize h-12 pr-1 text-4xl font-black tracking-tighter md-h:text-4xl'>
          {'Win up to '}
        </p>
        <AnimatePresence mode='wait'>
          <motion.p
            key={topPrize}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className='OTHpreviewTopPrize h-12 text-4xl font-black tracking-tighter md-h:text-4xl'
          >
            {`${topPrize}!`}
          </motion.p>
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;
