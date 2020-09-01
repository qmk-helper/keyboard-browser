import { Component, Input, OnInit } from '@angular/core';
import { KleKeyboard } from '@qmk-helper/kle-serial';

@Component({
  selector: 'app-keymap-renderer',
  templateUrl: './keymap-renderer.component.html',
  styleUrls: ['./keymap-renderer.component.scss'],
})
export class KeymapRendererComponent implements OnInit {
  @Input()
  kleKeyboard: KleKeyboard;

  constructor() {}

  ngOnInit(): void {
    console.log('Hello');
    console.log(this.kleKeyboard);
  }
}
