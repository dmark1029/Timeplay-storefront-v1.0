import { useEffect, useState } from 'react';

import {
  Button,
  Checkbox,
  CircularProgress,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Radio,
  RadioGroup,
  VisuallyHidden,
  useRadio,
} from '@nextui-org/react';
import { Divider } from '@nextui-org/react';
import { BsLightningChargeFill } from 'react-icons/bs';
import { MdInfo } from 'react-icons/md';

import { cn } from '@/utils/cn';

import { useGameContext } from '../context/game-context';
import { CheckoutLine } from '../types';
import CircleSelector from './circle-selector';
import LottoBall from './lotto-ball';

interface PicksModalProps {
  afterGenerationFunc?: () => void;
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  lineIndex?: number;
  setLineIndex?: React.Dispatch<React.SetStateAction<number>>;
  isAutoPick?: boolean;
}

const PicksModal: React.FC<PicksModalProps> = ({
  afterGenerationFunc,
  visible = false,
  setVisible,
  lineIndex = -1,
  setLineIndex,
  isAutoPick = false,
}) => {
  const {
    category,
    addLinesToCheckout,
    calculateLineValue,
    p3LinesCheckout,
    p4LinesCheckout,
    updateCheckoutLine,
  } = useGameContext();
  const [selectedStake, setSelectedStake] = useState<string>('');
  const [stake, setStake] = useState<number>(0);
  const [lineTypeSelected, setLineTypeSelected] = useState<string>('');
  const [isFireball, setIsFireball] = useState<boolean>(false);
  const [line, setLine] = useState<(number | null)[]>([null, null, null]);
  const [selectedLineNumber, setLineNumber] = useState<number>(0);
  const [checkoutLine, setCheckoutLine] = useState<CheckoutLine>();
  const [isEditing, setEditing] = useState<boolean>(false);
  const [disableAutoPicks, setDisableAutoPicks] = useState<boolean>(true);
  const [disableCreateLine, setDisableCreateLine] = useState<boolean>(true);
  const [pickErrorVisible, setPEVisible] = useState(false);
  const [picksError, setPicksErrors] = useState<string[]>([]);

  const closePicksModal = () => {
    setVisible(false);
    resetOptions();
    if (setLineIndex) setLineIndex(-1);
  };

  const submitLine = () => {
    let lineValid = true;
    const lineSet = new Set(line);
    let messages = [];

    if (lineTypeSelected === 'combo' && lineSet.size === 1) {
      messages.push('Combo lines must have at least 2 unique picks');
      setPicksErrors(messages);
      lineValid = false;
    }

    if (lineValid) {
      confirmLine();
      closePicksModal();
    } else {
      setPEVisible(true);
    }
  };

  useEffect(() => {
    if (isAutoPick) {
      runAutoPick();
    }
  }, [isAutoPick]);

  useEffect(() => {
    setDisableAutoPicks(disableAutoPickButton());
    setDisableCreateLine(disableCreateLineButton());
  }, [isAutoPick, checkoutLine]);

  const resetOptions = () => {
    setSelectedStake('');
    resetLine();
    setLineTypeSelected('');
    setIsFireball(false);
    setLineNumber(0);
  };

  const resetLine = () => {
    switch (category) {
      case 'pick3':
        setLine(new Array(3).fill(null));
        break;
      case 'pick4':
        setLine(new Array(4).fill(null));
        break;
      default:
        console.log('[powerpicks.PicksModal]', 'could not differentiate category, reload.');
    }
  };

  useEffect(() => {
    if (lineIndex !== -1) {
      setEditing(true);
      setLineNumber(-1);
      switch (category) {
        case 'pick3':
          if (p3LinesCheckout[lineIndex]) {
            let line = p3LinesCheckout[lineIndex];
            setLine(line.picks);
            setIsFireball(line.fireball_picked);
            setSelectedStake(`${line.stake}`);
            setLineTypeSelected(line.line_type);
          } else {
            setLine([null, null, null]);
          }
          return;
        case 'pick4':
          if (p4LinesCheckout[lineIndex]) {
            let line = p4LinesCheckout[lineIndex];
            setLine(line.picks);
            setIsFireball(line.fireball_picked);
            setSelectedStake(`${line.stake}`);
            setLineTypeSelected(line.line_type);
          } else {
            setLine([null, null, null, null]);
          }
          return;
        default:
          return;
      }
    } else {
      setEditing(false);
    }
  }, [lineIndex]);

  useEffect(() => {
    let num = parseInt(selectedStake);
    if (!isNaN(num)) setStake(parseInt(selectedStake));
    else setStake(0);
  }, [selectedStake]);

  useEffect(() => {
    if (category === 'pick3' || category === 'pick4') resetLine();
  }, [category]);

  useEffect(() => {
    let checkout_line = {
      picks: line,
      fireball_picked: isFireball,
      line_type: lineTypeSelected,
      stake: stake,
    } as CheckoutLine;
    setCheckoutLine(checkout_line);
  }, [stake, isFireball, lineTypeSelected, line]);

  const confirmLine = () => {
    if (checkoutLine) {
      if (isEditing) {
        updateCheckoutLine(checkoutLine, lineIndex, category);
      } else {
        addLinesToCheckout([checkoutLine], category);
      }
    }

    // run function after generating lines (navigating to/from a view for example)
    if (afterGenerationFunc) {
      afterGenerationFunc();
    }
  };

  const disableAutoPickButton = (): boolean => {
    let disable = false;
    if (checkoutLine) {
      if (checkoutLine.stake === 0) {
        disable = true;
      } else if (checkoutLine.line_type === '') {
        disable = true;
      }
    } else {
      disable = true;
    }
    return disable;
  };

  const disableCreateLineButton = (): boolean => {
    let disable = disableAutoPickButton();
    if (checkoutLine && (checkoutLine.picks as (number | null)[]).includes(null)) {
      disable = true;
    }
    return disable;
  };

  const runAutoPick = () => {
    const generateNumbers = (length: number, line_type: string) => {
      const numbers = new Array(length);
      const num_count = new Map<number, number>();
      for (let i = 0; i < length; i++) {
        if (line_type === 'combo') {
          while (true) {
            let num = Math.floor(Math.random() * 10);
            let count = num_count.get(num) || 0;
            if (count < length - 1) {
              numbers[i] = num;
              num_count.set(num, count + 1);
              break;
            }
          }
        } else {
          numbers[i] = Math.floor(Math.random() * 10);
        }
      }
      return numbers;
    };

    let numbers: number[];
    switch (category) {
      case 'pick3':
        numbers = generateNumbers(3, lineTypeSelected);
        setLine(numbers);
        break;
      case 'pick4':
        numbers = generateNumbers(4, lineTypeSelected);
        setLine(numbers);
        break;
      default:
        console.log('[powerpicks.PicksModal]', 'could not differentiate category, reload.');
    }
    setLineNumber(-1);
  };

  // === MODAL COMPONENT "MODULES" ===

  const CustomRadio = (props: any) => {
    const { value } = props;
    const {
      Component,
      children,
      getBaseProps,
      getInputProps,
      getLabelProps,
      getLabelWrapperProps,
    } = useRadio(props);
    return (
      <Component
        {...getBaseProps()}
        className={cn(
          'group inline-flex items-center font-bold tap-highlight-transparent',
          'rounded-full border-2 border-default bg-pp-background px-7 py-2',
          'data-[selected=true]:user-menu-blue border-user-menu-blue data-[selected=true]:bg-user-menu-blue',
        )}
      >
        <VisuallyHidden>
          <input {...getInputProps()} />
        </VisuallyHidden>
        <div {...getLabelWrapperProps()} className='m-0'>
          {children && (
            <span {...getLabelProps()}>
              <span
                className={`text-xl ${
                  selectedStake === value ? 'text-slate-100' : 'text-pp-text-dark'
                }`}
              >
                {children}
              </span>
            </span>
          )}
        </div>
      </Component>
    );
  };

  const LineSelections = (_props: any) => {
    return (
      <div className='flex w-full flex-col items-center gap-4 px-4'>
        <div className='flex h-full w-full flex-col items-center gap-2 rounded-xl bg-white p-4'>
          <h1 className='font-tempo text-[1.25rem] uppercase text-pp-text-accent'>Select Stake</h1>
          <RadioGroup
            orientation='horizontal'
            value={selectedStake}
            onValueChange={setSelectedStake}
          >
            <CustomRadio value='2'>$2</CustomRadio>
            <CustomRadio value='3'>$3</CustomRadio>
            <CustomRadio value='5'>$5</CustomRadio>
          </RadioGroup>
          <p className='text-center text-sm text-black'>
            The bigger your stake, the higher your potential payout!
          </p>
        </div>
        {/* <Divider /> */}
        <div className='flex h-full w-full flex-col items-center gap-2 rounded-xl bg-white p-4'>
          <h1 className='font-tempo text-[1.25rem] uppercase text-pp-text-accent'>Play Style</h1>
          <RadioGroup
            orientation='horizontal'
            classNames={{ wrapper: 'gap-4' }}
            value={lineTypeSelected}
            onValueChange={setLineTypeSelected}
          >
            <div className='flex flex-row gap-2'>
              <Radio value='straight'>
                <p className='text-lg text-pp-text-dark'>Straight</p>
              </Radio>
              <Popover placement='top' className='flex justify-center'>
                <PopoverTrigger>
                  <button className='text-blue-500'>
                    <MdInfo />
                  </button>
                </PopoverTrigger>
                <PopoverContent className='w-[80%] p-4'>
                  <strong>Straight Bet</strong>
                  <p>
                    A straight bet means you are betting on the exact order of the digits. To win,
                    the numbers you select must match the winning numbers in the exact same order.
                  </p>
                  <ul>
                    <li>
                      <strong>Example:</strong> If you bet on{' '}
                      {category === 'pick3' ? '123' : category === 'pick4' ? '1234' : '123'} and the
                      winning number is{' '}
                      {category === 'pick3' ? '123' : category === 'pick4' ? '1234' : '123'}, you
                      win.
                    </li>
                  </ul>
                </PopoverContent>
              </Popover>
            </div>
            <div className='flex flex-row gap-2'>
              <Radio value='combo'>
                <p className='text-lg text-pp-text-dark'>Combo</p>
              </Radio>
              <Popover placement='top' className='flex justify-center'>
                <PopoverTrigger>
                  <button className='text-blue-500'>
                    <MdInfo />
                  </button>
                </PopoverTrigger>
                <PopoverContent className='w-[80%] p-4'>
                  <strong>Combo Bet</strong>
                  <p>
                    To win, players need to match their chosen{' '}
                    {category === 'pick3' ? 3 : category === 'pick4' ? 4 : 3}-digit numbers with the
                    winning {category === 'pick3' ? 3 : category === 'pick4' ? 4 : 3}-digit numbers
                    in any order. This means a Combo Play offers better chances of winning compared
                    to a Straight Play, but your stake is multiplied for each combination for the
                    same payout.
                  </p>
                  {category === 'pick3' ? (
                    <>
                      <ul>
                        <li>
                          <strong>Example:</strong> If you bet on 123, the possible winning
                          combinations are 123, 132, 213, 231, 312, and 321.
                        </li>
                        <li>
                          <strong>Cost:</strong> Since you're covering six combinations, the cost of
                          the bet is six times the cost of a straight bet.
                        </li>
                      </ul>
                    </>
                  ) : category === 'pick4' ? (
                    <>
                      <ul>
                        <li>
                          <strong>Example:</strong> If you bet on 1234, the possible winning
                          combinations are 1234, 1243, 1324, 1342, 1423, 1432, 2134, 2143, 2314,
                          2341, 2413, 2431, 3124, 3142, 3214, 3241, 3412, 3421, 4123, 4132, 4213,
                          4231, 4312, and 4321.
                        </li>
                        <li>
                          <strong>Cost:</strong> Since you're covering twenty-four combinations, the
                          cost of the bet is twenty-four times the cost of a straight bet.
                        </li>
                      </ul>
                    </>
                  ) : (
                    <></>
                  )}
                </PopoverContent>
              </Popover>
            </div>
          </RadioGroup>
        </div>
        {/* <Divider /> */}
        <div className='flex h-full w-full flex-col items-center gap-2 rounded-xl bg-white p-4'>
          <div className='flex flex-row items-center gap-2'>
            <h1 className='font-tempo text-[1.25rem] uppercase text-pp-text-accent'>Powerplay</h1>
            <BsLightningChargeFill className='text-pp-text-accent' />
          </div>
          <div className='flex flex-row gap-2'>
            <Checkbox isSelected={isFireball} onValueChange={setIsFireball}>
              <p className='text-lg text-pp-text-dark'>Add Power Play ball</p>
            </Checkbox>
            <Popover placement='top' className='flex justify-center'>
              <PopoverTrigger>
                <button className='text-blue-500'>
                  <MdInfo />
                </button>
              </PopoverTrigger>
              <PopoverContent className='w-[80%] p-4'>
                <strong>PowerPlay</strong>
                <p>
                  PowerPlay is an add-on feature that allows players to increase their chances of
                  winning. When you play with the PowerPlay option, an extra number (the PowerPlay
                  number) is drawn from the same set of numbers as the main draw.
                </p>
                <strong>Example:</strong>
                {category === 'pick3' ? (
                  <>
                    <p>
                      Winning Pick 3 Numbers: <strong>1 2 3</strong>
                    </p>
                    <p>
                      PowerPlay Number: <strong>4</strong>
                    </p>
                    <p>
                      By using the PowerPlay number to replace one of the Pick 3 numbers, you get
                      these new winning combinations:
                    </p>
                    <ul>
                      <li>
                        <strong>4 2 3</strong>
                      </li>
                      <li>
                        <strong>1 4 3</strong>
                      </li>
                      <li>
                        <strong>1 2 4</strong>
                      </li>
                    </ul>
                  </>
                ) : category === 'pick4' ? (
                  <>
                    <p>
                      Winning Pick 4 Numbers: <strong>1 2 3 4</strong>
                    </p>
                    <p>
                      PowerPlay Number: <strong>5</strong>
                    </p>
                    <p>
                      By using the PowerPlay number to replace one of the Pick 4 numbers, you get
                      these new winning combinations:
                    </p>
                    <ul>
                      <li>
                        <strong>5 2 3 4</strong>
                      </li>
                      <li>
                        <strong>1 5 3 4</strong>
                      </li>
                      <li>
                        <strong>1 2 5 4</strong>
                      </li>
                      <li>
                        <strong>1 2 3 5</strong>
                      </li>
                    </ul>
                  </>
                ) : (
                  <></>
                )}
              </PopoverContent>
            </Popover>
          </div>
          <p className='text-sm text-black'>Double up for more ways to win! {`+$${stake}`}</p>
        </div>
      </div>
    );
  };

  // manual picks number selection
  const handleNumberClick = (number: number) => {
    const updatedLine = [...line];
    updatedLine[selectedLineNumber] = number;
    setLine(updatedLine);
    let numberChosen = line[selectedLineNumber];
    if (selectedLineNumber + 1 < line.length && numberChosen === null) {
      setLineNumber(selectedLineNumber + 1);
    }
  };

  const numberFlavourText = (idx: number) => {
    const num = idx + 1;
    if (idx >= 0) {
      let place = '';
      switch (num) {
        case 1:
          place = '1st';
          break;
        case 2:
          place = '2nd';
          break;
        case 3:
          place = '3rd';
          break;
        default:
          place = `${num}th`;
      }
      return `Select your\n${place} number`;
    } else {
      return 'Tap a ball\nabove & make\nyour pick here';
    }
  };

  const LineNumberSelection = (_props: any) => {
    return (
      <div className='flex flex-col gap-2 px-4 '>
        <div className='flex flex-col items-center gap-4'>
          <div className='flex h-full w-full flex-col items-center justify-around gap-4 rounded-xl bg-white p-4'>
            <div className='relative flex w-full flex-row items-center justify-around'>
              {line.length !== 0 ? (
                <>
                  {line.map((value, idx) => (
                    <LottoBall
                      key={idx}
                      scale='small'
                      number={value !== null ? value.toString() : null}
                      isActive={selectedLineNumber === idx}
                      onClick={() => setLineNumber(idx)}
                    />
                  ))}
                  {isFireball && <LottoBall scale='small' fireball />}
                </>
              ) : (
                <CircularProgress aria-label='Loading...' />
              )}
            </div>
            <p>
              {line.reduce((count: number, element) => {
                return element !== null ? count + 1 : count;
              }, 0)}{' '}
              of {line.length} Selected
            </p>
            <Button
              isDisabled={disableAutoPicks}
              onClick={runAutoPick}
              className='h-12 w-[80%] bg-gradient-to-r from-user-menu-blue-gradient-light to-user-menu-blue-gradient-dark font-tempo text-xl text-white shadow-user-menu-blue-shadow'
            >
              Auto Pick
            </Button>
            <Divider />
            <CircleSelector
              setNumber={handleNumberClick}
              activeNumber={line[selectedLineNumber]}
              isDisabled={selectedLineNumber < 0}
              line={line}
              lineType={lineTypeSelected}
            >
              <pre className='text-center font-tempo text-xl font-black text-pp-text-accent'>
                {numberFlavourText(selectedLineNumber)}
              </pre>
            </CircleSelector>
          </div>
        </div>
      </div>
    );
  };

  // === "MODULE" COMPONENTS END ===

  return (
    <Modal
      className='max-h-[80%] overflow-y-auto text-pp-text-dark'
      closeButton
      aria-label='Make Your Picks'
      isOpen={visible}
      onClose={closePicksModal}
    >
      <ModalContent className='modal-close-button bg-blue-100'>
        <ModalHeader>
          <h1 className='font-tempo uppercase'>Make Your Picks!</h1>
        </ModalHeader>
        <ModalBody className='p-0'>
          <LineSelections />
          {isAutoPick ? <></> : <LineNumberSelection />}
          <div className='flex h-24 w-full flex-col items-center justify-around bg-blue-200'>
            <h1 className='font-bold'>
              {`TOTAL COST: $${checkoutLine ? calculateLineValue(checkoutLine) : 0}`}
            </h1>
            <Button
              isDisabled={disableCreateLine}
              className='h-12 w-[80%] bg-gradient-to-r from-user-menu-blue-gradient-light to-user-menu-blue-gradient-dark font-tempo text-xl text-white'
              onClick={submitLine}
            >
              {isEditing ? 'Update' : 'Create'}
            </Button>
          </div>
          <Modal
            backdrop='blur'
            isDismissable={false}
            aria-labelledby='Picks Error'
            isOpen={pickErrorVisible}
            placement='center'
          >
            <ModalContent>
              <ModalHeader>
                <p className='font-tempo text-2xl uppercase text-pp-text-dark'>
                  Line Creation Error
                </p>
              </ModalHeader>
              <ModalBody>
                <ol className='ml-4 list-outside list-decimal space-y-4'>
                  {picksError.map((error) => (
                    <li>{error}</li>
                  ))}
                </ol>
              </ModalBody>
              <ModalFooter>
                <Button
                  className='bg-gradient-to-r from-user-menu-blue-gradient-light to-user-menu-blue-gradient-dark font-bold text-white shadow-user-menu-blue-shadow'
                  onPress={() => setPEVisible(false)}
                >
                  OK
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default PicksModal;
