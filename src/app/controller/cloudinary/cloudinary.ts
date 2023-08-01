import { Service } from '../services/services';

export class Cloudinary {
  private static post_path: string = 'new/file';
  public static api_service: Service;

  public static post(data: ImageData): Promise<string> {
    return new Promise((res, rej) => {
      this.api_service.post(this.post_path, data).subscribe({
        next: (cloud_res: any) => res(JSON.stringify(cloud_res)),
        error: () => rej('Something went wrong when post the data.'),
      });
    });
  }

  public static delete(url: string): Promise<string> {
    return new Promise((res, rej) => {
      this.api_service.deleteFile(url).subscribe({
        next: (cloud_res: any) => res(JSON.stringify(cloud_res)),
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
