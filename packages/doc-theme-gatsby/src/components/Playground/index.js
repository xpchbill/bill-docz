/** @jsx jsx */
import { jsx } from 'theme-ui'
import { useState } from 'react'
// import toJSXString from 'react-element-to-jsx-string'
import { useConfig } from '@bill-doc/doc-core'
import { LiveProvider, LiveError, LivePreview, LiveEditor } from 'react-live'
import { Resizable } from 're-resizable'
import copy from 'copy-text-to-clipboard'
// import prettier from 'prettier/standalone'
// import parserBabel from 'prettier/plugins/babel'
// import parserMdx from 'prettier/plugins/markdown'
// import * as prettierPluginEstree from 'prettier/plugins/estree'

import { Wrapper } from './Wrapper'
import { usePrismTheme } from '~utils/theme'
import * as styles from './styles'
import * as Icons from '../Icons'

const getResizableProps = (width, setWidth) => ({
  minWidth: 260,
  maxWidth: '100%',
  size: {
    width: width,
    height: 'auto',
  },
  style: {
    margin: 0,
    marginRight: 'auto',
  },
  enable: {
    top: false,
    right: true,
    bottom: false,
    left: false,
    topRight: false,
    bottomRight: false,
    bottomLeft: false,
    topLeft: false,
  },
  onResizeStop: (e, direction, ref) => {
    setWidth(ref.style.width)
  },
})

const transformCode = code => {
  if (code.startsWith('()') || code.startsWith('class')) return code
  return `<React.Fragment>${code}</React.Fragment>`
}

const stripTrailingNewline = (str) => {
  if (typeof str === 'string' && str[str.length - 1] === '\n') {
    return str.slice(0, -1)
  }
  return str
}

export const Playground = ({ code, scope, component, language, useScoping = false }) => {
  const {
    themeConfig: { showPlaygroundEditor, showLiveError, showLivePreview },
  } = useConfig()

  // Makes sure scope is only given on mount to avoid infinite re-render on hot reloads
  const [scopeOnMount] = useState(scope)
  const theme = usePrismTheme()
  const [showingCode, setShowingCode] = useState(showPlaygroundEditor)
  const [width, setWidth] = useState('100%')
  const resizableProps = getResizableProps(width, setWidth)

  const copyCode = () => copy(code)
  // console.log('toJSXString', toJSXString(component))
  // prettier.format(`${code}`, { parser: "mdx", plugins: [parserBabel, parserMdx, prettierPluginEstree] })
  //         .then(result => {
  //           console.log(result)
  //         })
  const toggleCode = () => setShowingCode(s => !s)

  return (
    <Resizable {...resizableProps} data-testid="playground">
      <LiveProvider
        code={code.replace(/\n$/,"")}
        scope={scopeOnMount}
        transformCode={transformCode}
        language={language}
        theme={theme}
      >
        <div sx={styles.previewWrapper}>
          <Wrapper
            content="preview"
            useScoping={useScoping}
            showingCode={showingCode}
          >
            {showLivePreview && (
              <LivePreview sx={styles.preview} data-testid="live-preview" />
            )}
          </Wrapper>
          <div sx={styles.buttons}>
            <button sx={styles.button} onClick={copyCode}>
              <Icons.Clipboard size={12} />
            </button>
            <button sx={styles.button} onClick={toggleCode}>
              <Icons.Code size={12} />
            </button>
          </div>
        </div>
        {showingCode && (
          <Wrapper
            content="editor"
            useScoping={useScoping}
            showingCode={showingCode}
          >
            <div sx={styles.editor(theme)}>
              <LiveEditor data-testid="live-editor" />
            </div>
          </Wrapper>
        )}
        {showLiveError && (
          <LiveError sx={styles.error} data-testid="live-error" />
        )}
      </LiveProvider>
    </Resizable>
  )
}