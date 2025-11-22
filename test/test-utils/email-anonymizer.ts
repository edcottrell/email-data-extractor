import { faker } from "@faker-js/faker";

function replaceEmailAddressesWithFakes(str : string, pattern? : RegExp) {
  if (!pattern) {
    pattern = /\b\S+@(?!fedex|ups|usps)([^\s.]+)+\.[a-z]{2,4}/gi;
  }
  return str.replace(pattern, () => faker.internet.email());
}

function replaceIPv4sWithFakes(str : string, pattern? : RegExp) {
  if (!pattern) {
    pattern = /\b(?:(?:2[0-5]\d|1\d\d|\d{1,2})\.){3}(?:2[0-5]\d|1\d\d|\d{1,2})\b/gi;
  }
  return str.replace(pattern, () => faker.internet.ipv4());
}

function replaceIPv6sWithFakes(str : string, pattern? : RegExp) {
  if (!pattern) {
    pattern = /(?:[0-9a-f]{4}:{1,2}){1,7}[0-9a-f]{4}\b/gi;
  }
  return str.replace(pattern, () => faker.internet.ipv6());
}