import { z, ZodTypeAny } from "zod";
import { ParsedMail } from "mailparser";

export const ZSimpleParserEmailAddress = z.object({
  address: z.string().nullish(),
  name: z.string(),
  get group(): ZodTypeAny {
    return ZSimpleParserEmailAddress.array().nullish()
  },
});
export const ZSimpleParserAddressObject = z.object({
  value: ZSimpleParserEmailAddress.array(),
  html: z.string(),
  text: z.string(),
});
export const ZSimpleParserStructuredHeader = z.unknown()
export const ZSimpleParserHeaderValue = z.union([
  z.string(),
  z.string().array(),
  ZSimpleParserAddressObject,
  z.date(),
  ZSimpleParserStructuredHeader,
  ZSimpleParserStructuredHeader.array(),
]);
export const ZSimpleParserHeaders = z.map(z.string(), ZSimpleParserHeaderValue);
export const ZSimpleParserHeaderLine = z.object({key : z.string(), line: z.string()});
export const ZSimpleParserAttachment = z.object({
  type: z.literal("attachment"),
  content: z.any(),
  contentType: z.string(),
  contentDisposition: z.string(),
  filename: z.string().nullish(),
  headers: ZSimpleParserHeaders,
  headerLines: ZSimpleParserHeaderLine.array().readonly(),
  checksum: z.string(),
  size: z.number(),
  contentId: z.string().nullish(),
  cid: z.string().nullish(),
  related: z.boolean(),
});
export const ZParsedMail = z.object({
  attachments: ZSimpleParserAttachment.array(),
  headers: ZSimpleParserHeaders,
  headerLines: ZSimpleParserHeaderLine.array().readonly(),
  html: z.union([z.string(), z.literal(false)]),
  text: z.union([z.string(), z.undefined()]).optional(),
  textAsHtml: z.union([z.string(), z.undefined()]).optional(),
  subject: z.union([z.string(), z.undefined()]).optional(),
  references: z.union([z.string().array(), z.string(), z.undefined()]).optional(),
  date: z.union([z.date(), z.undefined()]).optional(),
  to: z.union([ZSimpleParserAddressObject.array(), ZSimpleParserAddressObject, z.undefined()]).optional(),
  from: z.union([ZSimpleParserAddressObject, z.undefined()]).optional(),
  cc: z.union([ZSimpleParserAddressObject.array(), ZSimpleParserAddressObject, z.undefined()]).optional(),
  bcc: z.union([ZSimpleParserAddressObject.array(), ZSimpleParserAddressObject, z.undefined()]).optional(),
  replyTo: z.union([ZSimpleParserAddressObject, z.undefined()]).optional(),
  messageId: z.union([z.string(), z.undefined()]).optional(),
  inReplyTo: z.union([z.string(), z.undefined()]).optional(),
  priority: z.union([z.literal("normal"), z.literal("low"), z.literal("high"), z.undefined()]).optional(),
});

export const ZParsedCustomData = z.record(z.unknown(), z.unknown());
export const ZParsedData = ZParsedMail.extend({ custom: ZParsedCustomData.nullish() });
export type ParsedData = z.infer<typeof ZParsedData>;

export type Parser = {
  description?: string,
  emailType?: string[],
  name: string,
  parser: (message: ParsedMail) => any,
  version?: string,
}

export function messageHasHtml(message : unknown) : message is { html: string } {
  return !!message && typeof message === 'object' && ('html' in message) && typeof message.html === 'string' && message.html.length > 0;
}