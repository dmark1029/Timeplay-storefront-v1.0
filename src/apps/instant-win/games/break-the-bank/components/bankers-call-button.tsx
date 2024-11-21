import React from 'react';

interface BankersCallButtonProps {
  onClick: () => void;
  buttonType: 'Accept' | 'Decline';
}

const BankersCallButton: React.FC<BankersCallButtonProps> = ({ onClick, buttonType }) => {
  switch (buttonType) {
    case 'Accept':
      return (
        <div
          className='btn flex h-24 w-24 items-center justify-center rounded-md bg-green-500'
          onClick={onClick}
        >
          ACCEPT
        </div>
      );
    case 'Decline':
      return (
        <div
          className='btn flex h-24 w-24 items-center justify-center rounded-md bg-red-500'
          onClick={onClick}
        >
          DECLINE
        </div>
      );
  }
};

export default BankersCallButton;
