import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Tools } from 'src/app/tools/tools';

@Component({
  selector: 'app-add-images-input',
  templateUrl: './add-images-input.component.html',
  styleUrls: ['./add-images-input.component.css'],
})
export class AddImagesInputComponent {
  imgs: Image[] = [];
  imgsToDelete: string[] = [];
  tools: Tools = new Tools();

  @Input() imgsInCloud: string[] = [];
  @Input() hoverColor: string = '';
  @Input() fontSize: string = '';

  hoverAddImg: boolean = false;

  @ViewChild('addImgCont') addImgCont!: ElementRef<HTMLDivElement>;
  @ViewChild('addBtn') addbtn!: ElementRef<HTMLInputElement>;

  alertError: string = '';

  ngAfterViewInit() {
    this.setImgsOfCloud();
  }

  chooseImgModal(show: boolean): void {
    if (show) {
      this.addImgCont.nativeElement.style.opacity = '1';
      this.addImgCont.nativeElement.style.pointerEvents = 'all';
      return;
    }

    this.addImgCont.nativeElement.style.opacity = '0';
    this.addImgCont.nativeElement.style.pointerEvents = 'none';
  }

  setImgsOfCloud(): void {
    if (this.imgsInCloud != undefined) {
      for (const image of this.imgsInCloud) {
        const newImg: Image = {} as Image;
        newImg.url = image;
        newImg.name = this.tools.getNameOfCloudinaryFile(image);
        this.imgs.push(newImg);
      }
    }
  }

  async changingImg(e: Event): Promise<void> {
    const elem: HTMLInputElement = e.target as HTMLInputElement;
    const newImg: Image = {} as Image;

    const file: File = elem.files?.item(0) as File;
    const url: string = await this.tools.getImage(file);
    const name: string = file.name;

    for (const img of this.imgsInCloud)
      if (name == this.tools.getNameOfCloudinaryFile(img)) {
        this.alertError = 'Some image has the same name.';
        this.addbtn.nativeElement.value = '';
        return;
      }

    if (this.imgs.length < 3) {
      newImg.file = file;
      newImg.url = url;
      newImg.name = name;

      this.imgs.push(newImg);
      this.imgsInCloud.push(newImg.url);
      return;
    }
    this.alertError = 'Sorry only accept three images and/or videos. :(';
  }

  async removeLastImage(): Promise<void> {
    const lastImg = this.imgs[this.imgs.length - 1].url;
    if (lastImg.includes('https://res.cloudinary.com'))
      this.imgsToDelete.push(lastImg);
    this.imgs.pop();
    this.imgsInCloud.pop();
    this.addbtn.nativeElement.value = '';
  }
}

export interface Image {
  url: string;
  name: string;
  file: File;
}
