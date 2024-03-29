import * as parser from '@babel/parser';
import traverse from '@babel/traverse';
import get from 'lodash/get';

const fromDeclarations = (declarations: any = []) =>
  Array.isArray(declarations) && declarations.length > 0
    ? declarations.map(declaration => get(declaration, 'id.name'))
    : [];

const traverseOnExports = (fn: (path: any) => any[]) => (node: any) => {
  try {
    const ast = parser.parse(node.value, {
      sourceType: 'module',
    });
    let populated: any[] = [];
    traverse(ast, {
      enter(path: any): void {
        if (path.isExportDeclaration()) {
          populated = populated.concat(fn(path));
          return;
        }
      },
    });
    return populated;
  } catch (err: any) {
    return [];
  }
};

export const getExportsVariables = traverseOnExports(path => {
  const type = get(path, 'node.declaration.type');
  const declaration = get(path, 'node.declaration', false);
  switch (type) {
    case 'VariableDeclaration':
      return fromDeclarations(get(path, 'node.declaration.declarations', []));
    case 'FunctionDeclaration':
      return fromDeclarations(declaration ? [declaration] : []);
    case 'Identifier':
      return get(path, 'node.declaration.name');
    default:
      console.error(`Unexpected export type ${type} in @bill-doc/doc-utils/exports`);
  }
});
