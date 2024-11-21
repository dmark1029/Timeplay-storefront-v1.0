import { InstantWinNumber, InstantWinNumberStates } from '../types';

export const generateMockInstantWinNumbers = (count: number): InstantWinNumber[] => {
  const numbers: InstantWinNumber[] = [];
  for (let i = 0; i < count; i++) {
    numbers.push({
      number_id: `inst-lot-gameplay-number_${i}`,
      group_id: `inst-lot-gameplay-number_group_${i}`,
      number: i + 1,
      prize: { id: '999', value: '2', tag: '', multiplier: 1 },
      revealed: false,
      winner: false,
      prize_id: '999',
      sort_order: i,
    });
  }
  return numbers;
};

export const generateMockInstantWinNumbersStates = (
  count: number,
  state: InstantWinNumberStates,
): number[] => {
  const states: number[] = [];
  for (let i = 0; i < count; i++) {
    states.push(state);
  }
  return states;
};
