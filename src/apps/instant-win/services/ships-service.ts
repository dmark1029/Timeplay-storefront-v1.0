import axios, { AxiosError } from 'axios';
import { InstantwinPurchaseInstantWinRequest, InstantwinHTTPPurchaseInstantGameError, InstantwinPurchaseInstantGameErrorDetails } from 'ships-service-sdk';

import { instantWinInstanceApi } from '@/services/ships-service';
import { GameCategory } from '@/utils/types';

import {
  CompleteInstantWinInstanceConflictError,
  CompleteInstantWinInstanceConflictResponse,
  CompleteInstantWinInstanceHeldError,
  InstantWinInstance,
  InstantWinState,
  LotteryGameSession,
} from '../types';
import { isCompleteInstantWinInstanceConflictResponse } from '../util';

const INSTANT_WIN_CATEGORY = 'instant-win';

export class PurchaseError extends Error {
  public details: InstantwinPurchaseInstantGameErrorDetails
  constructor(message: string, details: InstantwinPurchaseInstantGameErrorDetails) {
    super(message);
    this.name = "PurchaseError";
    this.details = details;
  }
}

export class UnauthorizedError extends Error {}

export const purchaseInstantWin = async (
  userID: string,
  payload: InstantwinPurchaseInstantWinRequest,
): Promise<string[]> => {
  try {
    const res = await instantWinInstanceApi.purchaseInstantWin({
      userID: userID,
      payload: payload,
    });

    return res.data.data || [];
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;

      if (axiosError.response) {
        console.error('request failed with status:', axiosError.response.status);
        console.error('response data:', axiosError.response.data);

        switch (axiosError.response.status) {
          case 400:
            throw new Error('invalid or missing request body');
          case 401:
            throw new UnauthorizedError('invalid user credentials');
          case 402:
            const details = (axiosError.response.data as InstantwinHTTPPurchaseInstantGameError).data!;
            throw new PurchaseError('user made an invalid purchase', details);
          case 403:
            throw new Error('user not allowed to purchase');
          case 404:
            throw new Error('game session not found');
          default:
            throw new Error('failed to purchase instant win');
        }
      } else if (axiosError.request) {
        console.error('request made but no response received:', axiosError.request);
        throw new Error('request made but no response received');
      } else {
        console.error('error setting up the request:', axiosError.message);
        throw new Error(`error setting up the request: ${axiosError.message}`);
      }
    } else {
      console.error('unexpected error:', error);
      throw new Error(`unexpected error: ${error}`);
    }
  }
};

