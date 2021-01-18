import { useEffect, useRef } from 'react';

/** Hook that returns the value that the input had on the previous render */
export const usePrevious = <T>(value: T) => {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  // this returns *before* the effect above is executed
  return ref.current;
};

/** Escape unsafe characters in a RegExp string. See https://stackoverflow.com/a/6969486. */
export const escapeRegExp = (value: string) => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

/**
 * Looks for the given query in the given text. Search is case insensitive and allows spaces in the
 * place of underscores (e.g. "my column" will also match with "my_column"). Returns:
 *   matchRatio: the portion of the text that matched the query; 0 = no match, 1 = complete match
 *   splitText: the text broken apart such that each entry at an odd index matches the query, and
 *              each entry at an even index contains the text in-between matches
 */
export const searchText = (text: string, query: string) => {
  const safeQuery = escapeRegExp(query);
  const queryRegExp = new RegExp(`(${safeQuery.replace(' ', '[_ ]')})`, 'gi');

  const splitText = text.split(queryRegExp);

  // entries at odd indexes match the regex
  const matchText = splitText.filter((_, index) => index % 2 === 1);
  const matchLength = matchText.join('').length;

  return { splitText, matchRatio: matchLength / text.length };
};
