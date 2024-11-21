import { AnimatePresence, motion } from 'framer-motion';

import { cn } from '@/utils/cn';

type AnimateTransitionProps = {
  transitionKey?: string;
  children: React.ReactNode;
  initial?: boolean;
  className?: string;
  duration?: number;
};

const variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const AnimateTransition: React.FC<AnimateTransitionProps> = ({
  transitionKey = 'default',
  children,
  initial = false,
  className,
  duration = 0.2,
}) => {
  return (
    <AnimatePresence mode='wait' initial={initial}>
      <motion.div
        key={transitionKey}
        variants={variants}
        initial='hidden'
        animate='visible'
        transition={{ duration }}
        exit='hidden'
        className={cn('flex h-full w-full flex-col', className)}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};
export default AnimateTransition;
