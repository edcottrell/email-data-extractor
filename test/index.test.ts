import {loadAndParseFile} from '@app/index';

const attempt = await loadAndParseFile('/Users/edcottrell/Documents/temp_emails_for_package_tracking/811601.eml');
console.log(attempt?.custom ? attempt.custom : 'nothing found');