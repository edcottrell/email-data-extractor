import { z } from "zod";

const ZPackage = z.object({
  number : z.string(),
  shipper : z.string(),
  carrier : z.string(),
});
export type Package = z.infer<typeof ZPackage>;

const ZPackageUPS = ZPackage.extend({
  number : z.string().refine(n => !!n.match(/^1Z\d{10,}$/)),
  carrier: z.literal('UPS'),
});
export type PackageUPS = z.infer<typeof ZPackageUPS>;

const ZPackageUSPS = ZPackage.extend({
  number : z.string().refine(n => !!n.match(/^\d{10,22}$/)),
  carrier: z.literal('USPS'),
});
export type PackageUSPS = z.infer<typeof ZPackageUSPS>;