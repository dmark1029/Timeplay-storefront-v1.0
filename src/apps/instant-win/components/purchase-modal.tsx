import { FormEvent, forwardRef, useEffect, useRef, useState } from 'react';

import {
  Button,
  Checkbox,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/react';
import { announce } from '@react-aria/live-announcer';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';

import { useStoreFrontContext } from '@/apps/store-front';
import { backButtonImg, closeButtonImg } from '@/assets/images';
import { useAppContext } from '@/contexts/app-context';
import { Sfx, useAudioContext } from '@/contexts/audio-context';
import { useDialogContext } from '@/contexts/dialog-context';
import { useFocusOnRefChange } from '@/hooks/useFocusOnRefChange';
import { useHideModalDismissButtons } from '@/hooks/useHideInivisibleDismissButtons';
import { AccountType, GameIds } from '@/utils/types';

import { useGameContext } from '../context/game-context';

enum ModalStates {
  TICKETS,
  PAYMENT_OPTIONS,
  CONFIRMATION,
}

type PurchaseModalProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
};

const PurchaseModal: React.FC<PurchaseModalProps> = ({ isOpen, onOpenChange }) => {
  const [modalState, setModalState] = useState(ModalStates.TICKETS);
  const { isOpen: isGlobalDialogOpen } = useDialogContext();
  const { gameId } = useStoreFrontContext();
  const { playSoundEffect } = useAudioContext();

  if (isGlobalDialogOpen) {
    onOpenChange(false);
  }

  // hide invisible dismiss buttons
  useHideModalDismissButtons(isOpen, modalState);

  useEffect(() => {
    if (isOpen) {
      switch (gameId) {
        case GameIds.CruisingForCash:
          playSoundEffect(Sfx.CFC_POPUP);
          break;
        case GameIds.OceanTreasure:
          playSoundEffect(Sfx.OTH_POPUP);
          break;
        case GameIds.BreakTheBank:
          playSoundEffect(Sfx.DOND_POPUP);
          break;
        default:
          playSoundEffect(Sfx.OTH_POPUP);
          break;
      }
    }
  }, [isOpen]);

  return (
    <Modal
      backdrop={'blur'}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      placement='center'
      isDismissable={false}
      className='m-4 rounded-3xl'
      hideCloseButton={true}
      classNames={{ header: 'pb-0' }}
    >
      <RenderState state={modalState} changeState={setModalState} />
    </Modal>
  );
};

export default PurchaseModal;
type RenderStateProps = {
  state: ModalStates;
  changeState: (state: ModalStates) => void;
};

const RenderState: React.FC<RenderStateProps> = ({ state, changeState }) => {
  switch (state) {
    case ModalStates.TICKETS:
      return <TicketsState changeState={changeState} />;
    case ModalStates.PAYMENT_OPTIONS:
      return <PaymentOptionsState changeState={changeState} />;
    case ModalStates.CONFIRMATION:
      return <ConfirmationState changeState={changeState} />;
    default:
      return null;
  }
};

type ModalStateProps = {
  changeState: (state: ModalStates) => void;
};

