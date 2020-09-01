import { Component, OnInit } from '@angular/core';
import {
  KeyboardConverter,
  KleConverter,
} from '@qmk-helper/keyboard-converter';
import { KleKeyboard } from '@qmk-helper/kle-serial';
@Component({
  selector: 'app-keyboard-viewer',
  templateUrl: './keyboard-viewer.component.html',
  styleUrls: ['./keyboard-viewer.component.scss'],
})
export class KeyboardViewerComponent implements OnInit {
  kleKeyboardString: string;
  constructor() {}

  kleKeyboards: KleKeyboard[] = [];

  ngOnInit(): void {}
  test(qmkKeyboard, qmkKeymap): void {
    this.kleKeyboards = [];
    console.log('dfsfsdfds');
    console.log(typeof qmkKeymap);
    console.log(qmkKeyboard);

    const kc = new KeyboardConverter();
    kc.importQmkKeyboard(qmkKeyboard);
    kc.importQmkKeymap(qmkKeymap);
    console.log(kc.keyboard);
    const kleConverter = new KleConverter(kc.keyboard);
    const keymap = kc.keyboard.keymaps[0];
    if (keymap.layout === 'LAYOUT_preonic_grid') {
      console.log('adjust layout');
      keymap.layout = 'LAYOUT_ortho_5x12';
    }
    const layout = kc.keyboard.layouts.find((l) => l.name === keymap?.layout);
    console.log(keymap);
    keymap.layers.forEach((layer) => {
      kleConverter.generateKleKeys(layout, layer);
      console.log(layer);
      this.kleKeyboards.push(
        JSON.parse(JSON.stringify(kleConverter.kleKeyboard))
      );
      console.log(this.kleKeyboards);
    });
  }
}
