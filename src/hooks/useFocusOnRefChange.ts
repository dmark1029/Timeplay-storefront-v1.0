import { useEffect } from 'react';

/*
 * this hook automatically focuses on the passed in element whenever the ref changes
 * to use it, store the element as a useRef initialized as null, and then pass it in
 * this is for ADA compliance
 *
 * @param {HTMLElement} ref - The ref of the element to focus on.
 */
export const useFocusOnRefChange = (ref: React.RefObject<HTMLElement>) => {
  useEffect(() => {
    if (!!ref?.current) {
      ref.current.focus();
    }
  }, [ref]);
};
