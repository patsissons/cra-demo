import * as React from 'react';

import {FooterHelp, Heading} from '@shopify/polaris';
import {shallow} from 'enzyme';

import App from '../App';

describe('<App />', () => {
  it('renders the app', () => {
    const wrapper = shallow(<App />);

    expect(wrapper.find(Heading)).toHaveLength(1);
    expect(wrapper.find(FooterHelp)).toHaveLength(1);
  });
});
