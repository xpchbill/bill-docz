import * as paths from '../config/paths';
import yargs from 'yargs';
import { setArgs, Config } from '../config/argv';
import { Params } from '../lib/DataServer';
import { getBaseConfig } from '../config/doc';

export const mockedParams = (): Params => {
  const data: any = {};
  return {
    getState: () => data,
    setState: (key: string, value: string) => (data[key] = value),
  };
};

export const mockedArgv = () => {
  const yargsArgs: any = {
    argv: {},
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    option: jest.fn().mockImplementation((key, value) => {
      yargs.argv[value.alias ? value.alias : key] = value.default;
      return yargs;
    }),
  };
  const { argv } = setArgs(yargsArgs);
  return argv;
};

export const getTestConfig = (overrides?: Partial<Config>): Config => {
  const argv = mockedArgv();
  return {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    ...getBaseConfig(argv),
    paths,
    typescript: true,
    src: './__fixtures__',
    ...overrides,
  };
};
