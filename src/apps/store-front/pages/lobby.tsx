import { useEffect, useState } from 'react';

import { Badge, Card } from '@nextui-org/react';
import { useLocation, useNavigate } from 'react-router-dom';
import { GameDef, GameGroup, InstantwinInstantWinUserSummary } from 'ships-service-sdk';

import { AnimateTransition } from '@/components';
import { useAppContext } from '@/contexts/app-context';
import { useAudioContext } from '@/contexts/audio-context';
import { instantWinInstanceApi } from '@/services/ships-service';
import { gameLocations } from '@/utils';
import { toggleFullScreen } from '@/utils/timeplay';
import { GameCategory, GameGroups, GameIds } from '@/utils/types';

import {
  thumbnailBtbPng,
  thumbnailCfcPng,
  thumbnailLdPng,
  thumbnailOthPng,
  thumbnailPick3Png,
  thumbnailPick4Png,
} from '../assets/game-thumbnails';
import { promoBtbPng, promoCfcPng, promoOthPng } from '../assets/promo-images';
import { Carousel } from '../components';
import GamePreview from '../components/game-preview';
import GameSession from '../components/game-session';
import { useStoreFrontContext } from '../layout';
import { Game } from '../types';

export type LobbyGame = {
  id: string;
  name: string;
  description: string;
  category: string;
  thumbnail: string;
  enabled: boolean;
  visible: boolean;
  gambling: boolean;
};

type Games = Record<GameGroups, LobbyGame[]>;

const gameItems: Games = {
  [GameGroups.InstantWin]: [
    {
      id: GameIds.BreakTheBank,
      name: 'Beat the Banker',
      description: 'Beat the Banker',
      category: GameCategory.ScratchCard,
      thumbnail: thumbnailBtbPng,
      enabled: true,
      visible: true,
      gambling: true,
    },
    {
      id: GameIds.CruisingForCash,
      name: 'Cruising For Cash',
      description: 'Cruising For Cash',
      category: GameCategory.ScratchCard,
      thumbnail: thumbnailCfcPng,
      enabled: true,
      visible: true,
      gambling: true,
    },
    {
      id: GameIds.LuckyDragon,
      name: 'Lucky Dragon',
      description: 'Lucky Dragon',
      category: GameCategory.ScratchCard,
      thumbnail: thumbnailLdPng,
      enabled: false,
      visible: false,
      gambling: true,
    },
    {
      id: GameIds.OceanTreasure,
      name: 'Ocean Treasure',
      description: 'Ocean Treasure',
      category: GameCategory.ScratchCard,
      thumbnail: thumbnailOthPng,
      enabled: true,
      visible: true,
      gambling: true,
    },
  ],
  [GameGroups.Lotto]: [
    {
      id: GameIds.Pick3,
      name: 'Pick 3',
      description: 'Pick 3',
      category: GameCategory.PowerPick,
      thumbnail: thumbnailPick3Png,
      enabled: false,
      visible: false,
      gambling: true,
    },
    {
      id: GameIds.Pick4,
      name: 'Pick 4',
      description: 'Pick 4',
      category: GameCategory.PowerPick,
      thumbnail: thumbnailPick4Png,
      enabled: false,
      visible: false,
      gambling: true,
    },
  ],
  [GameGroups.Entertainment]: [],
};

const promoItems = [
  {
    id: GameIds.OceanTreasure,
    description:
      'Sea of Chances! Instantly win up to $50,000! Tap to play Ocean Treasure Hunt now.',
    thumbnail: promoOthPng,
  },
  {
    id: GameIds.BreakTheBank,
    description:
      'Beat the Banker from your pocket! Win up to $50,000 instantly! Tap to play Beat the Banker now.',
    thumbnail: promoBtbPng,
  },
  {
    id: GameIds.CruisingForCash,
    description:
      'Cruising for Cash! Seas the cash or a free cruise! Instant fun, instant rewards! Tap to play cruising for cash now.',
    thumbnail: promoCfcPng,
  },
];

