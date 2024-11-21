import { ReactNode, createContext, useContext, useEffect, useRef, useState } from 'react';

import { Howl, Howler } from 'howler';

import {
  cfcBgMusic,
  cfcBgMusicCalm,
  cfcBigWin,
  cfcBigWinCruise,
  cfcBonusSpot,
  cfcBonusSpotLose,
  cfcBuyButton,
  cfcClick,
  cfcFreeCruise,
  cfcMatch3Win,
  cfcMegaWin,
  cfcMegaWinCruise,
  cfcNormalWin,
  cfcNormalWinCruise,
  cfcPopUp,
  cfcPreviewMusic,
  cfcRevealAll,
  cfcRevealAllButton,
  cfcSplashMusic,
  cfcSplashTransition1,
  cfcSplashTransition2,
  cfcStakeDown,
  cfcStakeUp,
  cfcSuperWin,
  cfcSuperWinCruise,
  cfcSymbolReveal,
  cfcTapAnywhere,
  dondBgMusic,
  dondBigWin,
  dondBonusSpotWin,
  dondBuyButton,
  dondMatch3,
  dondMegaWin,
  dondNormalWin,
  dondPopUp,
  dondPreview,
  dondRevealAll,
  dondRevealAllButton,
  dondSplashMusic,
  dondStakeDown,
  dondStakeEnd,
  dondStakeUp,
  dondSuperWin,
  dondSymbolReveal,
  dondTickupEnd,
  dondWinTickUp,
  othBasicClick,
  othBgMusic1,
  othBgMusic2,
  othBigWin,
  othBonusBottle1SFX,
  othBonusBottle2SFX,
  othBonusBottleSelectSFX,
  othBubbles,
  othBuy,
  othMatch3Win,
  othMegaWin,
  othNormalWin,
  othPopUp,
  othPreviewMusic,
  othRevealAll,
  othRevealAllButton,
  othSplashMusic,
  othStakeDown,
  othStakeEnd,
  othStakeUp,
  othSuperWin,
  othSymbolMatch,
  othSymbolReveal,
  othTick,
  othUnderwaterAmbient,
} from '../assets/audio/index';
import useLocalStorage from 'use-local-storage';

export enum Music {
  OTH_NORMAL_WIN = 'oth_normalWin',
  OTH_BIG_WIN = 'oth_bigWin',
  OTH_SUPER_WIN = 'oth_superWin',
  OTH_MEGA_WIN = 'oth_megaWin',
  DOND_NORMAL_WIN = 'dond_normalWin',
  DOND_BIG_WIN = 'dond_bigWin',
  DOND_SUPER_WIN = 'dond_superWin',
  DOND_MEGA_WIN = 'dond_megaWin',
  CFC_BONUS_SPOT = 'cfc_bonusSpot',
  CFC_FREE_CRUISE = 'cfc_freeCruise',
  CFC_NORMAL_WIN = 'cfc_normalWin',
  CFC_BIG_WIN = 'cfc_bigWin',
  CFC_SUPER_WIN = 'cfc_superWin',
  CFC_MEGA_WIN = 'cfc_megaWin',
  CFC_NORMAL_WIN_CRUISE = 'cfc_normalWin+Cruise',
  CFC_BIG_WIN_CRUISE = 'cfc_bigWin+Cruise',
  CFC_SUPER_WIN_CRUISE = 'cfc_superWin+Cruise',
  CFC_MEGA_WIN_CRUISE = 'cfc_megaWin+Cruise',
}

