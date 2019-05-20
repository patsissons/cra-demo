import * as React from 'react';

import {Provider, Manager} from '@shopify/react-i18n';
// eslint-disable-next-line shopify/strict-component-boundaries
import {
  fallbackLocale,
  fallbackTranslations,
} from 'components/App/translations';

export const i18nManager = new Manager(
  {locale: fallbackLocale},
  fallbackTranslations,
);

export default function I18nProvider({children}: any) {
  return <Provider manager={i18nManager}>{children}</Provider>;
}
