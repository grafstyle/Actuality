import { Service } from '../services/services';

export class Comments {
  private static get_path: string = 'comments/get?';
  private static path: string = 'comments';
  public static api_service: Service;

  public static get(id: number): Promise<Comment[]> {
    return new Promise((res, rej) => {
      this.api_service.get(`${Comments.get_path}id=${id}`).subscribe({
        next: (e: any) => res(e as Comment[]),
        error: () => rej([]),
      });
    });
  }

  public static getAll(): Promise<Comment[]> {
    return new Promise((res, rej) => {
      this.api_service.get(Comments.path).subscribe({
        next: (e: any) => res(e as Comment[]),
        error: () => rej([]),
      });
    });
  }

  public static getBy(key: string, data: any): Promise<Comment[]> {
    return new Promise((res, rej) => {
      Comments.api_service.get(`${Comments.get_path}${key}=${data}`).subscribe({
        next: (comment: any) => res(comment as Comment[]),
        error: () => rej([]),
      });
    });
  }

  public static getLastID(): Promise<number> {
    return new Promise((res, rej) => {
      this.getAll()
        .then((data) => {
          if (data.length == 0) res(0);
          res(data[data.length - 1].id);
        })
        .catch(() => {
          rej(0);
        });
    });
  }

  public static post(data: Comment): Promise<string> {
    return new Promise((res, rej) => {
      this.api_service.post(Comments.path, data).subscribe({
        next: () => res('The data has been posted.'),
        error: () => rej('Something went wrong when post the data.'),
      });
    });
  }

  public static put(id: number, data: Comment): Promise<string> {
    return new Promise((res, rej) => {
      this.api_service.put(Comments.path, id, data).subscribe({
        next: () => res('The data has been updated.'),
        error: () => rej('Something went wrong when update the data.'),
      });
    });
  }

  public static delete(id: number): Promise<string> {
    return new Promise((res, rej) => {
      this.api_service.delete(Comments.path, id).subscribe({
        next: () => res('The data has been deleted.'),
        error: () => rej('Something went wrong when delete the data.'),
      });
    });
  }
}

export interface Comment {
  id: number;
  id_user: number;
  id_post: number;
  comment: string;
  images?: string[];
  date_added: string;
  date_modified?: string;
}