const LobbyPage = () => {
  const { setGamesList, instantWinSummary, setInstantWinSummary } = useStoreFrontContext();

  const { stackConfig, userIsMinor } = useAppContext();
  const [games, setGames] = useState<Games>(gameItems);
  const location = useLocation();
  const { stopAllAudio } = useAudioContext();

  // THIS IS COMMENTED OUT UNTIL MORE GAMES ARE AVAILABLE
  // const hasInstantWin = games['instant-win'].some((game) => game.enabled);
  // const hasLotto = games['lotto'].some((game) => game.enabled);
  // const hasEntertainment = games['entertainment'].some((game) => game.enabled);
  const { authAccount } = useAppContext();

  const getIWSummary = async () => {
    const req = {
      userID: authAccount.login?.user_info?.playerId || '',
      state: 'initialized',
    };
    const response = await instantWinInstanceApi.getInstantWinInstancesUserSummary(req);
    const summary = response.data.data;
    if (summary) {
      const summaryMap = new Map<string, number>(
        summary
          .filter(
            (
              game_summary: InstantwinInstantWinUserSummary,
            ): game_summary is { game_id: string; session_count: number } =>
              !!game_summary.game_id && !!game_summary.session_count,
          )
          .map((game_summary) => [game_summary.game_id, game_summary.session_count]),
      );
      summaryMap.get;
      setInstantWinSummary(summaryMap);
    }
  };

  const refreshActiveSessions = async () => {
    const newGameGroups = Object.values(stackConfig.game_group || {});
    const gamesList: Game[] = [];
    const newGames: Games = JSON.parse(JSON.stringify(games));

    newGameGroups.forEach((group: GameGroup) => {
      switch (group.name) {
        case GameGroups.InstantWin:
          for (const category of Object.values(group.category || {})) {
            for (const game of Object.values(category.game || {})) {
              gamesList.push(game);
            }
          }
          break;
        case GameGroups.Lotto:
          for (const category of Object.values(group.category || {})) {
            for (const game of Object.values(category.game || {})) {
              gamesList.push(game);
            }
          }
          break;
      }
    });

    setGamesList(gamesList);

    Object.values(newGames).forEach((category) => {
      for (const lobbyGame of category) {
        // update games with enabled status from gamesList
        const game = gamesList.find((game) => game.name === lobbyGame.id);
        if (game && game.enabled) {
          lobbyGame.enabled = true;
        } else if (game && !game.enabled) {
          lobbyGame.enabled = false;
        } else {
          console.error(`Game ${lobbyGame.id} not found in gamesList`);
        }
        // disable and hide gambling games for minors
        if (lobbyGame.gambling && userIsMinor) {
          lobbyGame.enabled = false;
          lobbyGame.visible = false;
        }
      }
    });

    setGames(newGames);
  };

  useEffect(() => {
    if (location.pathname === '/lobby') {
      stopAllAudio();
    }
  }, [location]);

  useEffect(() => {
    refreshActiveSessions();
    const id = setInterval(refreshActiveSessions, 10000);
    return () => clearInterval(id);
  }, [stackConfig]);

  useEffect(() => {
    getIWSummary();
  }, []);

  return (
    <AnimateTransition
      className='flex h-fit w-full flex-col py-4 pt-28'
      initial={true}
      duration={0.5}
    >
      <PromoRow promoItems={promoItems} />
      <GamesRow games={games['instant-win']} title='Scratch Games' summary={instantWinSummary} />
      {/* FILTERS/TABS ARE COMMENTED OUT UNTIL MORE GAMES ARE AVAILABLE */}
      {/* <Tabs
        aria-label='Options'
        fullWidth
        classNames={{
          tabContent: 'uppercase font-tempo',
          base: 'px-4',
        }}
      >
      <Tab key='All' title='All'>
          <AnimateTransition initial={true} duration={0.5}>
            <PromoRow promoItems={promoItems} />
            {hasInstantWin && (
              <GamesRow
                games={games['instant-win']}
                title='Scratch Games'
                summary={instantWinSummary}
              />
            )}
            {hasLotto && <GamesRow games={games['lotto']} title='Draw Games' />}
            {hasEntertainment && (
              <GamesRow games={games['entertainment']} title='Entertainment Games' />
            )}
          </AnimateTransition>
        </Tab>
        {hasInstantWin && (
          <Tab key='scratch-games' title='Scratch Games'>
            <AnimateTransition initial={true} duration={0.5}>
              <GamesGrid games={games['instant-win']} summary={instantWinSummary} />
            </AnimateTransition>
          </Tab>
        )}
        {hasLotto && (
          <Tab key='draw-games' title='Draw Games'>
            <AnimateTransition initial={true} duration={0.5}>
              <GamesGrid games={games['lotto']} />
            </AnimateTransition>
          </Tab>
        )}
        {hasEntertainment && (
          <Tab key='entertainment-games' title='Entertainment Games'>
            <AnimateTransition initial={true} duration={0.5}>
              <GamesGrid games={games['entertainment']} />
            </AnimateTransition>
          </Tab>
        )}
      </Tabs> */}
      <GamePreview />
      <GameSession />
      <div className='bg-gradient-to-t from-[#10559A] to-transparent h-[25%] w-full absolute bottom-0'/>
    </AnimateTransition>
  );
};

