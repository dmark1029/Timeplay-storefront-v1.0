import { useEffect, useRef, useState } from 'react';

import { useAnimationContext } from '@/apps/instant-win/context/animation-context';
import { useStoreFrontContext } from '@/apps/store-front';
import { useAppContext } from '@/contexts/app-context';
import { Loops, useAudioContext } from '@/contexts/audio-context';
import { useDialogContext } from '@/contexts/dialog-context';
import useIOSVideoLoop from '@/hooks/useIOSVideoLoop';
import { usdFormatter } from '@/utils/util';

import '../../animation-code/animations.css';
import {
  bg,
  caseClosed,
  dondAnimatedBg,
  downArrow,
  introBonusSpot,
  logo,
  luckyMatchedCase,
} from '../../assets';

const PreviewBackground = () => {
  const [videoError, setVideoError] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  useIOSVideoLoop(videoRef);

  return (
    <div className='background'>
      {videoError ? (
        <img
          className={'h-full w-full object-cover'}
          src={bg}
          alt='default win image displaying an open briefcase'
        />
      ) : (
        <video
          muted
          ref={videoRef}
          autoPlay
          loop
          playsInline
          aria-hidden={true}
          poster={bg}
          onError={() => {
            setVideoError(true);
          }}
        >
          <source src={dondAnimatedBg} type={'video/mp4'} />
        </video>
      )}
    </div>
  );
};

interface HeaderProps {
  handleClosePreview?: () => void;
}

const Header: React.FC<HeaderProps> = ({ handleClosePreview }) => {
  const { balance } = useAppContext();
  const [previewTopPrize, setPreviewTopPrize] = useState('');

  useEffect(() => {
    setPreviewTopPrize('$50,000!');
  }, []);

  return (
    <>
      <div className={'header'}>
        <h1 className='logoContainer'>
          <img src={logo} alt='Deal or No Deal logo' />
        </h1>
        <p
          className={
            'dondTopPrize dondDefaultText h-18 -translate-x-[3px] stroke-[black] stroke-[1.5] text-xl font-black uppercase md-h:text-xl'
          }
        >
          Win up to {previewTopPrize}
        </p>
      </div>
      <section className={'playNow'}>
        <button
          className='dondPlayNowButton'
          onClick={handleClosePreview}
          onKeyDown={(event) => {
            (event.key == ' ' || event.key == 'Enter') &&
              handleClosePreview &&
              handleClosePreview();
          }}
        >
          <p>Play Now</p>
          <p>Balance: {usdFormatter.format(balance?.cmas?.casinoBankBalance || 0)}</p>
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
  const { handleGenericClickAudio } = useAudioContext();
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
      handleGenericClickAudio(gameId);
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
      <div className='dondPreview'>
        <div className='dondContent' ref={scrollRef}>
          {/* Lucky symbols */}

          <section className='dondLuckySymbols'>
            <div className='dondWindow'>
              <div className='dondSign'>
                <p>Winning Cases</p>
              </div>
              <div className='dondWindowContent'>
                <div className='dondText'>
                  <p>
                    Open the Winning Cases to reveal a $ amount. If the amounts in Your Cases match
                    the Winning Cases then you bank that amount.
                  </p>
                </div>
                <div className='luckyCase'>
                  <p>$200</p>
                  <img
                    src={luckyMatchedCase}
                    alt='Each scratch area becomes an open briefcase containing a number amount, matched cases have a golden glow'
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Match 3 */}

          <section className='dondMatch3'>
            <div className='dondWindow'>
              <div className='dondSign'>
                <p>Match 3</p>
              </div>
              <div className='dondWindowContent'>
                <div className='dondText'>
                  <p>Open all 3 cases. If all three amounts match, win that cash amount.</p>
                </div>
                <div className='match3Cases'>
                  <img src={caseClosed} alt='closed briefcase' />
                  <img src={caseClosed} alt='closed briefcase' />
                  <img src={caseClosed} alt='closed briefcase' />
                </div>
              </div>
            </div>
          </section>

          {/* Bonus */}

          <section className='dondBonus'>
            <div className='dondWindow'>
              <div className='dondSign'>
                <p>Bonus Spot</p>
              </div>
              <div className='dondWindowContent'>
                <div className='dondText'>
                  <p>Reveal the Bonus Spot to see if you won a special prize.</p>
                </div>
                <div className='bankersPhoneBackground'>
                  <img src={introBonusSpot} alt='Image of bonus spot game' />
                </div>
              </div>
            </div>
          </section>

          {/* Ticket price */}

          <section className='dondTicketPrice'>
            <div className='dondWindow'>
              <div className='dondSign'>
                <p>Card Price</p>
              </div>
              <div className='dondWindowContent'>
                <div className='dondPriceText'>
                  <p>{price}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Odds */}

          <section className='odds'>
            <div className='dondWindow'>
              <div className='dondSign'>
                <p>Overall Odds Per Game</p>
              </div>
              <div className='dondWindowContent'>
                <div className='dondPriceText '>
                  <p>{odds}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Odds extras */}

          <section className='dondOddsExtras'>
            <div className='dondOddsExtrasImageContainer'>
              <button
                className='mx-auto flex h-full w-full justify-center'
                onClick={handleGameInfo}
                aria-label='click to see the odds for winning the top prize'
              >
                <p className='dondTopPrizeOdds'>Odds vary by price point</p>
              </button>
            </div>
          </section>

          {/* Scroll Arrow */}

          {!isBottom && (
            <section id={'downArrow'} className={'dondDownArrow'}>
              <div className='dondDownArrow'>
                <img src={downArrow} alt='Scroll for more information' />
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  );
};

const IntroAnimation = () => {
  const { startMusic, stopMusic, handleGenericClickAudio } = useAudioContext();
  const { gameId } = useStoreFrontContext();
  const { setShowIntroAnimation } = useAnimationContext();
  const [fadeSplash, setFadeSplash] = useState('');
  const [fadeBlackLayer, setFadeBlackLayer] = useState('');

  const handleCloseGameIntro = () => {
    setFadeSplash('fadeSplash');
    setFadeBlackLayer('fadeBlackLayer');
    stopMusic();
    if (gameId) {
      handleGenericClickAudio(gameId);
    }
    setTimeout(() => {
      setShowIntroAnimation(false);
    }, 1000);
  };

  useEffect(() => {
    startMusic(Loops.DOND_PREVIEW);
    return () => {
      stopMusic();
    };
  }, []);

  return (
    <div className={'previewAndSplash'}>
      <div className={`blackLayer ${fadeBlackLayer}`} aria-hidden={'true'}></div>
      <div className='gameIntro'>
        <div className={`previewContainer relative ${fadeSplash}`}>
          <PreviewBackground />
          <Header handleClosePreview={handleCloseGameIntro} />
          <Preview />
        </div>
      </div>
    </div>
  );
};

export default IntroAnimation;
