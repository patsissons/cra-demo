/* istanbul ignore file */

import React from 'react';
import {AppProvider, Frame} from '@shopify/polaris';
import {I18n, I18nContext, TranslationDictionary} from '@shopify/react-i18n';
import {I18nParentContext} from '@shopify/react-i18n/dist/context';
import {createMount} from '@shopify/react-testing';
import {i18nManager} from 'utilities';
// eslint-disable-next-line shopify/strict-component-boundaries
import {fallbackTranslations} from 'components/App/translations';

interface Context {
  i18n: I18n;
}

interface Options {
  translations?: TranslationDictionary[];
}

export const mountWithContext = createMount<Options, Context>({
  context({translations = []}) {
    return {
      i18n: new I18n(
        [fallbackTranslations, ...translations],
        i18nManager.details,
      ),
    };
  },
  render(node, {i18n}) {
    return (
      <AppProvider>
        <I18nContext.Provider value={i18nManager}>
          <I18nParentContext.Provider value={i18n}>
            <Frame>{node}</Frame>
          </I18nParentContext.Provider>
        </I18nContext.Provider>
      </AppProvider>
    );
  },
});

interface HookWrapperProps {
  args?: any[];
  hook(...args: any[]): any;
}

/**
 * use <HookWrapper /> to test hook logic
 * returned hook properties are composed into a <HookPropsContainer />
 */
export function HookWrapper({args = [], hook}: HookWrapperProps) {
  return <HookPropsContainer {...hook(...args)} />;
}

/**
 * use <HookPropsContainer /> to assert hook properties and trigger hook functions
 */
export function HookPropsContainer(_props: any) {
  return null;
}

/**
 * This promise resolves immediately using Promise.resolve
 */
export function noopPromise() {
  return Promise.resolve<any>({});
}

/**
 * this Promise uses setImmediate to resolve immediately after all synchronous
 * code has executed.
 */
export function asapPromise() {
  return new Promise<any>((resolve) => setImmediate(resolve));
}
