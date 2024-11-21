import { useEffect, useRef, useState } from 'react';

import { Button, Input } from '@nextui-org/react';

import { AnimateTransition } from '@/components';
import { LoginRequestCombined, useAppContext } from '@/contexts/app-context';
import { useDialogContext } from '@/contexts/dialog-context';
import { ShipsPartner } from '@/utils/types';
import { CookieMenu } from '@/apps/store-front/components';
type FormType = ShipsPartner | 'guest';

type FormInputType = {
  label: string;
  id: string;
  value: string;
  type: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  placeholder: string;
  inputMode?:
  | 'search'
  | 'text'
  | 'email'
  | 'tel'
  | 'url'
  | 'none'
  | 'numeric'
  | 'decimal'
  | undefined;
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement>,
    setValue: React.Dispatch<React.SetStateAction<string>>,
  ) => void;
};

type FormInputMap = {
  [partner: string]: FormInputType[];
};

const LoginPage = () => {
  const { handlePlayerLogin, partner, mockGuest } = useAppContext();
  const { handleSetInfoDialog } = useDialogContext();

  const formType: FormType = mockGuest.enabled ? 'guest' : partner;

  const [folio, setFolio] = useState('');
  const [pin, setPin] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dob, setDob] = useState('');
  const [cabinNumber, setCabinNumber] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [showCookieMenu, setShowCookieMenu] = useState(false);

  useEffect(() => {
    if (partner === ShipsPartner.Carnival && !mockGuest.enabled) {
      const params = new URLSearchParams(document.location.search);
      const session_key = params.get('token');

      if (session_key != null) handlePlayerLogin({ session_key });
    }
  }, [partner, mockGuest]);

  const login = (e: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLButtonElement>) => {
    e.preventDefault();
    handleSubmit();
  };

  const handleCookiePolicy = () => {
    setShowCookieMenu(false);
  };

  const handleSubmit = () => {
    console.log('submitting login form');

    // Validate form inputs here
    for (const input of formInputTypes[formType]) {
      if (!input.value || input.value === '') {
        console.error('Please enter a value for', input.label);
        handleSetInfoDialog({
          title: 'Login',
          message: `Please enter a value for ${input.label.toLowerCase()}`,
        });
        return;
      }
    }

    // TODO: Remove this mock data
    const mockGuestData: LoginRequestCombined = {
      firstname: firstName,
      dob: '198012',
      stateroom: '789',
      folio: '456',
      pin: '1111',
      session_key: '',
      lastname: '',
      cardNumber,
    };

    const loginPayload: LoginRequestCombined = {
      firstname: firstName,
      dob,
      stateroom: cabinNumber,
      folio,
      pin,
      session_key: '',
      lastname: lastName,
    };

    // Handle login logic here
    if (mockGuest.enabled) {
      handlePlayerLogin(mockGuestData);
    } else {
      handlePlayerLogin(loginPayload);
    }
  };

  const handlePinChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setValue: React.Dispatch<React.SetStateAction<string>>,
  ) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setValue(value);
    }
  };

  const formInputTypes: FormInputMap = {
    [ShipsPartner.Carnival]: [
      {
        label: 'Folio',
        id: 'folio',
        value: folio,
        type: 'text',
        setValue: setFolio,
        placeholder: '*****',
        inputMode: 'numeric',
      },
      {
        label: 'PIN*',
        id: 'pin',
        value: pin,
        type: 'password',
        setValue: setPin,
        placeholder: '----',
        inputMode: 'numeric',
        onChange: handlePinChange,
      },
    ],
    [ShipsPartner.NCL]: [
      {
        label: 'Firstname',
        id: 'firstname',
        value: firstName,
        type: 'text',
        setValue: setFirstName,
        placeholder: '----',
      },
      {
        label: 'Date of Birth',
        id: 'dob',
        type: 'date',
        value: dob,
        setValue: setDob,
        placeholder: '----',
      },
      {
        label: 'Cabin Number',
        id: 'cabinNumber',
        value: cabinNumber,
        type: 'number',
        setValue: setCabinNumber,
        placeholder: '----',
      },
    ],
    [ShipsPartner.Celebrity]: [
      {
        label: 'Firstname',
        id: 'firstname',
        value: firstName,
        type: 'text',
        setValue: setFirstName,
        placeholder: '----',
      },
      {
        label: 'Date of Birth',
        id: 'dob',
        type: 'date',
        value: dob,
        setValue: setDob,
        placeholder: '----',
      },
      {
        label: 'Cabin Number',
        id: 'cabinNumber',
        value: cabinNumber,
        type: 'number',
        setValue: setCabinNumber,
        placeholder: '----',
      },
    ],
    [ShipsPartner.Timeplay]: [
      {
        label: 'Firstname',
        id: 'firstname',
        value: firstName,
        type: 'text',
        setValue: setFirstName,
        placeholder: '----',
      },
      {
        label: 'Lastname',
        id: 'lastname',
        value: firstName,
        type: 'text',
        setValue: setLastName,
        placeholder: '----',
      },
    ],
    guest: [
      {
        label: 'Nickname',
        id: 'nickname',
        value: firstName,
        type: 'text',
        setValue: setFirstName,
        placeholder: '----',
      },
      {
        label: 'Card Number',
        id: 'cardNumber',
        value: cardNumber,
        type: 'number',
        inputMode: 'numeric',
        setValue: setCardNumber,
        onChange: handlePinChange,
        placeholder: '----',
      },
    ],
  };

  const formInputs = formInputTypes[formType];

  const titleRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    console.log('Focus set');
    titleRef.current?.focus();
    const cookieState = localStorage.getItem('cookieAccepted');
    if (!cookieState) {
      setShowCookieMenu(true);
    }
  }, []);

  const handleChange = (
    setValue: React.Dispatch<React.SetStateAction<string>>,
    label: string,
    value: string,
  ) => {
    const invalidChars = /[^a-zA-Z0-9]/;
    const invalidDigit = /[^0-9\s]/g;
    const isInvalid = label === 'Pin' ? invalidDigit.test(value) : invalidChars.test(value);
    if (isInvalid) {
      handleSetInfoDialog({
        title: 'Type error',
        message: `Please input a valid ${label.toLowerCase()}.`,
      });
    } else {
      setValue(value);
    }
  };

  useEffect(() => {
    const metaThemeColor = document.querySelector("meta[name='theme-color']") as HTMLMetaElement;
    const prevThemeColor = metaThemeColor.content;
    // NOTE: Need to use near-white for the status bar color, as on iOS using full white will just make it black for some reason
    // (unless page is refreshed)
    metaThemeColor.content = 'rgb(255,255,254)';

    return () => {
      metaThemeColor.content = prevThemeColor;
    };
  }, []);

  return (
    <>
      <AnimateTransition initial={true} duration={0.5}>
        <form
          className='flex h-full w-full flex-col items-center justify-center gap-4'
        >
          <div className='flex h-2/4 w-3/5 flex-col'>
            <div className='flex-1'></div>
            <div className='flex flex-col items-center justify-center'>
              {formInputs.map((input, index) => (
                <div className='m-2 flex w-4/5 flex-col items-center' key={index}>
                  <label htmlFor={input.id + '-input'} className='m-2 text-center'>
                    {input.label}
                  </label>
                  <Input
                    id={input.id + '-input'}
                    variant='faded'
                    radius='sm'
                    placeholder={input.placeholder}
                    classNames={{
                      input: 'placeholder:text-center text-center',
                    }}
                    size='lg'
                    required
                    type={input.type}
                    value={input.value}
                    inputMode={input.inputMode ?? 'text'}
                    onChange={(e) =>
                      input.onChange
                        ? input.onChange(e, input.setValue)
                        : handleChange(input.setValue, input.label, e.target.value)
                    }
                    aria-label='Login input field'
                  />
                </div>
              ))}
            </div>
            {!mockGuest.enabled && (
              <p className='m-4 text-center text-xs tracking-wide'>
                *Default PIN is MMYY of your birth date. If you have changed it, use your new PIN.
              </p>
            )}
            <div className='flex-1'></div>
            <div className='flex justify-center'>
              <Button
                onClick={(e) => login(e)}
                className='w-full bg-gradient-to-r from-user-menu-blue-gradient-light to-user-menu-blue-gradient-dark py-6 font-bold uppercase text-white shadow-user-menu-blue drop-shadow-sm'
                aria-label='Submit login'
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    login(event);
                  }
                }}
              >
                Login
              </Button>
            </div>
          </div>
          <div className='absolute bottom-0 flex w-full flex-col items-center'>
            <span
              className='p-1'
              style={{
                color: '#9a9a9a',
              }}
            >
              Powered by TimePlay
            </span>
            <span
              className='p-1'
              style={{
                color: '#9a9a9a',
              }}
            >{`v${import.meta.env.VITE_VERSION}`}</span>
          </div>
        </form>
      </AnimateTransition>
      {
        showCookieMenu &&
        <CookieMenu
          isOpen={showCookieMenu}
          onAccept={handleCookiePolicy}
        />
      }
    </>
  );
};

export default LoginPage;
