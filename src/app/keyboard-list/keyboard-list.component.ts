import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import {
  Component,
  EventEmitter,
  NgZone,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatSelectionListChange } from '@angular/material/list';
import { take } from 'rxjs/operators';

interface IKeymapMeta {
  name: string;
  path: string;
  error: string;
  'no-cpp': boolean;
}
@Component({
  selector: 'app-keyboard-list',
  templateUrl: './keyboard-list.component.html',
  styleUrls: ['./keyboard-list.component.scss'],
})
export class KeyboardListComponent implements OnInit {
  keyboards: string[];
  keyboard: string;
  keyboardJson = '';
  keyboardFilter = '';

  keymaps: IKeymapMeta[];
  keymap: IKeymapMeta;
  keymapJson = '';
  keymapFilter = '';

  @Output() keymapSelected = new EventEmitter<string>();
  @Output() keyboardSelected = new EventEmitter<string>();

  constructor(private ngZone: NgZone) {}
  @ViewChild('autosize1') autosize1: CdkTextareaAutosize;
  @ViewChild('autosize') autosize: CdkTextareaAutosize;

  triggerResize1(): void {
    // Wait for changes to be applied, then trigger textarea resize.
    this.ngZone.onStable
      .pipe(take(1))
      .subscribe(() => this.autosize1.resizeToFitContent(true));
  }
  triggerResize(): void {
    // Wait for changes to be applied, then trigger textarea resize.
    this.ngZone.onStable
      .pipe(take(1))
      .subscribe(() => this.autosize.resizeToFitContent(true));
  }
  ngOnInit(): void {
    console.log('helloWorld');
    fetch(
      'https://raw.githubusercontent.com/qmk-helper/qmk-database/master/keyboards.txt'
    )
      .then((response) => response.text())
      .then((keyboards) => {
        this.keyboards = keyboards.split('\n');
        console.log(this.keyboards);
      });
  }

  selectKeyboard(event: MatSelectionListChange): void {
    this.keyboard = event.option.value;
    this.keyboardJson = '';

    this.keymaps = [];
    this.keymap = undefined;
    this.keymapJson = '';
    fetch(
      `https://raw.githubusercontent.com/qmk-helper/qmk-database/master/keymaps/${this.keyboard}/keymaps.json`
    )
      .then((response) => response.json())
      .then((keymaps) => {
        this.keymaps = keymaps;
        console.log(this.keymaps);
      });

    fetch(
      `https://raw.githubusercontent.com/qmk/qmk_firmware/master/keyboards/${this.keyboard}/info.json`
    )
      .then((response) => response.text())
      .then((keyboardJson) => {
        this.keyboardJson = keyboardJson;
        console.log(this.keyboardJson);
        this.keyboardSelected.emit(this.keyboardJson);
        this.triggerResize1();
      });
  }
  getKeymapGithubUrl(): string {
    if (this.keyboard && this.keymap?.name) {
      return `https://github.com/qmk/qmk_firmware/tree/master/${this.keymap.path}`;
    } else {
      return '';
    }
  }
  getKeymapJsonUrl(): string {
    if (this.keyboard && this.keymap?.path) {
      return `https://raw.githubusercontent.com/qmk-helper/qmk-database/master/keymaps/${this.keyboard}/${this.keymap.name}.keymap.json`;
    } else {
      return '';
    }
  }
  selectKeymap(event: MatSelectionListChange): void {
    console.log('hfsdiofhsdiofhdiodfhiosdhfdhiosdfhsdio');
    this.keymap = event.option.value;
    fetch(this.getKeymapJsonUrl())
      .then((response) => response.text())
      .then((keymapJson) => {
        this.keymapJson = keymapJson;
        console.log(this.keymapJson);
        this.keymapSelected.emit(this.keymapJson);
        this.triggerResize();
      });
  }
}
