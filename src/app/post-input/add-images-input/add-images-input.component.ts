import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { Tools } from 'src/app/tools/tools';

@Component({
  selector: 'app-add-images-input',
  templateUrl: './add-images-input.component.html',
  styleUrls: ['./add-images-input.component.css'],
})
export class AddImagesInputComponent implements AfterViewInit {
  imgs: Image[] = [];
  imgs_to_delete: string[] = [];
  tools: Tools = new Tools();

  @Input() imgs_in_cloud: string[] = [];
  @Input() hover_color: string = '';
  @Input() font_size: string = '';

  hover_add_img: boolean = false;

  @ViewChild('add_img_cont') add_img_cont!: ElementRef<HTMLDivElement>;
  @ViewChild('add_btn') add_btn!: ElementRef<HTMLInputElement>;

  @Output() imgsIsChanged: EventEmitter<string[]> = new EventEmitter<
    string[]
  >();

  alert_error: string = '';

  ngAfterViewInit(): void {
    this.setImgsOfCloud();
  }

  chooseImgModal(show: boolean): void {
    if (show) {
      this.tools.showComponent(this.add_img_cont.nativeElement);
      return;
    }

    this.tools.hideComponent(this.add_img_cont.nativeElement);
  }

  setImgsOfCloud(): void {
    if (this.imgs_in_cloud != undefined) {
      for (const image of this.imgs_in_cloud) {
        const new_img: Image = {} as Image;
        new_img.url = image;
        new_img.name = this.tools.getNameOfCloudinaryFile(image);
        this.imgs.push(new_img);
      }
    }
  }

  async changingImg(e: Event, ...opts: string[]): Promise<void> {
    const elem: HTMLInputElement = e.target as HTMLInputElement;
    const new_img: Image = {} as Image;

    const file: File = elem.files?.item(0) as File;

    if (!this.tools.acceptSomeFileBy(file, opts)) {
      this.alert_error = 'This file not is supported.';
      elem.value = '';
      return;
    } else this.alert_error = '';

    const url: string = await this.tools.getImage(file);
    const name: string = file.name;

    for (const img of this.imgs_in_cloud)
      if (name == this.tools.getNameOfCloudinaryFile(img)) {
        this.alert_error = 'Some image has the same name.';
        this.add_btn.nativeElement.value = '';
        return;
      }

    if (this.imgs.length < 3) {
      new_img.file = file;
      new_img.url = url;
      new_img.name = name;

      this.imgs.push(new_img);
      this.imgs_in_cloud.push(new_img.url);
      this.imgsIsChanged.emit(this.imgs_in_cloud);
      return;
    }
    this.alert_error = 'Sorry only accept three images and/or videos. :(';
  }

  async removeLastImage(): Promise<void> {
    if (this.imgs.length > 0) {
      const lastImg = this.imgs[this.imgs.length - 1].url;
      if (lastImg.includes('https://res.cloudinary.com'))
        this.imgs_to_delete.push(lastImg);
    }
    this.imgs.pop();
    this.imgs_in_cloud.pop();
    this.add_btn.nativeElement.value = '';
    this.imgsIsChanged.emit(this.imgs_in_cloud);
  }
}

export interface Image {
  url: string;
  name: string;
  file: File;
}
