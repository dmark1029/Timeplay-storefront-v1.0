import { useEffect, useState } from 'react';

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/react';
import { Card, CardBody, CardFooter, CardHeader } from '@nextui-org/react';
import { SessionData, SkuSKUPackage } from 'ships-service-sdk';

import { useAppContext } from '@/contexts/app-context';
import { useDialogContext } from '@/contexts/dialog-context';
import { accountApi } from '@/services/ships-service';

type sessionCardProps = {
  session?: SessionData;
  onComplete: (session?: SessionData) => void;
};

const SessionCard: React.FC<sessionCardProps> = ({ session, onComplete }) => {
  const [onePkg, setOnePackage] = useState<SkuSKUPackage>();
  const [selectedPackage, setSelectedPackage] = useState<SkuSKUPackage>();
  const [isPurchaseConfirmOpen, setPurchaseConfirmOpen] = useState<boolean>(false);
  const [isPackageSelectOpen, setPackageSelectOpen] = useState<boolean>(false);
  const { authAccount } = useAppContext();
  const { handleSetErrorDialog } = useDialogContext();

  useEffect(() => {
    if (session) {
      const onePkg =
        session.entry_packages_detail && session.entry_packages_detail?.length == 1
          ? session.entry_packages_detail[0]
          : undefined;
      setOnePackage(onePkg);
      setSelectedPackage(onePkg);
    }
  }, [session]);

  // logic in getPurchaseText and onSessionClick should be kept identical
  const getPurchaseText = (pkg: SkuSKUPackage | undefined): string => {
    if (session?.validate_user?.is_valid) {
      return `Continue Playing`;
    } else if (pkg) {
      if (pkg.price == 0) {
        return `Play for free`;
      } else {
        return `Play for $${pkg?.price}`;
      }
    } else {
      return `Select a package to play`;
    }
  };

  // logic in getPurchaseText and onSessionClick should be kept identical
  const onSessionClick = async () => {
    try {
      // already purchased
      if (session?.validate_user?.is_valid) {
        onComplete(session);
      } else if (onePkg) {
        if (onePkg.price == 0) {
          // is free
          await makePurchase();
          onComplete(session);
        } else {
          // confirm purchase popup
          setPurchaseConfirmOpen(true);
        }
      } else {
        // select package popup
        setPackageSelectOpen(true);
      }
    } catch (err) {
      console.error(`[onSessionClick] ${err}`);
      handleSetErrorDialog({
        message: `Unable to select session`,
      });
    }
  };

  const onPackageClick = (pkg: SkuSKUPackage) => {
    setSelectedPackage(pkg);
    // confirm purchase popup
    setPurchaseConfirmOpen(true);
  };

  const onPackageClose = () => {
    setPackageSelectOpen(false);
  };

  const makePurchase = async () => {
    const userId = authAccount.isValid && authAccount.login?.user_info?.playerId;
    if (userId && selectedPackage) {
      await accountApi.purchase({
        userID: userId,
        payload: {
          packages: [
            {
              pkgSold: 1,
              sku: selectedPackage.sku,
            },
          ],
          meta: {
            sessionId: session?.uid,
          },
        },
      });
    } else {
      throw new Error(`cannot purchase with invalid user ${userId} or package ${selectedPackage}`);
    }
  };

  const confirmPurchase = async () => {
    try {
      await makePurchase();
      setPurchaseConfirmOpen(false);
      setPackageSelectOpen(false);
      onComplete(session);
    } catch (err) {
      console.error(`[confirmPurchase] ${err}`);
      handleSetErrorDialog({
        message: `Unable to purchase`,
      });
    }
  };

  const cancelPurchase = () => {
    setPurchaseConfirmOpen(false);
  };

  return (
    <div className='flex w-full justify-center'>
      <div className='flex max-w-fit flex-col gap-2'>
        <Card isBlurred className='' shadow='sm' isPressable onPress={() => onSessionClick()}>
          <CardHeader className='flex gap-3'>
            <div className='flex flex-col'>
              <p className='text-md'>{session?.name}</p>
            </div>
          </CardHeader>
          <CardBody className='bg-gray-200'>
            <p className='flex flex-col gap-1 text-black'>The show is currently underway!</p>
          </CardBody>
          <CardFooter className='justify-between text-small'>
            <p className='text-default-500'>{getPurchaseText(onePkg)}</p>
          </CardFooter>
        </Card>
      </div>

      {/* package selection popup */}
      <Modal isOpen={isPackageSelectOpen} placement='center' onOpenChange={onPackageClose}>
        <ModalContent className='modal-close-button justify-between text-black'>
          <ModalHeader className='flex flex-col gap-1 text-black'>Select a package</ModalHeader>
          <ModalBody className='relative'>
            {session &&
              session.entry_packages_detail &&
              session.entry_packages_detail.map((pkg, index) => (
                <Card
                  isBlurred
                  className=''
                  shadow='sm'
                  isPressable
                  onPress={() => onPackageClick(pkg)}
                  key={index}
                >
                  <CardHeader className='flex gap-3'>
                    <div className='flex flex-col'>
                      <p className='text-md'>{pkg?.name}</p>
                    </div>
                  </CardHeader>
                  <CardBody className='bg-gray-200'>
                    <p className='flex flex-col gap-1 text-black'>{pkg?.desc}</p>
                  </CardBody>
                  <CardFooter className='justify-between text-small'>
                    <p className='text-default-500'>{getPurchaseText(pkg)}</p>
                  </CardFooter>
                </Card>
              ))}
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* purchase confirmation popup */}
      <Modal isOpen={isPurchaseConfirmOpen} placement='center' onOpenChange={cancelPurchase}>
        <ModalContent className='modal-close-button justify-between text-black'>
          <ModalHeader className='flex flex-col gap-1 text-black'>Confirm purchase</ModalHeader>
          <ModalBody className='relative'>
            {selectedPackage && selectedPackage.price == 0
              ? `Play for free`
              : `Play for $${selectedPackage?.price}`}
          </ModalBody>
          <ModalFooter>
            <Button color='danger' variant='light' onPress={cancelPurchase}>
              Cancel
            </Button>
            <Button color='primary' onPress={confirmPurchase}>
              Confirm
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default SessionCard;
