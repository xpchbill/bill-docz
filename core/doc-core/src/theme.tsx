import React, { memo } from 'react'
import { FC, ComponentType as CT } from 'react'
import { docState, Database, ThemeConfig, TransformFn, Entry } from './state'

export interface ThemeProps {
  db: Database
  currentEntry: Entry
  children(WrappedComponent: CT): JSX.Element
}

export function theme(
  themeConfig: ThemeConfig,
  transform: TransformFn = c => c
): (WrappedComponent: CT) => CT<ThemeProps> {
  return WrappedComponent => {
    const Theme: FC<ThemeProps> = memo(props => {
      const { db, currentEntry, children } = props
      const initial: any = { ...db, currentEntry, themeConfig, transform }

      return (
        // @ts-ignore
        <docState.Provider initial={initial}>
          {/* @ts-ignore */}
          <WrappedComponent>{children}</WrappedComponent>
        </docState.Provider>
      )
    })

    Theme.displayName = WrappedComponent.displayName || 'DocTheme'
    return Theme
  }
}
