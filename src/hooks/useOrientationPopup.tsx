import { ReactNode, useEffect, useState } from 'react';

export enum DeviceOrientation {
  PORTRAIT = 'portrait',
  LANDSCAPE = 'landscape',
}

interface UseMobileOrientationPopupParams {
  popupContent: ReactNode;
  mode: DeviceOrientation;
  contentRef: React.RefObject<HTMLElement>;
}

/*
  This simple hook detects if orientation has changed on a passed in element (contentRef) and displays 
  the popup content that's passed in (popupContent) if orientation is no longer in the passed in mode (mode)
*/
const useOrientationPopup = ({
  popupContent,
  mode,
  contentRef,
}: UseMobileOrientationPopupParams) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // set popup visible if the content ref is in an orientation different than mode
    const handleOrientationChange = () => {
      if (contentRef.current) {
        if (contentRef.current.clientWidth < contentRef.current.clientHeight) {
          setVisible(mode === DeviceOrientation.LANDSCAPE);
        } else {
          setVisible(mode === DeviceOrientation.PORTRAIT);
        }
      }
    };

    handleOrientationChange();

    // listen for window resize events
    window.addEventListener('resize', handleOrientationChange);

    // remove listener on unmount
    return () => {
      window.removeEventListener('resize', handleOrientationChange);
    };
  }, [contentRef, mode]);

  const renderContent = () => {
    if (!visible || !popupContent) {
      return <></>;
    }
    return popupContent;
  };

  return renderContent;
};

export default useOrientationPopup;
