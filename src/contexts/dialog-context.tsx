import { createContext, useContext, useState } from 'react';

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  useDisclosure,
} from '@nextui-org/react';
import { AccountBalance } from 'ships-service-sdk';

import InfoModal from '@/apps/power-picks/components/info-modal';
import { useStoreFrontContext } from '@/apps/store-front';
import { GameIntro } from '@/apps/store-front/components';
import { Game } from '@/apps/store-front/types';
import { AnimateTransition, FundLotteryAccount } from '@/components';
import { useAudioContext } from '@/contexts/audio-context';
import { AccountType, GameId, GameIds } from '@/utils/types';

import GameInfo from '../apps/store-front/components/game-info';

type Dialog =
  | ({
      type:
        | 'error'
        | 'info'
        | 'confirm'
        | 'spinner'
        | 'custom'
        | 'preview'
        | 'fund-lottery-account'
        | 'game-intro'
        | 'account-hold'
        | 'game-info'
        | 'casino-hours'
        | 'game-disabled'
        | 'exit-game';
      title?: string;
      body?: string;
      image?: string;
      confirmButtonDisplay?: string;
      onConfirm?: () => void;
      onClose?: () => void;
    } & { [key: string]: any })
  | null;

type PreviewDialog = {
  title: string;
  image: string;
  onPlay: () => void;
};

export type ErrorDialog = {
  title?: string;
  message: string;
  onClose?: () => void;
};

type InfoDialog = {
  title: string;
  message: string;
  onClose?: () => void;
};

type FundLotteryAccountDialog = {
  balance: AccountBalance;
  onSubmit: (
    amount: number,
    chargeType: AccountType,
    pin: string,
  ) => Promise<AccountBalance | undefined>;
} & Dialog;

type GameIntroDialog = {
  type: 'game-intro';
  gameId: GameIds;
} & Dialog;

type GameInfoDialog = {
  type: 'game-info';
  game: Game | null;
  onPlay?: () => void;
  isIOS: boolean;
} & Dialog;

type AccountHoldDialog = { prizeDisplay: string; holdDisplay: string } & Dialog;

type DialogContextType = {
  handleSetDialog: (dialog: Dialog) => void;
  handleSetPreviewDialog: (dialog: PreviewDialog) => void;
  handleSetErrorDialog: (dialog: ErrorDialog) => void;
  handleSetInfoDialog: (dialog: InfoDialog) => void;
  handleSetFundLotteryAccountDialog: (dialog: FundLotteryAccountDialog) => void;
  handleSetGameIntroDialog: (gameId: GameId) => void;
  handleSetAccountHoldDialog: (dialog: AccountHoldDialog) => void;
  handleSetGameInfoDialog: (dialog: GameInfoDialog) => void;
  handleSetCasinoHoursDialog: () => void;
  handleSetGameEnabledDialog: () => void;
  isOpen: boolean;
};

const DialogContext = createContext<DialogContextType>({} as DialogContextType);

