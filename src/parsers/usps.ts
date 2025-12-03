import { CustomDataPackagesArray, ZPackage,} from '../parser-types/package.ts';
import { ParsedMail, } from 'mailparser';
import { Parser, } from '../parser.ts';
import {z} from "zod";

export const ZPackageUSPS = ZPackage.extend({
  number : z.string().refine(n => !!n.match(/^\d{10,22}$/)),
  carrier: z.literal('USPS'),
});

export type PackageUSPS = z.infer<typeof ZPackageUSPS>;

export const ParserUSPSSingle : Parser = {
  description: 'Parse single-package-tracking emails from USPS',
  emailType: ['html'],
  name: 'USPS Single-Package-Tracking Parser',
  parser: (message : ParsedMail) : CustomDataPackagesArray | null => {
    if (typeof message.html !== 'string') {
      return null;
    }
    const trackingNumberAndShipper = message.html.match(/(?<trackingNumber>\d{15,})(?:<[^>]+>\s*)+Package Shipped from: <strong>(?<shipper>[^<>]+)/i);
    if (!trackingNumberAndShipper) {
      return null;
    }
    return {
      packages: [{
        number: trackingNumberAndShipper.groups?.trackingNumber,
        shipper: trackingNumberAndShipper.groups?.shipper.replace(/^\s+|\s+$/gi, ''),
        carrier: 'USPS',
      } as PackageUSPS]
    };
  },
  version: '0.1',
}

export const ParserUSPSMultiple : Parser = {
  description: 'Parse multiple-package-tracking emails from USPS',
  emailType: ['html'],
  name: 'USPS Multiple-Package-Tracking Parser',
  parser: (message : ParsedMail) : CustomDataPackagesArray | null => {
    if (typeof message.html !== 'string') {
      return null;
    }
    const trackingNumberAndShipper = Array.from(message.html.matchAll(/<td[^>]+>(?:<[^<>]+>|FROM: )+(?:<[^<>]+>)+(?<shipper>[^<>]+)(?:<[^<>]+>|\s)+(?<trackingNumber>\d{15,})/gi));
    if (!trackingNumberAndShipper || trackingNumberAndShipper.length === 0) {
      return null;
    }
    return {
      packages : trackingNumberAndShipper.map(tns => {
        return {
            number : tns.groups?.trackingNumber,
            shipper : tns.groups?.shipper.replace(/^\s+|\s+$/gi, ''),
            carrier : 'USPS',
          } as PackageUSPS;
      })};
  },
  version: '0.1',
}

export const ParserUSPS : Parser = {
  description: 'Parse generic package-tracking emails from USPS',
  emailType: ['html'],
  name: 'USPS Generic Package-Tracking Parser',
  parser: (message : ParsedMail) : CustomDataPackagesArray | null => {
    return (ParserUSPSSingle.parser(message) || ParserUSPSMultiple.parser(message)) as CustomDataPackagesArray | null;
  },
  version: '0.1',
}