import { useEffect, useRef, useState } from 'react';

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
import { motion } from 'framer-motion';

import { backButtonImg, closeButtonImg } from '@/assets/images';
import { useAppContext } from '@/contexts/app-context';
import { Sfx, useAudioContext } from '@/contexts/audio-context';
import { useDialogContext } from '@/contexts/dialog-context';
import { AccountType } from '@/utils/types';

import { useGameContext } from '../context/game-context';
import { CheckoutLine } from '../types';

enum ModalStates {
  PAYMENT_OPTIONS,
  CONFIRMATION,
}

type PurchaseModalProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
};

const PurchaseModal: React.FC<PurchaseModalProps> = ({ isOpen, onOpenChange }) => {
  const [modalState, setModalState] = useState(ModalStates.PAYMENT_OPTIONS);
  const { isOpen: isGlobalDialogOpen } = useDialogContext();

  if (isGlobalDialogOpen) {
    onOpenChange(false);
  }

  return (
    <Modal
      backdrop={'blur'}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      placement='center'
      isDismissable={false}
      className='m-4 rounded-3xl'
      hideCloseButton={true}
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

const PaymentOptionsState: React.FC<ModalStateProps> = ({ changeState }) => {
  const {
    category,
    selectedAccountType,
    setSelectedAccountType,
    calculateTicketValue,
    p3LinesCheckout,
    p4LinesCheckout,
  } = useGameContext();
  const [checkout, setCheckout] = useState<CheckoutLine[]>([]);

  const { balance } = useAppContext();
  const casinoBalance = balance?.cmas?.casinoBankBalance || 0;

  const { playSoundEffect } = useAudioContext();

  useEffect(() => {
    switch (category) {
      case 'pick3':
        setCheckout(p3LinesCheckout);
        break;
      case 'pick4':
        setCheckout(p4LinesCheckout);
        break;
      default:
        break;
    }
  }, [category, p3LinesCheckout, p4LinesCheckout]);

  const handleChangeSelectedAccount = (account: AccountType) => {
    setSelectedAccountType(account);
    playSoundEffect(Sfx.OTH_BASIC_CLICK);
  };

  const handleNextClick = () => {
    changeState(ModalStates.CONFIRMATION);
    playSoundEffect(Sfx.OTH_BASIC_CLICK);
  };

  return (
    <ModalContent>
      {(onClose) => (
        <>
          <ModalHeader className='flex items-center justify-between gap-1 font-tempo font-black uppercase text-black'>
            <h1 className='text-2xl'>Payment Options</h1>
            <CloseButton
              onClick={() => {
                console.log('Close click');
                onClose();
                changeState(ModalStates.PAYMENT_OPTIONS);
              }}
            />
          </ModalHeader>
          <ModalBody className='text-black'>
            <hr className='w-full' />
            <h2 className='text-center font-bold uppercase'>
              Total: ${calculateTicketValue(checkout)}
            </h2>
            <hr className='w-full' />
            <fieldset className='flex flex-col gap-2 px-4'>
              <Checkbox
                isSelected={selectedAccountType === AccountType.Room}
                onChange={() => handleChangeSelectedAccount(AccountType.Room)}
                classNames={{
                  wrapper: 'after:bg-user-menu-blue',
                }}
              >
                Charge to my <span className='font-bold'>Sign & Sail Account </span>
              </Checkbox>
              <Checkbox
                isSelected={selectedAccountType === AccountType.Casino}
                onChange={() => handleChangeSelectedAccount(AccountType.Casino)}
                classNames={{
                  wrapper: 'after:bg-user-menu-blue',
                }}
              >
                Charge to my <span className='font-bold'>Gaming Wallet </span>(Balance: $
                {casinoBalance.toFixed(2)})
              </Checkbox>
            </fieldset>
          </ModalBody>
          <ModalFooter>
            <Button
              onPress={handleNextClick}
              fullWidth
              className='bg-gradient-to-r from-user-menu-blue-gradient-light to-user-menu-blue-gradient-dark py-6 font-bold text-white shadow-user-menu-blue drop-shadow-sm'
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
  const {
    purchaseTicket,
    setUserPIN,
    userPIN,
    selectedAccountType,
    setPurchasedTicket,
    purchaseRequestForm,
    isPurchasing,
    setIsPurchasing,
    setPurchaseSuccessVisible,
  } = useGameContext();
  const { playSoundEffect } = useAudioContext();

  const [isPINValid, setIsPINValid] = useState(true);
  const pinFieldRef = useRef<HTMLInputElement>(null);
  const { balance } = useAppContext();
  const casinoBalance = balance?.cmas?.casinoBankBalance || 0;

  const handleConfirmClick = () => {
    if (userPIN.length === 0) {
      setIsPINValid(false);
      pinFieldRef.current?.focus();
      playSoundEffect(Sfx.OTH_STAKE_END);
      return;
    }

    setIsPurchasing(true);
    try {
      const res = purchaseTicket(purchaseRequestForm, selectedAccountType, userPIN);
      setPurchasedTicket(res);
      setPurchaseSuccessVisible(true);
    } catch (error) {
      console.log('Error purchasing ticket:', error);
    } finally {
      setIsPurchasing(false);
    }
    setUserPIN('');
  };

  const handleBackClick = () => {
    playSoundEffect(Sfx.OTH_BASIC_CLICK);
    setUserPIN('');
    changeState(ModalStates.PAYMENT_OPTIONS);
  };

  const handlePINInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsPINValid(true);
    setUserPIN(e.target.value);
  };

  useEffect(() => {
    if (pinFieldRef.current) {
      pinFieldRef.current.focus();
    }
  }, []);

  return (
    <ModalContent>
      {(onClose) => (
        <>
          <ModalHeader className='flex items-center justify-between gap-1 font-tempo font-black uppercase text-black'>
            <BackButton onClick={handleBackClick} />
            <h1 className='text-2xl'>Confirm Payment</h1>
            <CloseButton
              onClick={() => {
                onClose();
                changeState(ModalStates.PAYMENT_OPTIONS);
              }}
            />
          </ModalHeader>
          <ModalBody className='text-black'>
            <hr className='w-full' />
            <h1 className='text-center'>Enter PIN</h1>
            <Input
              size='lg'
              key='input_pin'
              id='pin-input'
              type='password'
              placeholder='MMYY'
              value={userPIN}
              className='w-full'
              inputMode='numeric'
              classNames={{
                input: 'text-center',
              }}
              onChange={handlePINInputChange}
              isInvalid={!isPINValid}
              ref={pinFieldRef}
            />
            {!isPINValid && <p className='text-center text-red-500'>** Please enter a valid PIN</p>}
            <p className='text-center text-sm'>
              * Default PIN is MMYY of your birth date. If you have changed it, please enter your
              new PIN.
            </p>
            <h1 className='text-center font-bold'>
              Gaming Wallet Balance: <span>${casinoBalance.toFixed(2)}</span>
            </h1>
          </ModalBody>
          <ModalFooter>
            <Button
              onPress={handleConfirmClick}
              fullWidth
              spinner={isPurchasing}
              className='bg-gradient-to-r from-user-menu-blue-gradient-light to-user-menu-blue-gradient-dark py-6 font-bold text-white shadow-user-menu-blue drop-shadow-sm'
            >
              Confirm Purchase
            </Button>
          </ModalFooter>
        </>
      )}
    </ModalContent>
  );
};

type BackButtonProps = {
  onClick: () => void;
};

const BackButton = ({ onClick }: BackButtonProps) => {
  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className='h-10 w-10'
      aria-label='Back'
    >
      <img src={backButtonImg} className='h-full w-full' alt='Back' />
    </motion.button>
  );
};

type CloseButtonProps = {
  onClick: () => void;
};

const CloseButton = ({ onClick }: CloseButtonProps) => {
  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className='h-10 w-10'
      aria-label='Close'
    >
      <img src={closeButtonImg} className='h-full w-full' alt='Close' />
    </motion.button>
  );
};
