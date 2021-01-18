import sortBy from 'lodash/sortBy';
import React, { useMemo, useState } from 'react';
import { MdClear, MdSearch } from 'react-icons/md';
import styles from '../styles.module.scss';
import { Entity, Result } from '../types';
import { searchText } from '../utils';
import SearchResult from './SearchResult';

const MAX_RESULTS = 20;

interface Props {
  /** All database entities */
  entities: Entity[];
  /** Callback to select an entity */
  setEntityName: (entityName?: string) => void;
  /** Logo image to display in place of the search icon */
  logoImagePath?: string;
}

/** Search bar to search all entities and columns in the schema */
const SearchBar: React.FC<Props> = ({ entities, setEntityName, logoImagePath }) => {
  const [query, setQuery] = useState('');
  const [hasFocus, setHasFocus] = useState(false);

  const showResults = query.length >= 2 && hasFocus;

  const results = useMemo(() => {
    if (!showResults) return [];

    const entityResults: Result[] = [];
    const columnResults: Result[] = [];
    const emptySearch = { matchRatio: 0, splitText: [] };

    entities.forEach((entity) => {
      // Search the entity name and comment
      const entityNameSearch = searchText(entity.friendlyName, query);
      const entityCommentSearch = entity.comment ? searchText(entity.comment, query) : emptySearch;
      const entityScore = (entityNameSearch.matchRatio + entityCommentSearch.matchRatio) / 2;

      if (entityScore > 0) {
        const entitySplitText = entityNameSearch.splitText;
        if (entity.comment) entitySplitText.push('  •  ', ...entityCommentSearch.splitText);

        entityResults.push({
          entity,
          splitText: entitySplitText,
          score: entityScore,
        });
      }

      entity.columns.forEach((column) => {
        // Search the column name and comment
        const columnNameSearch = searchText(column.name, query);
        const columnCommentSearch = column.comment
          ? searchText(column.comment, query)
          : emptySearch;
        const columnScore = (columnNameSearch.matchRatio + columnCommentSearch.matchRatio) / 2;

        if (columnScore > 0) {
          const columnSplitText = [entity.friendlyName, '  •  ', ...columnNameSearch.splitText];
          if (column.comment) columnSplitText.push('  •  ', ...columnCommentSearch.splitText);

          columnResults.push({
            entity,
            column,
            splitText: columnSplitText,
            score: columnScore,
          });
        }
      });
    });

    // Sort results by score, displaying entity results first
    return [
      ...sortBy(entityResults, 'score').reverse(),
      ...sortBy(columnResults, 'score').reverse(),
    ].slice(0, MAX_RESULTS);
  }, [entities, query, showResults]);

  return (
    <div className={styles.searchBar}>
      {logoImagePath
        ? <img src={logoImagePath} alt="Search icon" className={styles.logoImage} />
        : <MdSearch size={32} className={styles.searchIcon} />}
      <input
        type="text"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onFocus={() => setHasFocus(true)}
        onBlur={() => setHasFocus(false)}
        placeholder="Search for a table, column, or comment..."
      />
      {query.length > 0 ? (
        <MdClear size={32} className={styles.clearIcon} onClick={() => setQuery('')} />
      ) : null}
      <div
        className={styles.results}
        style={{ display: showResults ? 'block' : 'none' }}
      >
        {results.map((result) => (
          <SearchResult
            result={result}
            setEntityName={setEntityName}
            key={`${result.entity.name}-${result.column?.name}`}
          />
        ))}
        {results.length === 0 ? (
          <div className={styles.searchResult}>Sorry, no results found!</div>
        ) : null}
      </div>
    </div>
  );
};

export default SearchBar;
