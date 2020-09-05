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

  constructor(private clipboard: Clipboard) {
    this.keyboardConverter = new KeyboardConverter();
    this.keyboardConverter.exportKleKeyboard();
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
    if (changes.qmkKeyboard && this.qmkKeyboard) {
      this.keyboardConverter.importQmkKeyboard(this.qmkKeyboard);
      if (!this.qmkKeymap) {
        this.renderLayouts();
      }
    }
    if (changes.qmkKeymap && this.qmkKeymap) {
      console.log('fkdlpsfkdpso');
      this.keyboardConverter.importQmkKeymap(this.qmkKeymap);
      this.renderLayers();
    }
  }
  renderLayouts(): void {
    console.log('Render Layputs');

    this.kleConverters = [];
    this.keyboardConverter.keyboard.layouts.forEach((layout) => {
      const kleConverter = new KleConverter(this.keyboardConverter.keyboard);
      kleConverter.generateKleKeys(layout);

      this.kleConverters.push(kleConverter);
    });
  }
  renderLayers(): void {
    console.log('Render Layers');
    this.kleConverters = [];
    const keymap = this.keyboardConverter.keyboard.keymaps.find(
      (l) => l.name === this.qmkKeymap.keymap
    );
    if (keymap.layout === 'LAYOUT_preonic_grid') {
      console.log('adjust layout');
      keymap.layout = 'LAYOUT_ortho_5x12';
    }
    const layout = this.keyboardConverter.keyboard.layouts.find(
      (l) => l.name === keymap?.layout
    );

    keymap.layers.forEach((layer) => {
      console.log('fdsefed');
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
      console.log(test);

      this.clipboard.copy(test);
    }
  }
  ngOnInit(): void {}
}