export const DialogProvider = ({ children }: { children: React.ReactNode }) => {
  const { gameId } = useStoreFrontContext();
  const [dialog, setDialog] = useState<Dialog>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { handleGenericClickAudio } = useAudioContext();
  const [infoVisible, setInfoVisible] = useState(false);
  const [category, setCategory] = useState('');

  const handleSetDialog = (dialog: Dialog) => {
    if (dialog) {
      setDialog(dialog);
      onOpen();
    } else {
      onClose();
    }
  };

  const handleSetPreviewDialog = (dialog: PreviewDialog) => {
    const { title, image, onPlay } = dialog;
    if (dialog) {
      console.log('dialog already open');
      setDialog({
        type: 'preview',
        title,
        image,
        onConfirm: onPlay,
      });
      onOpen();
    } else {
      setDialog(null);
      onClose();
    }
  };

  const handleSetErrorDialog = (dialog: ErrorDialog) => {
    const { title, message, onClose } = dialog;
    if (dialog) {
      setDialog({
        type: 'error',
        title: title ?? "Error",
        body: message,
        onClose,
      });
      onOpen();
    } else {
      setDialog(null);
      onClose && onClose();
    }
  };

  const handleSetInfoDialog = (dialog: InfoDialog) => {
    const { title, message, onClose } = dialog;
    if (dialog) {
      setDialog({
        type: 'info',
        title,
        body: message,
        onClose,
      });
      onOpen();
    } else {
      setDialog(null);
      onClose && onClose();
    }
  };

  const handleSetFundLotteryAccountDialog = (dialog: FundLotteryAccountDialog) => {
    if (!!dialog) {
      setDialog(dialog);
      onOpen();
    } else {
      setDialog(null);
      onClose();
    }
  };

  const handleSetGameIntroDialog = (gameId: GameId) => {
    if (!gameId) {
      console.error('Game ID is required');
      return;
    }
    setDialog({
      type: 'game-intro',
      gameId,
    });
    onOpen();
  };

  const handleSetAccountHoldDialog = (dialog: AccountHoldDialog) => {
    if (dialog) {
      setDialog({
        type: 'account-hold',
        title: dialog.title,
        body: dialog.body,
        holdDisplay: dialog.holdDisplay,
        prizeDisplay: dialog.prizeDisplay,
      });
      onOpen();
    } else {
      setDialog(null);
      onClose && onClose();
    }
  };

  const handleSetGameInfoDialog = (dialog: GameInfoDialog) => {
    setInfoVisible(true);
    setCategory(dialog.game?.name ?? '');
    if (!!dialog) {
      setDialog({
        type: 'game-info',
        onPlay: dialog.onPlay,
        game: dialog.game,
        isIOS: dialog.isIOS,
      });
      onOpen();
    } else {
      setDialog(null);
      onClose && onClose();
    }
  };

  const handleSetCasinoHoursDialog = () => {
    setDialog({
      type: 'casino-hours',
      title: 'Casino Closed',
      body: 'The casino is currently closed. Please try again later.',
    });
    onOpen();
  };

  const handleSetGameEnabledDialog = () => {
    setDialog({
      type: 'game-disabled',
      title: 'Game is Disabled',
      body: 'This game is currently disabled. Please try again later.',
    });
    onOpen();
  };

  const handleConfirm = () => {
    if (dialog?.onConfirm) {
      dialog.onConfirm();
    }
    handleSetDialog(null);
  };

  const handleClose = () => {
    if (dialog?.onClose) {
      if (gameId) {
        handleGenericClickAudio(gameId);
      }
      dialog.onClose();
    }
    handleSetDialog(null);
  };

  return (
    <DialogContext.Provider
      value={{
        handleSetDialog,
        handleSetPreviewDialog,
        handleSetErrorDialog,
        handleSetInfoDialog,
        handleSetFundLotteryAccountDialog,
        handleSetGameIntroDialog,
        handleSetAccountHoldDialog,
        handleSetGameInfoDialog,
        handleSetCasinoHoursDialog,
        handleSetGameEnabledDialog,
        isOpen,
      }}
    >
      <>
        {/* Confirm Modal */}
        {dialog?.type === 'confirm' && (
          <Modal
            backdrop={'blur'}
            isOpen={isOpen}
            onClose={handleClose}
            placement='center'
            isDismissable={false}
          >
            <ModalContent className='modal-close-button' role="alertdialog">
              {(handleClose) => (
                <>
                  <ModalHeader className='flex flex-col gap-1 text-black'>
                    {dialog?.title}
                  </ModalHeader>
                  <ModalBody className='text-black'>
                    <p>{dialog?.body}</p>
                  </ModalBody>
                  <ModalFooter>
                    <Button color='danger' variant='light' onPress={handleClose}>
                      Close
                    </Button>
                    <Button color='primary' onPress={handleConfirm}>
                      {dialog?.confirmButtonDisplay || 'Confirm'}
                    </Button>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
        )}

        {/* Alert Modal */}
        {dialog?.type === 'error' && (
          <Modal
            backdrop={'blur'}
            isOpen={isOpen}
            onClose={handleClose}
            placement='center'
            isDismissable={false}
            hideCloseButton={true}
            classNames={{
              base: "rounded-3xl",
            }}
          >
            <ModalContent className='modal-close-button'>
              {(handleClose) => (
                <>
                  <ModalHeader className='flex flex-col items-center justify-center gap-1 text-black font-tempo uppercase tracking-wide' style={{
                    fontSize: "20px",
                  }}>{dialog.title}</ModalHeader>
                  <ModalBody className='text-black text-center'>
                    <p>{dialog.body}</p>
                  </ModalBody>
                  <ModalFooter>
                    <div className='flex w-full items-center justify-center'>
                      <Button
                        className='w-2/5 p-6 pl-10 pr-10 bg-gradient-to-r from-user-menu-blue-gradient-light to-user-menu-blue-gradient-dark disabled:from-user-menu-blue-gradient-dark-disabled disabled:from-[1.95%] disabled:to-user-menu-blue-gradient-light-disabled disabled:to-[169.92%] disabled:opacity-80 border-0 font-tempo uppercase text-white tracking-wider shadow-tos-blue-shadow drop-shadow-sm'
                        style={{
                          fontSize: "20px",
                        }}
                        onPress={handleClose}>
                        Close
                      </Button>
                    </div>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
        )}

        {/* Info Modal */}
        {dialog?.type === 'info' && (
          <Modal backdrop={'blur'} isOpen={isOpen} onClose={handleClose} placement='center'>
            <ModalContent className='modal-close-button'>
              {(handleClose) => (
                <>
                  <ModalHeader className='flex flex-col gap-1 text-black'>
                    {dialog?.title}
                  </ModalHeader>
                  <ModalBody className='text-black'>
                    <p>{dialog?.body}</p>
                  </ModalBody>
                  <ModalFooter>
                    <Button color='danger' variant='light' onPress={handleClose}>
                      Close
                    </Button>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
        )}

        {/* Spinner Modal */}
        {dialog?.type === 'spinner' && (
          <Modal
            backdrop={'blur'}
            isOpen={isOpen}
            onClose={onClose}
            isDismissable={false}
            placement='center'
            hideCloseButton
            size='xs'
            classNames={{
              base: 'bg-transparent w-auto h-auto p-2 shadow-none',
            }}
          >
            <ModalContent className='modal-close-button'>
              <Spinner />
            </ModalContent>
          </Modal>
        )}

        {/* Fund Account Modal */}
        {(dialog as FundLotteryAccountDialog)?.type === 'fund-lottery-account' && (
          <Modal
            className='rounded-[30px] bg-white'
            backdrop={'blur'}
            isOpen={isOpen}
            onClose={handleClose}
            isDismissable={false}
            placement='center'
          >
            <ModalContent className='modal-close-button'>
              {/* <ModalHeader /> */}
              <ModalBody>
                <FundLotteryAccount
                  balance={(dialog as FundLotteryAccountDialog).balance}
                  onSubmit={(dialog as FundLotteryAccountDialog).onSubmit}
                  onClose={() => {
                    onClose();
                    if (gameId) {
                      handleGenericClickAudio(gameId);
                    }
                  }}
                />
              </ModalBody>
            </ModalContent>
          </Modal>
        )}

        {/* Game Intro Modal */}
        {(dialog as GameIntroDialog)?.type === 'game-intro' && (
          <section role='dialog' className='fixed inset-0 z-[60] h-full w-full'>
            <AnimateTransition initial={true} duration={0.5}>
              <GameIntro gameId={(dialog as GameIntroDialog).gameId} />
            </AnimateTransition>
          </section>
        )}

        {/* Account Hold Modal */}
        {(dialog as AccountHoldDialog)?.type === 'account-hold' && (
          <Modal
            className='rounded-[30px] bg-white'
            backdrop={'blur'}
            isOpen={isOpen}
            onClose={handleClose}
            placement='center'
          >
            <ModalContent className='modal-close-button'>
              {(handleClose) => (
                <>
                  <ModalHeader className='text-lg font-bold text-black'>
                    {dialog?.title}
                  </ModalHeader>
                  <ModalBody className='flex flex-col items-center'>
                    <p className='mb-2 text-center text-lg text-black'>
                      {`${(dialog as AccountHoldDialog)?.prizeDisplay} ${dialog?.body}`}
                    </p>
                    <p className='mb-2 text-center text-xs text-black'>
                      {(dialog as AccountHoldDialog)?.holdDisplay}
                    </p>
                  </ModalBody>
                  <ModalFooter className='mb-2 flex flex-col items-center'>
                    <Button
                      className='h-[48px] w-4/5 bg-gradient-to-r from-user-menu-blue-gradient-dark to-user-menu-blue-gradient-light font-bold text-white shadow-user-menu-blue-shadow'
                      onPress={() => {
                        setTimeout(handleClose, 5);
                      }}
                    >
                      Close
                    </Button>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
        )}

        {/* Game Info Modal */}
        {(dialog as GameInfoDialog)?.type === 'game-info' && !!(dialog as GameInfoDialog)?.game && (
          <>
            {(dialog as GameInfoDialog).game!.name === 'pick3' ||
            (dialog as GameInfoDialog).game!.name === 'pick4' ? (
              <InfoModal visible={infoVisible} setVisible={setInfoVisible} category={category} />
            ) : (
              <GameInfo
                game={(dialog as GameInfoDialog).game!}
                onPlay={() => {
                  const gameInfoDialog = dialog as GameInfoDialog;
                  if (gameInfoDialog && gameInfoDialog.onPlay) {
                    gameInfoDialog.onPlay();
                  }
                  handleClose();
                }}
                isOpen={isOpen}
                onClose={onClose}
                isIOS={(dialog as GameInfoDialog).isIOS!}
              />
            )}
          </>
        )}

        {/* Casino Hours/Game Disabled Modal */}
        {dialog?.type === 'casino-hours' ||
          (dialog?.type === 'game-disabled' && (
            <Modal
              className='rounded-[30px] bg-white'
              backdrop={'blur'}
              isOpen={isOpen}
              onClose={() => {
                setTimeout(handleClose, 5);
              }}
              placement='center'
            >
              <ModalContent className='modal-close-button'>
                {(handleClose) => (
                  <>
                    <ModalHeader className='text-lg font-bold text-black'>
                      {dialog.title}
                    </ModalHeader>
                    <ModalBody className='flex flex-col items-center'>
                      <p className='mb-2 text-center text-lg text-black'>{`${dialog.body}`}</p>
                    </ModalBody>
                    <ModalFooter className='mb-2 flex flex-col items-center'>
                      <Button
                        className='h-[48px] w-4/5 bg-gradient-to-r from-user-menu-blue-gradient-dark to-user-menu-blue-gradient-light font-bold text-white shadow-user-menu-blue-shadow'
                        onPress={handleClose}
                      >
                        Close
                      </Button>
                    </ModalFooter>
                  </>
                )}
              </ModalContent>
            </Modal>
          ))}

        {/* Exit Game Modal */}
        {dialog?.type === 'exit-game' && (
          <Modal
            backdrop={'blur'}
            isOpen={isOpen}
            onClose={handleClose}
            placement='center'
            isDismissable={true}
          >
            <ModalContent className='modal-close-button'>
              {() => (
                <>
                  <ModalHeader className='text-lg font-bold text-black modal-close-button'>
                    {dialog?.title}
                  </ModalHeader>
                  <ModalBody className='flex items-center justify-center text-user-menu-blue'>
                    <p className='w-4/5 text-center text-lg font-semibold text-black'>
                      {dialog?.body}
                    </p>
                  </ModalBody>
                  <ModalFooter>
                    <div className='flex w-full items-center justify-center'>
                      <Button
                        className='mb-8 h-[48px] w-4/5 bg-gradient-to-r from-user-menu-blue-gradient-dark to-user-menu-blue-gradient-light text-lg font-bold text-white shadow-user-menu-blue-shadow'
                        onPress={handleConfirm}
                      >
                        {dialog?.confirmButtonDisplay || 'Confirm'}
                      </Button>
                    </div>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
        )}
      </>
      {children}
    </DialogContext.Provider>
  );
};

export default DialogContext;

export const useDialogContext = () => useContext(DialogContext);
