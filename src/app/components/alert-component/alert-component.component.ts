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
  selector: 'app-alert-component',
  templateUrl: './alert-component.component.html',
  styleUrls: ['./alert-component.component.css'],
})
export class AlertComponentComponent {
  tools: Tools = new Tools();

  @Input() msg: string = '';
  @Output() is_closed: EventEmitter<boolean> = new EventEmitter<boolean>();

  @ViewChild('cont_error') modal!: ElementRef<HTMLDivElement>;

  ngAfterViewInit(): void {
    this.show();
  }

  show(): void {
    this.tools.showComponent(this.modal.nativeElement);
  }

  close(): void {
    this.tools.hideComponent(this.modal.nativeElement);
    this.msg = '';
    this.is_closed.emit(true);
  }
}
