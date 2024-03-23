import mdx from '@mdx-js/mdx';
import plugin from './';

const content = `
import { Playground } from '@bill-doc/doc-core'

<Playground>
  {() => {
    const foo = 'foo'

    return (
      <div>{foo}</div>
    )
  }}
</Playground>
`;

test('rendering children as function', async () => {
  const result = await mdx(content, { remarkPlugins: [plugin] });
  expect(result).toMatchSnapshot();
});
