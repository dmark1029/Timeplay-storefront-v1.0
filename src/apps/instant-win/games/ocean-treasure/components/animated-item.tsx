import { AnimatePresence, motion } from 'framer-motion';

import { cn } from '@/utils/cn';

type AnimatedItemProps = {
  transitionKey: string;
  children: React.ReactNode;
  initial?: boolean;
  className?: string;
  variants?: any;
};

const defaultVariants = {
  initial: { opacity: 0, scale: 1.5 },
  animate: { opacity: 1, scale: 1 },
};

const AnimatedItem: React.FC<AnimatedItemProps> = ({
  transitionKey,
  children,
  initial = false,
  className,
  variants = defaultVariants,
}) => {
  return (
    <AnimatePresence mode='popLayout' initial={initial}>
      <motion.div
        key={transitionKey}
        variants={variants}
        initial='initial'
        animate='animate'
        exit='initial'
        transition={{ duration: 0.2 }}
        className={cn('flex h-full w-full flex-col', className)}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};
export default AnimatedItem;