export default LobbyPage;

type GamesRowProps = {
  games: LobbyGame[];
  title: string;
  loop?: boolean;
  summary?: Map<string, number | string>;
};

const GamesRow: React.FC<GamesRowProps> = ({ games, title, summary }) => {
  const visibleGames: LobbyGame[] = games.filter((game) => game.visible);
  const sortedGames = visibleGames.sort(
    (a: LobbyGame, b: LobbyGame) => +(b.enabled as boolean) - +(a.enabled as boolean),
  );

  return (
    <div className='flex w-full flex-col  overflow-hidden pb-6'>
      <h1 className='px-4 pb-2 font-tempo text-2xl font-bold uppercase text-primary-900'>{title}</h1>
      <Carousel slidesPerView={2.5} spaceBetween={10}>
        {sortedGames.map((game) => (
          <GameCard key={game.id} game={game} badge_content={summary?.get(game.id)} />
        ))}
      </Carousel>
    </div>
  );
};

// DISABLED UNTIL MORE GAMES ARE AVAILABLE
// type GamesGridProps = {
//   games: LobbyGame[];
//   summary?: Map<string, number | string>;
// };

// const GamesGrid: React.FC<GamesGridProps> = ({ games, summary }) => {
//   const visibleGames: LobbyGame[] = games.filter((game) => game.visible);
//   const sortedGames = visibleGames.sort(
//     (a: LobbyGame, b: LobbyGame) => +(b.enabled as boolean) - +(a.enabled as boolean),
//   );
//   return (
//     <div className='grid grid-cols-2 gap-4 px-4'>
//       {sortedGames.map((game) => (
//         <GameCard key={game.id} game={game} badge_content={summary?.get(game.id)} />
//       ))}
//     </div>
//   );
// };

type GameCardProps = {
  game: LobbyGame;
  badge_content?: string | number;
};

const GameCard: React.FC<GameCardProps> = ({ game, badge_content }) => {
  const { handleSelectGame, getGameData } = useStoreFrontContext();
  const { isIOS } = useAppContext();
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();
  const gameId = game.id as GameIds;
  const enabled = game.enabled;
  const gameDef = getGameData(gameId) as GameDef;

  const handleClick = () => {
    if (!enabled) {
      return;
    }
    const gameLocation = gameLocations[gameId];
    handleSelectGame(gameDef);
    setIsExpanded(!isExpanded);
    !isIOS && toggleFullScreen(true);

    if (gameLocation) {
      console.log('gameLocation', gameLocation);
      navigate(gameLocation);
    } else {
      console.error(`Game location not found for ${gameId}`);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!enabled) {
      return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      handleClick();
    }
  };
  return (
    <Badge content={badge_content} color='danger' size='lg' isInvisible={!badge_content}>
      <Card
        isPressable={enabled}
        isDisabled={!enabled}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className='shadow-user-menu-blue-shadow'
      >
        <img alt={game.description} src={game.thumbnail} className='h-full w-full' />
      </Card>
    </Badge>
  );
};

type PromoItem = {
  id: GameIds;
  description: string;
  thumbnail: string;
};

type PromoRowProps = {
  promoItems: PromoItem[];
};

const PromoRow: React.FC<PromoRowProps> = ({ promoItems }) => {
  const { handleSelectGame, getGameData } = useStoreFrontContext();
  const { isIOS } = useAppContext();
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

  const handleClick = (gameId: GameIds) => {
    const gameDef = getGameData(gameId) as GameDef;
    const gameLocation = gameLocations[gameId];
    handleSelectGame(gameDef);
    setIsExpanded(!isExpanded);
    !isIOS && toggleFullScreen(true);

    if (gameLocation) {
      console.log('gameLocation', gameLocation);
      navigate(gameLocation);
    } else {
      console.error(`Game location not found for ${gameId}`);
    }
  };

  const handleKeyDown = (gameId: GameIds, event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      handleClick(gameId);
    }
  };

  return (
    <div className='flex w-full snap-x snap-mandatory gap-4 overflow-hidden pb-6'>
      <Carousel slidesPerView={1.1} spaceBetween={10}>
        {promoItems.map((promoItem) => (
          <Card
            key={promoItem.id}
            isPressable
            onClick={() => handleClick(promoItem.id)}
            onKeyDown={(event) => handleKeyDown(promoItem.id, event)}
            className='shadow-user-menu-blue-shadow'
          >
            <img alt={promoItem.description} src={promoItem.thumbnail} className='h-full w-full' />
          </Card>
        ))}
      </Carousel>
    </div>
  );
};
