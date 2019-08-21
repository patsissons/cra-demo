/* istanbul ignore file */

import React from 'react';
import ReactDOM from 'react-dom';
import {App, AppContainer} from './components';
import {serviceWorker} from './server';
import {theme} from './style';
import {patchPolarisForReact169} from './utilities';

import '@shopify/polaris/styles.scss';

patchPolarisForReact169();

ReactDOM.render(
  <AppContainer theme={theme}>
    <App />
  </AppContainer>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