export const getInstantWinInstance = async (
  userID: string,
  instanceID: string,
  token: string,
): Promise<InstantWinInstance> => {
  try {
    const res = await axios.get(
      `/ships-service/ships/lottery/user/${userID}/${INSTANT_WIN_CATEGORY}/instances/${instanceID}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    );
    return res.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;

      if (axiosError.response) {
        console.error('request failed with status:', axiosError.response.status);
        console.error('response data:', axiosError.response.data);

        switch (axiosError.response.status) {
          case 400:
            throw new Error('missing or invalid parameters');
          case 401:
            throw new Error('invalid user credentials');
          case 404:
            throw new Error('instance not found');
          default:
            throw new Error('failed to get instance');
        }
      } else if (axiosError.request) {
        console.error('request made but no response received:', axiosError.request);
        throw new Error('request made but no response received');
      } else {
        console.error('error setting up the request:', axiosError.message);
        throw new Error(`error setting up the request: ${axiosError.message}`);
      }
    } else {
      console.error('unexpected error:', error);
      throw new Error(`unexpected error: ${error}`);
    }
  }
};

export const updateInstantWinNumber = async (
  userID: string,
  numberID: string,
  instanceID: string,
  revealed: boolean,
  token: string,
) => {
  try {
    await axios.post(
      `/ships-service/ships/lottery/user/${userID}/${INSTANT_WIN_CATEGORY}/instances/${instanceID}/numbers/${numberID}`,
      {
        revealed: revealed,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    );
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;

      if (axiosError.response) {
        console.error('request failed with status:', axiosError.response.status);
        console.error('response data:', axiosError.response.data);

        switch (axiosError.response.status) {
          case 400:
            throw new Error('invalid or missing body or parameter(s)');
          case 401:
            throw new Error('invalid user credentials');
          case 404:
            throw new Error('lotto number not found');
          case 409:
            if (isCompleteInstantWinInstanceConflictResponse(axiosError.response.data)) {
              throw new CompleteInstantWinInstanceConflictError(
                'game is already completed',
                axiosError.response.data.data,
              );
            } else {
              throw new Error('game is already completed');
            }
          default:
            throw new Error('failed to update lotto number');
        }
      } else if (axiosError.request) {
        console.error('request made but no response received:', axiosError.request);
        throw new Error('request made but no response received');
      } else {
        console.error('error setting up the request:', axiosError.message);
        throw new Error(`error setting up the request: ${axiosError.message}`);
      }
    } else {
      console.error('unexpected error:', error);
      throw new Error(`unexpected error: ${error}`);
    }
  }
};

export const completeInstantWinInstance = async (
  userID: string,
  instanceID: string,
  token: string,
) => {
  try {
    await axios.post(
      `/ships-service/ships/lottery/user/${userID}/${INSTANT_WIN_CATEGORY}/instances/${instanceID}/complete`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    );
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;

      if (axiosError.response) {
        console.error('request failed with status:', axiosError.response.status);
        console.error('response data:', axiosError.response.data);

        switch (axiosError.response.status) {
          case 400:
            throw new Error('missing or invalid parameter(s)');
          case 401:
            throw new Error('invalid user credentials');
          case 403:
            throw new CompleteInstantWinInstanceHeldError('user not allowed to process payout');
          case 404:
            throw new Error('game instance not found');
          case 409:
            if (
              !!axiosError.response.data &&
              isCompleteInstantWinInstanceConflictResponse(axiosError.response.data)
            ) {
              const resp = axiosError.response.data as CompleteInstantWinInstanceConflictResponse;
              const error: CompleteInstantWinInstanceConflictError = new Error(
                'conflict occurred when completing instance',
              ) as CompleteInstantWinInstanceConflictError;
              error.state = resp.data;
              throw error;
            } else {
              throw new Error('failed to complete instance');
            }
          default:
            throw new Error('failed to complete instance');
        }
      } else if (axiosError.request) {
        console.error('request made but no response received:', axiosError.request);
        throw new Error('request made but no response received');
      } else {
        console.error('error setting up the request:', axiosError.message);
        throw new Error(`error setting up the request: ${axiosError.message}`);
      }
    } else {
      console.error('unexpected error:', error);
      throw new Error(`unexpected error: ${error}`);
    }
  }
};

export const getActiveInstantWinSessions = async (): Promise<LotteryGameSession[]> => {
  const query = new URLSearchParams([['category', GameCategory.ScratchCard]]);

  try {
    const res = await axios.get(
      `/ships-service/ships/lottery/session/current?${query.toString()}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    return res.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;

      if (axiosError.response) {
        console.error('request failed with status:', axiosError.response.status);
        console.error('response data:', axiosError.response.data);

        switch (axiosError.response.status) {
          case 401:
            throw new Error('invalid user credentials');
          default:
            throw new Error('failed to fetch active instant win sessions');
        }
      } else if (axiosError.request) {
        console.error('request made but no response received:', axiosError.request);
        throw new Error('request made but no response received');
      } else {
        console.error('error setting up the request:', axiosError.message);
        throw new Error(`error setting up the request: ${axiosError.message}`);
      }
    } else {
      console.error('unexpected error:', error);
      throw new Error(`unexpected error: ${error}`);
    }
  }
};

