import * as fs from 'node:fs';
import { simpleParser } from 'mailparser';
import {Package, PackageUPS, PackageUSPS} from '@app/package';

function extractPackageInfoUpsSingle(message : string) : PackageUPS | null {
  const trackingNumber = message.match(/\b(?:1Z[A-Z0-9]{15,16}|T\d{10}|\d{12}|\d{9})\b/)
  const shipperRaw = message.match(/From <strong>[^<>]+<\/strong>|your <strong>[^<>]+<\/strong> package/i);
  let shipper : string | null = null;
  if (shipperRaw) {
    shipper = shipperRaw[0].replace(/.*<strong>|<\/strong>.*/gi, '');
  }
  if (!trackingNumber || !shipper) {
    return null;
  }
  return {
    number : trackingNumber[0],
    shipper : shipper,
    carrier : 'UPS',
  } as PackageUPS;
}

function extractPackageInfoUspsMultiple(message : string) : PackageUSPS[] | null {
  const trackingNumberAndShipper = message.matchAll(/<td[^>]+>(?:<[^<>]+>|FROM: )+(?:<[^<>]+>)+(?<shipper>[^<>]+)(?:<[^<>]+>|\s)+(?<trackingNumber>\d{15,})/gi);
  if (!trackingNumberAndShipper) {
    return null;
  }
  return [...trackingNumberAndShipper].map(tns => {
    return {
      number : tns.groups?.trackingNumber,
      shipper : tns.groups?.shipper,
      carrier : 'USPS',
    } as PackageUSPS;
  });
}

function extractPackageInfoUspsSingle(message : string) : PackageUSPS | null {
  const trackingNumberAndShipper = message.match(/(?<trackingNumber>\d{15,})(?:<[^>]+>\s*)+Package Shipped from: <strong>(?<shipper>[^<>]+)/i);
  if (!trackingNumberAndShipper) {
    return null;
  }
  return {
    number : trackingNumberAndShipper.groups?.trackingNumber,
    shipper : trackingNumberAndShipper.groups?.shipper,
    carrier : 'USPS',
  } as PackageUSPS;
}

async function parse(message : Buffer) : Promise<Package[] | null> {
  const parsed = await simpleParser(message);
  if (typeof parsed.html !== 'string') {
    throw new Error("Couldn't extract HTML body from message");
  }
  const single : Package | null = extractPackageInfoUspsSingle(parsed.html) || extractPackageInfoUpsSingle(parsed.html);
  if (single) {
    return [single];
  }
  return extractPackageInfoUspsMultiple(parsed.html);
}

async function loadAndParseTestFile(path : string) {
  const fileContents = fs.readFileSync(path);
  return await parse(fileContents);
}
