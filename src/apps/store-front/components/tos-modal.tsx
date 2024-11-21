import { useEffect, useState } from 'react';
import clsx from 'clsx';

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/react';

import { ScrollToBottomComponent } from '@/components/scroll-to-bottom';
import { useAppContext } from '@/contexts/app-context';
import { useDialogContext } from '@/contexts/dialog-context';
import { activityApi } from '@/services/ships-service';
import { ActivityType } from '@/utils/types';

import TermsConditions from './terms-conditions';

// Bump this up whenever Terms and Conditions gets updated
export const CURRENT_TOS_VERSION = 'carnival-v1.0.0';

type TOCModalProps = {
  isOpen: boolean;
  handleCloseMenu: () => void;
};

const TOSModal: React.FC<TOCModalProps> = ({ isOpen, handleCloseMenu }) => {
  const { authAccount, logoutPlayer } = useAppContext();
  const { handleSetDialog } = useDialogContext();
  const [isAtBottom, setIsAtBottom] = useState(false);

  const handleTOSAgree = async () => {
    try {
      await activityApi.createUserActivity({
        userID: authAccount.login?.user_info?.playerId || '',
        payload: {
          activity_type: ActivityType.TOSAccept,
          meta: {
            tosVersion: CURRENT_TOS_VERSION,
          },
        },
      });
      handleCloseMenu();
    } catch (e) {
      console.error(e);
      handleSetDialog({
        type: 'error',
        title: 'Error',
        body: 'There was an error accepting the Terms and Conditions. Please try again later, or reach out to a crew member for assistance.',
      });
    }
  };

  const handleTOSCancel = () => {
    logoutPlayer(handleCloseMenu);
  };

  const handleTOSBottomScrollEnter = () => {
    setIsAtBottom(true);
  };

  const handleTOSBottomScrollLeave = () => {
    // If in debug mode, do not disable
    if (!import.meta.env.VITE_DEBUG) {
      setIsAtBottom(false);
    }
  };

  useEffect(() => {
    // Always show the Accept button if in debug mode
    if (import.meta.env.VITE_DEBUG) {
      setIsAtBottom(true);
      return;
    }
    // Prevent the Accept button from appearing as enabled upon reopen (ie. if user logs out and into a new account)
    if (isOpen) {
      setIsAtBottom(false);
    }
  }, [isOpen]);

  return (
    <div className='flex max-w-fit flex-col gap-2'>
      <Modal
        isOpen={isOpen}
        placement='bottom'
        isDismissable={false}
        isKeyboardDismissDisabled={true}
        hideCloseButton={true}
        scrollBehavior={'inside'}
      >
        <ModalContent className='modal-close-button justify-between text-black'>
          {() => (
            <>
              <ModalHeader className='flex flex-col gap-1 text-center text-xl font-bold tracking-tight text-black'>
                <h2>TERMS & CONDITIONS</h2>
              </ModalHeader>
              <ModalBody className='relative'>
                <ScrollToBottomComponent
                  onBottomScrollEnter={handleTOSBottomScrollEnter}
                  onBottomScrollLeave={handleTOSBottomScrollLeave}
                  endOfContentLabel='You have reached the end of the Terms and Conditions.'
                >
                  <TermsConditions maxHeight={true} />
                </ScrollToBottomComponent>
              </ModalBody>
              <ModalFooter className='flex flex-wrap items-center justify-center gap-7 pb-8'>
                <Button
                  // isDisabled={!isAtBottom}
                  className={clsx(
                    'w-2/5 p-6 pl-10 pr-10 border-0 font-tempo uppercase tracking-wider shadow-tos-blue-shadow drop-shadow-sm disabled:from-user-menu-blue-gradient-dark-disabled disabled:from-[1.95%] disabled:to-user-menu-blue-gradient-light-disabled disabled:to-[169.92%] disabled:opacity-100',
                    !isAtBottom
                      ? 'bg-[#42485F] text-[#E6E6E6]'
                      : 'bg-gradient-to-r from-user-menu-blue-gradient-light to-user-menu-blue-gradient-dark text-white',
                  )}
                  onPress={() => handleTOSAgree()}
                >
                  I Agree
                </Button>
                <Button
                  className='w-2/5 p-6 pl-10 pr-10 bg-gradient-to-r from-user-menu-red-gradient-light to-user-menu-red-gradient-dark font-tempo uppercase text-white tracking-wider shadow-tos-black-shadow drop-shadow-sm'
                  onPress={() => handleTOSCancel()}
                >
                  I Decline
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default TOSModal;
