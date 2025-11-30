import { PackageTrackingParser } from "@app/parser-bundles/package-tracking";
import { ParsedData, Parser } from "@app/parser";
import { simpleParser } from "mailparser";
import fs from "node:fs";
import { parseCommandLine } from "@app/parseCommandLine";

const argv = await parseCommandLine(process.argv.slice(2));

export const defaultParsers = [PackageTrackingParser];

async function parse(message : Buffer, parsers? : Parser[]) : Promise<ParsedData | null> {
  if (!parsers) {
    parsers = defaultParsers;
  }
  let parserIndex = 0;
  const parserCount = parsers.length;
  const parsed = await simpleParser(message);
  if (typeof parsed.html !== 'string') {
    throw new Error("Couldn't extract HTML body from message");
  }
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

if (argv.input) {
  argv.input.forEach(async (file) => {
    const parsed = await loadAndParseFile(file);
    const jsonOutput = JSON.stringify(parsed, null, 2);
    console.log(jsonOutput);
  });
}