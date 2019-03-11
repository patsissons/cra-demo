import React from 'react';

import ReactDOM from 'react-dom';
import {AppProvider, Frame} from '@shopify/polaris';
import '@shopify/polaris/styles.scss';

import App, {I18nManager, theme} from './App';
import {serviceWorker} from './server';

ReactDOM.render(
  <AppProvider theme={theme}>
    <I18nManager>
      <Frame>
        <App />
      </Frame>
    </I18nManager>
  </AppProvider>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
