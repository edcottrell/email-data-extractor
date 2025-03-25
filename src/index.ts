import { PackageTrackingParser } from "@app/parser-bundles/package-tracking";
import { ParsedData, Parser } from "@app/parser";
import { simpleParser } from "mailparser";
import fs from "node:fs";


export const defaultParsers = [PackageTrackingParser];

async function parse(message : Buffer, parsers? : Parser[]) : Promise<ParsedData[] | null> {
  if (!parsers) {
    parsers = defaultParsers;
  }
  let parserIndex = 0;
  const parserCount = parsers.length;
  const parsed = await simpleParser(message);
  if (typeof parsed.html !== 'string') {
    throw new Error("Couldn't extract HTML body from message");
  }
  for (parserIndex = 0; parserIndex < parserCount; parserIndex++) {
    const result = parsers[parserIndex].parser(parsed.html);
    if (result) {
      return result;
    }
  }
  return null;
}

export async function loadAndParseTestFile(path : string) {
  const fileContents = fs.readFileSync(path);
  return await parse(fileContents);
}