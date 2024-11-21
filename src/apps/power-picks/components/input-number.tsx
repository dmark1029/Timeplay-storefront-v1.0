import React, { useState } from 'react';

import { Button } from '@nextui-org/react';
import {
  FaArrowLeft as Left,
  FaMinus as Minus,
  FaPlus as Plus,
  FaArrowRight as Right,
} from 'react-icons/fa';

interface InputNumberProps {
  options?: any[];
  count?: number;
  setValue: React.Dispatch<React.SetStateAction<number>>;
}

const InputNumber: React.FC<InputNumberProps> = ({ count = 0, setValue, options }) => {
  const [isSelect, _setSelect] = useState<boolean>(options !== undefined);
  const [idx, setIndex] = useState<number>(0);

  const decrementCount = () => {
    if (typeof count === 'number' && count > 0)
      setValue((prevCount) => (prevCount > 1 ? prevCount - 1 : prevCount));
  };

  const incrementCount = () => {
    setValue((prevCount) => prevCount + 1);
  };

  let handlePrevClick;
  let handleNextClick;
  if (options) {
    // use count as "index"
    const prevOption = async () => {
      let index = idx > 0 ? idx - 1 : idx;
      await setIndex(index);
      console.log(index, options, options[index]);
      setValue(options[index]);
    };

    const nextOption = async () => {
      let index = idx < options.length - 1 ? idx + 1 : idx;
      await setIndex(index);
      console.log(index, options, options[index]);
      setValue(options[index]);
    };

    handlePrevClick = prevOption;
    handleNextClick = nextOption;
  } else {
    handlePrevClick = decrementCount;
    handleNextClick = incrementCount;
  }

  return (
    <div className='flex h-8 w-[80%] items-center'>
      <Button
        isDisabled={(options && idx === 0) || (count && count <= 1) ? true : false}
        isIconOnly
        onClick={handlePrevClick}
        className='flex h-full min-w-[2rem] items-center justify-center rounded-none rounded-s-lg bg-gradient-to-r from-user-menu-blue-gradient-light to-user-menu-blue-gradient-dark text-white'
      >
        {isSelect ? <Left /> : <Minus />}
      </Button>
      {options ? (
        <div className='flex h-full w-full items-center justify-center bg-slate-200 text-center'>
          {options[idx]}
        </div>
      ) : (
        <input
          id='number-input'
          value={count === 0 ? '' : count}
          type='number'
          onChange={(e) => {
            let input = e.target.value;
            if (/^\d*$/.test(input)) {
              let val = parseInt(e.target.value);
              if (!isNaN(val)) {
                setValue(val);
              } else {
                setValue(0);
              }
            }
          }}
          onBlur={(e) => {
            let val = parseInt(e.target.value);
            if (isNaN(val)) setValue(0);
          }}
          className='flex h-full w-full items-center justify-center bg-slate-200 text-center'
        />
      )}
      <Button
        isDisabled={options && idx === options.length - 1}
        isIconOnly
        onClick={handleNextClick}
        className='flex h-full min-w-[2rem] items-center justify-center rounded-none rounded-e-lg bg-gradient-to-r from-user-menu-blue-gradient-light to-user-menu-blue-gradient-dark text-white'
      >
        {isSelect ? <Right /> : <Plus />}
      </Button>
    </div>
  );
};

export default InputNumber;
