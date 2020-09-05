import { Clipboard } from '@angular/cdk/clipboard';
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import {
  KeyboardConverter,
  KleConverter,
} from '@qmk-helper/keyboard-converter';
import { LAYOUT_LOOKUP } from './layout-lookup';

@Component({
  selector: 'app-keyboard-viewer',
  templateUrl: './keyboard-viewer.component.html',
  styleUrls: ['./keyboard-viewer.component.scss'],
})
export class KeyboardViewerComponent implements OnInit, OnChanges {
  kleKeyboardString: string;
  kleConverters: KleConverter[] = [];

  @Input()
  qmkKeyboard: any;

  @Input()
  qmkKeymap: any;
  panelOpenState = false;
  keyboardConverter: KeyboardConverter;
  layoutLookupName: string;

  constructor(private clipboard: Clipboard) {
    this.keyboardConverter = new KeyboardConverter();
    this.keyboardConverter.exportKleKeyboard();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.qmkKeyboard && this.qmkKeyboard) {
      this.keyboardConverter.importQmkKeyboard(this.qmkKeyboard);
      if (!this.qmkKeymap) {
        this.renderLayouts();
      }
    }
    if (changes.qmkKeymap && this.qmkKeymap) {
      this.keyboardConverter.importQmkKeymap(this.qmkKeymap);
      this.renderLayers();
    }
  }
  renderLayouts(): void {
    this.kleConverters = [];
    this.keyboardConverter.keyboard.layouts.forEach((layout) => {
      const kleConverter = new KleConverter(this.keyboardConverter.keyboard);
      kleConverter.generateKleKeys(layout);

      this.kleConverters.push(kleConverter);
    });
  }
  renderLayers(): void {
    this.kleConverters = [];
    const keymap = this.keyboardConverter.keyboard.keymaps.find(
      (l) => l.name === this.qmkKeymap.keymap
    );

    let layout = this.keyboardConverter.keyboard.layouts.find(
      (l) => l.name === keymap?.layout
    );
    if (!layout) {
      layout = this.keyboardConverter.keyboard.layouts.find(
        (l) => l.name === LAYOUT_LOOKUP[keymap?.layout]
      );
    }
    if (!layout) {
      this.layoutLookupName =
        window.prompt(
          'This keymap uses an unknown LAYOUT name: ' +
            keymap?.layout +
            '. Please enter the name of the layout to be used',
          this.layoutLookupName
        ) || undefined;
      layout = this.keyboardConverter.keyboard.layouts.find(
        (l) => l.name === this.layoutLookupName
      );
    }
    if (!layout) {
      window.alert('No matching Layout');
      return;
    }
    keymap.layers.forEach((layer) => {
      const kleConverter = new KleConverter(this.keyboardConverter.keyboard);
      kleConverter.generateKleKeys(layout, layer);
      this.kleConverters.push(kleConverter);
    });
  }
  exportKle(): void {
    if (this.qmkKeymap && this.qmkKeyboard) {
      const kleConverter = new KleConverter(this.keyboardConverter.keyboard);
      kleConverter.useKeymap(this.qmkKeymap.keymap);
      const test = JSON.stringify(kleConverter.serialize()).slice(1, -1);
      this.clipboard.copy(test);
    }
  }
  ngOnInit(): void {}
}
