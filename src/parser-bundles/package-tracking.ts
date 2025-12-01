import {ParserUPS, } from "../parsers/ups";
import {ParserUSPSMultiple, ParserUSPSSingle} from "../parsers/usps";
import { CustomDataPackagesArray, } from '../parser-types/package';
import { messageHasHtml, Parser, } from '../parser';
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

export * from "../parsers/ups";
export * from "../parsers/usps";