export enum Sfx {
  OTH_BONUS_BOTTLE1 = 'oth_bonusBottle1',
  OTH_BONUS_BOTTLE2 = 'oth_bonusBottle2',
  OTH_BONUS_BOTTLE_SELECT = 'oth_bonusBottleSelect',
  OTH_SYMBOL_REVEAL = 'oth_symbolReveal',
  OTH_STAKE_UP = 'oth_ticketStakeUp',
  OTH_STAKE_DOWN = 'oth_ticketStakeDown',
  OTH_STAKE_END = 'oth_ticketStakeEnd',
  OTH_MATCH3_WIN = 'oth_match3Win',
  OTH_BUY = 'oth_buy',
  OTH_REVEAL_ALL = 'oth_revealAll',
  OTH_REVEAL_ALL_BUTTON = 'oth_revealAllButton',
  OTH_SYMBOL_MATCH = 'oth_symbolMatch',
  OTH_BASIC_CLICK = 'oth_basicClick',
  OTH_POPUP = 'oth_popUp',
  OTH_TICK = 'oth_tick',
  OTH_BUBBLES = 'oth_bubbles',
  DOND_REVEAL_ALL = 'dond_revealAll',
  DOND_REVEAL_ALL_BUTTON = 'dond_revealAllButton',
  DOND_STAKE_DOWN = 'dond_stakeDown',
  DOND_STAKE_END = 'dond_stakeEnd',
  DOND_STAKE_UP = 'dond_stakeUp',
  DOND_BUY = 'dond_buy',
  DOND_SYMBOL_REVEAL = 'dond_symbolReveal',
  DOND_BONUS_SPOT_WIN = 'dond_bonusSpotWin',
  DOND_MATCH_3 = 'dond_match3',
  DOND_POPUP = 'dond_popUp',
  DOND_TICKUP_END = 'dond_tickUpEnd',
  CFC_SYMBOL_REVEAL = 'cfc_symbolReveal',
  CFC_REVEAL_ALL = 'cfc_revealAll',
  CFC_REVEAL_ALL_BUTTON = 'cfc_revealAllButton',
  CFC_MATCH3 = 'cfc_match3',
  CFC_STAKE_DOWN = 'cfc_stakeDown',
  CFC_STAKE_UP = 'cfc_stakeUp',
  CFC_BUY = 'cfc_buyButton',
  CFC_TAP_ANYWHERE = 'cfc_tapAnywhere',
  CFC_SPLASH_TRANSITION_1 = 'cfc_splashTransision1',
  CFC_SPLASH_TRANSITION_2 = 'cfc_splashTransition2',
  CFC_BONUS_SPOT_LOSE = 'cfc_bonusSpotLose',
  CFC_CLICK = 'cfc_click',
  CFC_POPUP = 'cfc_popup',
}

export enum Loops {
  DOND_WIN_TICK_UP = 'dond_winTickUp',
  OTH_BG1 = 'oth_background1',
  OTH_BG2 = 'oth_background2',
  OTH_PREVIEW = 'oth_preview',
  OTH_SPLASH = 'oth_splash',
  OTH_UNDERWATER = 'oth_underWaterAmbient',
  DOND_BG_MUSIC = 'dond_backgroundMusic',
  DOND_SPLASH_MUSIC = 'dond_splashMusic',
  DOND_PREVIEW = 'dond_preview',
  CFC_BG_MUSIC = 'cfc_bgMusic',
  CFC_PREVIEW = 'cfc_preview',
  CFC_SPLASH = 'cfc_splash',
  CFC_BG_MUSIC_CALM = 'cfc_bgMusicCalm',
}

type AudioContextType = {
  startMusic: (track: Music | Loops, duration?: number) => void;
  stopMusic: () => void;
  fadeInMusic: (track: Music | Loops, duration: number) => void;
  fadeOutMusic: (duration: number) => void;
  playSoundEffect: (effect: Sfx | Loops) => void;
  setMuted: (muted: boolean) => void;
  toggleMuted: () => void;
  isMuted: boolean;
  stopSoundEffect: (track: Sfx | Loops) => void;
  stopAllAudio: () => void;
  appHidden: boolean;
  handleGenericClickAudio: (game: string) => void;
  stopMusicTrack: (track: Music | Loops) => void;
};

const AudioContext = createContext<AudioContextType | null>(null);

