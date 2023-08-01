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
    const time_split: string[] = hour24.split(':');
    const hour: number = parseInt(time_split[0]);

    if (hour > 12) time_split[0] = (hour - 12).toString();
    else if (hour == 0) time_split[0] = '12';
    else time_split[0] = hour.toString();

    return `${time_split[0]}:${time_split[1]}`;
  }

  public getActualISODate(): string {
    const date = new Date().toISOString();
    return date;
  }

  public getMonthOfNumber(numberStr: string): string {
    const months: string[] = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    const month_number: number = parseInt(numberStr);
    return months[month_number];
  }

  formatDate(date: string): string {
    const iso_date: string = date;
    const splitted_c_date: string[] = this.dateToString(iso_date).split(' ');
    const splitted_date: string[] = splitted_c_date[0].split('/');

    const month_str: string = this.getMonthOfNumber(splitted_date[1]);

    return `${month_str} ${splitted_date[0]}, ${splitted_date[2]} ${
      splitted_c_date[1]
    } ${splitted_c_date[2].toLowerCase()}`;
  }

  public dateToString(dateStr: string): string {
    const date = new Date(dateStr);

    const day: number = date.getDate();
    const month: number = date.getMonth();
    const year: number = date.getFullYear();

    const conv_day: string = day < 10 ? `0${day}` : `${day}`;
    const conv_month: string = month < 10 ? `0${month}` : `${month}`;

    const only_date: string = `${conv_day}/${conv_month}/${year}`;

    const hour: number = date.getHours();
    const minutes: number = date.getMinutes();
    const AM_or_PM: string = hour >= 12 ? 'PM' : 'AM';

    const conv_mins: string = minutes < 10 ? `0${minutes}` : `${minutes}`;

    const final_hour = this.format12Time(`${hour}:${conv_mins} ${AM_or_PM}`);

    return `${only_date} ${final_hour}`;
  }
}
