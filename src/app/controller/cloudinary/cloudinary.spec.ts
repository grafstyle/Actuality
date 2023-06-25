import { Cloudinary } from './cloudinary';

describe('Cloudinary', () => {
  it('should create an instance', () => {
    expect(new Cloudinary()).toBeTruthy();
  });
});
