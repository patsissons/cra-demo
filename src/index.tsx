import React from 'react';

import ReactDOM from 'react-dom';
import {AppProvider, Frame} from '@shopify/polaris';
import '@shopify/polaris/styles.scss';

import App from './App';
import {serviceWorker} from './server';
import {theme} from './style';
import {I18nProvider} from './utilities';

ReactDOM.render(
  <AppProvider theme={theme}>
    <I18nProvider>
      <Frame>
        <App />
      </Frame>
    </I18nProvider>
  </AppProvider>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
