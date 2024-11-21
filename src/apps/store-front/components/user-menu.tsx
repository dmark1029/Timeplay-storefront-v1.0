import { useEffect, useState } from 'react';

import { Button, Card, CardBody, Divider, Modal, ModalBody, ModalContent, Tab, Tabs } from '@nextui-org/react';
import { PartnerCarnivalLoyaltyLevel } from 'ships-service-sdk';

import { useAppContext } from '@/contexts/app-context';
import { useAudioContext } from '@/contexts/audio-context';
import { cn } from '@/utils/cn';
import { useHideModalDismissButtons } from '@/hooks/useHideInivisibleDismissButtons';
import { checkAuthAccount } from '@/utils/timeplay';
import { usdFormatter } from '@/utils/util';

import {
  AccountDisabledIcon,
  AccountIcon,
  HistoryDisabledIcon,
  HistoryIcon,
  LogoutIcon,
} from '../assets/user-menu';
import { useStoreFrontContext } from '../layout';
import Accessibility from './accessibility-policy';
import TermsConditions from './terms-conditions';
import History from './user-history';
import Prizes from './user-prizes';

type TimePlayLevel = 'Beginner' | 'Middle' | 'Expert';

type Level = TimePlayLevel | PartnerCarnivalLoyaltyLevel;

type UserProps = {
  name: string;
  level: Level;
  playCount: number;
  cash: number;
};

const MOCK_USER: UserProps = {
  name: 'Bob S',
  level: 'Expert',
  playCount: 5,
  cash: 45,
};

const getLevelDescription = (level: Level) => {
  switch (level) {
    case 'BLUE':
      return 'Rookie, this is your first cruise';
    case 'RED':
      return 'been on a few cruises';
    case 'GOLD':
      return 'been on more cruises';
    case 'PLATINUM':
      return 'been on a ton';
    case 'DIAMOND':
      return 'over 200 cruise days';
    case 'BLUE':
      return 'Rookie, this is your first cruise';
    case 'RED':
      return 'been on a few cruises';
    case 'GOLD':
      return 'been on more cruises';
    case 'PLATINUM':
      return 'been on a ton';
    case 'DIAMOND':
      return 'over 200 cruise days';
    default:
      return '';
      return '';
  }
};