export const AudioProvider = ({ children }: { children: ReactNode }) => {
  const audioRefs = useRef<{ [key: string]: Howl | null }>({});
  const [currentTrack, setCurrentTrack] = useState<Music | Loops | null>(null);
  const [isMuted, setIsMuted] = useLocalStorage('is-muted', false);
  const [maxVolume, setMaxVolume] = useState(0);
  const [playingSounds, setPlayingSounds] = useState<number>(0);
  const [appHidden, setAppHidden] = useState(false);

  const music: { [key in Music]: string } = {
    [Music.OTH_NORMAL_WIN]: othNormalWin,
    [Music.OTH_BIG_WIN]: othBigWin,
    [Music.OTH_SUPER_WIN]: othSuperWin,
    [Music.OTH_MEGA_WIN]: othMegaWin,
    [Music.DOND_NORMAL_WIN]: dondNormalWin,
    [Music.DOND_BIG_WIN]: dondBigWin,
    [Music.DOND_SUPER_WIN]: dondSuperWin,
    [Music.DOND_MEGA_WIN]: dondMegaWin,
    [Music.CFC_BONUS_SPOT]: cfcBonusSpot,
    [Music.CFC_FREE_CRUISE]: cfcFreeCruise,
    [Music.CFC_NORMAL_WIN]: cfcNormalWin,
    [Music.CFC_BIG_WIN]: cfcBigWin,
    [Music.CFC_SUPER_WIN]: cfcSuperWin,
    [Music.CFC_MEGA_WIN]: cfcMegaWin,
    [Music.CFC_NORMAL_WIN_CRUISE]: cfcNormalWinCruise,
    [Music.CFC_BIG_WIN_CRUISE]: cfcBigWinCruise,
    [Music.CFC_SUPER_WIN_CRUISE]: cfcSuperWinCruise,
    [Music.CFC_MEGA_WIN_CRUISE]: cfcMegaWinCruise,
  };

  const sfx: { [key in Sfx]: string } = {
    [Sfx.OTH_BONUS_BOTTLE1]: othBonusBottle1SFX,
    [Sfx.OTH_BONUS_BOTTLE2]: othBonusBottle2SFX,
    [Sfx.OTH_BONUS_BOTTLE_SELECT]: othBonusBottleSelectSFX,
    [Sfx.OTH_SYMBOL_REVEAL]: othSymbolReveal,
    [Sfx.OTH_STAKE_UP]: othStakeUp,
    [Sfx.OTH_STAKE_DOWN]: othStakeDown,
    [Sfx.OTH_STAKE_END]: othStakeEnd,
    [Sfx.OTH_MATCH3_WIN]: othMatch3Win,
    [Sfx.OTH_BUY]: othBuy,
    [Sfx.OTH_REVEAL_ALL]: othRevealAll,
    [Sfx.OTH_REVEAL_ALL_BUTTON]: othRevealAllButton,
    [Sfx.OTH_SYMBOL_MATCH]: othSymbolMatch,
    [Sfx.OTH_BASIC_CLICK]: othBasicClick,
    [Sfx.OTH_TICK]: othTick,
    [Sfx.OTH_POPUP]: othPopUp,
    [Sfx.OTH_BUBBLES]: othBubbles,
    [Sfx.DOND_REVEAL_ALL]: dondRevealAll,
    [Sfx.DOND_REVEAL_ALL_BUTTON]: dondRevealAllButton,
    [Sfx.DOND_STAKE_DOWN]: dondStakeDown,
    [Sfx.DOND_STAKE_UP]: dondStakeUp,
    [Sfx.DOND_STAKE_END]: dondStakeEnd,
    [Sfx.DOND_BUY]: dondBuyButton,
    [Sfx.DOND_SYMBOL_REVEAL]: dondSymbolReveal,
    [Sfx.DOND_BONUS_SPOT_WIN]: dondBonusSpotWin,
    [Sfx.DOND_MATCH_3]: dondMatch3,
    [Sfx.DOND_POPUP]: dondPopUp,
    [Sfx.DOND_TICKUP_END]: dondTickupEnd,
    [Sfx.CFC_SYMBOL_REVEAL]: cfcSymbolReveal,
    [Sfx.CFC_REVEAL_ALL]: cfcRevealAll,
    [Sfx.CFC_REVEAL_ALL_BUTTON]: cfcRevealAllButton,
    [Sfx.CFC_MATCH3]: cfcMatch3Win,
    [Sfx.CFC_STAKE_DOWN]: cfcStakeDown,
    [Sfx.CFC_STAKE_UP]: cfcStakeUp,
    [Sfx.CFC_BUY]: cfcBuyButton,
    [Sfx.CFC_TAP_ANYWHERE]: cfcTapAnywhere,
    [Sfx.CFC_SPLASH_TRANSITION_1]: cfcSplashTransition1,
    [Sfx.CFC_SPLASH_TRANSITION_2]: cfcSplashTransition2,
    [Sfx.CFC_BONUS_SPOT_LOSE]: cfcBonusSpotLose,
    [Sfx.CFC_CLICK]: cfcClick,
    [Sfx.CFC_POPUP]: cfcPopUp,
  };

  const loops: { [key in Loops]: string } = {
    [Loops.DOND_WIN_TICK_UP]: dondWinTickUp,
    [Loops.OTH_BG1]: othBgMusic1,
    [Loops.OTH_BG2]: othBgMusic2,
    [Loops.OTH_PREVIEW]: othPreviewMusic,
    [Loops.OTH_SPLASH]: othSplashMusic,
    [Loops.DOND_BG_MUSIC]: dondBgMusic,
    [Loops.DOND_SPLASH_MUSIC]: dondSplashMusic,
    [Loops.OTH_UNDERWATER]: othUnderwaterAmbient,
    [Loops.DOND_PREVIEW]: dondPreview,
    [Loops.CFC_BG_MUSIC]: cfcBgMusic,
    [Loops.CFC_PREVIEW]: cfcPreviewMusic,
    [Loops.CFC_SPLASH]: cfcSplashMusic,
    [Loops.CFC_BG_MUSIC_CALM]: cfcBgMusicCalm,
  };

  const setMuted = (muted: boolean) => {
    setIsMuted(muted);
  };

  useEffect(() => {
    Howler.mute(isMuted);
  }, [isMuted]);

  const toggleMuted = () => {
    const muteStatus = !isMuted;
    setMuted(muteStatus);
  };

  const isLoop = (track: Music | Loops): track is Loops => {
    return Object.values(Loops).includes(track as Loops);
  };

  const startMusic = async (track: Music | Loops, duration?: number) => {
    if (track) {
      console.log('[Audio Context] Starting music: ', track);
      if (audioRefs.current[track] !== currentTrack) {
        if (currentTrack && audioRefs.current[currentTrack]) {
          await fadeOutMusic(duration ? duration : 500);
        }
        setCurrentTrack(track);
        console.log('[Audio Context] Fading in new track: ', track);
        fadeInMusic(track, duration ? duration : 500);
      }
    } else {
      console.log('[Audio Context] Audio not found for track: ', track);
    }
  };

  const stopMusic = async () => {
    if (currentTrack && audioRefs.current[currentTrack]) {
      console.log('[Audio Context] Stopping music:', currentTrack);
      await fadeOutMusic(500);
      setCurrentTrack(null);
    }
  };

  const stopMusicTrack = (track: Music | Loops) => {
    if (track) {
      if (audioRefs.current[track]?.playing()) {
        console.log('[Audio Context] Stopping track: ', track);
        audioRefs.current[track]?.stop();
        setCurrentTrack(null);
      } else {
        console.log('[Audio Context] stopMusicTrack - track not playing: ', track);
      }
    } else {
      console.log('[Audio Context] stopMusicTrack - no track specified');
      return;
    }
  };

  const fadeInMusic = (track: Music | Loops, duration: number) => {
    if (audioRefs.current[track]) {
      const audio = audioRefs.current[track]!;
      audio.volume(0);
      if (isLoop(track)) {
        audio.play(track);
      } else {
        audio.play();
      }
      if (!isMuted) {
        let targetVolume = maxVolume;
        switch (track) {
          case Music.OTH_NORMAL_WIN:
          case Music.OTH_SUPER_WIN:
            targetVolume = 0.3 * maxVolume;
            break;
          case Loops.OTH_BG1:
            targetVolume = 0.2 * maxVolume;
            break;
        }
        audio.fade(0, targetVolume, duration);
      }
    }
  };

  const fadeOutMusic = async (duration: number) => {
    if (currentTrack && audioRefs.current[currentTrack]) {
      const audio = audioRefs.current[currentTrack]!;
      if (isMuted) {
        audio.volume(0);
        audio.stop();
      } else {
        if (audio.volume() > 0) {
          const currentVolume = audio.volume();
          audio.fade(currentVolume, 0, duration);
          await new Promise((resolve) => setTimeout(resolve, duration));
          audio.stop();
        }
      }
    }
  };

  const playSoundEffect = async (effect: Sfx | Loops) => {
    if (isMuted) {
      return;
    }
    if (audioRefs.current[effect]) {
      const soundEffect = audioRefs.current[effect];
      if (effect) {
        soundEffect!.seek(0);
        soundEffect!.volume(maxVolume / (playingSounds + 0.5));
        if (effect === Loops.DOND_WIN_TICK_UP) {
          soundEffect!.play(effect);
        } else {
          soundEffect!.play();
        }
        setPlayingSounds((prev) => prev + 1);
        soundEffect!.once('end', () => {
          setPlayingSounds((prev) => prev - 1);
        });
        console.log('[Audio Context] Playing SFX: ', effect);
      }
    } else {
      console.log('[Audio Context] SFX not found...');
    }
  };

  const stopSoundEffect = (effect: Sfx | Loops) => {
    if (audioRefs.current[effect]) {
      const soundEffect = audioRefs.current[effect];
      soundEffect!.stop();
      console.log('[Audio Context] Stopping SFX: ', effect);
    }
  };

  const stopAllAudio = () => {
    console.log('[Audio Context] Stopping all audio');
    Howler.stop();
    setCurrentTrack(null);
  };

  const handleGenericClickAudio = (game: string) => {
    if (!game) {
      return;
    }
    switch (game) {
      case 'ocean-treasure':
      case 'dond-dbk':
        playSoundEffect(Sfx.OTH_BASIC_CLICK);
        break;
      case 'cruising-for-cash':
        playSoundEffect(Sfx.CFC_CLICK);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (currentTrack && audioRefs.current[currentTrack]) {
      const selectedTrack = audioRefs.current[currentTrack];
      if (!selectedTrack!.playing()) {
        console.log('Selected track not playing, clearing playlist: ', selectedTrack);
        selectedTrack!.stop();
        setCurrentTrack(null);
      }
    }
  }, [currentTrack]);

  useEffect(() => {
    setMaxVolume(0.65);
    const handleVisibilityChange = () => {
      if (document.hidden) {
        Howler.mute(true);
        setIsMuted(true);
        setAppHidden(true);
      } else {
        setAppHidden(false);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      stopAllAudio();
    };
  }, []);

  useEffect(() => {
    Object.keys(music).forEach((track) => {
      audioRefs.current[track] = new Howl({
        src: [music[track as keyof typeof music]],
        preload: true,
        html5: false,
      });
    });

    Object.keys(sfx).forEach((effect) => {
      audioRefs.current[effect] = new Howl({
        src: [sfx[effect as keyof typeof sfx]],
      });
    });

    Object.keys(loops).forEach((loop) => {
      // Default loop length, will be reset
      let trackOffset = 0;
      let trackDuration = 15000;
      switch (loop) {
        case Loops.OTH_BG1:
          trackOffset = 25;
          trackDuration = 42800;
          break;
        case Loops.OTH_BG2:
          trackDuration = 32000;
          break;
        case Loops.OTH_PREVIEW:
          trackDuration = 7990;
          break;
        case Loops.OTH_SPLASH:
          trackOffset = 25;
          trackDuration = 15980;
          break;
        case Loops.OTH_UNDERWATER:
          trackDuration = 46000;
          break;
        case Loops.DOND_BG_MUSIC:
          trackDuration = 26000;
          break;
        case Loops.DOND_PREVIEW:
          trackOffset = 10;
          trackDuration = 15990;
          break;
        case Loops.DOND_SPLASH_MUSIC:
          trackDuration = 9000;
          break;
        case Loops.DOND_WIN_TICK_UP:
          trackDuration = 2995;
          break;
        case Loops.CFC_PREVIEW:
          trackOffset = 50;
          trackDuration = 8960;
          break;
        case Loops.CFC_SPLASH:
          trackOffset = 20;
          trackDuration = 4800;
          break;
        case Loops.CFC_BG_MUSIC:
          trackDuration = 48000;
          break;
        default:
          break;
      }
      audioRefs.current[loop] = new Howl({
        src: [loops[loop as keyof typeof loops]],
        sprite: {
          [loop]: [trackOffset, trackDuration],
        },
        preload: true,
        loop: true,
        html5: false,
      });
    });

    return () => {
      stopAllAudio();
    };
  }, []);

  const audioContextValue = {
    startMusic,
    stopMusic,
    fadeInMusic,
    fadeOutMusic,
    playSoundEffect,
    setMuted,
    toggleMuted,
    isMuted,
    stopSoundEffect,
    stopAllAudio,
    appHidden,
    handleGenericClickAudio,
    stopMusicTrack,
  };

  return <AudioContext.Provider value={audioContextValue}>{children}</AudioContext.Provider>;
};

export default AudioContext;

export const useAudioContext = (): AudioContextType => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudioContext must be used within an AudioProvider');
  }
  return context;
};
