import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/react';

type UnderAgePopupProps = {
  isOpen: boolean;
  handleCloseMenu: () => void;
};

const UnderAgePopup: React.FC<UnderAgePopupProps> = ({isOpen, handleCloseMenu }) => {

  return (
      <Modal
        isOpen={isOpen}
        isDismissable={false}
        isKeyboardDismissDisabled={false}
        hideCloseButton={true}
        className='rounded-3xl py-2'
        backdrop='blur'
        placement='center'
      >
        <ModalContent>
          <ModalHeader className='justify-center text-center font-tempo text-xl font-[850]'>
            <p>OOPS!</p>
            <button
              onClick={handleCloseMenu}
              className="text-2xl font-bold cursor-pointer absolute top-[3px] right-[13px]"
            >
              &times;
            </button>
          </ModalHeader>
          <ModalBody className='gap-0 text-center text-xl font-semibold'>
            <p>You must be 18+ to use this app.</p>
            <p>Please come back when you're older!</p>
          </ModalBody>
          <ModalFooter className='justify-center'>
            <Button
              onClick={handleCloseMenu}
              className='h-10 w-32 bg-primary-pressed text-xl font-bold text-white shadow-[0px_8px_25px_0px_#4085EF80] '
            >
              OK
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
  );
};

export default UnderAgePopup;