const Summary: React.FC<UserProps> = ({ name, level, cash}) => {
  return (
    <div>
      <div className='my-16'>
        <h1
          className='mb-4 mt-4 text-center font-tempo text-4xl uppercase text-primary-900'
        >
          {name}
        </h1>
        <div>
          <p className='mt-px text-center text-2xl font-bold'>{level}</p>
          <p className='text-center text-lg font-bold leading-3 first-letter:uppercase'>
            {getLevelDescription(level)}
          </p>
        </div>
      </div>
      <Card isBlurred className='mb-5 mt-2 shadow-xl' shadow='sm'>
        <CardBody className=''>
          <div className='align-center flex justify-center gap-2'>
            <div>
              <h3
                className='text-center font-tempo text-xl uppercase text-blue-800'
                style={{ color: '#052049' }}
              >
                Gaming Wallet Balance
              </h3>
              <p className='text-center text-xl font-medium' style={{ color: '#052049' }}>
                {usdFormatter.format(cash)}
              </p>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

type UserMenuProps = {
  isOpen: boolean;
  handleCloseMenu: () => void;
};

type ContentType =
  | 'my-account'
  | 'history'
  | 'prizes'
  | 'accessibility-policy'
  | 'terms-conditions'
  | 'logout';

const UserMenu: React.FC<UserMenuProps> = ({ isOpen, handleCloseMenu }) => {
  const { logoutPlayer } = useAppContext();
  const { balance, updateBalance } = useAppContext();
  const { gameId } = useStoreFrontContext();
  const { handleGenericClickAudio } = useAudioContext();
  const [view, setView] = useState<ContentType>('my-account');
  const [userInfo, setUserInfo] = useState<UserProps>(MOCK_USER);
  const [modalOpen, setModalOpen] = useState(isOpen);

  // hide invisible dismiss buttons
  useHideModalDismissButtons(isOpen, view);

  const changeView = (view: ContentType) => {
    setView(view);
  };

  const handleClose = () => {
    setModalOpen(false);
    handleCloseMenu();
    if (gameId) {
      handleGenericClickAudio(gameId);
    }
    window.history.back();
  };

  const handleLogout = () => {
    handleClose();
    logoutPlayer(handleCloseMenu);
  };

  const refreshUserInfo = async () => {
    if (isOpen) {
      const auth = await checkAuthAccount();
      userInfo.name = `${auth.login?.passenger?.firstname} ${auth.login?.passenger?.lastname}`;
      userInfo.cash = balance?.cmas?.casinoBankBalance || 0;
      if (auth.login?.passenger?.carnival) {
        userInfo.level =
          (auth.login.passenger.carnival.fss?.validateAccountInfoResponseWrapper?.voyageInformation
            ?.guestInformationLinked?.guest?.loyaltyLevel as Level) || 'Blue';
        userInfo.level =
          (auth.login.passenger.carnival.fss?.validateAccountInfoResponseWrapper?.voyageInformation
            ?.guestInformationLinked?.guest?.loyaltyLevel as Level) || 'Blue';
      }
    }
  };

  // update the balance when view changes to deposit
  useEffect(() => {
    if (view === 'my-account') {
      updateBalance();
      refreshUserInfo();
    }
  }, [view]);

  useEffect(() => {
    setModalOpen(isOpen);
  }, [isOpen]);

  useEffect(() => {
    const handlePopState = () => {
      if (modalOpen) {
        setModalOpen(false);
        handleCloseMenu();
      }
    };
    if (modalOpen) {
      window.history.pushState({ modalOpen: true }, '');
    }
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [modalOpen]);

  useEffect(() => {
    setUserInfo(MOCK_USER);
    refreshUserInfo();
  }, [isOpen]);

  // auto focus the close button on modal open
  useEffect(() => {
    const closeButton = document.querySelector(
      'button[role="button"][aria-label="Close"]',
    ) as HTMLElement;
    if (closeButton && isOpen) {
      closeButton.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (event: any) => {
      switch (event.key) {
        case 't':
          changeView('terms-conditions');
          break;
        case 'p':
          changeView('accessibility-policy');
          break;
        case 'l':
          handleLogout();
          break;
        case 'a':
          changeView('my-account');
          break;
        case 'h':
          changeView('history');
          break;
        default:
          break;
      }
    };
    isOpen && document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div className='flex max-w-fit flex-col gap-2'>
      <Modal
        isOpen={isOpen}
        placement='bottom'
        onOpenChange={handleClose}
        isDismissable={false}
        scrollBehavior='inside'
        className='max-h-[90vh] overflow-y-auto'
        aria-label="Menu"
      >
        <ModalContent className='justify-between text-black modal-close-button sm:mb-1'>
          {() => (
            <>
              <div
                className='flex flex-col gap-1 px-6 py-4 pb-0 xs-h:pb-4 text-start font-tempo text-xl xs-h:text-2xl font-bold tracking-tight'
                style={{ color: '#052049', background: '#d9ecf9' }}
              >
                {view === 'my-account' && <h2>MY ACCOUNT</h2>}
                {view === 'history' && <h2>MY HISTORY</h2>}
                {view === 'prizes' && <h2>MY PRIZE</h2>}
                {view === 'accessibility-policy' && <h2>DIGITAL ACCESSIBILITY POLICY</h2>}
                {view === 'terms-conditions' && <h2>TERMS & CONDITIONS</h2>}
                {view === 'logout' && <h2>LOG OUT</h2>}
              </div>
              <ModalBody className='relative rounded-b-2xl' style={{ background: '#d9ecf9' }}>
                <Tabs selectedKey={view} classNames={{
                  panel: "p-0",
                  tabList: "hidden",
                  base: "hidden",
                }}>
                  <Tab key="my-account">
                    <Summary
                      name={userInfo.name}
                      level={userInfo.level}
                      playCount={userInfo.playCount}
                      cash={userInfo.cash}
                    />
                  </Tab>
                  <Tab key="history">
                    <History />
                  </Tab>
                  <Tab key="prizes">
                    <Prizes />
                  </Tab>
                  <Tab key="terms-conditions">
                    <TermsConditions />
                  </Tab>
                  <Tab key="accessibility-policy">
                    <Accessibility />
                  </Tab>
                </Tabs>
              </ModalBody>
              <div className='flex w-full flex-wrap items-center justify-center px-2 py-0 xs-h:py-2 sm-h:py-4'>
                <div className='w-full'>
                  <div className='flex w-full justify-evenly py-0 xs-h:py-1 xs-h:pb-2 sm-h:py-2 sm-h:pb-4'>
                    <Button
                      radius='sm'
                      style={{
                        width: '52px',
                        height: '52px',
                        minWidth: '52px',
                        padding: '0',
                      }}
                      onPress={() => changeView('my-account')}
                      className={`flex flex-col items-center justify-center gap-0 ${
                        view === 'my-account'
                          ? 'bg-gradient-to-l from-user-menu-blue-gradient-dark to-user-menu-blue-gradient-light shadow-user-menu-blue-shadow'
                          : 'bg-user-menu-light-blue'
                      }`}
                      role="tab"
                    >
                      <img
                        src={view === 'my-account' ? AccountIcon : AccountDisabledIcon}
                        alt=''
                      />
                      <p
                        className={`text-[.5625rem] font-medium leading-none ${
                          view === 'my-account'
                            ? 'text-white'
                            : 'text-user-menu-blue-gradient-light'
                        }`}
                      >
                        Account
                      </p>
                    </Button>
                    <Button
                      radius='sm'
                      style={{
                        width: '52px',
                        height: '52px',
                        minWidth: '52px',
                        padding: '0',
                      }}
                      onPress={() => {
                        changeView('history');
                      }}
                      className={`flex flex-col items-center justify-center gap-0 ${
                        view === 'history'
                          ? 'bg-gradient-to-l from-user-menu-blue-gradient-dark to-user-menu-blue-gradient-light shadow-user-menu-blue-shadow'
                          : 'bg-user-menu-light-blue'
                      }`}
                      role="tab"
                    >
                      <img
                        src={view === 'history' ? HistoryIcon : HistoryDisabledIcon}
                        alt=''
                      />
                      <p
                        className={`text-[.5625rem] font-medium leading-none ${
                          view === 'history' ? 'text-white' : 'text-user-menu-blue-gradient-light'
                        }`}
                      >
                        History
                      </p>
                    </Button>
                    <Button
                      radius='sm'
                      style={{
                        width: '52px',
                        height: '52px',
                        minWidth: '52px',
                        padding: '0',
                      }}
                      onPress={handleLogout}
                      className={`flex flex-col items-center justify-center gap-0 ${
                        view === 'logout'
                          ? 'bg-gradient-to-l from-user-menu-blue-gradient-dark to-user-menu-blue-gradient-light shadow-user-menu-blue-shadow'
                          : 'bg-user-menu-light-blue'
                      }`}
                    >
                      <img src={LogoutIcon} alt='' />
                      <p
                        className={`text-[.5625rem] font-medium leading-none ${
                          view === 'logout' ? 'text-white' : 'text-user-menu-blue-gradient-light'
                        }`}
                      >
                        Log out
                      </p>
                    </Button>
                  </div>
                  <Divider />
                  <div className='flex items-center justify-center py-0 xs-h:py-2 sm-h:py-4'>
                    <span
                      className={cn(
                        'mr-4 flex w-1/3 flex-col items-center text-center font-medium text-primary-700',
                        view === 'terms-conditions' && 'text-primary-900',
                      )}
                    >
                      <button
                        onClick={() => changeView('terms-conditions')}
                        className='rounded-md outline-offset-2 outline-primary focus:outline-2'
                        role="tab"
                      >
                        Terms and Conditions
                      </button>
                      <div
                        className={cn(
                          'w-[50%] border-b-1 border-primary-700',
                          view === 'terms-conditions' && 'border-primary-900',
                        )}
                      ></div>
                    </span>
                    <span
                      className={cn(
                        'mr-4 flex w-1/3 flex-col items-center text-center font-medium text-primary-700',
                        view === 'accessibility-policy' && 'text-primary-900',
                      )}
                    >
                      <button
                        onClick={() => changeView('accessibility-policy')}
                        className='rounded-md outline-offset-2 outline-primary focus:outline-2'
                        role="tab"
                      >
                        Policies
                      </button>
                      <div
                        className={cn(
                          'w-[50%] border-b-1 border-primary-700',
                          view === 'accessibility-policy' && 'border-primary-900',
                        )}
                      ></div>
                    </span>
                  </div>
                </div>
              </div>
              <span className='absolute bottom-0 m-1 p-1 text-sm'>{`v${
                import.meta.env.VITE_VERSION
              }`}</span>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default UserMenu;
