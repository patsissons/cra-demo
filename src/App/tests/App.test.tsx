import * as React from 'react';

import {FooterHelp, Heading} from '@shopify/polaris';
import {mountWithContext} from '../../tests/utilities';

import App from '../App';

describe('<App />', () => {
  it('renders the app', () => {
    const wrapper = mountWithContext(<App />);

    expect(wrapper.find(Heading)).toHaveLength(1);
    expect(wrapper.find(Heading).text()).toContain(
      wrapper.i18n.translate('App.header'),
    );
    expect(wrapper.find(FooterHelp)).toHaveLength(1);
    expect(wrapper.find(FooterHelp).text()).toContain(
      wrapper.i18n.translate('App.footer', {
        polarisLink: wrapper.i18n.translate('App.polarisLink'),
      }),
    );
  });
});
