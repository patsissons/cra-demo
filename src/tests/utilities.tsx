import * as React from 'react';

import {AppProvider, Frame} from '@shopify/polaris';
import {I18n, withI18n, WithI18nProps} from '@shopify/react-i18n';
import {mount, ReactWrapper} from 'enzyme';

// eslint-disable-next-line shopify/strict-component-boundaries
import {fallbackTranslations} from 'components/App/translations';
import {I18nProvider} from 'utilities';

const Translations = withI18n({
  id: 'Test',
  fallback: fallbackTranslations,
})(({children}: any) => children);

function TestWrapper({element}: any) {
  return (
    <AppProvider>
      <I18nProvider>
        <Frame>
          <Translations>{element}</Translations>
        </Frame>
      </I18nProvider>
    </AppProvider>
  );
}

export interface TestContext {
  element: ReactWrapper;
  i18n: I18n;
}

export type ReactWrapperWithContext<
  P = {},
  S = {},
  C = React.Component
> = ReactWrapper<P, S, C> & Readonly<TestContext>;

export function mountWithContext<
  C extends React.Component,
  P = C['props'],
  S = C['state']
>(element: React.ReactElement<P>): ReactWrapperWithContext<P, S, C> {
  const wrapper = mount(<TestWrapper element={element} />) as ReactWrapper<
    P,
    S,
    C
  > &
    TestContext;

  wrapper.element = wrapper.find(element.type as any);
  wrapper.i18n = wrapper.element
    .findWhere(
      (wrapper: ReactWrapper<WithI18nProps>) =>
        wrapper && wrapper.length === 1 && wrapper.prop('i18n') instanceof I18n,
    )
    .first()
    .prop('i18n') as I18n;

  return wrapper;
}
