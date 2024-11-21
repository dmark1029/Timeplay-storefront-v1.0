import { Spinner } from '@nextui-org/react';
import { Navigate, Outlet } from 'react-router-dom';

import { useAppContext } from '@/contexts/app-context';

const GamesLayout = () => {
  const { authAccount, isLoading } = useAppContext();
  const hasAuthAccount = authAccount?.isValid;

  return isLoading ? (
    <Spinner size='lg' className='h-full w-full' />
  ) : hasAuthAccount ? (
    <Outlet />
  ) : (
    <Navigate to='/' />
  );
};

export default GamesLayout;
