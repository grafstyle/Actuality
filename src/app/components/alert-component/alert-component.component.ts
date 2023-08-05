import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-alert-component',
  templateUrl: './alert-component.component.html',
  styleUrls: ['./alert-component.component.css'],
})
export class AlertComponentComponent {
  @Input() msg: string = '';
  @Output() is_closed: EventEmitter<boolean> = new EventEmitter<boolean>();

  @ViewChild('cont_error') modal!: ElementRef<HTMLDivElement>;

  ngAfterViewInit(): void {
    this.show();
  }

  show(): void {
    this.modal.nativeElement.style.opacity = '1';
    this.modal.nativeElement.style.pointerEvents = 'all';
  }

  close(): void {
    this.modal.nativeElement.style.opacity = '0';
    this.modal.nativeElement.style.pointerEvents = 'none';

    this.msg = '';

    this.is_closed.emit(true);
  }
}
