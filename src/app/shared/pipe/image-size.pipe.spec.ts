import { ImageSizePipe } from './image-size.pipe';

describe('ImageSizePipe', () => {
  let pipe: ImageSizePipe;

  beforeEach(() => {
    pipe = new ImageSizePipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return the same URL if the URL is empty or undefined', () => {
    expect(pipe.transform('', 800, 600)).toBe('');
    expect(pipe.transform(null as any, 800, 600)).toBeNull();
    expect(pipe.transform(undefined as any, 800, 600)).toBeUndefined();
  });

  it('should transform the URL with new width and height', () => {
    const url = 'https://picsum.photos/id/1/5000/3333';
    const result = pipe.transform(url, 800, 600);
    expect(result).toBe('https://picsum.photos/id/1/800/600');
  });

  it('should return the same URL if the format does not match', () => {
    const url = 'https://example.com/photo.jpg';
    const result = pipe.transform(url, 800, 600);
    expect(result).toBe(url);
  });

  it('should correctly extract the image ID', () => {
    const url = 'https://picsum.photos/id/1/5000/3333';
    const result = pipe['extractId'](url);
    expect(result).toBe('1');
  });

  it('should handle URLs without an image ID', () => {
    const url = 'https://example.com/photo.jpg';
    const result = pipe['extractId'](url);
    expect(result).toBe('');
  });
});