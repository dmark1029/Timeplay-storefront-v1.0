import { motion } from 'framer-motion';

import { cn } from '@/utils/cn';

type WinningItemMotionProps = {
  className?: string;
  children: React.ReactNode;
  isAnimated?: boolean;
  minScale?: number;
  maxScale?: number;
};

const Pulse: React.FC<WinningItemMotionProps> = ({
  className = '',
  children,
  isAnimated,
  minScale = 0.9,
  maxScale = 1.1,
}) => {
  return (
    <motion.div
      animate={isAnimated ? { scale: [minScale, maxScale, maxScale, minScale] } : { scale: 1 }}
      transition={{
        duration: 1.5,
        repeat: isAnimated ? Infinity : 0,
        repeatType: 'reverse',
        ease: 'easeInOut',
      }}
      className={cn('', className)}
    >
      {children}
    </motion.div>
  );
};
export default Pulse;
