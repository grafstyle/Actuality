import { Service } from '../services/services';

export class Posts {
  private path: string = 'posts';
  constructor(private _apiService: Service) {}

  get(): Promise<Post[]> {
    return new Promise((res, rej) => {
      this._apiService.get(this.path).subscribe({
        next: (e: any) => res(e as Post[]),
        error: () => rej([]),
      });
    });
  }

  post(data: Post): Promise<string> {
    return new Promise((res, rej) => {
      this._apiService.post(this.path, data).subscribe({
        next: () => res('The data has been posted.'),
        error: () => rej('Something went wrong when post the data.'),
      });
    });
  }

  put(id: number, data: Post): Promise<string> {
    return new Promise((res, rej) => {
      this._apiService.put(this.path, id, data).subscribe({
        next: () => res('The data has been updated.'),
        error: () => rej('Something went wrong when update the data.'),
      });
    });
  }

  delete(id: number): Promise<string> {
    return new Promise((res, rej) => {
      this._apiService.delete(this.path, id).subscribe({
        next: () => res('The data has been deleted.'),
        error: () => rej('Something went wrong when delete the data.'),
      });
    });
  }
}

export interface Post {
  id: number;
  id_user: number;
  body: string;
  date_added: string;
  date_modified: string;
  cant_likes: number;
}
