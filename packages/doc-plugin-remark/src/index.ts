import visit from 'unist-util-visit';
import remove from 'unist-util-remove';
import flatten from 'lodash/flatten';
import { format } from 'prettier/standalone';
import * as parserBabel from 'prettier/plugins/babel';
import * as markdown from 'prettier/plugins/markdown';
import * as prettierPluginEstree from 'prettier/plugins/estree';

import { getImportsVariables } from '@bill-doc/doc-utils';
import { getExportsVariables } from '@bill-doc/doc-utils';


const isPlayground = (name: string) => {
  return name === 'Playground';
};

// match component name by regexp
const componentName = (value: any) => {
  // eslint-disable-next-line no-useless-escape
  const match = value.match(/^\<\\?(\w+)/);
  return match && match[1];
};


const addComponentsProps = (scopes: string[] = []) => async (
  node: any,
  idx: number,
) => {
  if (isPlayground(node.name)) {
    const [
      {
        mdxToMarkdown,
      },
      {
        toMarkdown,
      },
  ] = await Promise.all([
      import(`mdast-util-mdx`),
      import(`mdast-util-to-markdown`),
    ]);
    let isMdxFlowExpression = false;
    const childJsxArray: any[] = [];
    node.children.forEach((item: any) => {
      if (item.type === 'mdxJsxFlowElement') {
        const md = toMarkdown(item, {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          extensions: [mdxToMarkdown()],
        });
        childJsxArray.push(md);
      }
      if (item.type === 'mdxFlowExpression') {
        isMdxFlowExpression = true;
        childJsxArray.push(item.value);
      }
    });
    console.log('childJsxArray: ', childJsxArray);

    return format(childJsxArray.join(''), { parser: isMdxFlowExpression ? "babel" : "mdx", plugins: [parserBabel, markdown, prettierPluginEstree ] }).then(result => {
      const jsxValue = result.replace(/\n$/,"");
      console.log(jsxValue);
      node.children = [{
        type: 'code',
        lang: 'jsx',
        meta: null,
        value: jsxValue,
      }];
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
                        "name": name,
                      },
                      "kind": "init",
                      "value": {
                        "type": "Identifier",
                        "name": name,
                      },
                    })),
                  },
                },
              ],
              "sourceType": "module",
              "comments": [],
            },
          },
        },
      });
      node.attributes.push({
        type: 'mdxJsxAttribute',
        name: '__position',
        value: idx,
      });
    });
  }
};

// iterate in a reverse way to merge values then delete the unused node
const valuesFromNodes = (tree: any) => (first: number, last: number) => {
  const values = [];

  if (first !== last) {
    for (let i = last; i >= first; i--) {
      const found = tree.children[i];

      if (found.children && found.children.length > 0) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        values.push(...found.children.map((child: any) => child.value));
      }

      if (found.value && found.value.length > 0) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        values.push(found.value);
      }

      if (i !== first) remove(tree, found);
    }
  }

  return values;
};

const mergeNodeWithoutCloseTag = (tree: any, node: any, idx: any) => {
  if (!node.value || typeof node.value !== 'string') return;

  // parse component name and create two regexp to check open and close tag
  const component = componentName(node.value);
  const tagOpen = new RegExp(`^\\<${component}`);
  const tagClose = new RegExp(`\\<\\/${component}\\>$`);

  const hasOpenTag = (val: any) => tagOpen.test(val);
  const hasCloseTag = (val: any) => tagClose.test(val);
  const hasJustCloseTag = (val: any) =>
    val && !hasOpenTag(val) && hasCloseTag(val);

  // return default value is has open and close tag
  if (!component || (hasOpenTag(node.value) && hasCloseTag(node.value))) {
    return;
  }

  // when some node has just the open tag
  // find node index with equivalent close tag
  const tagCloseIdx = tree.children.findIndex(({ value, children }: any) => {
    if (children) return children.some((c: any) => hasJustCloseTag(c.value));
    return hasJustCloseTag(value);
  });

  if (tagCloseIdx > -1 && tagCloseIdx !== idx) {
    // merge all values from node open tag until node with the close tag
    const mergeUntilCloseTag = valuesFromNodes(tree);
    const values = mergeUntilCloseTag(idx, tagCloseIdx);
    node.value = values.reverse().join('\n');
  }
};

// turns `html` nodes into `jsx` nodes
export default () => (tree: any) => {
  visit(tree, 'image', (node: any): void => {
    // check if a node has just open tag
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    node = {
      ...node,
      name: 'img',
      type: 'mdxJsxFlowElement',
      attributes: [
        {
          "type": "mdxJsxAttribute",
          "name": "src",
          "value": node.url,
        },
        {
          "type": "mdxJsxAttribute",
          "name": "alt",
          "value": node.alt,
        },
      ],
    };
  });
  visit(tree, 'jsx', (node: any, idx: any): void => {
    // check if a node has just open tag
    mergeNodeWithoutCloseTag(tree, node, idx);
  });


  const importNodes = tree.children.filter((n: any) => (n.type === 'mdxjsEsm' && n.value.indexOf('import') > -1));
  const exportNodes = tree.children.filter((n: any) => (n.type === 'mdxjsEsm' && n.value.indexOf('export') > -1));
  const importedScopes = flatten<string>(importNodes.map(getImportsVariables));
  const exportedScopes = flatten<string>(exportNodes.map(getExportsVariables));
  const scopes = [...importedScopes, ...exportedScopes].filter(
    Boolean,
  );
  const nodes = tree.children
    .filter((node: any) => node.type === 'mdxJsxFlowElement')
    .map(addComponentsProps(scopes));

  return Promise.all(nodes).then(() => tree);
};
