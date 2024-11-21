import { useEffect } from 'react';

import {
  Button,
  Checkbox,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/react';
import { motion } from 'framer-motion';
import useLocalStorage from 'use-local-storage';

import { useStoreFrontContext } from '@/apps/store-front';
import { Sfx, useAudioContext } from '@/contexts/audio-context';
import { useDialogContext } from '@/contexts/dialog-context';
import { GameIds } from '@/utils/types';

import { closeButtonImg } from '@/assets/images';
import { useGameContext } from '../context/game-context';

type AutoplayModalProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
};

const AutoplayModal: React.FC<AutoplayModalProps> = ({ isOpen, onOpenChange }) => {
  const { playSoundEffect } = useAudioContext();
  const { setAutoPlay } = useGameContext();
  const { isOpen: isGlobalDialogOpen } = useDialogContext();
  const { gameId } = useStoreFrontContext();
  const [isChecked, setIsChecked] = useLocalStorage('dont_ask_for_autoplay', false);

  if (isGlobalDialogOpen) {
    onOpenChange(false);
  }

  const handleAutoplayClick = () => {
    playSoundEffect(Sfx.OTH_BASIC_CLICK);
    setAutoPlay(true);
    onOpenChange(false);
  };

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
    >
      <ModalContent className='modal-close-button'>
        {(onClose) => (
          <>
            <ModalHeader className='flex items-center justify-end gap-1 font-tempo font-black uppercase text-black'>
              <CloseButton
                onClick={() => {
                  onClose();
                  setIsChecked(false);
                  playSoundEffect(Sfx.OTH_BASIC_CLICK);
                }}
              />
            </ModalHeader>
            <ModalBody className='text-center text-black'>
              AUTOPLAY will reveal all cards in succession.
            </ModalBody>
            <ModalFooter>
              <div className='flex w-full flex-col items-center justify-center gap-4 pb-2'>
                <Button
                  onPress={handleAutoplayClick}
                  fullWidth
                  className='bg-gradient-to-r from-user-menu-blue-gradient-light to-user-menu-blue-gradient-dark py-6 font-bold uppercase text-white shadow-user-menu-blue drop-shadow-sm'
                >
                  Autoplay
                </Button>
                <Checkbox
                  checked={isChecked}
                  onChange={(e) => {
                    setIsChecked(e.target.checked);
                  }}
                  className='text-black'
                  classNames={{
                    wrapper: 'after:bg-user-menu-blue',
                  }}
                >
                  Don't ask me again
                </Checkbox>
              </div>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
export default AutoplayModal;

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
