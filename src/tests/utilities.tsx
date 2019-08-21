/* istanbul ignore file */

import React from 'react';
import {I18n, I18nManager, TranslationDictionary} from '@shopify/react-i18n';
import {I18nParentContext} from '@shopify/react-i18n/dist/context';
import {createMount} from '@shopify/react-testing';
// eslint-disable-next-line shopify/strict-component-boundaries
import {fallbackTranslations} from 'components/App/translations';
// eslint-disable-next-line shopify/strict-component-boundaries
import {AppContainer} from 'components/AppContainer/AppContainer';

interface Context {
  i18n: I18n;
}

interface Options {
  locale?: string;
  translations?: TranslationDictionary[];
}

export const mountWithContext = createMount<Options, Context>({
  context({locale = 'en', translations = []}) {
    return {
      i18n: new I18n(
        [fallbackTranslations, ...translations],
        new I18nManager({locale}).details,
      ),
    };
  },
  render(node, {i18n}) {
    return (
      <AppContainer>
        <I18nParentContext.Provider value={i18n}>
          {node}
        </I18nParentContext.Provider>
      </AppContainer>
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
  return new Promise<unknown>((resolve) => setImmediate(resolve));
}
