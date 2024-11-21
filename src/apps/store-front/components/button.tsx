import React from 'react';
import { Button, Checkbox } from '@nextui-org/react';
import { useState } from 'react';

type ButtonProps = {
  name: string;
  state: string;
  type: string;
};

const button: React.FC<ButtonProps> = ({ name, state, type }) => {
  const [isDefaultball, setIsDefaultball] = useState(false);
  const [isDisabledball, setIsDisabledball] = useState(false);
  switch (type) {
    case 'primary':
      switch (state) {
        case 'pressed':
          return (
            <Button className='bg-primary-pressed w-24 text-white mx-2 my-2 shadow-2xl shadow-blue-500/50'>
              {name}
            </Button>
          )
        case 'disabled':
          return (
            <Button className='bg-primary-100 w-24 text-white mx-2 my-2 shadow-2xl shadow-blue-500/50'>
              {name}
            </Button>
          )
        default:
          return (
            <Button className='bg-primary-default w-24 text-white mx-2 my-2 shadow-2xl shadow-blue-500/50'>
              {name}
            </Button>
          )
      }
    case 'secondary':
      switch (state) {
        case 'pressed':
          return (
            <Button className='bg-primary-pressed w-12 h-2/4 text-white mx-2 my-2 shadow-2xl shadow-blue-500/50'>
              {name}
            </Button>
          )
        case 'disabled':
          return (
            <Button className='bg-primary-100 w-12 h-2/4 text-white mx-2 my-2 shadow-2xl shadow-blue-500/50'>
              {name}
            </Button>
          )
        default:
          return (
            <Button className='bg-primary-default w-12 h-2/4 text-white mx-2 my-2 shadow-2xl shadow-blue-500/50'>
              {name}
            </Button>
          )
      }
    case 'distractive':
      return (
        <Button className='bg-accent-red w-24 text-white mx-2 my-2 shadow-2xl shadow-red-500/50'>
          {name}
        </Button>
      )
    case 'sections':
      switch (state) {
        case 'disabled':
          return (
            <Button
              style={{
                width: '40px',
                height: '40px',
                minWidth: '40px',
                padding: '0',
              }}
              className='bg-primary-100 text-primary-500 block my-2 pt-1 h-12'
            >
              <Checkbox
                className='text-white flex align-center mt-0.5 ml-2.5 mb-0 mr-0 p-0'
                isSelected={isDisabledball}
                onValueChange={setIsDisabledball}>
              </Checkbox>
              <span className='text-xs'>{name}</span>
            </Button>
          )
        default:
          return (
            <Button
              style={{
                width: '40px',
                height: '40px',
                minWidth: '40px',
                padding: '0',
              }}
              className='bg-primary-default text-white block my-2 pt-1 h-12'
            >
              <Checkbox
                className='text-white flex align-center mt-0.5 ml-2.5 mb-0 mr-0 p-0'
                isSelected={isDefaultball}
                onValueChange={setIsDefaultball}>
              </Checkbox>
              <span className='text-xs'>{name}</span>
            </Button>
          )
      }
    case 'stake':
      switch (state) {
        case 'disabled':
          return (
            <Button className='bg-transparent text-primary-default border-2 border-primary-default mx-2 my-2 shadow-2xl shadow-blue-500/50'>
              {name}
            </Button>
          )
        default:
          return (
            <Button className='bg-primary-default text-white mx-2 my-2 shadow-2xl shadow-blue-500/50'>
              {name}
            </Button>
          )
      }
    case 'round1':
      switch (state) {
        case 'pressed':
          return (
            <Button
              style={{
                width: '35px',
                height: '35px',
                minWidth: '35px',
                padding: '0',
              }}
              className='bg-round-pressed rounded-full text-white mx-2 my-2 drop-shadow-lg shadow-blue-500 border-2'
            >
              <div className='m-auto rounded bg-white border-neutral-default w-3.5 h-3.5'></div>
            </Button>
          )
        default:
          return (
            <Button
              style={{
                width: '35px',
                height: '35px',
                minWidth: '35px',
                padding: '0',
              }}
              className='bg-primary-default rounded-full text-white mx-2 my-2 drop-shadow-lg shadow-blue-500 border-2'
            >
              <div className='m-auto rounded bg-white border-blue-500 border-2 w-4 h-4'></div>
            </Button>
          )
      }
    case 'round2':
      switch (state) {
        case 'disabled':
          return (
            <Button
              style={{
                width: '35px',
                height: '35px',
                minWidth: '35px',
                padding: '0',
              }}
              className='bg-transparent border-neutral-400 rounded-full text-white mx-2 my-2 drop-shadow-lg shadow-blue-500 border-2'
            >
              <div className='w-3.5 h-3.5 m-auto rounded border-neutral-default bg-neutral-400'></div>
            </Button>
          )
        default:
          return (
            <Button
              style={{
                width: '35px',
                height: '35px',
                minWidth: '35px',
                padding: '0',
              }}
              className='bg-primary-default rounded-full text-white mx-2 my-2 drop-shadow-lg shadow-blue-500 border-2'
            >
              <div className='w-3.5 h-3.5 m-auto rounded border-blue-500 bg-white border-2'></div>
            </Button>
          )
      }
    case 'round3':
      switch (state) {
        case 'pressed':
          return (
            <Button
              style={{
                width: '35px',
                height: '35px',
                minWidth: '35px',
                padding: '0',
              }}
              className='bg-transparent text-lg border-2 rounded-full mx-2 my-2 text-blue-600 border-blue-600 font-bold'
            >0
            </Button>
          )
        default:
          return (
            <Button
              style={{
                width: '35px',
                height: '35px',
                minWidth: '35px',
                padding: '0',
              }}
              className='bg-transparent text-lg border-2 rounded-full mx-2 my-2 text-blue-400 border-blue-400 font-bold'
            >0
            </Button>
          )
      }
    case 'word':
      return (
        <a className='text-blue-600 font-bold underline'>
          {name}
        </a>
      )
    case 'game':
      return (
        <Button
          style={{
            width: '25px',
            height: '25px',
            minWidth: '25px',
            padding: '0',
          }}
          className='bg-transparent border-2 border-neutral-400 rounded-lg text-white mx-2 my-2'
        >
          <div className='w-3.5 h-3.5 bg-neutral-400 m-auto rounded'></div>
        </Button>
      )
  }
}
export default button;
