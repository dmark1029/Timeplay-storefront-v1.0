import { useEffect, useRef } from 'react';

import anime from 'animejs';

type RippleEffectTextProps = {
  text: string;
  className?: string;
  trigger: boolean;
  onComplete?: () => void;
};

const RippleEffectText: React.FC<RippleEffectTextProps> = ({
  text,
  className,
  trigger,
  onComplete,
}) => {
  const textRef = useRef<HTMLHeadingElement>(null);
  const animationRef = useRef<anime.AnimeInstance | null>(null);

  useEffect(() => {
    if (!textRef.current) return;
    if (!trigger) return;
    const letters = textRef.current.querySelectorAll('span');

    animationRef.current = anime
      .timeline({
        loop: false,
        delay: anime.stagger(0, { start: 0 }),
        update: handleUpdate,
      })
      .add({
        targets: letters,
        scale: [
          { value: 1.3, duration: 500 },
          { value: 1, duration: 500 },
        ],
        opacity: [
          { value: 1, duration: 500 },
          { value: 1, duration: 500 },
        ],
        easing: 'easeInOutQuad',
        delay: anime.stagger(100),
      });
  }, [trigger, text]);

  const handleUpdate = (anim: anime.AnimeInstance) => {
    const remainingTime = anim.duration - anim.currentTime;
    if (remainingTime <= 500 && !anim.completed) {
      onComplete && onComplete();
    }
  };
  return (
    <span className={className} ref={textRef}>
      {text.split('').map((char, index) => (
        <span key={index} className='inline-block'>
          {char === ' ' ? <>&nbsp;</> : char}
        </span>
      ))}
    </span>
  );
};

export default RippleEffectText;
