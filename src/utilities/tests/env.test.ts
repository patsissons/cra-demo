import * as env from '../env';

describe('env', () => {
  it('defines isDevelopment as false in a test', () => {
    expect(env.isDevelopment).toBe(false);
  });

  it('defines isProduction as false in a test', () => {
    expect(env.isProduction).toBe(false);
  });

  it('defines isTest as true in a test', () => {
    expect(env.isTest).toBe(true);
  });
});
