import '@shopify/react-testing/matchers';
import {patchPolarisForReact169} from './utilities';

patchPolarisForReact169();

beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    value(query: any) {
      return {
        matches: false,
        media: query,
        onchange: null,
        addListener() {},
        removeListener() {},
      };
    },
  });
});
