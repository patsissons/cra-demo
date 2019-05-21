import {I18nManager} from '@shopify/react-i18n';

// eslint-disable-next-line shopify/strict-component-boundaries
import {
  fallbackLocale,
  fallbackTranslations,
} from 'components/App/translations';

export const i18nManager = new I18nManager(
  {locale: fallbackLocale},
  fallbackTranslations,
);
