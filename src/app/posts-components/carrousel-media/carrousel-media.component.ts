import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { Tools } from 'src/app/tools/tools';

@Component({
  selector: 'app-carrousel-media',
  templateUrl: './carrousel-media.component.html',
  styleUrls: ['./carrousel-media.component.css'],
})
export class CarrouselMediaComponent {
  @Input() media: string[] = [];
  @Output() closed: EventEmitter<boolean> = new EventEmitter<boolean>();
  @ViewChild('media_carrousel') media_carrousel!: ElementRef<HTMLDivElement>;
  showIndex: number = 0;
  tools: Tools = new Tools();

  toNext(): void {
    if (this.showIndex < this.media.length - 1) this.showIndex++;
    else this.showIndex = 0;
  }

  toBefore(): void {
    if (this.showIndex > 0) this.showIndex--;
    else this.showIndex = this.media.length - 1;
  }

  close(): void {
    this.tools.hideComponent(this.media_carrousel.nativeElement);
    this.closed.emit(true);
  }

  open(): void {
    this.tools.showComponent(this.media_carrousel.nativeElement);
  }
}
