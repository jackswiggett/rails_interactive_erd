import React from 'react';
import styles from '../styles.module.scss';
import { Result } from '../types';

interface Props {
  /** Result to display */
  result: Result;
  /** Callback to select an entity */
  setEntityName: (entityName?: string) => void;
}

/** Search result with a link to the corresponding entity or column */
const SearchResult: React.FC<Props> = ({ result: { entity, splitText }, setEntityName }) => {
  return (
    <button
      type="button"
      className={styles.searchResult}
      onMouseDown={() => setEntityName(entity.name)}
    >
      <div>
        {splitText.map((text, index) => (
          index % 2 === 0
            ? <span key={index.toString()}>{text}</span>
            : <strong key={index.toString()}>{text}</strong>
        ))}
      </div>
    </button>
  );
};

export default SearchResult;
