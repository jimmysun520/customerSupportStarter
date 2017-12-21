import { ReadablePhonePipe } from './readable-phone.pipe';

describe('ReadablePhonePipe', () => {
  let pipe: ReadablePhonePipe;

  beforeAll(() => pipe = new ReadablePhonePipe());

    it('should change "" to readable format', () => {
      expect(pipe.transform('')).toEqual('N/A');
    });

    it('should change null to N/A', () => {
      expect(pipe.transform(null)).toEqual('N/A');
    });

    it('should change 11234567890 to readable format', () => {
      expect(pipe.transform(1234567890)).toEqual('(123) 456-7890');
    });

    it('should change 112345678901 (11 digits) to N/A', () => {
      expect(pipe.transform(12345678901)).toEqual('N/A');
    });

    it('should change (112-3456-78.90GGAA- (with symbols, letters) to readable format', () => {
      expect(pipe.transform('(123-456-7890-')).toEqual('(123) 456-7890');
    });
});
