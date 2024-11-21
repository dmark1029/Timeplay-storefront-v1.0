import { useEffect, useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, ModalContent } from '@nextui-org/react';
import { useHideModalDismissButtons } from '@/hooks/useHideInivisibleDismissButtons';

type CookieMenuProps = {
  isOpen: boolean;
  onAccept: () => void;
};

const CookieMenu: React.FC<CookieMenuProps> = ({ isOpen, onAccept }) => {
  const [modalOpen, setModalOpen] = useState(isOpen);
  useHideModalDismissButtons(modalOpen);

  const acceptAllCookie = () => {
    setModalOpen(false);
    localStorage.setItem('cookieAccepted', 'true');
    onAccept();
  };

  // auto focus the accept button on modal open
  useEffect(() => {
    const confirmButton = document.querySelector(
      'button[role="button"][aria-label="accept"]',
    ) as HTMLElement;
    if (confirmButton && modalOpen) {
      confirmButton.focus();
    }
  }, [modalOpen]);

  return (
    <div className='flex max-w-fit flex-col gap-2'>
      <Modal
        isOpen={isOpen && modalOpen}
        placement='center'
        hideCloseButton={true}
        onOpenChange={() => setModalOpen(false)}
        isDismissable={false}
        scrollBehavior='inside'
        className='max-h-[90vh] overflow-y-auto'
        classNames={{
          body: "py-3 text-blue-900 font-serif",
          backdrop: "bg-[#292f46]/50 backdrop-opacity-40",
          base: "border-[#292f46] text-[#a8b0d3]",
          header: "border-b-[1px] border-[#DFE1E3]",
          closeButton: "hover:bg-white/5 active:bg-white/10",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className='flex flex-col text-center px-2 text-blue-900'>
                <p className='flex flex-col text-center text-xl tracking-tight font-extrabold'>COOKIES!</p>
              </ModalHeader>
              <ModalBody>
                <p>
                  This site only stores "strictly necessary" information using cookies or similar technologies and cannot be switched off.
                  This information is set on login and is used for authentication. By using our website, you agree to the use of cookies.
                  For cookie policy, refer to&nbsp;
                  <a
                    href="https://www.carnival.com/about-carnival/legal-notice/privacy-notice"
                    target="_blank"
                    className="underline"
                    tabIndex={0}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        window.open('https://www.carnival.com/about-carnival/legal-notice/privacy-notice', '_blank');
                      }
                    }}
                  >
                    Carnival Cookie Policy
                  </a>.
                </p>
              </ModalBody>
              <ModalFooter className='block'>
                <div className='flex w-full justify-center'>
                  <Button role='button' aria-label='accept' onPress={() => { acceptAllCookie(); onClose(); }} onKeyDown={(event) => {
                    (event.key == ' ' || event.key == 'Enter') &&
                      acceptAllCookie();
                  }} className="bg-gradient-to-r from-user-menu-blue-gradient-light to-user-menu-blue-gradient-dark py-6 font-bold text-white shadow-user-menu-blue drop-shadow-sm">
                    ACCEPT
                  </Button>
                </div>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default CookieMenu;
