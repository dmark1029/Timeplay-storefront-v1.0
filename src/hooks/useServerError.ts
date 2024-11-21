import { useEffect, useState } from 'react';

import axios, { AxiosError } from 'axios';

import { ErrorDialog } from '../contexts/dialog-context';

/* 
  This hook is designed to intercept 5xx returned from any request for any general server errors.
*/
const useServerError = () => {
  const [interceptor, setInterceptor] = useState<undefined | number>(undefined);
  const [onToggle, setOnToggle] = useState<undefined | ((arg: ErrorDialog) => void)>(undefined);

  useEffect(() => {
    const newInterceptor = axios.interceptors.response.use(
      (response) => {
        // we do nothing in this case on a success response
        return response;
      },

      (error) => {
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError;
          const status = axiosError.response?.status || 0;
          const backgroundRequest = axiosError.config?.headers?.['x-background-request'];
          if (status >= 500 && status < 600 && !backgroundRequest) {
            onToggle?.({
              message: 'Server not available. Please try again later.',
            });
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

export default useServerError;
