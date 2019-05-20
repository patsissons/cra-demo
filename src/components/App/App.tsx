import * as React from 'react';

import {
  Card,
  FooterHelp,
  Loading,
  Link,
  Page,
  SkeletonPage,
  SkeletonBodyText,
} from '@shopify/polaris';
import {withI18n, WithI18nProps} from '@shopify/react-i18n';
import {compose} from 'recompose';

import {TodoList} from './components';
import {fallbackTranslations} from './translations';
import {withTodoListData, WithTodoListDataProps} from './withTodoListData';

export interface Props {}

type ComposedProps = Props & WithI18nProps & WithTodoListDataProps;

export function App({i18n, items, create, remove, update}: ComposedProps) {
  if (!items) {
    return (
      <SkeletonPage primaryAction title={i18n.translate('App.title')}>
        <Card sectioned>
          <SkeletonBodyText />
        </Card>
        <Loading />
      </SkeletonPage>
    );
  }

  return (
    <Page
      title={i18n.translate('App.title')}
      primaryAction={{content: i18n.translate('App.create'), onAction: create}}
    >
      <Card>
        <TodoList items={items} remove={remove} update={update} />
      </Card>
      <FooterHelp>
        {i18n.translate('App.footer', {
          polarisLink: (
            <Link url="https://polaris.shopify.com">
              {i18n.translate('App.polarisLink')}
            </Link>
          ),
        })}
      </FooterHelp>
    </Page>
  );
}

export default compose<ComposedProps, {}>(
  withTodoListData(),
  withI18n({
    id: 'App',
    fallback: fallbackTranslations,
    async translations(locale) {
      const dictionary = await import(
        /* webpackChunkName: "App_<hash>-i18n" */ `./translations/${locale}.json`
      );
      return dictionary;
    },
  }),
)(App);
