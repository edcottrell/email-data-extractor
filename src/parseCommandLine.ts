import yargs from 'yargs';

export type LaunchOptions = {
  format?: (string | number)[] | string;
  input?: string[];
  verbose?: boolean;
};

type Arguments = LaunchOptions & {
  _: (string | number)[];
  $0: string;
};

/* istanbul ignore next */
export async function parseCommandLine(args: string[]): Promise<Arguments> {
  return yargs(args)
    .array('format')
    .option('format', {
      alias: 'f',
      type: 'array',
      description: 'Specify a report format',
      default: 'date project tag description entry',
    })
    .array('input')
    .option('input', {
      alias: 'i',
      type: 'array',
      description: 'Specify one or more files to process',
    })
    .coerce('input', (arg: (string|number)[]) => arg.map(file => file.toString()))
    .option('verbose', {
      alias: 'v',
      type: 'boolean',
      description: 'Run with verbose logging',
    })
    .help('help')
    .alias('h', 'help')
    .epilog('(c) 2025 Ed Cottrell')
    .parseSync();
}