import { useEffect, useRef, useState } from 'react';

import { useAnimationContext } from '@/apps/instant-win/context/animation-context';
import { useGameContext } from '@/apps/instant-win/context/game-context';
import { useStoreFrontContext } from '@/apps/store-front';
import { useAppContext } from '@/contexts/app-context';
import { Loops, Sfx, useAudioContext } from '@/contexts/audio-context';
import { useDialogContext } from '@/contexts/dialog-context';
import { usdFormatter } from '@/utils/util';

import '../../animation-code/animations.css';
import {
  bonusSymbolImg1,
  bonusTextImg,
  chests,
  downArrow,
  headerImg,
  match3Sign,
  oddsBg,
  oddsOfWinning,
  previewBG,
  previewBg,
  pufferfish,
  pufferfishiOS,
  ticketPrice,
  winningSymbolsTextImg,
} from '../../assets';
import { pufferfishStatic } from '../../assets';

const PreviewBackground = () => {
  const [videoError, setVideoError] = useState<boolean>(false);

  return (
    <div className='background'>
      {videoError ? (
        <img className={'h-full w-full object-cover'} src={previewBG} alt='' />
      ) : (
        <video
          muted
          autoPlay
          loop
          playsInline
          aria-hidden={true}
          poster={previewBG}
          onError={() => {
            setVideoError(true);
          }}
        >
          <source src={previewBg} type='video/mp4' />
        </video>
      )}
    </div>
  );
};

interface HeaderProps {
  handleClosePreview?: () => void;
}

const Header: React.FC<HeaderProps> = ({ handleClosePreview }) => {
  const [previewTopPrize, setPreviewTopPrize] = useState('');
  const { balance } = useAppContext();

  useEffect(() => {
    setPreviewTopPrize('$50,000!');
  }, []);
  return (
    <>
      <div className={'header'}>
        <h1 className='logoContainer'>
          <img src={headerImg} alt='Ocean Treasure Hunt' />
        </h1>
        <p
          className={
            'OTHpreviewTopPrize h-12 -translate-x-[3px] text-[2.45rem] font-black -tracking-wide md-h:text-4xl'
          }
        >
          Win up to {previewTopPrize}
        </p>
      </div>
      <section className='playNow font-tempo'>
        <button
          className='OTHplayNowButton flex flex-col focus:z-10 focus:outline-2 focus:outline-offset-2 focus:outline-white'
          onClick={handleClosePreview}
          onKeyDown={(event) => {
            (event.key == ' ' || event.key == 'Enter') &&
              handleClosePreview &&
              handleClosePreview();
          }}
        >
          <p className='text-2xl leading-6'>Play Now</p>
          <p className='font-roboto text-xs'>
            Balance: {usdFormatter.format(balance?.casino_available_balance || 0)}
          </p>
        </button>
      </section>
    </>
  );
};

