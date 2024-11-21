import { useEffect, useState } from 'react';

import {
  Button,
  Checkbox,
  CheckboxGroup,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from '@nextui-org/react';
import { useNavigate } from 'react-router-dom';

import { useGameContext } from '../context/game-context';
import { ships_service } from '../services/ships-service';
import { CheckoutLine } from '../types';

interface CheckoutModalProps {
  checkout: CheckoutLine[];
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ checkout }) => {
  const { category, calculateTicketValue, draws, setDraws, selectedDraw } = useGameContext();

  const { selectedDraws, setSelectedDraws, toLongDate } = useGameContext();

  useEffect(() => {
    setSelectedDraws(selectedDraw ? ([selectedDraw] as string[]) : []);
  }, [selectedDraw]);

  // check if there are any selected draws that have already been completed and remove
  useEffect(() => {
    const activeDraws = new Set(draws?.map((draw) => draw.id.toString()));
    setSelectedDraws(selectedDraws.filter((id) => activeDraws.has(id)));
  }, [draws]);

  const [visible, setVisible] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    switch (category) {
      case 'pick3':
        ships_service.getP3Draws().then((data) => {
          setDraws(data);
        });
        break;
      case 'pick4':
        ships_service.getP4Draws().then((data) => {
          setDraws(data);
        });
        break;
      default:
        break;
    }
  }, [visible]);

  const openModal = () => setVisible(true);
  const closeModal = () => setVisible(false);

  return (
    <>
      <Button
        onClick={openModal}
        className='min-h-[4rem] w-full rounded-full bg-gradient-to-r from-user-menu-blue-gradient-light to-user-menu-blue-gradient-dark font-tempo text-2xl text-white shadow-user-menu-blue-shadow'
      >
        Checkout (${calculateTicketValue(checkout)})
      </Button>
      <Modal
        closeButton
        aria-label='Select draws for your picks'
        isOpen={visible}
        onClose={closeModal}
      >
        <ModalContent className='modal-close-button'>
          <ModalHeader>
            <h1>
              <strong>Total: ${calculateTicketValue(checkout) * selectedDraws.length}</strong> (
              {checkout.length} lines)
            </h1>
          </ModalHeader>
          <ModalBody className='flex items-center p-4'>
            <p className='text-slate-500'>{selectedDraws.length} Draws Selected</p>
            {draws && draws.length > 0 ? (
              <CheckboxGroup value={selectedDraws} onValueChange={setSelectedDraws}>
                {draws.map((draw) => (
                  <Checkbox key={draw.id} value={`${draw.id}`}>
                    {toLongDate(draw.draw_time)}
                  </Checkbox>
                ))}
              </CheckboxGroup>
            ) : (
              <p>no draws</p>
            )}
            <Button
              isDisabled={selectedDraws.length === 0 || checkout.length === 0}
              className='h-12 w-[80%] bg-gradient-to-r from-user-menu-blue-gradient-light to-user-menu-blue-gradient-dark font-tempo text-xl text-white shadow-user-menu-blue-shadow'
              onClick={() => navigate('../purchase')}
            >
              Continue (${calculateTicketValue(checkout) * selectedDraws.length})
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CheckoutModal;
