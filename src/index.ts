import { PackageTrackingParser } from "./parser-bundles/package-tracking.ts";
import { ParsedData, Parser } from "./parser.ts";
import { simpleParser } from "mailparser";
import fs from "node:fs";
import { getPipedInput, parseCommandLine } from "./parseCommandLine.ts";

const argv = await parseCommandLine(process.argv.slice(2));

export const defaultParsers = [PackageTrackingParser];

async function parse(message : Buffer | string, parsers? : Parser[]) : Promise<ParsedData | null> {
  if (!parsers) {
    parsers = defaultParsers;
  }
  let parserIndex = 0;
  const parserCount = parsers.length;
  const parsed = await simpleParser(message);
  const output : ParsedData = JSON.parse(JSON.stringify(parsed));
  for (parserIndex = 0; parserIndex < parserCount; parserIndex++) {
    const result = parsers[parserIndex].parser(parsed);
    if (result) {
      if (!Object.prototype.hasOwnProperty.call(output, 'custom')) {
        output.custom = {};
      }
      output.custom = { ...output.custom, ...result };
    }
  }
  return output;
}

export async function loadAndParseFile(path : string) {
  const fileContents = fs.readFileSync(path);
  return await parse(fileContents);
}

export async function processAllInput(): Promise<(ParsedData | null)[] | ParsedData | null> {
  const piped = await getPipedInput();
  const parsedInputs: (ParsedData | null)[] = [];
  if (piped !== undefined && piped !== '') {
    const parsedPiped = await parse(piped);
    parsedInputs.push(parsedPiped);
  }
  return await parseAllInputFiles(parsedInputs);
}

export async function parseAllInputFiles(parsedInputs: (ParsedData | null)[] | null = null): Promise<(ParsedData | null)[] | ParsedData | null> {
  if (parsedInputs === null) {
    parsedInputs = [];
  }
  if (argv.input) {
    for (let index = 0; index < argv.input.length; index++) {
      const parsed = await loadAndParseFile(argv.input[index]);
      parsedInputs.push(parsed);
    }
  }
  switch (parsedInputs.length) {
    case 0: return null;
    case 1: return parsedInputs[0];
    default: return parsedInputs;
  }
}

const result = await processAllInput();
console.log(JSON.stringify(result, null, 2));