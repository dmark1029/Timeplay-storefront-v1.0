import { Outlet } from 'react-router-dom';

import { ContextProvider } from './context';

const PowerPicksBigScreenLayout = () => {
  return (
    <ContextProvider>
      <Outlet />
    </ContextProvider>
  );
};

export default PowerPicksBigScreenLayout;
