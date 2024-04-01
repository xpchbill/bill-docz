/** @jsx jsx */
import { jsx } from 'theme-ui';
import { Themed } from '@theme-ui/mdx';
import { ThemeUIProvider } from 'theme-ui';
import { theme, useConfig, ComponentsProvider } from '@bill-doc/doc-core';

import defaultTheme from './theme';
import components from './components';

const Theme = ({ children }) => {
  const config = useConfig();
  console.log(children);
  return (
    <ThemeUIProvider theme={config.themeConfig}>
      <Themed.root>
        <ComponentsProvider components={components}>
          {children}
        </ComponentsProvider>
      </Themed.root>
    </ThemeUIProvider>
  );
};

export default theme(defaultTheme)(Theme);
