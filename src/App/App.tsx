import * as React from 'react';

import {
  DisplayText,
  FooterHelp,
  Heading,
  Image,
  Layout,
  Link,
} from '@shopify/polaris';
import {withI18n, WithI18nProps} from '@shopify/react-i18n';
import {compose} from 'recompose';

import {logo} from './images';
import styles from './App.module.scss';
import en from './translations/en.json';

type ComposedProps = WithI18nProps;

export function App({i18n}: ComposedProps) {
  return (
    <Layout>
      <div className={styles.App}>
        <Heading element="h1">
          <DisplayText size="extraLarge">
            {i18n.translate('App.header')}
          </DisplayText>
        </Heading>
        <Image alt="logo" className={styles.Logo} source={logo} />
        <FooterHelp>
          {i18n.translate('App.footer', {
            polarisLink: (
              <Link url="https://polaris.shopify.com">
                {i18n.translate('App.polarisLink')}
              </Link>
            ),
          })}
          Built using <Link url="https://polaris.shopify.com">Polaris</Link>.
        </FooterHelp>
      </div>
    </Layout>
  );
}

export default compose<ComposedProps, {}>(
  withI18n({
    id: 'App',
    fallback: en,
    async translations(locale) {
      const dictionary = await import(/* webpackChunkName: "App_<hash>-i18n" */ `./translations/${locale}.json`);
      return dictionary;
    },
  }),
)(App);
