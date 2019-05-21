// eslint-disable-next-line shopify/strict-component-boundaries
import {
  fallbackLocale,
  fallbackTranslations,
} from 'components/App/translations';
import {i18nManager} from '../i18nManager';

describe('i18nManager', () => {
  it('is created with the fallback locale', () => {
    expect(i18nManager.details).toMatchObject({
      locale: fallbackLocale,
    });
  });
});
