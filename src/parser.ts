import { z } from "zod";

export const ZParsedData = z.any().nullable();
export type ParsedData = z.infer<typeof ZParsedData>;

export const ZParser = z.object({
  description: z.string().optional(),
  emailType: z.string().array().optional(),
  name: z.string(),
  parser: z.function().args(z.string()).returns(z.union([ZParsedData.array(), z.null()])),
  version: z.string().optional(),
});
export type Parser = z.infer<typeof ZParser>;