import {loadAndParseTestFile} from '@app/index';

const attempt = await loadAndParseTestFile('/Users/edcottrell/Documents/temp_emails_for_package_tracking/811601.eml');
console.log(attempt);