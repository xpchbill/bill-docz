/** @jsx jsx */
import { jsx } from 'theme-ui'
import { theme, useConfig, ComponentsProvider } from 'docz'
import { ThemeProvider } from 'theme-ui'

import defaultTheme from '~theme'
import components from '~components'

const Theme = ({ children }) => {
  const config = useConfig()
  console.log(children)
  return (
    <ThemeProvider theme={config.themeConfig}>
      <ComponentsProvider components={components}>
        {children}
      </ComponentsProvider>
    </ThemeProvider>
  )
}

export default theme(defaultTheme)(Theme)
