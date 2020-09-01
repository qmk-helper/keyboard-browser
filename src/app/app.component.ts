import { Component, ViewChild } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'keyboard-browser';

  @ViewChild('test') child;

  qmkKeyboard: any;
  qmkKeymap: any;

  storeKeyboard(qmkKeyboard): void {
    this.qmkKeyboard = JSON.parse(qmkKeyboard);
  }
  storeKeymap(qmkKeymap): void {
    this.qmkKeymap = JSON.parse(qmkKeymap);

    if (!this.qmkKeyboard) {
      console.log('Missing Keyboard');
      return;
    }

    this.child.test(this.qmkKeyboard, this.qmkKeymap);
  }
}
