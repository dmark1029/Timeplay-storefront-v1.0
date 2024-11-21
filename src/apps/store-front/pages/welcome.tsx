import { useEffect } from 'react';

import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import { timeplay } from '@/assets/images';
import { useAppContext } from '@/contexts/app-context';

const WelcomePage = () => {
  const { authAccount, shipsActiveSessions } = useAppContext();
  const navigate = useNavigate();

  const handleAnimationComplete = () => {
    console.log('Animation complete');
    if (!hasAuthAccount) {
      navigate('/login');
    } else {
      navigate('/lobby');
    }
  };

  const hasSessions = shipsActiveSessions.length > 0;
  const hasAuthAccount = authAccount?.isValid;

  useEffect(() => {}, [hasSessions, hasAuthAccount]);

  useEffect(() => {
    const metaThemeColor = document.querySelector("meta[name='theme-color']") as HTMLMetaElement;
    const prevThemeColor = metaThemeColor.content;
    metaThemeColor.content = '#000';

    return () => {
      metaThemeColor.content = prevThemeColor;
    };
  }, []);

  return (
    <div className='flex h-full w-full flex-col bg-black'>
      <motion.div
        className='flex h-full w-full items-center justify-center'
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: [0, 1, 1, 0], scale: [0.8, 1, 1, 0.8] }}
        transition={{ duration: 2 }}
        onAnimationComplete={handleAnimationComplete}
      >
        <img src={timeplay} alt='TimePlay logo' />
      </motion.div>
    </div>
  );
};

export default WelcomePage;
