import {AppProvider, ThemeProvider} from '@shopify/polaris';

describe('patchPolarisForReact169()', () => {
  it('patches AppProvider.componentWillReceiveProps', () => {
    expect(AppProvider.prototype.componentWillReceiveProps).toHaveProperty(
      '__suppressDeprecationWarning',
      true,
    );
  });

  it('patches ThemeProvider.componentWillReceiveProps', () => {
    expect(ThemeProvider.prototype.componentWillReceiveProps).toHaveProperty(
      '__suppressDeprecationWarning',
      true,
    );
  });
});
