import '@test/test-utils/email-anonymizer.ts';
import {faker} from "@faker-js/faker";

describe('anonymize email addresses', () => {
  const str = `Delivered-To: bogey@bogus.com
Received: by ${faker.internet.ipv6()} with SMTP id ${faker.string.alphanumeric({length: 16})};
        Tue, 11 Mar 2025 03:52:34 -0700 (PDT)
X-Forwarded-Encrypted: i=4; ${faker.string.alphanumeric({length: 35})}/${faker.string.alphanumeric({length: 18})}+${faker.string.alphanumeric({length: 10})}/${faker.string.alphanumeric({length: 9})}=@bogus.com
X-Received: by ${faker.internet.ipv6()} with SMTP id af79cd13be357-7c55ef75510mr349290185a.22.1741690354621;
        Tue, 11 Mar 2025 03:52:34 -0700 (PDT)
Return-Path: <auto-reply@usps.com>
Received: from mail-sor-f69.google.com (mail-sor-f69.google.com. [209.85.220.69])
        by mx.google.com with SMTPS id af79cd13be357-7c565223c9esor55517885a.7.2025.03.11.03.52.34
        for <bogey@bogus.com>
        (Google Transport Security);
        Tue, 11 Mar 2025 03:52:34 -0700 (PDT)`;
})