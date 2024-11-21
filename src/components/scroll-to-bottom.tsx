import { useEffect, useRef, useState } from 'react';

type ScrollToBottomComponentProps = {
  onBottomScrollEnter: () => void;
  onBottomScrollLeave: () => void;
  endOfContentLabel?: string;
  children: React.ReactNode;
};

export const ScrollToBottomComponent: React.FC<ScrollToBottomComponentProps> = ({
  onBottomScrollEnter,
  onBottomScrollLeave,
  endOfContentLabel,
  children,
}) => {
  const [isAtBottom, setIsAtBottom] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) {
      return;
    }
    // TODO: The original check was `container.scrollHeight - container.scrollTop <= container.clientHeight`
    // but this does not work for some devices. Preferably, we should look into root cause of this and fix.
    // For now, relax the check so that if it's near the bottom, it'll still activate.
    const isBottom = container.scrollHeight - container.scrollTop <= (container.clientHeight + 400);
    if (isBottom !== isAtBottom) {
      if (isBottom) {
        onBottomScrollEnter();
      } else {
        onBottomScrollLeave();
      }
    }
    setIsAtBottom(isBottom);
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) {
      return;
    }
    container.addEventListener('scroll', handleScroll);

    // Clean up the event listener on component unmount or when isAtBottom value changes
    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [isAtBottom]);

  return (
    <div ref={scrollContainerRef} style={{ overflowY: 'scroll' }}>
      {children}
      <div className='sr-only relative'>
        {endOfContentLabel ?? 'You have reached the end of the content.'}
      </div>
    </div>
  );
};
