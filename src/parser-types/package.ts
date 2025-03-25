import {z} from "zod";

export const ZPackage = z.object({
  number : z.string(),
  shipper : z.string(),
  carrier : z.string(),
});
export type Package = z.infer<typeof ZPackage>;