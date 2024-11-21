import { useEffect } from 'react';

/*
 * this hook automatically hides the invisible dismiss buttons that are added by NextUI's modal
 * to use it, pass it the isOpen boolean for the model
 * this is for ADA compliance
 *
 * @param {boolean} isOpen - The boolean that controls whether or not the modal is open
 * @param {unknown} modalState - The optional state of the modal
 */
export const useHideModalDismissButtons = (isOpen: boolean, modalState?: unknown) => {
  // remove the invisible dismiss buttons that NextUI's modal adds.
  useEffect(() => {
    if (isOpen) {
      const matches = document.querySelectorAll('button[aria-label="Dismiss"]');
      matches.forEach((button) => {
        const htmlElement = button as HTMLElement;
        htmlElement.style.display = 'none';
      });
    }
  }, [isOpen, modalState]);
};