const TicketsState: React.FC<ModalStateProps> = ({ changeState }) => {
  const {
    possibleStakes,
    stakeIndex,
    changeStakeAndSession,
    purchaseCount,
    changePurchaseCount,
    topPrize,
    setSelectedAccountType,
    setPurchaseCount,
  } = useGameContext();
  const { gameId } = useStoreFrontContext();

  const { balance } = useAppContext();
  const [purchaseCountInvalid, setPurchaseCountInvalid] = useState<boolean>(false);
  const [minusButtonDisabled, setMinusButtonDisabled] = useState<boolean>(true);
  const [plusButtonDisabled, setPlusButtonDisabled] = useState<boolean>(false);

  const firstElementRef = useRef<HTMLElement>(null);
  const minusButtonRef = useRef<HTMLButtonElement>(null);
  const plusButtonRef = useRef<HTMLButtonElement>(null);

  const casinoBalance = balance?.cmas?.casinoBankBalance || 0;
  const isCasinoBalanceSufficient = casinoBalance >= possibleStakes[stakeIndex] * purchaseCount;
  const maxNumTickets = 100;

  const { playSoundEffect, handleGenericClickAudio } = useAudioContext();

  const handleNextClick = () => {
    // if no valid purchase count, return early
    if (purchaseCountInvalid) {
      return;
    }

    if (gameId) {
      handleGenericClickAudio(gameId);
    }
    isCasinoBalanceSufficient
      ? setSelectedAccountType(AccountType.Casino)
      : setSelectedAccountType(AccountType.Room);
    changeState(ModalStates.PAYMENT_OPTIONS);
  };

  const handleReducePurchaseCount = () => {
    switch (gameId) {
      case 'ocean-treasure':
        playSoundEffect(Sfx.OTH_STAKE_DOWN);
        break;
      case 'dond-dbk':
        playSoundEffect(Sfx.DOND_STAKE_DOWN);
        break;
      case 'cruising-for-cash':
        playSoundEffect(Sfx.CFC_STAKE_DOWN);
        break;
      default:
        break;
    }
    announce(
      `Set number of tickets to ${purchaseCount - 1}. Total is $${
        possibleStakes[stakeIndex] * (purchaseCount - 1)
      }`,
    );
    changePurchaseCount(false);
  };

  const handleIncreasePurchaseCount = () => {
    switch (gameId) {
      case 'ocean-treasure':
        playSoundEffect(Sfx.OTH_STAKE_UP);
        break;
      case 'dond-dbk':
        playSoundEffect(Sfx.DOND_STAKE_UP);
        break;
      case 'cruising-for-cash':
        playSoundEffect(Sfx.CFC_STAKE_UP);
        break;
      default:
        break;
    }
    announce(
      `Set number of tickets to ${purchaseCount + 1}. Total is $${
        possibleStakes[stakeIndex] * (purchaseCount + 1)
      }`,
    );
    changePurchaseCount(true);
  };

  const handleSelectStake = (index: number) => {
    if (gameId) {
      handleGenericClickAudio(gameId);
    }
    announce(
      `Selected stake amount of $${possibleStakes[index]} per ticket. Total is $${
        possibleStakes[index] * purchaseCount
      }`,
    );
    changeStakeAndSession(index);
  };

  // this is to force focus onto the first element for ADA
  useFocusOnRefChange(firstElementRef);

  const handleOnPurchaseCountChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    // parse val to int (input is also set to numeric)
    const val = parseInt(e.target.value);
    // ensure number is a number and int
    if (!isNaN(val) && Number.isInteger(val)) {
      // if the amount entered is less than or equal to the maximum use it otherwise set it to max
      setPurchaseCount(Math.min(val, maxNumTickets));
    } else {
      setPurchaseCount(0);
    }
  };

  // whenever purchase count changes update the invalid flag, and the plus and minus buttons accordingly
  useEffect(() => {
    setPurchaseCountInvalid(purchaseCount < 1);

    switch (true) {
      case purchaseCount <= 1:
        setMinusButtonDisabled(true);
        setPlusButtonDisabled(false);
        if (minusButtonRef.current && document.activeElement === minusButtonRef.current) {
          // shift focus to plus button per ada
          plusButtonRef.current?.focus();
        }
        break;
      case purchaseCount >= maxNumTickets:
        setMinusButtonDisabled(false);
        setPlusButtonDisabled(true);
        if (plusButtonRef.current && document.activeElement === plusButtonRef.current) {
          // shift focus to prev button per ada
          minusButtonRef.current?.focus();
        }
        break;
      default:
        setMinusButtonDisabled(false);
        setPlusButtonDisabled(false);
        break;
    }
  }, [purchaseCount]);

  return (
    <ModalContent className='modal-close-button'>
      {(onClose) => (
        <>
          <ModalHeader className='flex items-center justify-between gap-1 font-tempo font-black uppercase text-black'>
            <BackButton
              ref={firstElementRef}
              onClick={() => {
                if (gameId) {
                  handleGenericClickAudio(gameId);
                }
                onClose();
              }}
            />
            <h1 className='text-2xl text-primary-900'> Cards</h1>
            <CloseButton
              onClick={() => {
                onClose();
                if (gameId) {
                  handleGenericClickAudio(gameId);
                }
                changeState(ModalStates.TICKETS);
              }}
            />
          </ModalHeader>
          <ModalBody className='text-black'>
            <hr className='w-full' />
            <div className='flex flex-col justify-center'>
              <p className='text-center text-lg font-bold'>
                Win up to{' '}
                {
                  <AnimatePresence mode='wait'>
                    <motion.span
                      key={topPrize}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      transition={{ duration: 0.15, ease: 'easeOut' }}
                      className='font-extrabold text-green-700'
                    >
                      {`${topPrize}!`}
                    </motion.span>
                  </AnimatePresence>
                }
              </p>
              <p className='text-md text-center'>Buy More, Win More!</p>
            </div>
            <hr className='w-full' />
            <h2 className='w-full text-center font-tempo text-xl uppercase text-primary-900'>
              Card Price
            </h2>
            <div className='flex w-full justify-center gap-3'>
              {possibleStakes.slice(0, 3).map((stake, index) => (
                <Button
                  key={index}
                  onPress={() => handleSelectStake(index)}
                  radius='sm'
                  className={clsx(
                    'py-6 font-bold',
                    stakeIndex === index
                      ? 'bg-gradient-to-r from-user-menu-blue-gradient-light to-user-menu-blue-gradient-dark text-white'
                      : 'bg-user-menu-light-blue text-primary-900',
                  )}
                >
                  ${stake}
                </Button>
              ))}
            </div>
            <hr className='w-full' />
            <h2
              id='quantity-label'
              className='w-full text-center font-tempo text-xl uppercase text-primary-900'
            >
              Quantity
            </h2>
            <div className='flex w-full items-center justify-center gap-4'>
              <Button
                onPress={handleReducePurchaseCount}
                isDisabled={minusButtonDisabled}
                radius='full'
                className='bg-gradient-to-r from-user-menu-blue-gradient-light to-user-menu-blue-gradient-dark font-roboto text-2xl font-bold text-white'
                isIconOnly
                ref={minusButtonRef}
              >
                -
              </Button>
              <Input
                className='w-24 rounded-2xl border-2 border-black text-center'
                style={{ textAlign: 'center' }}
                radius='lg'
                size='sm'
                inputMode='numeric'
                type='number'
                value={purchaseCount.toString()}
                onChange={handleOnPurchaseCountChanged}
                isInvalid={purchaseCountInvalid}
                aria-labelledby='quantity-label'
                aria-describedby={'purchase-count-error-text'}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleNextClick();
                  }
                }}
              />
              <Button
                onPress={handleIncreasePurchaseCount}
                isDisabled={plusButtonDisabled}
                radius='full'
                color='default'
                className='bg-gradient-to-r from-user-menu-blue-gradient-light to-user-menu-blue-gradient-dark font-roboto text-2xl font-bold text-white'
                isIconOnly
                ref={plusButtonRef}
              >
                +
              </Button>
            </div>
            <hr className='w-full' />
            <div className='flex w-full justify-center'>
              <p className='font-tempo text-xl uppercase text-primary-900'>
                Total:{' '}
                <span className='font-roboto font-bold'>
                  ${possibleStakes[stakeIndex] * purchaseCount}
                </span>
              </p>
            </div>
          </ModalBody>
          <ModalFooter>
            <div className='flex h-full w-full flex-col items-center justify-center'>
              <div
                id='purchase-count-error-text'
                className={`mb-1 text-sm text-red-500 ${
                  purchaseCountInvalid ? 'visible' : 'invisible'
                }`}
              >
                Please select a value greater than 0
              </div>
              <Button
                onPress={handleNextClick}
                fullWidth
                className='bg-gradient-to-r from-user-menu-blue-gradient-light to-user-menu-blue-gradient-dark py-6 font-bold text-white shadow-user-menu-blue drop-shadow-sm'
              >
                Next
              </Button>
            </div>
          </ModalFooter>
        </>
      )}
    </ModalContent>
  );
};

