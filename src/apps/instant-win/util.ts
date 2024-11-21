import {
  CompleteInstantWinInstanceConflictError,
  CompleteInstantWinInstanceConflictResponse,
  CompleteInstantWinInstanceHeldError,
  InstantWinState,
  Prize,
} from './types';

export function isCompleteInstantWinInstanceConflictResponse(
  data: any,
): data is CompleteInstantWinInstanceConflictResponse {
  return (
    typeof data === 'object' &&
    typeof data.type === 'string' &&
    Object.values(InstantWinState).includes(data.data)
  );
}

export function isCompleteInstantWinInstanceConflictError(
  error: any,
): error is CompleteInstantWinInstanceConflictError {
  return error instanceof Error && 'state' in error;
}

export function isCompleteInstantWinInstanceHeldError(
  error: any,
): error is CompleteInstantWinInstanceHeldError {
  return error instanceof CompleteInstantWinInstanceHeldError;
}

// This function converts the prize value to display value by dividing by the multiplier. This is because prize.value is already multiplied.
// This function assumes prize.value is in cents.
export const getPreMultiplierAmountWon = (prize: Prize): number => {
  const winAmount = parseInt(prize.value, 10);
  // if the win amount isnt a number return
  if (isNaN(winAmount)) {
    console.error(`[getPreMultiplierAmountWon] prize value: ${prize?.value} was not a number`);
    return 0;
  }

  // convert to dollars
  const amountInDollars = winAmount / 100;

  // if theres no multiplier return the win amount in dollars - skipping the multiplier
  if (!prize?.multiplier) {
    console.error('[getPreMultiplierAmountWon] prize didnt have a multiplier');
    return amountInDollars;
  }

  // divide by the multipler and return
  return amountInDollars / prize.multiplier;
};
