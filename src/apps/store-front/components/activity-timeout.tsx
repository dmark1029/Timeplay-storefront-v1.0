import { Button, Modal, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react';

type ActivityTimeoutProps = {
  isOpen: boolean;
  handleCloseMenu: () => void;
};

const ActivityTimeout: React.FC<ActivityTimeoutProps> = ({ isOpen, handleCloseMenu }) => {
  const handleClose = async () => {
    handleCloseMenu();
  };

  return (
    <div className='flex max-w-fit flex-col gap-2'>
      <Modal isOpen={isOpen} placement='bottom' onOpenChange={handleClose}>
        <ModalContent className='justify-between text-black modal-close-button'>
          {() => (
            <>
              <ModalHeader className='flex flex-col gap-1 text-center text-xl font-bold tracking-tight text-black'>
                <p className='text-center text-lg'>
                  You have been logged out due to 15 minutes of inactivity.
                </p>
              </ModalHeader>
              <ModalFooter className='flex flex-wrap items-center justify-center'>
                <div>
                  <div className='flex justify-center gap-4 py-2'>
                    <Button radius='sm' onClick={() => handleClose()}>
                      LOG IN
                    </Button>
                  </div>
                </div>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default ActivityTimeout;