const Preview = () => {
  const { handleSetGameInfoDialog } = useDialogContext();
  const { getGameData, gameId } = useStoreFrontContext();
  const [price, setPrice] = useState('');
  const [odds, setOdds] = useState('');
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [isBottom, setIsBottom] = useState(false);
  const { prefersReducedMotion } = useGameContext();
  const { isIOS } = useAppContext();

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 20) {
        setIsBottom(true);
      } else {
        setIsBottom(false);
      }
    }
  };

  const handleGameInfo = () => {
    if (!!gameId) {
      const game = getGameData(gameId);
      if (game) {
        handleSetGameInfoDialog({
          game: game,
          type: 'game-info',
          isIOS: isIOS,
        });
        scrollToPayouts();
      }
    }
  };

  const handleGameInfoKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      handleGameInfo();
    }
  };

  const scrollToPayouts = () => {
    const element = document.getElementById('payouts');
    if (element) {
      setTimeout(() => {
        element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      // if the element isn't found retry
      requestAnimationFrame(scrollToPayouts);
    }
  };

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
    }

    // Cleanup the event listener
    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  useEffect(() => {
    setPrice('$2 - $10');
    setOdds('1 in 4.20');
  }, []);

  return (
    <>
      <div className={'preview'}>
        <div className={'content'} ref={scrollRef}>
          {/* Lucky symbols */}

          <section className='luckySymbols'>
            <h2 className='sign'>
              <img src={winningSymbolsTextImg} alt='Winning Symbols' />
            </h2>
            <div className='instructions'>
              <div className='text font-roboto font-medium'>
                <p>
                  Scratch off each sea creature to reveal a symbol and $ value behind. Match any{' '}
                  <span>winning symbols</span> to <span>your symbols</span> and the $ amount is
                  yours!
                </p>
              </div>
              <div className='pufferfish'>
                {!prefersReducedMotion ? (
                  <video muted autoPlay loop aria-hidden={true} playsInline>
                    <source src={pufferfishiOS} type={'video/quicktime'} />
                    <source src={pufferfish} type={'video/webm'} />
                  </video>
                ) : (
                  <img
                    src={pufferfishStatic}
                    alt='Each scratch area inside the Winning symbols and Your symbols sections is a sea creature, such as a pufferfish'
                  />
                )}
              </div>
            </div>
          </section>

          {/* Match 3 */}

          <section className='match3'>
            <h2 className='sign'>
              <img src={match3Sign} alt='Match 3' />
            </h2>
            <div className='instructions'>
              <div className='text font-roboto font-medium'>
                <p>
                  Scratch all 3 treasure chests. If <span>all 3 match</span>, then you win the cash
                  amount hidden behind the $ symbol.
                </p>
              </div>
              <div className='chests'>
                <img
                  src={chests}
                  alt='Each scratch area inside the Match three section is an opened purple treasure chest with golden coins inside'
                />
              </div>
            </div>
          </section>

          {/* Bonus */}

          <section className='bonus'>
            <h2 className='sign'>
              <img src={bonusTextImg} alt='Bonus' />
            </h2>
            <div className='instructions'>
              <div className='bonusText flex  px-4 font-roboto font-medium'>
                <p>Tap the bottle to uncork and reveal the message inside.</p>
              </div>
              <div className='bottle'>
                <img
                  src={bonusSymbolImg1}
                  alt='The scratch area inside the Bonus section is a transparent, corked bottle with a scroll inside'
                />
              </div>
            </div>
          </section>

          {/* Ticket price */}

          <section className='OTHticketPrice'>
            <h2 className='sign'>
              <img src={ticketPrice} alt='Ticket Price' />
            </h2>
            <div className='text'>
              <p>{price}</p>
            </div>
          </section>

          {/* Odds */}

          <section className='OTHodds'>
            <h2 className='sign'>
              <img src={oddsBg} alt='Overall odds per game' />
            </h2>
            <div className='text'>
              <p>{odds}</p>
            </div>
          </section>

          {/* Odds extras */}

          <section className='oddsExtras'>
            <button
              onClick={handleGameInfo}
              onKeyDown={handleGameInfoKeyDown}
              className='oddsExtrasImageContainer  focus:z-10 focus:outline-2 focus:outline-offset-2 focus:outline-white'
            >
              <img src={oddsOfWinning} alt='Odds vary by price point' />
            </button>
          </section>

          {/* Scroll Arrow */}

          {!isBottom && (
            <section id={'OTHdownArrow'} className={'OTHdownArrow'}>
              <img src={downArrow} alt='' />
            </section>
          )}
        </div>
      </div>
    </>
  );
};

const IntroAnimation = () => {
  const { setShowIntroAnimation } = useAnimationContext();
  const { startMusic, stopMusic, playSoundEffect } = useAudioContext();
  const [fadeOutPreview, setFadeOutPreview] = useState('');

  const handleCloseGameIntro = () => {
    stopMusic();
    playSoundEffect(Sfx.OTH_BASIC_CLICK);
    playSoundEffect(Sfx.OTH_BUBBLES);
    setFadeOutPreview('fadeOutGame');
    setTimeout(() => {
      setShowIntroAnimation(false);
    }, 500);
  };

  useEffect(() => {
    startMusic(Loops.OTH_PREVIEW);
    return () => {
      stopMusic();
    };
  }, []);

  return (
    <div className={'previewAndSplash'}>
      {/* Black under layer for components to animate over, so there isn't a flash between components switching */}
      <div className={`blackLayer`} aria-hidden={'true'}></div>
      <div className={'gameIntro absolute inset-0 left-0 top-0 h-full w-full object-fill'}>
        <div className={`previewContainer relative ${fadeOutPreview}`}>
          <PreviewBackground />
          <Header handleClosePreview={handleCloseGameIntro} />
          <Preview />
        </div>
      </div>
    </div>
  );
};

export default IntroAnimation;
