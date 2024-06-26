/** @jsx jsx */
import { useRef, useState } from 'react';
import { jsx } from 'theme-ui';
import { Global } from '@emotion/react';

import global from '../../theme/global';
import { Header } from '../Header';
import { Sidebar } from '../Sidebar';
import { MainContainer } from '../MainContainer';
import * as styles from './styles';

export const Layout = ({ children }) => {
  const [open, setOpen] = useState(false);
  const nav = useRef();

  return (
    <div sx={{ '& > div': { flex: '1 1 auto' } }} data-testid="layout">
      <Global styles={global} />
      <div sx={styles.main}>
        <Header onOpen={() => setOpen((s) => !s)} />
        <div sx={styles.wrapper}>
          <Sidebar
            ref={nav}
            open={open}
            onFocus={() => setOpen(true)}
            onBlur={() => setOpen(false)}
            onClick={() => setOpen(false)}
          />
          <MainContainer data-testid="main-container">{children}</MainContainer>
        </div>
      </div>
    </div>
  );
};
