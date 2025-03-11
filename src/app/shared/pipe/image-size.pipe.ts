import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'imageSize',
})
export class ImageSizePipe implements PipeTransform {
  transform(url: string, width: number, height: number): string {
    if (!url) return url;
    // Regular expression to match the pattern: /id/{id}/{width}/{height}
    const regex = /\/id\/\d+\/(\d+)\/(\d+)/;

    if (regex.test(url)) {
      return url.replace(
        regex,
        `/id/${this.extractId(url)}/${width}/${height}`
      );
    }
    return url;
  }

  private extractId(url: string): string {
    // Extract the image ID from the URL (e.g., /id/1/ -> return '1')
    const match = url.match(/\/id\/(\d+)\//);
    return match ? match[1] : '';
  }
}
