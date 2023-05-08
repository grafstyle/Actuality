import { Service } from '../services/services';

export class Cloudinary {
  private static path: string = 'new/image';
  public static apiService: Service;

  public static post(data: ImageData): Promise<string> {
    return new Promise((res, rej) => {
      this.apiService.post(this.path, data).subscribe({
        next: () => res('The data has been posted.'),
        error: () => rej('Something went wrong when post the data.'),
      });
    });
  }
}

export interface ImageData {
  image: string;
  name: string;
  url: string;
}
