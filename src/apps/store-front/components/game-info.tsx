import { useEffect, useState } from 'react';

import {
  Button,
  Checkbox,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/react';
import clsx from 'clsx';

import { useAudioContext } from '@/contexts/audio-context';
import { AccountType, GameIds } from '@/utils/types';

import * as CFCAssets from '../assets/game-info-assets/cfc/index';
import * as CTHAssets from '../assets/game-info-assets/cth/index';
import * as DONDAssets from '../assets/game-info-assets/dond/index';
import * as InfoAssets from '../assets/game-info-assets/index';
import { Game } from '../types';

const IWCardSelectInfo = () => {
  const [stakeIndex, setStateIndex] = useState<number>(1);
  const [purchaseCount, setPurchaseCount] = useState<number>(6);
  const [selectedAccountType, setSelectedAccountType] = useState<AccountType>(AccountType.Room);
  const possibleStakes = [2, 5, 10];
  return (
    <>
      <div className='rounded-2xl border-1 border-solid border-primary-900 bg-white px-2'>
        <div className='flex h-fit w-full flex-col items-center gap-4 px-2 py-4'>
          <h3 className='px-2 font-tempo text-2xl uppercase'>Card Price</h3>
          <div className='flex w-full justify-center gap-3'>
            {possibleStakes.slice(0, 3).map((stake, index) => (
              <Button
                key={index}
                onPress={() => setStateIndex(index)}
                radius='sm'
                className={clsx(
                  'pointer-events-none py-6',
                  stakeIndex === index
                    ? 'bg-gradient-to-r from-user-menu-blue-gradient-light to-user-menu-blue-gradient-dark font-bold text-white'
                    : 'bg-user-menu-light-blue',
                )}
              >
                ${stake}
              </Button>
            ))}
          </div>
          <p>Select the card price to initiate the purchase.</p>
          <h3 className='px-2 font-tempo text-2xl uppercase'>Quantity</h3>
          <div className='flex w-full items-center justify-center gap-4'>
            <Button
              onPress={() => setPurchaseCount(purchaseCount - 1)}
              isDisabled={purchaseCount === 1}
              radius='full'
              className='pointer-events-none bg-gradient-to-r from-user-menu-blue-gradient-light to-user-menu-blue-gradient-dark font-bold text-white'
              isIconOnly
            >
              -
            </Button>
            <span className='w-20 rounded-full bg-user-menu-light-blue p-2 text-center'>
              {purchaseCount}
            </span>
            <Button
              onPress={() => setPurchaseCount(purchaseCount + 1)}
              isDisabled={purchaseCount === 100}
              radius='full'
              color='default'
              className='pointer-events-none bg-gradient-to-r from-user-menu-blue-gradient-light to-user-menu-blue-gradient-dark font-bold text-white'
              isIconOnly
            >
              +
            </Button>
          </div>
          <p>Change the quantity of cards to purchase using the - or + buttons.</p>
        </div>
      </div>
      <div className='rounded-2xl border-1 border-solid border-primary-900 bg-white px-2'>
        <div className='flex h-fit w-full flex-col gap-4 px-2 py-4'>
          <h3 className='px-2 font-tempo text-2xl uppercase'>Purchase Options</h3>
          <fieldset className='flex flex-col gap-2 px-4'>
            <p className='pb-4'>Choose one of the following options to fund the purchase:</p>
            <Checkbox
              isSelected={selectedAccountType === AccountType.Room}
              onChange={() => setSelectedAccountType(AccountType.Room)}
              size='lg'
              className='pointer-events-none'
              classNames={{
                wrapper: 'after:bg-user-menu-blue',
              }}
            >
              Charge my{' '}
              <span className='font-bold'>
                Sign & Sail <sup>®</sup>
              </span>
            </Checkbox>
            <p className='pb-4'>
              Sail & Sign is registered payment gateway for Carnival Cruise purchases.
            </p>
            <Checkbox
              isSelected={selectedAccountType === AccountType.Casino}
              onChange={() => setSelectedAccountType(AccountType.Casino)}
              size='lg'
              className='pointer-events-none'
              classNames={{
                wrapper: 'after:bg-user-menu-blue',
              }}
            >
              Charge my <span className='font-bold'>Gaming Wallet </span>(Balance: ${999})
            </Checkbox>
            <p>Gaming Wallet is your casino account balance.</p>
          </fieldset>
        </div>
      </div>
    </>
  );
};

type GenericGlobalHeaderInfoProps = {
  isIOS: boolean;
};

const GenericGlobalHeaderInfo: React.FC<GenericGlobalHeaderInfoProps> = ({ isIOS }) => {
  return (
    <div className='rounded-2xl border-1 border-solid border-primary-900 bg-white px-2'>
      <div className='flex h-fit w-full flex-col gap-4 px-2 py-4'>
        <div className='flex w-full flex-row items-center gap-2'>
          <img
            src={InfoAssets.info_menu}
            alt='cth-info-1'
            className='aspect-auto h-auto w-1/3 px-5'
          />
          <p className='w-2/3'>Select to open the MENU for more options.</p>
        </div>
        <div className='flex w-full flex-row items-center gap-2'>
          <img
            src={InfoAssets.info_home}
            alt='cth-info-1'
            className='aspect-auto h-auto w-1/3 px-5'
          />
          <p className='w-2/3'>Select to return to the game store.</p>
        </div>
        {!isIOS && (
          <>
            <div className='flex w-full flex-row items-center gap-2'>
              <img
                src={InfoAssets.info_full}
                alt='cth-info-1'
                className='aspect-auto h-auto w-1/3 px-5'
              />
              <p className='w-2/3'>
                Select to make the game fit to your device screen. (Android only)
              </p>
            </div>
            <div className='flex w-full flex-row items-center gap-2'>
              <img
                src={InfoAssets.info_shrink}
                alt='cth-info-1'
                className='aspect-auto h-auto w-1/3 px-5'
              />
              <p className='w-2/3'>
                Select to make the game shrink to standard size on your device screen. (Android
                only)
              </p>
            </div>
          </>
        )}
        <div className='flex w-full flex-row items-center gap-2'>
          <img src={InfoAssets.info_volume} alt='cth-info-1' className='aspect-auto h-auto w-1/3' />
          <p className='w-2/3'>Select to toggle all sounds on/off.</p>
        </div>
        <div className='flex w-full flex-row items-center gap-2'>
          <img
            src={InfoAssets.info_info}
            alt='cth-info-1'
            className='aspect-auto h-auto w-1/3 px-5'
          />
          <p className='w-2/3'>Select to open the information page.</p>
        </div>
      </div>
    </div>
  );
};

type GameInfoProps = {
  game: Game;
  isOpen: boolean;
  onPlay: () => void;
  onClose?: () => void;
  isIOS: boolean;
};

const GameInfo = (props: GameInfoProps) => {
  const [modalOpen, setModalOpen] = useState(props?.isOpen);
  const { handleGenericClickAudio } = useAudioContext();
  const { name } = props.game;

  const handlePlayClick = () => {
    if (name) {
      handleGenericClickAudio(name);
    }
    props?.onPlay();
  };

  const handleClose = () => {
    if (props?.onClose) {
      setModalOpen(false);
      if (name) {
        handleGenericClickAudio(name);
      }
      props.onClose();
      window.history.back();
    }
  };

  let modalContent: JSX.Element = <></>;

  switch (props.game.name) {
    case GameIds.OceanTreasure: {
      modalContent = (
        <ModalContent className='bg-blue-100 px-4 modal-close-button'>
          <ModalHeader className='flex h-20 flex-col gap-1 px-0 text-primary-900 md-h:h-24'>
            <div className='flex h-fit w-full flex-col gap-4 py-2 text-left md-h:py-4'>
              <h3 className='font-tempo text-3xl tracking-tight'>HOW TO PLAY</h3>
            </div>
          </ModalHeader>
          <ModalBody className='tracking-snug overflow-auto px-2 leading-tight text-primary-900'>
            <div className='rounded-2xl border-1 border-solid border-primary-900 bg-white px-2'>
              <div className='flex h-fit w-full flex-col gap-4 px-2 py-4'>
                <h3 className='font-tempo text-2xl uppercase'>Main game</h3>
                <ul className='flex h-full w-full list-disc flex-col pl-4'>
                  <li>Press "BUY" button to buy a new scratch card.</li>
                  <li>Scratch the "Winning Symbols" to reveal symbols.</li>
                </ul>
                <img src={CTHAssets.CTHInfoImg1} alt='cth-info-1' />
                <ul className='flex h-full w-full list-disc flex-col pl-4'>
                  <li>Scratch "Your Symbols" to reveal symbols.</li>
                </ul>
                <img src={CTHAssets.CTHInfoImg2} alt='cth-info-2' />
                <ul className='flex h-full w-full list-disc flex-col pl-4'>
                  <li>
                    If any one of the "Your Symbols" match the "Winning Symbols", win the
                    corresponding prize.
                  </li>
                </ul>
              </div>
            </div>
            <div className='rounded-2xl border-1 border-solid border-primary-900 bg-white px-2'>
              <div className='flex h-fit w-full flex-col gap-4 px-2 py-4'>
                <h3 className='font-tempo text-2xl uppercase'>Match 3</h3>
                <ul className='flex h-full w-full flex-col'>
                  <li>
                    In addition to the main game, scratch and reveal three identical symbols from
                    "Match 3" symbols to win the corresponding prize.
                  </li>
                </ul>
                <img src={CTHAssets.CTH_MATCH} alt='cth-info-1' />
              </div>
            </div>
            <div className='rounded-2xl border-1 border-solid border-primary-900 bg-white px-2'>
              <div className='flex h-fit w-full flex-col gap-4 px-2 py-4'>
                <h3 className='font-tempo text-2xl uppercase'>Bonus</h3>
                <ul className='flex h-full w-full flex-col'>
                  <li>
                    Scratch the bottle to reveal a message and see if you won the grand prize.
                  </li>
                </ul>
                <img src={CTHAssets.CTH_BONUS} alt='cth-info-1' />
              </div>
            </div>
            <div
              className='rounded-2xl border-1 border-solid border-primary-900 bg-white px-2'
              id='payouts'
            >
              <div className='flex h-fit w-full flex-col gap-4 px-2 py-4'>
                <h3 className='font-tempo text-2xl uppercase'>Payouts</h3>
                <img src={CTHAssets.CTH_PAYOUTS} alt='cth-info-1' />
              </div>
            </div>
            <div className='rounded-2xl border-1 border-solid border-primary-900 bg-white px-2'>
              <div className='flex h-fit w-full flex-col gap-4 px-2 py-4'>
                <h3 className='font-tempo text-2xl uppercase'>Game Rules</h3>
                <ul className='flex h-full w-full list-disc flex-col gap-1 pl-4'>
                  <li>Your average odds of winning any Instant prize are 1 in 4.20.</li>
                  <li>Wins are multiplied by the card price.</li>
                  <li>Malfunction voids all pays and plays.</li>
                  <li>The maximum win of the game is 5000x.</li>
                  <li>
                    For USC's/ARC's, all payouts that are 300 to 1 or higher than the actual card
                    purchase price are subject to IRS tax reporting/withholding requirements.
                  </li>
                  <li>Players must be 18 years or older to buy, play or redeem the prizes.</li>
                </ul>
              </div>
            </div>
            <div className='rounded-2xl border-1 border-solid border-primary-900 bg-white px-2'>
              <div className='flex h-fit w-full flex-col gap-4 py-4'>
                <h3 className='px-2 font-tempo text-2xl uppercase'>User Interface</h3>
                <div className='rounded-2xl border-1 border-solid border-primary-900 bg-white px-2'>
                  <div className='flex h-fit w-full flex-col gap-4 px-2 py-4'>
                    <div className='flex w-full flex-row items-center gap-2'>
                      <img
                        src={CTHAssets.CTH_STAKE}
                        alt='cth-info-1'
                        className='aspect-auto h-auto w-1/3'
                      />
                      <p className='w-2/3'>Select the card price.</p>
                    </div>
                    <div className='flex w-full flex-row items-center gap-2'>
                      <img
                        src={CTHAssets.CTH_BUY}
                        alt='cth-info-1'
                        className='aspect-auto h-auto w-1/3'
                      />
                      <p className='w-2/3'>
                        Select to initiate the purchase of card at the chosen price.
                      </p>
                    </div>
                    <div className='flex w-full flex-row items-center gap-2'>
                      <img
                        src={CTHAssets.CTH_REVEAL}
                        alt='cth-info-1'
                        className='aspect-auto h-auto w-1/3'
                      />
                      <p className='w-2/3'>Select to reveal all the symbols on the card.</p>
                    </div>
                    <div className='flex w-full flex-row items-center gap-2'>
                      <img
                        src={CTHAssets.CTH_AUTO}
                        alt='cth-info-1'
                        className='aspect-auto h-auto w-1/3'
                      />
                      <p className='w-2/3'>
                        Select to reveal all the outcomes of the purchased cards automatically one
                        after another.
                      </p>
                    </div>
                    <div className='flex w-full flex-row items-center gap-2'>
                      <img
                        src={CTHAssets.CTH_STOPAUTO}
                        alt='cth-info-1'
                        className='aspect-auto h-auto w-1/3'
                      />
                      <p className='w-2/3'>Select to stop the Auto Play. </p>
                    </div>
                  </div>
                </div>
                <IWCardSelectInfo />
                <GenericGlobalHeaderInfo isIOS={props.isIOS} />
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              className='bg-gradient-to-r from-user-menu-blue-gradient-light to-user-menu-blue-gradient-dark font-tempo text-lg uppercase text-white'
              fullWidth
              isDisabled={!props?.game?.enabled}
              onClick={handlePlayClick}
            >
              Play
            </Button>
          </ModalFooter>
        </ModalContent>
      );
      break;
    }
    case GameIds.BreakTheBank: {
      modalContent = (
        <ModalContent className='bg-blue-100 px-4 modal-close-button'>
          <ModalHeader className='flex h-20 flex-col gap-1 px-0 text-primary-900 md-h:h-24'>
            <div className='flex h-fit w-full flex-col gap-4 py-2 text-left md-h:py-4'>
              <h3 className='font-tempo text-3xl tracking-tight'>HOW TO PLAY</h3>
            </div>
          </ModalHeader>
          <ModalBody className='tracking-snug overflow-auto px-2 leading-tight text-primary-900'>
            <div className='rounded-2xl border-1 border-solid border-primary-900 bg-white px-2'>
              <div className='flex h-fit w-full flex-col gap-4 px-2 py-4'>
                <h3 className='font-tempo text-2xl uppercase'>Main game</h3>
                <ul className='flex h-full w-full list-disc flex-col pl-4'>
                  <li>Press "BUY" button to buy a new scratch card.</li>
                  <li>Scratch the “Winning Cases” to reveal values.</li>
                  <li>Scratch “Your Cases” to reveal values.</li>
                  <li>
                    If any one of the “Your Cases” match the “Winning Cases”, win the corresponding
                    prize.
                  </li>
                </ul>
                <img src={DONDAssets.dond_nums} alt='cfc-info-2' />
              </div>
            </div>
            <div className='rounded-2xl border-1 border-solid border-primary-900 bg-white px-2'>
              <div className='flex h-fit w-full flex-col gap-4 px-2 py-4'>
                <h3 className='font-tempo text-2xl uppercase'>Match 3</h3>
                <ul className='flex h-full w-full flex-col'>
                  <li>
                    In addition to the main game, scratch and reveal three identical symbols from
                    "Match 3" symbols to win the corresponding prize.
                  </li>
                </ul>
                <img src={DONDAssets.dond_match} alt='cth-info-1' />
              </div>
            </div>
            <div className='rounded-2xl border-1 border-solid border-primary-900 bg-white px-2'>
              <div className='flex h-fit w-full flex-col gap-4 px-2 py-4'>
                <h3 className='font-tempo text-2xl uppercase'>Bonus</h3>
                <ul className='flex h-full w-full flex-col'>
                  <li>Scratch the Bonus Spot to win the grand prize.</li>
                </ul>
                <img src={DONDAssets.dond_bonus} alt='cth-info-1' />
              </div>
            </div>
            <div
              className='rounded-2xl border-1 border-solid border-primary-900 bg-white px-2'
              id='payouts'
            >
              <div className='flex h-fit w-full flex-col gap-4 px-2 py-4'>
                <h3 className='font-tempo text-2xl uppercase'>Payouts</h3>
                <img src={DONDAssets.dond_payouts} alt='cth-info-1' />
              </div>
            </div>
            <div className='rounded-2xl border-1 border-solid border-primary-900 bg-white px-2'>
              <div className='flex h-fit w-full flex-col gap-4 px-2 py-4'>
                <h3 className='font-tempo text-2xl uppercase'>Game Rules</h3>
                <ul className='flex h-full w-full list-disc flex-col gap-1 pl-4'>
                  <li>Your average odds of winning any Instant prize are 1 in 4.20.</li>
                  <li>Wins are multiplied by the card price.</li>
                  <li>Malfunction voids all pays and plays.</li>
                  <li>The maximum win of the game is 5000x.</li>
                  <li>
                    For USC's/ARC's, all payouts that are 300 to 1 or higher than the actual card
                    purchase price are subject to IRS tax reporting/withholding requirements.
                  </li>
                  <li>Players must be 18 years or older to buy, play or redeem the prizes.</li>
                </ul>
              </div>
            </div>
            <div className='rounded-2xl border-1 border-solid border-primary-900 bg-white px-2'>
              <div className='flex h-fit w-full flex-col gap-4 py-4'>
                <h3 className='px-2 font-tempo text-2xl uppercase'>User Interface</h3>
                <div className='rounded-2xl border-1 border-solid border-primary-900 bg-white px-2'>
                  <div className='flex h-fit w-full flex-col gap-4 px-2 py-4'>
                    <div className='flex w-full flex-row items-center gap-2'>
                      <img
                        src={DONDAssets.dond_stake}
                        alt='cth-info-1'
                        className='aspect-auto h-auto w-1/3 px-1'
                      />
                      <p className='w-2/3'>Select the card price.</p>
                    </div>
                    <div className='flex w-full flex-row items-center gap-2'>
                      <img
                        src={DONDAssets.dond_buy}
                        alt='cth-info-1'
                        className='aspect-auto h-auto w-1/3'
                      />
                      <p className='w-2/3'>
                        Select to initiate the purchase of card at the chosen price.
                      </p>
                    </div>
                    <div className='flex w-full flex-row items-center gap-2'>
                      <img
                        src={DONDAssets.dond_reveal}
                        alt='cth-info-1'
                        className='aspect-auto h-auto w-1/3'
                      />
                      <p className='w-2/3'>Select to reveal all the symbols on the card.</p>
                    </div>
                    <div className='flex w-full flex-row items-center gap-2'>
                      <img
                        src={DONDAssets.dond_autoplay}
                        alt='cth-info-1'
                        className='aspect-auto h-auto w-1/3'
                      />
                      <p className='w-2/3'>
                        Select to reveal all the outcomes of the purchased cards automatically one
                        after another.
                      </p>
                    </div>
                    <div className='flex w-full flex-row items-center gap-2'>
                      <img
                        src={DONDAssets.dond_stop}
                        alt='cth-info-1'
                        className='aspect-auto h-auto w-1/3'
                      />
                      <p className='w-2/3'>Select to stop the Auto Play. </p>
                    </div>
                  </div>
                </div>
                <IWCardSelectInfo />
                <div className='rounded-2xl border-1 border-solid border-primary-900 bg-white px-2'>
                  <div className='flex h-fit w-full flex-col gap-4 px-2 py-4'>
                    <div className='flex w-full flex-row items-center gap-2'>
                      <img
                        src={DONDAssets.dond_menu}
                        alt='cth-info-1'
                        className='aspect-auto h-auto w-1/3 px-5'
                      />
                      <p className='w-2/3'>Select to open the MENU for more options.</p>
                    </div>
                    <div className='flex w-full flex-row items-center gap-2'>
                      <img
                        src={DONDAssets.dond_home}
                        alt='cth-info-1'
                        className='aspect-auto h-auto w-1/3 px-5'
                      />
                      <p className='w-2/3'>Select to return to game store.</p>
                    </div>
                    {!props.isIOS && (
                      <>
                        <div className='flex w-full flex-row items-center gap-2'>
                          <img
                            src={DONDAssets.dond_full}
                            alt='cth-info-1'
                            className='aspect-auto h-auto w-1/3 px-5'
                          />
                          <p className='w-2/3'>
                            Select to make the game fit to your device screen. (Android only)
                          </p>
                        </div>
                        <div className='flex w-full flex-row items-center gap-2'>
                          <img
                            src={DONDAssets.dond_shrink}
                            alt='cth-info-1'
                            className='aspect-auto h-auto w-1/3 px-5'
                          />
                          <p className='w-2/3'>
                            Select to make the game shrink to standard size on your device screen.
                            (Android only)
                          </p>
                        </div>
                      </>
                    )}
                    <div className='flex w-full flex-row items-center gap-2'>
                      <img
                        src={DONDAssets.dond_volume}
                        alt='cth-info-1'
                        className='aspect-auto h-auto w-1/3'
                      />
                      <p className='w-2/3'>Select to toggle all sounds on/off.</p>
                    </div>
                    <div className='flex w-full flex-row items-center gap-2'>
                      <img
                        src={DONDAssets.dond_info}
                        alt='cth-info-1'
                        className='aspect-auto h-auto w-1/3 px-5'
                      />
                      <p className='w-2/3'>Select to open the information page.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              className='bg-gradient-to-r from-user-menu-blue-gradient-light to-user-menu-blue-gradient-dark font-tempo text-lg uppercase text-white'
              fullWidth
              isDisabled={!props?.game?.enabled}
              onClick={handlePlayClick}
            >
              Play
            </Button>
          </ModalFooter>
        </ModalContent>
      );
      break;
    }
    case GameIds.CruisingForCash: {
      modalContent = (
        <ModalContent className='bg-blue-100 px-4 modal-close-button'>
          <ModalHeader className='flex h-20 flex-col gap-1 px-0 text-primary-900 md-h:h-24'>
            <div className='flex h-fit w-full flex-col gap-4 py-2 text-left md-h:py-4'>
              <h3 className='font-tempo text-3xl tracking-tight'>HOW TO PLAY</h3>
            </div>
          </ModalHeader>
          <ModalBody className='tracking-snug overflow-auto px-2 leading-tight text-primary-900'>
            <div className='rounded-2xl border-1 border-solid border-primary-900 bg-white px-2'>
              <div className='flex h-fit w-full flex-col gap-4 px-2 py-4'>
                <h3 className='font-tempo text-2xl uppercase'>Main game</h3>
                <ul className='flex h-full w-full list-disc flex-col pl-4'>
                  <li>Press "BUY" button to buy a new scratch card.</li>
                  <li>Scratch the “Winning Numbers” to reveal numbers.</li>
                  <li>Scratch “Your Numbers” to reveal numbers.</li>
                  <li>
                    If any one of the “Your Numbers” match the “Winning Numbers”, win the
                    corresponding prize.
                  </li>
                </ul>
                <img src={CFCAssets.cfc_nums} alt='cfc-info-2' />
              </div>
            </div>
            <div className='rounded-2xl border-1 border-solid border-primary-900 bg-white px-2'>
              <div className='flex h-fit w-full flex-col gap-4 px-2 py-4'>
                <h3 className='font-tempo text-2xl uppercase'>Match 3</h3>
                <ul className='flex h-full w-full flex-col'>
                  <li>
                    In addition to the main game, scratch and reveal three identical symbols from
                    "Match 3" symbols to win the corresponding prize.
                  </li>
                </ul>
                <img src={CFCAssets.cfc_match} alt='cth-info-1' />
              </div>
            </div>
            <div className='rounded-2xl border-1 border-solid border-primary-900 bg-white px-2'>
              <div className='flex h-fit w-full flex-col gap-4 px-2 py-4'>
                <h3 className='font-tempo text-2xl uppercase'>Bonus</h3>
                <img src={CFCAssets.cfc_bonus} alt='cth-info-1' />
                <ul className='flex h-full w-full flex-col'>
                  <li>Scratch to reveal the Bonus area to win a CRUISE.</li>
                </ul>
              </div>
            </div>
            <div
              className='rounded-2xl border-1 border-solid border-primary-900 bg-white px-2'
              id='payouts'
            >
              <div className='flex h-fit w-full flex-col gap-4 px-2 py-4'>
                <h3 className='font-tempo text-2xl uppercase'>Payouts</h3>
                <img src={CFCAssets.cfc_payouts} alt='cth-info-1' />
              </div>
            </div>
            <div className='rounded-2xl border-1 border-solid border-primary-900 bg-white px-2'>
              <div className='flex h-fit w-full flex-col gap-4 px-2 py-4'>
                <h3 className='font-tempo text-2xl uppercase'>Game Rules</h3>
                <ul className='flex h-full w-full list-disc flex-col gap-1 pl-4'>
                  <li>Your average odds of winning any Instant prize are 1 in 4.20.</li>
                  <li>Wins are multiplied by the card price.</li>
                  <li>Malfunction voids all pays and plays.</li>
                  <li>The maximum win of the game is 5000x.</li>
                  <li>
                    For USC's/ARC's, all payouts that are 300 to 1 or higher than the actual card
                    purchase price are subject to IRS tax reporting/withholding requirements.
                  </li>
                  <li>Players must be 18 years or older to buy, play or redeem the prizes.</li>
                </ul>
              </div>
            </div>
            <div className='rounded-2xl border-1 border-solid border-primary-900 bg-white px-2'>
              <div className='flex h-fit w-full flex-col gap-4 py-4'>
                <h3 className='px-2 font-tempo text-2xl uppercase'>User Interface</h3>
                <div className='rounded-2xl border-1 border-solid border-primary-900 bg-white px-2'>
                  <div className='flex h-fit w-full flex-col gap-4 px-2 py-4'>
                    <div className='flex w-full flex-row items-center gap-2'>
                      <img
                        src={CFCAssets.cfc_stake}
                        alt='cth-info-1'
                        className='aspect-auto h-auto w-1/3 px-1'
                      />
                      <p className='w-2/3'>Select the card price.</p>
                    </div>
                    <div className='flex w-full flex-row items-center gap-2'>
                      <img
                        src={CFCAssets.cfc_buy}
                        alt='cth-info-1'
                        className='aspect-auto h-auto w-1/3'
                      />
                      <p className='w-2/3'>
                        Select to initiate the purchase of card at the chosen price.
                      </p>
                    </div>
                    <div className='flex w-full flex-row items-center gap-2'>
                      <img
                        src={CFCAssets.cfc_reveal}
                        alt='cth-info-1'
                        className='aspect-auto h-auto w-1/3'
                      />
                      <p className='w-2/3'>Select to reveal all the symbols on the card.</p>
                    </div>
                    <div className='flex w-full flex-row items-center gap-2'>
                      <img
                        src={CFCAssets.cfc_auto}
                        alt='cth-info-1'
                        className='aspect-auto h-auto w-1/3'
                      />
                      <p className='w-2/3'>
                        Select to reveal all the outcomes of the purchased cards automatically one
                        after another.
                      </p>
                    </div>
                    <div className='flex w-full flex-row items-center gap-2'>
                      <img
                        src={CFCAssets.cfc_stopauto}
                        alt='cth-info-1'
                        className='aspect-auto h-auto w-1/3'
                      />
                      <p className='w-2/3'>Select to stop the Auto Play. </p>
                    </div>
                  </div>
                </div>
                <IWCardSelectInfo />
                <GenericGlobalHeaderInfo isIOS={props.isIOS} />
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              className='bg-gradient-to-r from-user-menu-blue-gradient-light to-user-menu-blue-gradient-dark font-tempo text-lg uppercase text-white'
              fullWidth
              isDisabled={!props?.game?.enabled}
              onClick={handlePlayClick}
            >
              Play
            </Button>
          </ModalFooter>
        </ModalContent>
      );
      break;
    }
  }

  useEffect(() => {
    setModalOpen(props?.isOpen);
  }, [props?.isOpen]);

  useEffect(() => {
    if (modalOpen) {
      window.history.pushState({ modalOpen: true }, '');

      const handlePopState = () => {
        if (modalOpen) {
          setModalOpen(false);
          if (props?.onClose) {
            props?.onClose();
          }
        }
      };
      window.addEventListener('popstate', handlePopState);
      return () => {
        window.removeEventListener('popstate', handlePopState);
      };
    }
  }, [modalOpen, props?.onClose]);

  return (
    <Modal
      backdrop={'blur'}
      isOpen={props?.isOpen}
      onClose={handleClose}
      placement='center'
      className='h-5/6 focus:outline-2 focus:outline-primary-default'
      isDismissable={false}
    >
      {modalContent}
    </Modal>
  );
};
export default GameInfo;
