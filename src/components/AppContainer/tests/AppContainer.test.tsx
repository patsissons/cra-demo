import React from 'react';
import {mountWithContext} from 'tests/utilities';
import {AppContainer} from '../AppContainer';

describe('<AppContainer />', () => {
  it('renders the children', () => {
    function Placeholder() {
      return null;
    }

    const wrapper = mountWithContext(
      <AppContainer>
        <Placeholder />
      </AppContainer>,
    );

    expect(wrapper).toContainReactComponent(Placeholder);
  });
});
