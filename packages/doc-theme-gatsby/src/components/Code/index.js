import React from 'react';
import { Themed } from '@theme-ui/mdx';

export const Code = ({ children }) => {
  return <Themed.inlineCode>{children}</Themed.inlineCode>;
};
