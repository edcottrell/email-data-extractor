import yargs from 'yargs';
import process from "node:process";

export type LaunchOptions = {
  input?: string[];
  verbose?: boolean;
};

type Arguments = LaunchOptions & {
  _: (string | number)[];
  $0: string;
};

export async function getPipedInput() : Promise<string | undefined> {
  return new Promise((resolve, reject) => {
    // Check if input is being piped in
    if (process.stdin.isTTY) {
      resolve(undefined);
    } else {
      let input: string = '';

      // Set the encoding for the input data
      process.stdin.setEncoding('utf8');

      // Collect data chunks
      process.stdin.on('data', (chunk: string) => {
        input += chunk;
      });

      // When there's no more data, resolve the promise
      process.stdin.on('end', () => {
        resolve(input);
      });

      // Handle errors
      process.stdin.on('error', (err) => {
        reject(err);
      });
    }
  });
}

/* istanbul ignore next */
export async function parseCommandLine(args: string[]): Promise<Arguments> {
  return yargs(args)
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