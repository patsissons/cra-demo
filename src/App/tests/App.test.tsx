import * as React from 'react';

import {FooterHelp, Page} from '@shopify/polaris';

import {mountWithContext} from 'src/tests/utilities';

import App from '../App';
import {TodoList} from '../components';

describe('<App />', () => {
  const defaultMockProps = {
    items: [
      {id: '1', isComplete: true, text: 'first'},
      {id: '2', isComplete: false, text: 'second'},
    ],
  };

  it('renders the app', () => {
    const mockProps = {
      ...defaultMockProps,
    };
    const wrapper = mountWithContext(<App {...mockProps as any} />);

    expect(wrapper.find(Page)).toHaveLength(1);
    expect(wrapper.find(Page).props()).toMatchObject({
      title: wrapper.i18n.translate('App.title'),
      primaryAction: {content: wrapper.i18n.translate('App.create')},
    });

    expect(wrapper.find(TodoList)).toHaveLength(1);
    expect(wrapper.find(TodoList).props()).toMatchObject({
      items: mockProps.items,
    });

    expect(wrapper.find(FooterHelp)).toHaveLength(1);
    expect(wrapper.find(FooterHelp).text()).toContain(
      wrapper.i18n.translate('App.footer', {
        polarisLink: wrapper.i18n.translate('App.polarisLink'),
      }),
    );
  });
});
