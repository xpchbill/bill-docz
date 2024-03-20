import flatten from 'lodash/flatten'
import { getImportsVariables } from '@bill-doc/doc-utils/lib/imports'
import { getExportsVariables } from '@bill-doc/doc-utils/lib/exports'

import { format } from 'prettier/standalone'
import * as parserBabel from 'prettier/plugins/babel'
import * as markdown from 'prettier/plugins/markdown'
import * as prettierPluginEstree from 'prettier/plugins/estree'

const isPlayground = (name: string) => {
  return name === 'Playground'
}

const addComponentsProps = (scopes: string[] = []) => async (
  node: any,
  idx: number
) => {
  if (isPlayground(node.name)) {
    const [
      {
        mdxToMarkdown
      },
      {
        toMarkdown
      }
  ] = await Promise.all([
      import(`mdast-util-mdx`),
      import(`mdast-util-to-markdown`)
    ]);
    const childJsxArray: any[] = []
    node.children.forEach((item: any) => {
      if (item.type === 'mdxJsxFlowElement') {
        const md = toMarkdown(item, {
          // @ts-ignore
          extensions: [mdxToMarkdown()],
        })
        childJsxArray.push(md)
      }
    })
    console.log('childJsxArray: ', childJsxArray)

    return format(childJsxArray.join(''), { parser: "mdx", plugins: [parserBabel, markdown, prettierPluginEstree] }).then(result => {
      const jsxValue = result.replace(/\n$/,"")
      console.log(jsxValue)
      node.children = [{
        type: 'code',
        lang: 'jsx',
        meta: null,
        value: childJsxArray.join(''),
      }]
      node.attributes.push({
        type: 'mdxJsxAttribute',
        name: '__scope',
        value: {
          "type": "mdxJsxAttributeValueExpression",
          "value": `{props,${scopes.join(',')}}`,
          "data": {
            "estree": {
              "type": "Program",
              "body": [
                {
                  "type": "ExpressionStatement",
                  "expression": {
                    "type": "ObjectExpression",
                    "properties": scopes.map(name => ({
                      "type": "Property",
                      "method": false,
                      "shorthand": true,
                      "computed": false,
                      "key": {
                        "type": "Identifier",
                        "name": name
                      },
                      "kind": "init",
                      "value": {
                        "type": "Identifier",
                        "name": name
                      }
                    }))
                  }
                }
              ],
              "sourceType": "module",
              "comments": []
            }
          },
        }
      })
      node.attributes.push({
        type: 'mdxJsxAttribute',
        name: '__position',
        value: idx,
      })
    })
  }
}

export interface PluginOpts {
  root: string
}

export default () => (tree: any) => {
  const importNodes = tree.children.filter((n: any) => (n.type === 'mdxjsEsm' && n.value.indexOf('import') > -1))
  const exportNodes = tree.children.filter((n: any) => (n.type === 'mdxjsEsm' && n.value.indexOf('export') > -1))
  const importedScopes = flatten<string>(importNodes.map(getImportsVariables))
  const exportedScopes = flatten<string>(exportNodes.map(getExportsVariables))
  const scopes = [...importedScopes, ...exportedScopes].filter(
    Boolean
  )
  const nodes = tree.children
    .filter((node: any) => node.type === 'mdxJsxFlowElement')
    .map(addComponentsProps(scopes))

  return Promise.all(nodes).then(() => tree)
}
