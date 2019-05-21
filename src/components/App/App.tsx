import React, {useCallback, useMemo, useState} from 'react';
import {
  Card,
  FooterHelp,
  Loading,
  Link,
  Page,
  SkeletonPage,
  SkeletonBodyText,
  Toast,
} from '@shopify/polaris';
import {useI18n} from '@shopify/react-i18n';
import {isDevelopment, isProduction} from 'utilities';
import {TodoList} from './components';
import {useTodoListService} from './hooks';
import {fallbackTranslations} from './translations';

export default function App() {
  const [i18n, ShareTranslations] = useI18n({
    id: 'App_<hash>',
    fallback: fallbackTranslations,
    async translations(locale) {
      const dictionary = await import(
        /* webpackChunkName: "App_<hash>-i18n", webpackMode: "lazy-once" */ `./translations/${locale}.json`
      );
      return dictionary;
    },
  });
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState(false);
  const options = useMemo(
    () =>
      /* istanbul ignore next */
      isDevelopment || isProduction
        ? {params: {simulatedLatency: 1000}}
        : undefined,
    [],
  );
  const {items, loading, create, remove, update} = useTodoListService(options);
  const handleDismissToast = useCallback(() => {
    setError(false);
  }, [setError]);

  if (loading) {
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
    <ShareTranslations>
      <Page
        title={i18n.translate('App.title')}
        primaryAction={{
          content: i18n.translate('App.create'),
          loading: creating,
          async onAction() {
            setCreating(true);

            try {
              await create();
            } catch {
              setError(true);
            }

            setCreating(false);
          },
        }}
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
      {error && (
        <Toast
          content={i18n.translate(`App.error`)}
          onDismiss={handleDismissToast}
          error
        />
      )}
    </ShareTranslations>
  );
}
