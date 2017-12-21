import { ShortZipPipe } from './short-zip.pipe';

describe('ShortZipPipe', () => {
  let pipe: ShortZipPipe;

  beforeAll(() => pipe = new ShortZipPipe());

  it('should change "" to N/A', () => {
    expect(pipe.transform('')).toEqual('N/A');
  });

  it('should change null to N/A', () => {
    expect(pipe.transform(null)).toEqual('N/A');
  });

  it('should change less than 5 digits to N/A', () => {
    expect(pipe.transform(1235)).toEqual('N/A');
  });

  it('should change more than 1235523425 to 12355', () => {
    expect(pipe.transform(1235523425)).toEqual('12355');
  });

  it('should change 12345-5678 to 12345', () => {
    expect(pipe.transform('12345-6789')).toEqual('12345');
  });

  it('should change abcde to N/A', () => {
    expect(pipe.transform('abcde')).toEqual('N/A');
  });
});
