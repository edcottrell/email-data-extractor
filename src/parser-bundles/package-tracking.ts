import {ParserUPS, } from "../parsers/ups.ts";
import {ParserUSPSMultiple, ParserUSPSSingle} from "../parsers/usps.ts";
import { CustomDataPackagesArray, } from '../parser-types/package.ts';
import { messageHasHtml, Parser, } from '../parser.ts';
import { ParsedMail, } from 'mailparser';

export const PackageTrackingParser : Parser = {
  description: 'Parse package-tracking emails',
  emailType: ['html'],
  name: 'Generic Package-Tracking Parser',
  parser: (message : ParsedMail) : CustomDataPackagesArray | null => {
    if (!messageHasHtml(message)) {
      return null;
    }
    return (ParserUSPSSingle.parser(message) || ParserUSPSMultiple.parser(message) || ParserUPS.parser(message)) as CustomDataPackagesArray | null;
  },
  version: '0.1',
}

export * from "../parsers/ups.ts";
export * from "../parsers/usps.ts";