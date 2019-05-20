import React from 'react';
import {AppProvider, ThemeProvider} from '@shopify/polaris';
import {isDevelopment} from './env';

/**
 * AppProvider and ThemeProvider still currently use componentWillReceiveProps
 * which is deprecated and generates a warning in React 16.9. This patch
 * function supresses the warning.
 */
export function patchPolarisForReact169() {
  function supressDeprecationWarning(
    ComponentClass: React.ComponentClass<any, any>,
    lifecycle: keyof React.DeprecatedLifecycle<any, any>,
  ) {
    /* istanbul ignore else */
    if (ComponentClass && ComponentClass.prototype[lifecycle]) {
      ComponentClass.prototype[lifecycle].__suppressDeprecationWarning = true;
    }
  }

  /* istanbul ignore if */
  if (isDevelopment) {
    // eslint-disable-next-line no-console
    console.warn(
      'supressing warnings for polaris usage of deprecated lifecycle functions',
    );
  }

  supressDeprecationWarning(AppProvider, 'componentWillReceiveProps');
  supressDeprecationWarning(ThemeProvider, 'componentWillReceiveProps');
}
