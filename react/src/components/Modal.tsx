import React from 'react';
import { MdClose } from 'react-icons/md';
import styles from '../styles.module.scss';

interface Props {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Callback when the modal is closed */
  onClose: () => void;
}

/** Modal to show additional information about an entity or column */
const Modal: React.FC<Props> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalContainer}>
      <div className={styles.modal}>
        <button type="button" className={styles.closeButton} onClick={onClose}>
          <MdClose />
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
