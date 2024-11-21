import { useEffect, useState } from 'react';

import axios, { AxiosError } from 'axios';

import { AccountHold, HTTPAccountHoldsError } from '@/utils/types';

/* 
  This hook is designed to intercept the 403 sent from ships-service in the event of an 
  account hold blocking the call. It such a case it will trigger the onTrigger func passed in
*/
const useAccountHold = () => {
  const [interceptor, setInterceptor] = useState<undefined | number>(undefined);
  const [onToggle, setOnToggle] = useState<undefined | ((hold: AccountHold) => void)>(undefined);

  useEffect(() => {
    const newInterceptor = axios.interceptors.response.use(
      (response) => {
        // we do nothing in this case on a success response
        return response;
      },

      // on a failed response, we check to see if the status code is a 403, and if it contains the account hold headers
      (error) => {
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError;
          if (
            axiosError.response?.status === 403 &&
            axiosError.response?.headers?.['x-account-hold']
          ) {
            const holdsError = axiosError.response?.data as HTTPAccountHoldsError;
            const hold = holdsError?.data[0];
            if (!!hold && !!onToggle) {
              onToggle(hold);
            } else if (!hold) {
              // log error but allow error chain to continue
              console.error('failed to parse account hold');
            }
          }
        }
        return Promise.reject(error);
      },
    );

    // if old interceptor exists, eject it
    if (interceptor !== undefined) {
      axios.interceptors.response.eject(interceptor);
    }

    // store the interceptor in state so it can be ejected later
    setInterceptor(newInterceptor);

    // on unmount, eject the interceptor
    return () => {
      if (interceptor !== undefined) {
        axios.interceptors.response.eject(interceptor);
      }
    };
  }, [onToggle]);

  return { setOnToggle };
};

export default useAccountHold;
