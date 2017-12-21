import { InitCapsPipe } from './init-caps.pipe';

describe('InitCapsPipe', () => {
  let pipe: InitCapsPipe;

  beforeAll(function () {
    pipe = new InitCapsPipe();
  });

  it('should change null to N/A', () => {
    expect(pipe.transform(null)).toEqual('N/A');
  });

  it('should send "" through', () => {
    expect(pipe.transform('')).toEqual('');
  });

  it('send unitcode char U+1f602 and \u03A9 through', () => {
    expect(pipe.transform('U+1f602 and \u03A9')).toEqual('U+1f602 And \u03A9');
  });

  it('send lower case john o\'liver through', () => {
    expect(pipe.transform('john o\'liver')).toEqual('John O\'liver');
  });

  it('send all caps DONALD TRUMP through', () => {
    expect(pipe.transform('DONALD TRUMP')).toEqual('DONALD TRUMP');
  });

  it('send mcDonald through and keep the D', () => {
    expect(pipe.transform('mcDonald')).toEqual('McDonald');
  });
});
