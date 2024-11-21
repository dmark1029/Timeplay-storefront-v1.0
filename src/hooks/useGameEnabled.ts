import { useEffect, useState } from 'react';

import axios, { AxiosError } from 'axios';

/* 
  This hook is designed to intercept the 403 sent from ships-service in the event of the game being disabled
  and the middleware blocking the call. It such a case it will trigger the onTrigger func passed in
*/
const useGameEnabled = () => {
  const [interceptor, setInterceptor] = useState<undefined | number>(undefined);
  const [onToggle, setOnToggle] = useState<undefined | (() => void)>(undefined);

  useEffect(() => {
    const newInterceptor = axios.interceptors.response.use(
      (response) => {
        // we do nothing in this case on a success response
        return response;
      },

      // on a failed response, we check to see if the status code is a 403, and if it contains the game disabled header
      (error) => {
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError;
          if (
            axiosError.response?.status === 403 &&
            axiosError.response?.headers?.['x-game-disabled']
          ) {
            onToggle?.();
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

export default useGameEnabled;
