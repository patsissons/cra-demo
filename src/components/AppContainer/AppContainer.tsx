import React, {ComponentPropsWithoutRef, ReactNode} from 'react';
import {AppProvider, Frame} from '@shopify/polaris';
import {useLazyRef} from '@shopify/react-hooks';
import {I18nContext, I18nManager} from '@shopify/react-i18n';

interface Props {
  children?: ReactNode;
  locale?: string;
  theme?: ComponentPropsWithoutRef<typeof AppProvider>['theme'];
}

export function AppContainer({children, locale = 'en', theme}: Props) {
  const i18nManager = useLazyRef(() => new I18nManager({locale}));

  return (
    <AppProvider theme={theme}>
      <I18nContext.Provider value={i18nManager.current}>
        <Frame>{children}</Frame>
      </I18nContext.Provider>
    </AppProvider>
  );
}
