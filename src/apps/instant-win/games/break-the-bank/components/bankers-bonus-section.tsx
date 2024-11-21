// import React, { useState } from 'react';

// import { cn } from '@/utils/cn';

// import BankersBonusItem from './bankers-bonus-item';
// import { InstantWinNumber } from '../types';

// interface BankersBonusSectionProps {
//   className?: string;
// }

// const BankersBonusSection: React.FC<BankersBonusSectionProps> = ({ className }) => {
//   // const [revealed, setRevealed] = useState(false);

//   // const numbers: InstantWinNumber[] = [];
//   // const numSet: React.Dispatch<React.SetStateAction<InstantWinNumber>>[] = [];
//   // for (let i = 0; i < 4; i++) {
//   //   const [num, setNum] = useState({ number_id: i, payout: 0, revealed: false, winner: false });
//   //   numbers.push(num);
//   //   numSet.push(setNum);
//   // }

//   // return (
//   //   <div
//   //     className={cn(
//   //       'grid h-full grid-cols-2 place-items-center gap-2 rounded-md px-2 py-2',
//   //       className,
//   //     )}
//   //   >
//   //     <BankersBonusItem
//   //       data={numbers[0]}
//   //       onClick={() => {
//   //         console.log(`Case 1 clicked`);
//   //         if (!revealed) {
//   //           setRevealed(true);
//   //           numSet[0]({ ...numbers[0], revealed: true });
//   //         }
//   //       }}
//   //     />
//   //     <BankersBonusItem
//   //       data={numbers[1]}
//   //       onClick={() => {
//   //         console.log(`Case 2 clicked`);
//   //         if (!revealed) {
//   //           setRevealed(true);
//   //           numSet[1]({ ...numbers[1], revealed: true });
//   //         }
//   //       }}
//   //     />
//   //     <BankersBonusItem
//   //       data={numbers[2]}
//   //       onClick={() => {
//   //         console.log(`Case 3 clicked`);
//   //         if (!revealed) {
//   //           setRevealed(true);
//   //           numSet[2]({ ...numbers[2], revealed: true });
//   //         }
//   //       }}
//   //     />
//   //     <BankersBonusItem
//   //       data={numbers[3]}
//   //       onClick={() => {
//   //         console.log(`Case 4 clicked`);
//   //         if (!revealed) {
//   //           setRevealed(true);
//   //           numSet[3]({ ...numbers[3], revealed: true });
//   //         }
//   //       }}
//   //     />
//     </div>
//   );
// };

// export default BankersBonusSection;
