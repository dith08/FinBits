import React, { ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface ModalPortalProps {
  children: ReactNode;
}

/**
 * ModalPortal - Renders modal content outside of the component hierarchy
 * This allows modals to appear above all other content regardless of parent z-index
 */
export const ModalPortal: React.FC<ModalPortalProps> = ({ children }) => {
  const modalRoot = document.getElementById('modal-root') || document.body;
  return createPortal(children, modalRoot);
};

export default ModalPortal;
