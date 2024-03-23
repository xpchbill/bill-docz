import { useContext } from 'react';
import sort from 'array-sort';

import { docState, Entry } from '../state';
import { compare } from '../utils/helpers';

export const useDocs = (): Entry[] | null => {
  const { entries = [] } = useContext(docState.context);
  const arr = entries.map(({ value }) => value);
  return sort(arr, (a: Entry, b: Entry) => compare(a.name, b.name));
};
