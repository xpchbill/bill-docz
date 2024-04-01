// @ts-nocheck
import React from 'react';
import { Themed } from '@theme-ui/mdx';
import Highlight, { defaultProps } from 'prism-react-renderer';

import { usePrismTheme } from '../../utils/theme';

export const Pre = ({ children }) => {
  const theme = usePrismTheme();
  const code = children.props.children.trim();
  const languageClass = children.props.className;
  const language = languageClass?.replace(/language-/, '').split(' ')[0];

  return (
    <Highlight {...defaultProps} code={code} language={language} theme={theme}>
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <Themed.pre
          className={`${languageClass || ''} ${className}`}
          style={{ ...style, overflowX: 'auto' }}
          data-testid="code"
        >
          {tokens.map((line, i) => (
            <div key={i} {...getLineProps({ line, key: i })}>
              {line.map((token, key) => (
                <span key={i} {...getTokenProps({ token, key })} />
              ))}
            </div>
          ))}
        </Themed.pre>
      )}
    </Highlight>
  );
};
