/* istanbul ignore file */

import React from 'react';
import ReactDOM from 'react-dom';
import {I18nContext} from '@shopify/react-i18n';
import {AppProvider, Frame} from '@shopify/polaris';
import {App} from './components';
import {serviceWorker} from './server';
import {theme} from './style';
import {i18nManager, patchPolarisForReact169} from './utilities';

import '@shopify/polaris/styles.scss';

patchPolarisForReact169();

ReactDOM.render(
  <AppProvider theme={theme}>
    <I18nContext.Provider value={i18nManager}>
      <Frame>
        <App />
      </Frame>
    </I18nContext.Provider>
  </AppProvider>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
