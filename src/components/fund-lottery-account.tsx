import { FormEvent, useEffect, useRef, useState } from 'react';

import { Button, Input } from '@nextui-org/react';
import { AccountBalance } from 'ships-service-sdk';

import { useStoreFrontContext } from '@/apps/store-front';
import { Sfx, useAudioContext } from '@/contexts/audio-context';
import { AccountType } from '@/utils/types';
import { usdFormatter } from '@/utils/util';

enum ViewState {
  INITIAL = 'initial',
  CHARGE_SOURCE = 'chargeSource',
  ENTER_AMOUNT = 'enterAmount',
  ENTER_CUSTOM_AMOUNT = 'enterCustomAmount',
  ENTER_PIN = 'enterPin',
  RESULT = 'result',
}

type FundLotteryAccountProps = {
  balance: AccountBalance;
  onSubmit: (
    amount: number,
    chargeType: AccountType,
    pin: string,
  ) => Promise<AccountBalance | undefined>;
  onClose: () => void;
};

type AmountButton = {
  key: string;
  display: string;
  onClick: () => void;
};

const FundLotteryAccount = (props: FundLotteryAccountProps) => {
  const { playSoundEffect, handleGenericClickAudio } = useAudioContext();
  const { gameId } = useStoreFrontContext();
  const [view, setView] = useState<ViewState>(ViewState.CHARGE_SOURCE);

  const [pin, setPin] = useState<string>('');
  const [pinInvalid, setPinInvalid] = useState<boolean>(false);

  const [sourceAccountType, setSourceAccountType] = useState<AccountType | undefined>(undefined);

  const [amount, setAmount] = useState<number>(0);
  const [amountInvalid, setAmountInvalid] = useState<boolean>(false);
  const [amountDisplay, setAmountDisplay] = useState<string>('');
  const [amountSelectedID, setAmountSelectedID] = useState<number | undefined>(undefined);

  const [resultError, setResultError] = useState<string>('');

  const [finalBalance, setFinalBalance] = useState<AccountBalance | undefined>(undefined);

  const [isCasinoButtonDisabled, setIsCasinoButtonDisabled] = useState<boolean>(false);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const amountFieldRef = useRef<any>(null);
  const pinFieldRef = useRef<any>(null);
  const priceButtonRef = useRef<any>(null);
  const confirmButtonRef = useRef<any>(null);

  const handleSourceSubmit = (accountType: AccountType) => {
    // if trying to use casino balance, and there is none return
    if (accountType == AccountType.Casino) {
      if (isCasinoButtonDisabled) {
        return;
      }
    }

    setTimeout(() => {
      setSourceAccountType(accountType);
      setView(ViewState.ENTER_AMOUNT);
    }, 5);
  };

  const handleCustomAmountSelected = () => {
    setAmount(0);
    setView(ViewState.ENTER_CUSTOM_AMOUNT);
    amountFieldRef.current?.focus();
  };

  const handleAmountChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAmountInvalid(false);
    const value = event?.target?.value;

    // limit input to digits only, up to 2 decimal places
    const regex = /^\d*\.?\d{0,2}$/;

    // ensure pattern matches or dont set it.
    if (regex.test(value)) {
      setAmount(parseFloat(value));
      setAmountDisplay(value);
    }
  };

  const handleAmountSubmit = () => {
    if (!amount) {
      setAmountInvalid(true);
      playSoundEffect(Sfx.OTH_STAKE_END);
      return;
    } else {
      if (gameId) {
        handleGenericClickAudio(gameId);
      }
    }

    setTimeout(() => {
      setAmount(amount);
      setView(ViewState.ENTER_PIN);
      pinFieldRef.current?.focus();
    }, 5);
  };

  const handlePinChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    const invalidChars = /[^0-9\s]/g;
    const inputtedValue = event?.target?.value;
    if (invalidChars.test(inputtedValue) || inputtedValue.length > 4) {
      setPinInvalid(true);
    } else {
      setPinInvalid(false);
      setPin(inputtedValue);
    }
  };

  const handlePinSubmit = async () => {
    if (!pin) {
      setPinInvalid(true);
      playSoundEffect(Sfx.OTH_STAKE_END);
      return;
    }
    if (gameId) {
      handleGenericClickAudio(gameId);
    }

    if (isSubmitting) {
      return;
    }

    if (!!sourceAccountType) {
      setIsSubmitting(true);
      if (gameId) {
        handleGenericClickAudio(gameId);
      }
      try {
        const bal = await props?.onSubmit(amount, sourceAccountType, pin);
        setFinalBalance(bal);
      } catch (e: any) {
        setResultError(e.message);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setResultError('An error occurred please try again');
    }
    setView(ViewState.RESULT);
    confirmButtonRef.current?.focus();
  };

  const amountButtons: AmountButton[] = [
    { key: '1', display: '$20', onClick: () => setAmount(20) },
    { key: '2', display: '$30', onClick: () => setAmount(30) },
    { key: '3', display: '$40', onClick: () => setAmount(40) },
    { key: '4', display: '$50', onClick: () => setAmount(50) },
    { key: '5', display: '$100', onClick: () => setAmount(100) },
    { key: '6', display: 'Other', onClick: () => handleCustomAmountSelected() },
  ];

  // used to keep the state of isCasinoButtonDisabled updated anytime theres a change in casino balance
  useEffect(() => {
    setIsCasinoButtonDisabled(!props?.balance?.cmas?.casinoBankBalance);
  }, [props?.balance?.cmas?.casinoBankBalance]);

  const renderInitial = (
    <div>
      <p>Your lottery balance is {usdFormatter.format(props?.balance?.timeplay?.lottery || 0)}</p>
      <p>Would you like to fund your account?</p>
      <Button onPress={() => setView(ViewState.CHARGE_SOURCE)}>Yes</Button>
      <Button onPress={props.onClose}>No</Button>
    </div>
  );
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Check if the Enter/Go key is pressed
    console.log('jh')
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent default form behavior
      handlePinSubmit(); // Call the submit function manually
    }
  };
  
  const renderChargeSource = (
    <div>
      <p className='mb-8 mt-4 text-lg font-bold text-black'>SELECT SOURCE</p>
      <div className='flex flex-col items-center'>
        <p className='mb-8 w-4/5 text-center text-lg font-semibold text-black'>
          From where would you like to fund your Lottery Hub Account?
        </p>
        <Button
          className={
            isCasinoButtonDisabled
              ? 'mb-8 h-[48px] w-4/5 bg-gradient-to-r from-user-menu-gray-gradient-dark to-user-menu-gray-gradient-light text-sm font-bold text-white shadow-user-menu-gray-shadow'
              : 'mb-8 h-[48px] w-4/5 bg-gradient-to-r from-user-menu-blue-gradient-dark to-user-menu-blue-gradient-light text-sm font-bold text-white shadow-user-menu-blue-shadow'
          }
          onPress={() => {
            handleSourceSubmit(AccountType.Casino);
            if (gameId) {
              handleGenericClickAudio(gameId);
            }
            priceButtonRef.current?.focus();
          }}
          disabled={isCasinoButtonDisabled}
        >
          <p>From Casino Bank</p>
          {!!props?.balance?.cmas?.casinoBankBalance && (
            <p className='font-normal'>&#40;BAL: ${props.balance.cmas.casinoBankBalance}&#41;</p>
          )}
        </Button>
        <Button
          className='mb-8 h-[48px] w-4/5 bg-gradient-to-r from-user-menu-blue-gradient-dark to-user-menu-blue-gradient-light text-sm font-bold text-white shadow-user-menu-blue-shadow'
          onPress={() => {
            handleSourceSubmit(AccountType.Room);
            if (gameId) {
              handleGenericClickAudio(gameId);
            }
            priceButtonRef.current?.focus();
          }}
        >
          <p>From Room Account</p>
        </Button>
        <p className='mb-8 w-4/5 text-center text-lg font-semibold text-black'>
          Current Balance: {usdFormatter.format(props?.balance?.timeplay?.lottery || 0)}
        </p>
      </div>
    </div>
  );

  const renderEnterAmount = (
    <div>
      <h2 className='mb-8 mt-4 text-lg font-bold text-black'>SELECT AMOUNT</h2>
      <div className='flex flex-col items-center'>
        <p className='mb-4 w-4/5 text-center text-lg font-semibold text-black'>
          Select the amount you would like to add
        </p>
        <ul className='mb-8 grid w-4/5 grid-cols-3 items-center gap-4 justify-self-center'>
          {amountButtons.map((button, index) => (
            <li key={index}>
              <Button
                key={button.key}
                className={
                  amountSelectedID === index
                    ? 'h-[50px] rounded-[10px]  bg-gradient-to-r from-user-menu-blue-gradient-dark to-user-menu-blue-gradient-light text-base font-medium text-white'
                    : 'h-[50px] rounded-[10px] border-1 border-user-menu-blue bg-white text-base font-medium text-user-menu-blue'
                }
                aria-pressed={button.display === 'Other' ? undefined : amountSelectedID === index}
                ref={index === 1 ? priceButtonRef : undefined}
                onPress={() => {
                  button.onClick();
                  setAmountSelectedID(index);
                  if (gameId) {
                    handleGenericClickAudio(gameId);
                  }
                }}
              >
                {button.display}
              </Button>
            </li>
          ))}
        </ul>
        <Button
          className='mb-8 h-[48px] w-4/5 bg-gradient-to-r from-user-menu-blue-gradient-dark to-user-menu-blue-gradient-light font-bold text-white shadow-user-menu-blue-shadow'
          onPress={() => {
            if (!!amount) {
              handleAmountSubmit();
              if (gameId) {
                handleGenericClickAudio(gameId);
              }
            } else {
              playSoundEffect(Sfx.OTH_STAKE_END);
            }
          }}
          disabled={!amount}
        >
          Confirm
        </Button>
      </div>
    </div>
  );

  const renderEnterCustomAmount = (
    <form
      onSubmit={(event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        handleAmountSubmit();
      }}
    >
      <fieldset>
        <legend>
          <h2 className='mb-8 mt-4 text-lg font-bold text-black'>SELECT AMOUNT</h2>
        </legend>
        <div className='flex flex-col items-center'>
          <p id='amount-label' className='text-center text-lg text-black'>
            Enter Amount
          </p>
          <Input
            key={'input_amount'}
            id='amount-input'
            className='w-4/5 text-4xl text-black'
            size='lg'
            placeholder='0.00'
            type='number'
            value={amountDisplay}
            onChange={handleAmountChanged}
            isInvalid={amountInvalid}
            style={{ textAlign: 'center' }}
            aria-labelledby='amont-label'
            aria-describedby={amountInvalid ? 'amount-error-text' : undefined}
            ref={amountFieldRef}
          />
          <div
            id='amount-error-text'
            className={`mb-8 text-sm text-red-500 ${amountInvalid ? 'visible' : 'invisible'}`}
          >
            Please enter a valid amount
          </div>
          <Button
            className='mb-8 h-[48px] w-4/5 bg-gradient-to-r from-user-menu-blue-gradient-dark to-user-menu-blue-gradient-light font-bold text-white shadow-user-menu-blue-shadow'
            type='submit'
          >
            Confirm
          </Button>
        </div>
      </fieldset>
    </form>
  );

  const renderEnterPin = (
    <form
      onSubmit={(event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        handlePinSubmit();
      }}
    >
      <fieldset>
        <legend>
          <h2 className='mb-8 mt-4 text-lg font-bold text-black'>CONFIRM PURCHASE</h2>
        </legend>
        <div className='flex flex-col items-center'>
          <p id='pin-label' className='text-center text-lg text-black'>
            Enter PIN
          </p>
          <Input
            size='lg'
            key='input_pin'
            id='pin-input'
            className='my-2 w-4/5 text-4xl text-black'
            value={pin}
            onChange={handlePinChanged}
            onKeyDown={handleKeyPress}
            isInvalid={pinInvalid}
            placeholder='YYMM'
            type='password'
            style={{ textAlign: 'center' }}
            aria-labelledby='pin-label'
            aria-describedby={pinInvalid ? 'pin-error-text' : 'pin-help-text'}
            inputMode='numeric'
            ref={pinFieldRef}
          />
          <p id='pin-help-text' className='w-4/5 text-center text-base font-bold text-black'>
            * YEAR and MONTH of birth unless you have updated your PIN *
          </p>
          <div
            id='pin-error-text'
            className={`mb-8 text-sm text-red-500 ${pinInvalid ? 'visible' : 'invisible'}`}
          >
            Your pin should be a 4-digit number.
          </div>
          <Button
            className='mb-8 h-[48px] w-4/5 bg-gradient-to-r from-user-menu-blue-gradient-dark to-user-menu-blue-gradient-light font-bold text-white shadow-user-menu-blue-shadow'
            type='submit'
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Processing...' : 'Confirm'}
          </Button>
        </div>
      </fieldset>
    </form>
  );

  const renderResult = (
    <div>
      {!resultError ? (
        <div>
          <h2 className='mb-8 mt-4 text-lg font-bold text-black'>PURCHASE COMPLETE!</h2>
          <div className='flex flex-col items-center'>
            <p className='text-center text-lg text-black'>New Account Balance:</p>
            <p className='mb-8 text-center text-lg font-bold leading-none text-black'>
              {usdFormatter.format(finalBalance?.timeplay?.lottery || 0)}
            </p>
          </div>
        </div>
      ) : (
        <div>
          <h2 className='mb-8 mt-4 text-lg font-bold text-black'>PURCHASE UNSUCCESSFUL</h2>
          <div className='flex flex-col items-center'>
            <p className='mb-8 w-4/5 text-center text-lg text-black'>
              An error occurred during purchase please try again
            </p>
            <p className='mb-8 w-4/5 text-center text-lg text-black'>{resultError}</p>
          </div>
        </div>
      )}
      <div className='flex flex-col items-center'>
        <Button
          className='mb-8 h-[48px] w-4/5 bg-gradient-to-r from-user-menu-blue-gradient-dark to-user-menu-blue-gradient-light font-bold text-white shadow-user-menu-blue-shadow'
          onPress={() => {
            props.onClose();
            if (gameId) {
              handleGenericClickAudio(gameId);
            }
          }}
          aria-description={
            !resultError
              ? 'Purchase successful, new balance: ' +
                usdFormatter.format(finalBalance?.timeplay?.lottery || 0)
              : 'An error occurred during purchase please try again'
          }
          ref={confirmButtonRef}
        >
          Confirm
        </Button>
      </div>
    </div>
  );

  switch (view) {
    case ViewState.INITIAL:
      return renderInitial;
    case ViewState.CHARGE_SOURCE:
      return renderChargeSource;
    case ViewState.ENTER_AMOUNT:
      return renderEnterAmount;
    case ViewState.ENTER_CUSTOM_AMOUNT:
      return renderEnterCustomAmount;
    case ViewState.ENTER_PIN:
      return renderEnterPin;
    case ViewState.RESULT:
      return renderResult;
    default:
      return <></>;
  }
};

export default FundLotteryAccount;
