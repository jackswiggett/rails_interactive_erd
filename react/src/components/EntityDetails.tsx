import React, { useMemo } from 'react';
import { CellProps, useTable } from 'react-table';
import styles from '../styles.module.scss';
import { Column, Entity } from '../types';
import NameCell from './NameCell';
import TypeCell from './TypeCell';

interface Props {
  /** Currently selected entity */
  entity: Entity;
  /** Callback to select an entity */
  setEntityName: (entityName?: string) => void;
}

/** Displays information about the currently selected entity */
const EntityDetails: React.FC<Props> = ({ entity, setEntityName }) => {
  const columns = useMemo(() => {
    return [
      {
        accessor: 'name',
        Header: 'Name',
        Cell: ({ row: { original } }: CellProps<Column>) => (
          <NameCell column={original} setEntityName={setEntityName} />
        ),
      } as const,
      {
        Header: 'Type',
        accessor: 'type',
        Cell: ({ row: { original } }: CellProps<Column>) => (
          <TypeCell column={original} />
        ),
      } as const,
      { Header: 'Comment', accessor: 'comment' } as const,
    ];
  }, []);

  const tableInstance = useTable({ columns, data: entity.columns });

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = tableInstance;

  return (
    <div className={styles.entityDetails}>
      <h2>{entity.friendlyName}</h2>
      {entity.comment ? <p>{entity.comment}</p> : null}
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>
                  {column.render('Header')}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()}>
                    {cell.render('Cell')}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default EntityDetails;
