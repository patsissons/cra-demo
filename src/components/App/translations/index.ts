// this is an annoying workaround to deal with isolatedModules in this version
// of TypeScript (will be fixed shortly).
// eslint-disable-next-line typescript/no-var-requires
const fallbackTranslations = require('./en.json');

export const fallbackLocale = 'en';
export {fallbackTranslations};
