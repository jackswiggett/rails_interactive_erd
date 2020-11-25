import React, { useState } from 'react';
import { MdInfoOutline } from 'react-icons/md';
import styles from '../styles.module.scss';
import { Column } from '../types';
import Modal from './Modal';

interface Props {
  /** Information about a database table column */
  column: Column;
}

/** Cell in the EntityDetails table showing the name of the database column */
const TypeCell: React.FC<Props> = ({ column }) => {
  const { name, type, enumValues } = column;

  const [modalIsOpen, setModalIsOpen] = useState(false);

  return (
    <div className={styles.typeCell}>
      {type}
      {enumValues && (
        <>
          <button
            type="button"
            className={styles.infoButton}
            onClick={() => setModalIsOpen(true)}
          >
            <MdInfoOutline />
          </button>
          <Modal
            isOpen={modalIsOpen}
            onClose={() => setModalIsOpen(false)}
          >
            <p><strong>{name}</strong> is an enum with the following values:</p>
            <ul>
              {Object.entries(enumValues).map(([key, value]) => (
                <li key={key}>
                  {key === value ? key : `${key} \u2192 ${value}`}
                </li>
              ))}
            </ul>
          </Modal>
        </>
      )}
    </div>
  );
};

export default TypeCell;
