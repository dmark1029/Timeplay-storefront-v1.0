import { cn } from '@/utils/cn';

import { useGameContext } from '../../../context/game-context';

type LoadingProps = {
  className?: string;
};
const Loading: React.FC<LoadingProps> = ({ className }) => {
  const { isFetchingData } = useGameContext();
  if (!isFetchingData) return null;
  return (
    <div
      className={cn(
        'absolute inset-0 z-30 flex items-center justify-center bg-black/50 backdrop-blur-sm',
        className,
      )}
    >
      Loading...
    </div>
  );
};
export default Loading;
