import React, { useEffect, useState } from 'react';

import { CircularProgress } from '@nextui-org/react';

import { useGameContext } from '../context/game-context';

interface DateCountdownProps {
  targetDate: Date | undefined;
}

const DateCountdown: React.FC<DateCountdownProps> = ({ targetDate }) => {
  const { toLongDate } = useGameContext();
  const [countdown, setCountdown] = useState('');

  useEffect(() => {
    if (targetDate) {
      const intervalId = setInterval(() => {
        const now = new Date();
        const difference = targetDate.getTime() - now.getTime();

        if (difference > 0) {
          const days = Math.floor(difference / (1000 * 60 * 60) / 24);
          const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
          const minutes = Math.floor((difference / (1000 * 60)) % 60);
          const seconds = Math.floor((difference / 1000) % 60);
          if (days > 0) {
            setCountdown(toLongDate(targetDate));
          } else if (hours > 1) {
            setCountdown(`${hours} hours ${minutes} minutes`);
          } else {
            setCountdown(
              `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(
                seconds,
              ).padStart(2, '0')}`,
            );
          }
        } else {
          setCountdown('NOW!');
          clearInterval(intervalId);
        }
      }, 200);

      return () => clearInterval(intervalId);
    }
  }, [targetDate]);

  if (countdown === '') return <CircularProgress aria-label='Loading...' />;
  return countdown;
};

export default DateCountdown;
