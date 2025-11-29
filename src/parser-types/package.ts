import {z} from "zod";
import { ZParsedCustomData } from "@app/parser";

export const ZPackage = z.object({
  number : z.string(),
  shipper : z.string(),
  carrier : z.string(),
});
export type Package = z.infer<typeof ZPackage>;

export type CustomDataPackagesArray = { packages: Package[] };