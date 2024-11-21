import React from 'react';

import { Card } from '@nextui-org/react';

import { cn } from '@/utils/cn';

import { InstantWinNumber } from '../../../types';

interface BankersBonusItemProps {
  data: InstantWinNumber;
  onClick: () => void;
}
type states = 'closed' | 'winner' | 'open';

const BankersBonusItem: React.FC<BankersBonusItemProps> = ({ data, onClick }) => {
  let state: states = 'closed';
  let text: string = 'closed';

  if (data.revealed && data.winner) {
    text = data?.prize?.value?.toString();
    state = 'winner';
  } else if (data.revealed) {
    text = data?.prize?.value?.toString();
    state = 'open';
  }
  console.log('BankersBonusItem', data, state, text);

  return (
    <Card
      isPressable
      onClick={onClick}
      className={cn(`flex h-20 w-20 shrink-0 items-center justify-center p-2`)}
    >
      {text}
    </Card>
  );
};

export default BankersBonusItem;
