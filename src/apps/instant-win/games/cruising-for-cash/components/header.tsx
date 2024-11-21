import { motion } from 'framer-motion';

import { useGameContext } from '@/apps/instant-win/context/game-context';
import { cn } from '@/utils/cn';

import { headerImg } from '../assets';

type HeaderProps = {
  className?: string;
  children?: React.ReactNode;
};

const Header: React.FC<HeaderProps> = ({ className }) => {
  const { topPrize } = useGameContext();
  const textStrokeStyle = {
    WebkitTextStroke: '0.4px white', // Stroke width and color for WebKit browsers
    textShadow: `
      -0.4px -0.4px 0 white,
       0.4px -0.4px 0 white,
      -0.4px  0.4px 0 white,
       0.4px  0.4px 0 white
    `, // Shadow fallback for other browsers
  };

  return (
    <header
      className={cn(
        `flex h-[5%] w-full flex-col items-center justify-center sm-h:h-[20%] md-h:h-[10%] md-h:pt-2`,
        className,
      )}
    >
      <img
        src={headerImg}
        className='absolute top-0 mx-auto aspect-auto w-[65%] object-contain justify-center'
        alt='Cruising for Cash'
      />
      <div className='flex h-full w-full items-end justify-center'>
        <h2
          className='font-tempo text-base font-extrabold uppercase -tracking-wider text-cfc-red drop-shadow-lg md-h:text-xl'
          style={textStrokeStyle}
        >
          <span>
            Win a <span className='text-3xl'>cruise</span> or
          </span>
          <span> Win up to</span>
          {topPrize && (
            <motion.span
              key={topPrize}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className={`ml-2 ${topPrize.length > 12 ? 'text-xl' : 'text-3xl'}`}
            >{`${topPrize}!`}</motion.span>
          )}
        </h2>
      </div>
    </header>
  );
};

export default Header;
