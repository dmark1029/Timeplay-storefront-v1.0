import { useEffect, useState } from 'react';

import {
  Button,
  Card,
  CircularProgress,
  Divider,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/react';
import { useNavigate } from 'react-router-dom';

import { AnimateTransition } from '@/components';

import { pick3LogoLong, pick4LogoLong } from '../assets';
import LottoBall from '../components/lotto-ball';
import { useGameContext } from '../context/game-context';
import { ships_service } from '../services/ships-service';
import { CheckoutLine, PowerPicksPurchaseRequest } from '../types';
import PurchaseModal from '../components/purchase-modal';

const PurchasePage = () => {
  const {
    p3LinesCheckout,
    p4LinesCheckout,
    setP3LinesCheckout,
    setP4LinesCheckout,
    category,
    calculateLineValue,
    calculateTicketValue,
    selectedDraws,
    draws,
    setDraws,
    toLongDate,
    purchasedTicket,
    purchaseSuccessVisible,
    setPurchaseSuccessVisible,
    setPurchaseRequestForm,
    isPurchasing,
    setIsPurchasing,
  } = useGameContext();
  const [checkout, setCheckout] = useState<CheckoutLine[]>([]);
  const [purchaseErrorVisible, setPEVisible] = useState(false);
  const [purchaseErrors, setPurchaseErrors] = useState<string[]>([]);
  const navigate = useNavigate();

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
  }, [selectedDraws]);

  const createPurchase = (): PowerPicksPurchaseRequest => {
    let draws = selectedDraws.map(Number);
    return {
      draws: draws,
      lines: checkout,
    };
  };

  const confirmModal = () => {
    setPurchaseSuccessVisible(false);
    switch (category) {
      case 'pick3':
        setP3LinesCheckout([]);
        break;
      case 'pick4':
        setP4LinesCheckout([]);
        break;
      default:
        break;
    }
    navigate('../draws');
  };

  const confirmErrorModal = () => {
    setPEVisible(false);
    navigate('../lines');
  };

  const verifyTicket = (form: PowerPicksPurchaseRequest): [string[], boolean] => {
    let messages: string[] = [];
    let error = false;

    form.lines.forEach((line, idx) => {
      const lineSet = new Set(line.picks);
      if (line.line_type === 'combo' && lineSet.size === 1) {
        messages.push(
          `line #${
            idx + 1
          } is a combo and may not have all the same picks, please choose at least 2 unique numbers.`,
        );
        error = true;
      }
    });
    return [messages, error];
  };

  const handlePurchase = async () => {
    const formReq = createPurchase();
    const [messages, err] = verifyTicket(formReq);
    if (!err) {
      setPurchaseRequestForm(formReq);
      setIsPurchasing(true);
      
    } else {
      setPurchaseErrors(messages);
      setPEVisible(true);
    }
  };

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

  const renderCheckout = () => {
    return checkout.map((line, idx) => {
      return (
        <Card
          key={idx}
          className={`flex w-full flex-row items-center justify-between bg-white p-4`}
        >
          <div className='flex w-full flex-col gap-2'>
            <div className='flex w-full flex-row items-center justify-between'>
              <h1 className='font-tempo text-lg font-black uppercase text-pp-text-light'>
                Line {idx + 1}
              </h1>
              <h1 className='text-pp-text-dark'>
                Stake: ${line.stake} (${calculateLineValue(line)})
              </h1>
              <h1 className='font-bold capitalize text-pp-text-dark'>{line.line_type}</h1>
            </div>
            <div className='flex flex-row items-center justify-between gap-2'>
              <div className='w-full'>
                <div className='flex flex-row gap-2'>
                  {line.picks.map((number, idx) => {
                    if (number === null) return <LottoBall key={idx} scale='small' />;
                    return <LottoBall key={idx} number={number.toString()} scale='small' />;
                  })}
                  {line.fireball_picked && (
                    <LottoBall scale='small' fireball={line.fireball_picked} />
                  )}
                </div>
              </div>
            </div>
          </div>
        </Card>
      );
    });
  };

  return (
    <AnimateTransition initial={true} className='h-full w-full' duration={0.5}>
      <div className='flex h-full w-full flex-col gap-4 overflow-y-auto px-4 py-4'>
        <div className='flex'>
          <Card className='flex w-full flex-col items-center p-4'>
            {category === 'pick3' && <img className='px-6 py-2' src={pick3LogoLong} />}
            {category === 'pick4' && <img className='px-6 py-2' src={pick4LogoLong} />}
            <p className='font-tempo text-2xl uppercase text-pp-text-dark'>Selected Draws:</p>
            <ul>
              {draws ? (
                draws.map((draw) => {
                  if (selectedDraws.includes(`${draw.id}`)) {
                    return (
                      <li key={draw.id} className='font-tempo text-xl text-pp-text-accent'>
                        {toLongDate(draw.draw_time)}
                      </li>
                    );
                  }
                })
              ) : (
                <li>No Draws Selected</li>
              )}
            </ul>
          </Card>
        </div>
        <div className='flex flex-col items-center justify-center gap-4'>
          {renderCheckout()}
          <div className='min-h-[4rem]'></div> {/* blank space for checkout button */}
        </div>

        <div className='flex min-h-[5rem]'></div>
        <div className='absolute bottom-4 right-4 z-50 flex w-[calc(100%-2rem)] flex-col gap-4'>
          {/* <CheckoutModal checkout={checkout} /> */}
          <div className='z-50 flex min-h-[5rem] w-full'>
            <Card className='flex min-h-full w-full items-center justify-center px-8'>
              <p>
                <strong>Total:</strong> ${calculateTicketValue(checkout) * selectedDraws.length}
              </p>
              <Divider className='m-1' />
              <p>
                {checkout.length} Line{checkout.length > 1 && 's'} for {selectedDraws.length} Draw
                {selectedDraws.length > 1 && 's'}
              </p>
            </Card>
          </div>
          <Button
            onClick={handlePurchase}
            isDisabled={isPurchasing || checkout.length === 0 || selectedDraws.length === 0}
            className='min-h-[4rem] w-full rounded-full bg-gradient-to-r from-user-menu-blue-gradient-light to-user-menu-blue-gradient-dark font-tempo text-2xl text-white shadow-user-menu-blue-shadow'
          >
            {isPurchasing ? <CircularProgress /> : 'Purchase'}
          </Button>
        </div>
      </div>
      <Modal
        backdrop='blur'
        isDismissable={false}
        aria-label='Purchase Successful'
        isOpen={purchaseSuccessVisible}
        onClose={confirmModal}
        placement='center'
      >
        <ModalContent className='modal-close-button'>
          <ModalHeader>
            <p className='font-tempo text-2xl uppercase text-pp-text-dark'>Purchase Successful</p>
          </ModalHeader>
          <ModalBody>
            <div className='flex flex-col items-center gap-2'>
              <p>
                You have purchased {checkout.length} Line{checkout.length > 1 && 's'} for{' '}
                {selectedDraws.length} Draw{selectedDraws.length > 1 && 's'}
              </p>
              <p className='text-center font-bold text-pp-text-dark'>
                Ticket #{purchasedTicket?.id}
              </p>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              className='bg-gradient-to-r from-user-menu-blue-gradient-light to-user-menu-blue-gradient-dark font-bold text-white shadow-user-menu-blue-shadow'
              onPress={confirmModal}
            >
              OK
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal
        backdrop='blur'
        isDismissable={false}
        aria-labelledby='Purchase Error'
        isOpen={purchaseErrorVisible}
        onClose={confirmErrorModal}
        placement='center'
      >
        <ModalContent className='modal-close-button'>
          <ModalHeader>
            <p className='font-tempo text-2xl uppercase text-pp-text-dark'>Purchase Error</p>
          </ModalHeader>
          <ModalBody>
            <ol className='ml-4 list-outside list-disc space-y-4'>
              {purchaseErrors.map((error, idx) => (
                <li key={idx}>{error}</li>
              ))}
            </ol>
          </ModalBody>
          <ModalFooter>
            <Button
              className='bg-gradient-to-r from-user-menu-blue-gradient-light to-user-menu-blue-gradient-dark font-bold text-white shadow-user-menu-blue-shadow'
              onPress={confirmErrorModal}
            >
              BACK
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <PurchaseModal isOpen={isPurchasing} onOpenChange={setIsPurchasing} />
    </AnimateTransition>
  );
};
export default PurchasePage;
