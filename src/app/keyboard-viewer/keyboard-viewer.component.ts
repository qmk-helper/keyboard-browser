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
  test(qmkKeyboard: any, qmkKeymap: any): void {
    this.kleKeyboards = [];

    const kc = new KeyboardConverter();
    kc.importQmkKeyboard(qmkKeyboard);
    kc.importQmkKeymap(qmkKeymap);

    const keymap = kc.keyboard.keymaps[0];
    if (keymap.layout === 'LAYOUT_preonic_grid') {
      console.log('adjust layout');
      keymap.layout = 'LAYOUT_ortho_5x12';
    }
    const layout = kc.keyboard.layouts.find((l) => l.name === keymap?.layout);

    keymap.layers.forEach((layer) => {
      const kleConverter = new KleConverter(kc.keyboard);
      kleConverter.generateKleKeys(layout, layer);

      this.kleKeyboards.push(kleConverter.kleKeyboard);
      console.log(JSON.stringify(kleConverter.serialize()).slice(1, -1));
      // console.log(this.kleKeyboards);
    });
  }
}
