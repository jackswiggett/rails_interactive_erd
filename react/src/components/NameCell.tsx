import React, { useState } from 'react';
import styles from '../styles.module.scss';
import { Column } from '../types';
import Modal from './Modal';

interface Props {
  /** Information about a database table column */
  column: Column;
  /** Callback to select an entity */
  setEntityName: (entityName?: string) => void;
}

/** Cell in the EntityDetails table showing the name of the database column */
const NameCell: React.FC<Props> = ({ column, setEntityName }) => {
  const { name, associations } = column;

  const [modalIsOpen, setModalIsOpen] = useState(false);

  return (
    <div className={styles.nameCell}>
      {associations.length === 0 ? name : (
        <button
          type="button"
          className={styles.button}
          onClick={() => {
            if (associations.length === 1) {
              setEntityName(associations[0]);
            } else {
              setModalIsOpen(true);
            }
          }}
        >
          {name}
        </button>
      )}
      <Modal
        isOpen={modalIsOpen}
        onClose={() => setModalIsOpen(false)}
      >
        <p><strong>{name}</strong> references one of the following tables:</p>
        <ul>
          {associations.map((association) => (
            <li key={association}>
              <button
                type="button"
                key={association}
                className={styles.button}
                onClick={() => {
                  setModalIsOpen(false);
                  setEntityName(association);
                }}
              >
                {association}
              </button>
            </li>
          ))}
        </ul>
      </Modal>
    </div>
  );
};

export default NameCell;
