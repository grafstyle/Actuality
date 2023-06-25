import { Service } from '../services/services';

export class Cloudinary {
  private static post_path: string = 'new/file';
  public static apiService: Service;

  public static post(data: ImageData): Promise<string> {
    return new Promise((res, rej) => {
      this.apiService.post(this.post_path, data).subscribe({
        next: (cloudRes: any) => res(JSON.stringify(cloudRes)),
        error: () => rej('Something went wrong when post the data.'),
      });
    });
  }

  public static delete(url: string): Promise<string> {
    return new Promise((res, rej) => {
      this.apiService.deleteFile(url).subscribe({
        next: (cloudRes: any) => res(JSON.stringify(cloudRes)),
        error: () => rej('Something went wrong when delete the data.'),
      });
    });
  }
}

export interface ImageData {
  image: string;
  name: string;
  url: string;
}
