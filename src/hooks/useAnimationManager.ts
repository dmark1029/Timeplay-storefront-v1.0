import { useEffect, useRef, useState } from 'react';

import { Animation } from '@/utils/types';

type AnimationManager = {
  queue: Animation[];
  currentAnimation: Animation | undefined;
};

const useAnimationManager = () => {
  const [animationManager, setAnimationManager] = useState<AnimationManager>({
    currentAnimation: undefined,
    queue: [],
  });
  const timeouts = useRef<NodeJS.Timeout[]>([]);

  const addAnimation = (animation: Animation) => {
    setAnimationManager((prevAnimationManager) => {
      const newQueue = [...prevAnimationManager.queue, animation];
      return {
        ...prevAnimationManager,
        queue: newQueue,
      };
    });
  };

  const setNextAnimation = () => {
    setAnimationManager((prevAnimationManager) => {
      if (!!prevAnimationManager.queue?.length) {
        const [nextAnimation, ...newQueue] = prevAnimationManager.queue;
        return {
          ...prevAnimationManager,
          currentAnimation: nextAnimation,
          queue: newQueue,
        };
      }
      return prevAnimationManager;
    });
  };

  const playAnimation = () => {
    if (!!animationManager.currentAnimation) {
      animationManager.currentAnimation.setIsPlaying(true);

      const timeout = setTimeout(
        () => {
          animationManager.currentAnimation?.setIsPlaying(false);
          setAnimationManager((prevAnimationManager) => ({
            ...prevAnimationManager,
            currentAnimation: undefined,
          }));
          animationManager.currentAnimation?.onComplete?.();
        },
        animationManager.currentAnimation?.duration || 0,
      );
      timeouts.current.push(timeout);
    }
  };

  useEffect(() => {
    if (!animationManager.currentAnimation && !!animationManager.queue?.length) {
      setNextAnimation();
    }
  }, [animationManager]);

  useEffect(() => {
    if (!!animationManager.currentAnimation) {
      playAnimation();
    }
  }, [animationManager.currentAnimation]);

  useEffect(() => {
    return () => {
      timeouts.current.forEach((timeout) => {
        clearTimeout(timeout);
      });
      timeouts.current = [];
    };
  }, []);

  return { addAnimation };
};

export default useAnimationManager;
