import {ParserUPS, } from "@app/parsers/ups";
import {ParserUSPSMultiple, ParserUSPSSingle} from "@app/parsers/usps";
import { Package, } from '@app/parser-types/package';
import { Parser, } from '@app/parser';

export const PackageTrackingParser : Parser = {
  description: 'Parse package-tracking emails',
  emailType: ['html'],
  name: 'Generic Package-Tracking Parser',
  parser: (message : string) : Package[] | null => {
    return ParserUSPSSingle.parser(message) || ParserUSPSMultiple.parser(message) || ParserUPS.parser(message);
  },
  version: '0.1',
}

export * from "@app/parsers/ups";
export * from "@app/parsers/usps";