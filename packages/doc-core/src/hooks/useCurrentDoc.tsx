import { useContext } from 'react'
import { get } from 'lodash/fp'

import { docState } from '../state'

export const useCurrentDoc = () => {
  const state = useContext(docState.context)
  return get('currentEntry.value', state)
}
