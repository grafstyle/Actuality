import { Service } from '../services/services';

export class Posts {
  private static path: string = 'posts';
  public static apiService: Service;

  public static get(id: number): Promise<Post[]> {
    return new Promise((res, rej) => {
      this.apiService.get(`${this.path}/${id}`).subscribe({
        next: (e: any) => res(e as Post[]),
        error: () => rej([]),
      });
    });
  }

  public static getAll(): Promise<Post[]> {
    return new Promise((res, rej) => {
      this.apiService.get(this.path).subscribe({
        next: (e: any) => res(e as Post[]),
        error: () => rej([]),
      });
    });
  }

  public static post(data: Post): Promise<string> {
    return new Promise((res, rej) => {
      this.apiService.post(this.path, data).subscribe({
        next: () => res('The data has been posted.'),
        error: () => rej('Something went wrong when post the data.'),
      });
    });
  }

  public static put(id: number, data: Post): Promise<string> {
    return new Promise((res, rej) => {
      this.apiService.put(this.path, id, data).subscribe({
        next: () => res('The data has been updated.'),
        error: () => rej('Something went wrong when update the data.'),
      });
    });
  }

  public static delete(id: number): Promise<string> {
    return new Promise((res, rej) => {
      this.apiService.delete(this.path, id).subscribe({
        next: () => res('The data has been deleted.'),
        error: () => rej('Something went wrong when delete the data.'),
      });
    });
  }
}

export interface Post {
  id: number;
  id_user: number;
  title: string;
  images: string[];
  date_added: string;
  date_modified: string;
  cant_likes: number;
}
