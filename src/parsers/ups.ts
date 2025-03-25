import {ZPackage,} from '@app/parser-types/package';
import { Parser, } from '@app/parser';
import {z} from "zod";

export const ZPackageUPS = ZPackage.extend({
  number : z.string().refine(n => !!n.match(/^1Z\d{10,}$/)),
  carrier: z.literal('UPS'),
});

export type PackageUPS = z.infer<typeof ZPackageUPS>;

export const ParserUPS : Parser = {
  description: 'Parse package-tracking emails from UPS',
  emailType: ['html'],
  name: 'UPS Package-Tracking Parser',
  parser: (message : string) : PackageUPS[] | null => {
    const trackingNumber = message.match(/\b(?:1Z[A-Z0-9]{15,16}|T\d{10}|\d{12}|\d{9})\b/)
    const shipperRaw = message.match(/From <strong>[^<>]+<\/strong>|your <strong>[^<>]+<\/strong> package/i);
    let shipper : string | null = null;
    if (shipperRaw) {
      shipper = shipperRaw[0].replace(/.*<strong>|<\/strong>.*/gi, '');
    }
    if (!trackingNumber || !shipper) {
      return null;
    }
    return [{
      number : trackingNumber[0],
      shipper : shipper,
      carrier : 'UPS',
    } as PackageUPS];
  },
  version: '0.1',
}