import { EnsureAuthenticatedMiddleware } from './ensure-authenticated.middleware';

describe('EnsureAuthenticatedMiddleware', () => {
  it('should be defined', () => {
    expect(new EnsureAuthenticatedMiddleware()).toBeDefined();
  });
});