export const getActiveInstantWinInstances = async (
  userID: string,
  token: string,
  gameID?: string,
  price?: number,
  hideHeld: boolean = true,
): Promise<InstantWinInstance[]> => {
  const query = new URLSearchParams([['state', InstantWinState.InstantWinInitialized]]);

  // Add gameID to query if it exists
  if (!!gameID) {
    query.append('gameID', gameID);
  }

  // Add price to query if it exists
  if (price !== undefined) {
    query.append('price', price.toString());
  }

  query.append('hideHeld', hideHeld.toString());

  try {
    const res = await axios.get(
      `/ships-service/ships/lottery/user/${userID}/instant-win/instances?${query.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    );

    return res.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;

      if (axiosError.response) {
        console.error('request failed with status:', axiosError.response.status);
        console.error('response data:', axiosError.response.data);

        switch (axiosError.response.status) {
          case 401:
            throw new Error('invalid user credentials');
          default:
            throw new Error('failed to fetch active instances');
        }
      } else if (axiosError.request) {
        console.error('request made but no response received:', axiosError.request);
        throw new Error('request made but no response received');
      } else {
        console.error('error setting up the request:', axiosError.message);
        throw new Error(`error setting up the request: ${axiosError.message}`);
      }
    } else {
      console.error('unexpected error:', error);
      throw new Error(`unexpected error: ${error}`);
    }
  }
};

export const getInstantWinPlaylist = async (
  userID: string,
  token: string,
  gameID?: string,
  price?: number,
): Promise<string[]> => {
  const query = new URLSearchParams();

  // Add gameID to query if it exists
  if (!!gameID) {
    query.append('gameID', gameID);
  }

  // Add price to query if it exists
  if (price !== undefined) {
    query.append('price', price.toString());
  }

  let url = `/ships-service/ships/lottery/user/${userID}/instant-win/instances/playlist`;
  // Add query to url if it exists
  if (!!query) {
    url += `?${query.toString()}`;
  }

  try {
    const res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    return res.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;

      if (axiosError.response) {
        console.error('request failed with status:', axiosError.response.status);
        console.error('response data:', axiosError.response.data);

        switch (axiosError.response.status) {
          case 401:
            throw new Error('invalid user credentials');
          case 404:
            throw new Error('instance not found');
          default:
            throw new Error('failed to complete instance');
        }
      } else if (axiosError.request) {
        console.error('request made but no response received:', axiosError.request);
        throw new Error('request made but no response received');
      } else {
        console.error('error setting up the request:', axiosError.message);
        throw new Error(`error setting up the request: ${axiosError.message}`);
      }
    } else {
      console.error('unexpected error:', error);
      throw new Error(`unexpected error: ${error}`);
    }
  }
};

export const getAllInstantWinInstances = async (
  userID: string,
  token: string,
): Promise<InstantWinInstance[]> => {
  try {
    const res = await axios.get(
      `/ships-service/ships/lottery/user/${userID}/instant-win/instances`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    );

    return res.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;

      if (axiosError.response) {
        console.error('request failed with status:', axiosError.response.status);
        console.error('response data:', axiosError.response.data);

        switch (axiosError.response.status) {
          case 401:
            throw new Error('invalid user credentials');
          default:
            throw new Error('failed to fetch all instances');
        }
      } else if (axiosError.request) {
        console.error('request made but no response received:', axiosError.request);
        throw new Error('request made but no response received');
      } else {
        console.error('error setting up the request:', axiosError.message);
        throw new Error(`error setting up the request: ${axiosError.message}`);
      }
    } else {
      console.error('unexpected error:', error);
      throw new Error(`unexpected error: ${error}`);
    }
  }
};

export const revealInstantWinInstance = async (
  userID: string,
  instanceID: string,
  token: string,
): Promise<InstantWinInstance> => {
  try {
    const res = await axios.post(
      `/ships-service/ships/lottery/user/${userID}/${INSTANT_WIN_CATEGORY}/instances/${instanceID}/reveal`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    );

    return res.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;

      if (axiosError.response) {
        console.error('request failed with status:', axiosError.response.status);
        console.error('response data:', axiosError.response.data);

        switch (axiosError.response.status) {
          case 400:
            throw new Error('missing or invalid parameter(s)');
          case 401:
            throw new Error('invalid user credentials');
          case 404:
            throw new Error('game instance or number not found');
          default:
            throw new Error('failed to reveal instance');
        }
      } else if (axiosError.request) {
        console.error('request made but no response received:', axiosError.request);
        throw new Error('request made but no response received');
      } else {
        console.error('error setting up the request:', axiosError.message);
        throw new Error(`error setting up the request: ${axiosError.message}`);
      }
    } else {
      console.error('unexpected error:', error);
      throw new Error(`unexpected error: ${error}`);
    }
  }
};