const PaymentOptionsState: React.FC<ModalStateProps> = ({ changeState }) => {
  const { possibleStakes, stakeIndex, purchaseCount, selectedAccountType, setSelectedAccountType } =
    useGameContext();

  const { balance } = useAppContext();
  const casinoBalance = balance?.cmas?.casinoBankBalance || 0;

  const { handleGenericClickAudio } = useAudioContext();
  const { gameId } = useStoreFrontContext();

  const firstElementRef = useRef<HTMLElement>(null);

  const handleChangeSelectedAccount = (account: AccountType) => {
    setSelectedAccountType(account);
    if (gameId) {
      handleGenericClickAudio(gameId);
    }
  };

  const handleNextClick = () => {
    changeState(ModalStates.CONFIRMATION);
    if (gameId) {
      handleGenericClickAudio(gameId);
    }
  };

  const handleBackClick = () => {
    changeState(ModalStates.TICKETS);
    if (gameId) {
      handleGenericClickAudio(gameId);
    }
  };

  // this is to force focus onto the first element for ADA
  useFocusOnRefChange(firstElementRef);

  return (
    <ModalContent className='modal-close-button'>
      {(onClose) => (
        <>
          <ModalHeader className='flex items-center justify-between gap-1 font-tempo font-black uppercase  text-primary-900'>
            <BackButton ref={firstElementRef} onClick={handleBackClick} />
            <h1 className='text-2xl'>Purchase Options</h1>
            <CloseButton
              onClick={() => {
                console.log('Close click');
                onClose();
                changeState(ModalStates.TICKETS);
              }}
            />
          </ModalHeader>
          <ModalBody className=' text-primary-900'>
            <hr className='w-full' />
            <p className='text-center font-roboto text-lg font-medium'>
              <span className='font-black uppercase'>Total:</span> $
              {possibleStakes[stakeIndex] * purchaseCount} ({purchaseCount}{' '}
              {purchaseCount > 1 ? 'cards' : 'card'})
            </p>
            <hr className='w-full' />
            <fieldset className='flex flex-col gap-2 px-4'>
              <Checkbox
                isSelected={selectedAccountType === AccountType.Room}
                onChange={() => handleChangeSelectedAccount(AccountType.Room)}
                classNames={{
                  label: 'text-primary-900',
                  wrapper: 'after:bg-user-menu-blue before:border-user-menu-blue',
                  icon: 'border-red-500',
                }}
              >
                Charge my <span className='font-bold '>Sail & Sign ®</span>
              </Checkbox>
              <Checkbox
                isSelected={selectedAccountType === AccountType.Casino}
                onChange={() => handleChangeSelectedAccount(AccountType.Casino)}
                classNames={{
                  label: 'text-primary-900',
                  wrapper: 'after:bg-user-menu-blue before:border-user-menu-blue',
                }}
              >
                Charge my <span className='font-bold'>Gaming Wallet </span>(Balance: $
                {casinoBalance.toFixed(2)})
              </Checkbox>
            </fieldset>
          </ModalBody>
          <ModalFooter>
            <Button
              onPress={handleNextClick}
              fullWidth
              className='bg-gradient-to-r from-user-menu-blue-gradient-light to-user-menu-blue-gradient-dark py-6 font-tempo text-xl font-bold uppercase tracking-wider text-white shadow-user-menu-blue drop-shadow-sm'
            >
              Next
            </Button>
          </ModalFooter>
        </>
      )}
    </ModalContent>
  );
};

