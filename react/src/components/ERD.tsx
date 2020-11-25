import flatten from 'lodash/flatten';
import React, { useState } from 'react';
import Select from 'react-select';
import styles from '../styles.module.scss';
import { Schema } from '../types';
import EntityDetails from './EntityDetails';
import GraphvizDiagram from './GraphvizDiagram';

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
      <div className={styles.header}>
        <Select
          className={styles.entitySelect}
          options={schema.entities}
          value={entity}
          onChange={(value) => {
            // use `flatten` to get around react-select type def which allows value to be an array
            setEntityName(value ? flatten([value])[0].name : undefined);
          }}
          getOptionLabel={({ friendlyName }) => friendlyName}
          getOptionValue={({ name }) => name}
          placeholder="Choose a table"
          isClearable
        />
        <div>{schema.title}</div>
      </div>
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
