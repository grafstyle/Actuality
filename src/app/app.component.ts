import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Actuality';
}

class cosas {
  hoja: string = 'Hola mundo';

  constructor() {
    console.log(hoja);
  }
}