const ConfirmationState: React.FC<ModalStateProps> = ({ changeState }) => {
  const { purchaseTicket, setUserPIN, userPIN, selectedAccountType } = useGameContext();
  const { playSoundEffect, handleGenericClickAudio } = useAudioContext();
  const { gameId } = useStoreFrontContext();

  const [isPINValid, setIsPINValid] = useState(true);
  const pinFieldRef = useRef<HTMLInputElement>(null);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const { balance } = useAppContext();
  const casinoBalance = balance?.cmas?.casinoBankBalance || 0;

  const firstElementRef = useRef<HTMLElement>(null);

  const handleConfirmClick = async () => {
    if (userPIN.length === 0) {
      setIsPINValid(false);
      pinFieldRef.current?.focus();
      playSoundEffect(Sfx.OTH_STAKE_END);
      return;
    }

    setIsPurchasing(true);
    try {
      await purchaseTicket();
    } catch (error) {
      console.log('Error purchasing ticket:', error);
    } finally {
      setIsPurchasing(false);
    }
    setUserPIN('');
  };

  const handleBackClick = () => {
    if (gameId) {
      handleGenericClickAudio(gameId);
    }
    setUserPIN('');
    changeState(ModalStates.PAYMENT_OPTIONS);
  };

  const handlePINInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsPINValid(true);
    setUserPIN(e.target.value);
  };

  // this is to force focus onto the first element for ADA
  useFocusOnRefChange(firstElementRef);

  return (
    <ModalContent className='modal-close-button'>
      {(onClose) => (
        <form
          onSubmit={(event: FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            handleConfirmClick();
          }}
        >
          <ModalHeader className='flex items-center justify-between gap-1 font-tempo font-black uppercase text-black'>
            <BackButton ref={firstElementRef} onClick={handleBackClick} />
            <h1 className='text-2xl text-primary-900'>Confirm Purchase</h1>
            <CloseButton
              onClick={() => {
                onClose();
                changeState(ModalStates.TICKETS);
              }}
            />
          </ModalHeader>
          <ModalBody className='text-black'>
            <hr className='w-full' />
            <p className='text-center text-xl font-bold text-primary-900'>Enter Casino PIN</p>
            <Input
              size='lg'
              key='input_pin'
              id='pin-input'
              type='password'
              placeholder='----'
              value={userPIN}
              className='w-full'
              inputMode='numeric'
              classNames={{
                inputWrapper: 'border-2 border-primary-900',
                input: 'text-center font-black placeholder:text-neutral-900',
              }}
              onChange={handlePINInputChange}
              isInvalid={!isPINValid}
              isDisabled={isPurchasing}
              ref={pinFieldRef}
            />
            {!isPINValid && <p className='text-center text-red-800'>** Please enter a valid PIN</p>}
            <p className='text-center text-sm'>
              * Default PIN is MMYY of your birth date. If you have changed it, please enter your
              new PIN.
            </p>
            {selectedAccountType === AccountType.Casino && (
              <p className='text-center text-xl font-bold'>
                Gaming Wallet Balance:{' '}
                <span className='font-roboto font-normal'>${casinoBalance.toFixed(2)}</span>
              </p>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              type='submit'
              fullWidth
              isLoading={isPurchasing}
              className='bg-gradient-to-r from-user-menu-blue-gradient-light to-user-menu-blue-gradient-dark py-6 font-tempo text-xl font-bold uppercase tracking-wider text-white shadow-user-menu-blue drop-shadow-sm'
            >
              Confirm Purchase
            </Button>
          </ModalFooter>
        </form>
      )}
    </ModalContent>
  );
};

type BackButtonProps = {
  onClick: () => void;
};

const BackButton = forwardRef<HTMLElement, BackButtonProps>(({ onClick }, ref) => {
  return (
    <motion.button
      ref={ref as React.Ref<HTMLButtonElement>}
      type='button'
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className='h-10 w-10 focus:outline-primary'
      aria-label='Back'
    >
      <img src={backButtonImg} className='h-full w-full' alt='Back' />
    </motion.button>
  );
});

type CloseButtonProps = {
  onClick: () => void;
};

const CloseButton = ({ onClick }: CloseButtonProps) => {
  return (
    <motion.button
      type='button'
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className='h-10 w-10 focus:outline-primary'
      aria-label='Close'
    >
      <img src={closeButtonImg} className='h-full w-full' alt='Close' />
    </motion.button>
  );
};
