import { useEffect, useState } from 'react';

import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react';
import {
  ContentAvatarData,
  SessionDONDSession,
  SessionData,
  SkuSKUPackage,
} from 'ships-service-sdk';

import { useAppContext } from '@/contexts/app-context';
import { useDialogContext } from '@/contexts/dialog-context';
import { accountApi, sessionApi } from '@/services/ships-service';
import { dondTempType, getAvatar, saveAvatar, saveDondTemp } from '@/utils/timeplay';
import { GameIds } from '@/utils/types';

import { useStoreFrontContext } from '../layout';
import { isEntGame } from '../types';
import SessionCard from './session-card';
import UserAvatar from './user-avatar';

const GameSession = () => {
  const { authAccount, stackConfig } = useAppContext();
  const { handleSetErrorDialog } = useDialogContext();
  const { activeSessions, selectedGame, handleSelectGame } = useStoreFrontContext();
  const [filterSssions, setFilterSessions] = useState<SessionData[]>();
  const [selectedSession, setSelectedSession] = useState<SessionData | undefined>();
  // opens for ent games with active session
  const isOpen = Boolean(selectedGame) && isEntGame(selectedGame) && selectedGame?.enabled;

  const [isAvatarOpen, setIsAvatarOpen] = useState<boolean>(false);

  useEffect(() => {
    const onOpen = async () => {
      if (isOpen) {
        // handle dond sessions
        if (selectedGame.name == GameIds.DealOrNoDeal) {
          const sessions = activeSessions.filter((x): x is SessionDONDSession => x !== null);
          if (sessions.length == 0) {
            console.error(`[GameSession] no session found for ${selectedGame.name}`);
            handleClose();
            return;
          }

          // only assume one dond session for now
          const session = sessions[0];
          enterDondClient(session);
          return;
        }

        // handle rmb sessions
        const sessions = activeSessions
          .filter((x): x is SessionData => x !== null)
          .filter((x) => x.category == selectedGame.name);
        if (sessions.length == 0) {
          console.error(`[GameSession] no session found for ${selectedGame.name}`);
          handleClose();
          return;
        }

        setFilterSessions(sessions);

        // only one session
        if (sessions.length == 1) {
          const session = sessions[0];
          const onePkg =
            session.entry_packages_detail && session.entry_packages_detail?.length == 1
              ? session.entry_packages_detail[0]
              : undefined;
          // only one pkg and is free
          if (onePkg && onePkg?.price == 0) {
            // skip session view
            setSelectedSession(session);

            // show avatar selection if no avatar set
            if (session.useAvatar && !getAvatar()) {
              setIsAvatarOpen(true);
              return;
            }

            // still need to purchase to generate a transaction
            try {
              await makePurchase(session, onePkg);
            } catch (err) {
              console.error(`[game-session.onOpen] ${err}`);
              handleSetErrorDialog({
                message: `Unable to enter session`,
                onClose: () => {
                  handleClose();
                },
              });
              return;
            }

            // go to web client
            enterSession(session);
            return;
          }
        }

        // let user select session
        setSelectedSession(undefined);
      }
    };

    onOpen();
  }, [isOpen]);

  const makePurchase = async (session: SessionData, pkg: SkuSKUPackage) => {
    const userId = authAccount.isValid && authAccount.login?.user_info?.playerId;
    if (userId) {
      await accountApi.purchase({
        userID: userId,
        payload: {
          packages: [
            {
              pkgSold: 1,
              sku: pkg.sku,
            },
          ],
          meta: {
            sessionId: session.uid,
          },
        },
      });
    } else {
      throw new Error(`cannot purchase with invalid user ${userId}`);
    }
  };

  const handleClose = () => {
    handleSelectGame(null);
    setIsAvatarOpen(false);
  };

  const handleAvatarConfirm = (avatar: ContentAvatarData) => {
    // save the selection
    saveAvatar(avatar);
    // go to web client
    enterSession(selectedSession);
  };

  const handleSessionConfirm = (session?: SessionData) => {
    setSelectedSession(session);

    // go to avatar selection
    if (session?.useAvatar && !getAvatar()) {
      setIsAvatarOpen(true);
      return;
    }

    // go to web client
    enterSession(session);
  };

  const enterSession = async (session: SessionData | undefined) => {
    try {
      if (!session) {
        throw new Error('No session selected');
      }
      const resp = await sessionApi.enterSession({
        payload: {
          session_id: session?.uid,
        },
      });
      if (resp.data.data?.redirectUrl) {
        handleSelectGame(null);
        setIsAvatarOpen(false);
        window.location.href = resp.data.data?.redirectUrl;
      }
    } catch (err) {
      console.error(`[enterSession] ${err}`);
      handleSetErrorDialog({
        message: `Unable to enter session`,
        onClose: () => {
          handleClose();
        },
      });
    }
  };

  const enterDondClient = (session: SessionDONDSession) => {
    const dondTemp: dondTempType = {
      sessionName: session.name!,
      sessionId: session.sessionId!,
      sessionDay: session.sessionDay!,
      sessionScheduledStart: session.scheduledStart!,
      userLoginCredentials: {},
      updated: true,
    };

    const passenger = authAccount.login!.passenger!;

    if (authAccount.cardNumber) {
      dondTemp.userLoginCredentials.cardNumber = authAccount.cardNumber;
    } else if (passenger.carnival) {
      const bookingInfo =
        passenger.carnival!.fss!.validateAccountInfoResponseWrapper!.voyageInformation!
          .guestInformationLinked!.guest!.bookingSeqNumber!;

      dondTemp.userLoginCredentials.bookNo = bookingInfo.bookingNumber!;
      dondTemp.userLoginCredentials.seqNo = bookingInfo.bookingSequenceNumber!;
    } else {
      dondTemp.userLoginCredentials.cabin = passenger.cabin;
      dondTemp.userLoginCredentials.firstName = passenger.firstname;
      dondTemp.userLoginCredentials.birthYear = passenger.birthYear?.toString();
    }

    saveDondTemp(dondTemp);

    handleSelectGame(null);
    setIsAvatarOpen(false);

    const url = stackConfig.ships?.dond_client_url;
    if (!url) {
      console.error(`[enterDondClient] invalid dond client url: ${url}`);
      return;
    }
    window.location.href = url;
  };

  return (
    <Modal
      backdrop={'blur'}
      isOpen={isOpen}
      onClose={handleClose}
      placement='center'
      className='max-w-screen mx-4 max-h-screen'
    >
      <ModalContent>
        <ModalHeader className='flex flex-col gap-1 text-black'>
          {selectedGame?.display_name}
        </ModalHeader>
        <ModalBody className='items-center text-black'>
          {filterSssions &&
            filterSssions.map((session, index) => (
              <SessionCard
                session={session}
                onComplete={() => handleSessionConfirm(session)}
                key={index}
              />
            ))}
        </ModalBody>
        <ModalFooter></ModalFooter>
      </ModalContent>

      {/* Render nested modal inside parent modal */}
      <Modal isOpen={isAvatarOpen} placement='center' onOpenChange={handleClose}>
        <ModalContent className='modal-close-button justify-between text-black'>
          {() => (
            <>
              <ModalHeader className='flex flex-col gap-1 text-black'>
                {selectedGame?.display_name}
              </ModalHeader>
              <ModalBody className='relative'>
                <UserAvatar
                  prevAvatar={getAvatar()}
                  scrollHeight='75vh'
                  onConfirmation={handleAvatarConfirm}
                  onClose={handleClose}
                />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </Modal>
  );
};
export default GameSession;
