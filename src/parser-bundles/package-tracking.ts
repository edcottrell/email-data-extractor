import {ParserUPS, } from "@app/parsers/ups";
import {ParserUSPSMultiple, ParserUSPSSingle} from "@app/parsers/usps";
import { CustomDataPackagesArray, } from '@app/parser-types/package';
import { messageHasHtml, Parser, } from '@app/parser';
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

export * from "@app/parsers/ups";
export * from "@app/parsers/usps";