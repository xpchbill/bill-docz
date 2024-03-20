import flatten from 'lodash/flatten'
// import nodeToString from 'hast-util-to-string'
// import { format } from 'docz-utils/lib/format'
// import mdx from "mdast-util-mdx";
// import toMarkdown from 'mdast-util-to-markdown'
// import { sanitizeCode, removeTags } from 'docz-utils/lib/jsx'
// import { removeTags } from 'docz-utils/lib/jsx'
import { getImportsVariables } from '@bill-doc/utils/lib/imports'
import { getExportsVariables } from '@bill-doc/utils/lib/exports'

import { format } from 'prettier/standalone'
import * as parserBabel from 'prettier/plugins/babel'
import * as markdown from 'prettier/plugins/markdown'
import * as prettierPluginEstree from 'prettier/plugins/estree'
// import { encode } from 'html-entities';
// import escapeJS from 'js-string-escape'

const isPlayground = (name: string) => {
  return name === 'Playground'
}

// const stripTrailingNewline = (str: any) => {
//   if (typeof str === 'string' && str[str.length - 1] === '\n') {
//     return str.slice(0, -1)
//   }
//   return str
// }

const addComponentsProps = (scopes: string[] = []) => async (
  node: any,
  idx: number
) => {
  // const name = componentName(node.value)
  // const tagOpen = new RegExp(`^\\<${name}`)

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
    // console.log('mdxToMarkdown:', mdxToMarkdown)
    // console.log('toMarkdown:', toMarkdown)
    // console.log('__scopes:', scopes)
    // const md = toMarkdown(node, {
    //   // @ts-ignore
    //   extensions: [mdxToMarkdown()],
    // })
    // // const html = toHtml(toHast(node))
    // // console.log('html:', html)
    // const formatted = await format(md)
    // const code = formatted.slice(1, Infinity)
    // const child = removeTags(code)
    // console.log('formatted:', formatted)
    // console.log('code:', code)
    // console.log(child)
    // const code = stripTrailingNewline(removeTags(md))
    // console.log('md:', escapeJS(code))

    // const __code = encode(escapeJS(code))
    // console.log('__code:', __code)
    // console.log('removeTags(md):', removeTags(md))
    // console.log(removeTags(code))
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
    // console.log('formattedCode: ');
    // console.log(formattedCode);

    // const formatted = await format(nodeToString(node))
    // const code = formatted.slice(1, Infinity)
    // const scope = `{props,${scopes.join(',')}}`
    // const child = sanitizeCode(removeTags(code))

    // console.log('nodeToString: ', nodeToString)
    // console.log('node: ', node)
    // console.log('scopes: ', scopes)
    // console.log('__scope: ', scope)
    // node.value = node.value.replace(
    //   tagOpen,
    //   `<${name} __position={${idx}} __code={'${child}'} __scope={${scope}}`
    // )
    // console.log('node.value: ', node.value)
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
  // console.log('tree: ', tree)
  // console.log('tree.children: ', tree.children)
  // console.log('importNodes: ', importNodes)
  // console.log('importedScopes: ', importedScopes)
  // console.log('exportedScopes: ', exportedScopes)
  // filter added to avoid throwing if an unexpected type is exported
  const scopes = [...importedScopes, ...exportedScopes].filter(
    Boolean
  )
  const nodes = tree.children
    .filter((node: any) => node.type === 'mdxJsxFlowElement')
    .map(addComponentsProps(scopes))

  return Promise.all(nodes).then(() => tree)
}
