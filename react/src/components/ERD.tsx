import React, { useState } from 'react';
import styles from '../styles.module.scss';
import { Schema } from '../types';
import EntityDetails from './EntityDetails';
import GraphvizDiagram from './GraphvizDiagram';
import SearchBar from './SearchBar';

interface Props {
  /** Information about the database schema */
  schema: Schema;
}

/** Interactive entity relationship diagram to visualize and explore the database schema */
const ERD: React.FC<Props> = ({ schema }) => {
  const [entityName, setEntityName] = useState<string>();

  const entity = schema.entities.find(({ name }) => name === entityName);

  return (
    <div className={styles.root}>
      <SearchBar
        entities={schema.entities}
        setEntityName={setEntityName}
        logoImagePath={schema.logoImagePath}
      />
      <div className={styles.content}>
        <GraphvizDiagram schema={schema} entityName={entityName} setEntityName={setEntityName} />
        {entity && (
          <div className={styles.rightPanel}>
            <EntityDetails entity={entity} setEntityName={setEntityName} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ERD;
