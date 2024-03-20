import * as React from 'react'
import Layout from './src/base/layout'

import './src/index.css'

// Wraps every page in a component
export const wrapPageElement = ({ element, props }) => {
  return <Layout {...props}>{element}</Layout>
}
