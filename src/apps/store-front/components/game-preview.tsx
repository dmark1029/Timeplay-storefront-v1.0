import { Modal, ModalBody, ModalContent, ModalHeader } from '@nextui-org/react';

import { useStoreFrontContext } from '@/apps/store-front';
import { GameIds } from '@/utils/types';

import {
  CheckLaterPreview,
  CloseButtonIcon,
  DONDPreviewBG,
  TriviaPreviewBG,
} from '../assets/game-previews';
import { Game, isEntGame } from '../types';
import './game-preview.css';

const GamePreview = () => {
  const { selectedGame, handleSelectGame } = useStoreFrontContext();
  const isOpen = Boolean(selectedGame) && (!isEntGame(selectedGame) || !selectedGame?.enabled);

  const handleClose = () => {
    handleSelectGame(null);
  };

  const getGameBG = (game: Game | null): string => {
    if (!game) {
      return '';
    }
    switch (game.name) {
      case GameIds.Trivia:
        return `url(${TriviaPreviewBG})`;
      case GameIds.DealOrNoDeal:
        return `url(${DONDPreviewBG})`;
      case GameIds.Bingo:
        return `url(${CheckLaterPreview})`;
      case GameIds.WheelOfFortune:
        return `url(${CheckLaterPreview})`;
      case GameIds.FamilyFeud:
        return `url(${CheckLaterPreview})`;
      default:
        return '';
    }
  };

  const getGameText = (game: Game | null) => {
    if (!game) {
      return '';
    }
    switch (game.name) {
      case GameIds.Trivia:
        return (
          <div className='label'>
            <div className='ent-text'>
              <span className='text-wrapper'>
                TRIVIA
                <p className='linebreak' />
              </span>
              <ul
                className='span'
                style={{ listStyleType: 'disc', paddingLeft: '1.5em', margin: '0' }}
              >
                <p className='linebreak' />
                <li>
                  TimePlay Live is a fun interactive trivia experience that where guests use their
                  phones to answer questions on the big screen across a variety of categories such
                  as movies, TV, music, pop culture and more.
                </li>
                <p className='linebreak' />
                <p className='linebreak' />
                <li>
                  Everyone competes against each other in the audience to get onto the real-time
                  leaderboard for a chance to win prizes – and bragging rights of course!
                </li>
                <p className='linebreak' />
                <p className='linebreak' />
                <li>
                  It’s trivia like you’ve never experienced before, so make sure not to forget your
                  phone.
                </li>
                <p className='linebreak' />
                <p className='linebreak' />
                <li>Check the schedule for show location and time details.</li>
              </ul>
            </div>
          </div>
        );
      case GameIds.DealOrNoDeal:
        return (
          <div className='label'>
            <div className='ent-text'>
              <span className='text-wrapper'>
                DEAL OR NO DEAL
                <p className='linebreak' />
              </span>
              <ul
                className='span'
                style={{ listStyleType: 'disc', paddingLeft: '1.5em', margin: '0' }}
              >
                <p className='linebreak' />
                <li>
                  Deal or No Deal, one of the world’s most popular game shows ever is onboard! 
                </li>
                <p className='linebreak' />
                <p className='linebreak' />
                <li>
                  It’s an exhilarating live hosted show where contestants play and deal for cash in
                </li>
                a high-energy contest of nerves and raw intuition, just like on TV!
                <p className='linebreak' />
                <p className='linebreak' />
                <li>
                  Everyone in the audience gets to play along to win by opening up briefcases on
                  their Deal or No Deal cards with the chance to win $1,000 plus loads of great
                  prizes.
                </li>
                <p className='linebreak' />
                <p className='linebreak' />
                <li>Watch or play along - everyone is invited!</li>
                <p className='linebreak' />
                <p className='linebreak' />
                <li>Check the schedule for show location and time details.</li>
              </ul>
            </div>
          </div>
        );
      case GameIds.Bingo:
        return <></>;
      case GameIds.WheelOfFortune:
        return <></>;
      case GameIds.FamilyFeud:
        return <></>;
      default:
        return '';
    }
  };

  const bgStyle: React.CSSProperties = {
    backgroundImage: getGameBG(selectedGame),
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    width: '343px',
    height: '627px',
    padding: 0,
  };

  const CloseButton = () => (
    <img
      src={CloseButtonIcon}
      alt='Close'
      style={{
        cursor: 'pointer',
        width: '24px',
        height: '24px',
        top: '20px',
        right: '10px',
        position: 'absolute',
      }}
      onClick={handleClose}
    />
  );

  return (
    <Modal
      backdrop={'blur'}
      isOpen={isOpen && bgStyle.backgroundImage != null && bgStyle.backgroundImage !== ''}
      onClose={handleClose}
      closeButton={<CloseButton />}
      placement='center'
      classNames={{
        base: 'bg-transparent shadow-none',
      }}
      style={bgStyle}
    >
      <ModalContent className='modal-close-button'>
        <ModalHeader></ModalHeader>
        <ModalBody className='text-white'>{getGameText(selectedGame)}</ModalBody>
      </ModalContent>
    </Modal>
  );
};
export default GamePreview;
