import * as React from 'react';

import {Provider, Manager} from '@shopify/react-i18n';

export const i18nManager = new Manager({locale: 'en'});

export default function I18nProvider({children}: any) {
  return <Provider manager={i18nManager}>{children}</Provider>;
}
