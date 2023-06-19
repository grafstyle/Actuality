import { ElementRef } from '@angular/core';

export class Tools {
  getImage(file: File): Promise<string> {
    return new Promise((res, rej) => {
      const reader: FileReader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => res(reader.result as string);
      reader.onerror = (err) => rej(err);
    });
  }

  public getNameOfCloudinaryFile(url: string): string {
    const dirs: string[] = url.split('/');
    return dirs[dirs.length - 1];
  }

  public setCursorToLast(elem: ElementRef<HTMLElement>): void {
    const range: Range = document.createRange();
    const sel: Selection | null = window.getSelection();
    range.setStart(elem.nativeElement, 1);
    range.collapse(true);

    sel?.removeAllRanges();
    sel?.addRange(range);
  }

  public getNameMail(email: string): string {
    return email.split('@')[0];
  }

  public createURLName(name: string): string {
    return name.replace(' ', '_').toLowerCase();
  }

  private format12Time(hour24: string): string {
    if (!hour24.includes(':'))
      throw EvalError('The time not include semicolon.');
    const timeSplit: string[] = hour24.split(':');
    const hour: number = parseInt(timeSplit[0]);

    if (hour > 12) timeSplit[0] = (hour - 12).toString();

    return `${hour}:${timeSplit[1]}`;
  }

  public getActualISODate(): string {
    const date = new Date().toISOString();
    return date;
  }

  public getFormattedActualDate(): string {
    const date: Date = new Date();

    const day: number = date.getDay();
    const month: number = date.getMonth();
    const year: number = date.getFullYear();

    const convDay: string = day < 10 ? `0${day}` : `${day}`;
    const convMonth: string = month < 10 ? `0${month}` : `${month}`;

    const onlyDate: string = `${convDay}/${convMonth}/${year}`;

    const hour: number = date.getHours();
    const minutes: number = date.getMinutes();
    const AM_or_PM: string = hour >= 12 ? 'PM' : 'AM';

    const convMins: string = minutes < 10 ? `0${minutes}` : `${minutes}`;

    const finalHour = this.format12Time(`${hour}:${convMins}${AM_or_PM}`);

    return `${onlyDate} ${finalHour}`;
  }
}
