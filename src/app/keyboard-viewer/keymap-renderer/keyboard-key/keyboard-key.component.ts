import { Component, Input, OnInit } from '@angular/core';
import { KleKey } from '@qmk-helper/kle-serial';
import * as tc from 'tinycolor2';

@Component({
  selector: 'app-keyboard-key',
  templateUrl: './keyboard-key.component.html',
  styleUrls: ['./keyboard-key.component.scss'],
})
export class KeyboardKeyComponent implements OnInit {
  @Input()
  key: KleKey;

  lightColor: string;

  constructor() {}

  ngOnInit(): void {
    const color = tc(this.key.color);
    color.brighten(20);
    this.lightColor = color.toHex8String();
    // console.log(`X: ${this.key.x} | Y: ${this.key.y}`);
    // console.log(`Key: ${this.key}`);
  }
}
