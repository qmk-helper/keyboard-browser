import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatSelectionListChange } from '@angular/material/list';

interface IKeymapDBEntry {
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
  keyboardDb: string[];
  keyboardEntry: string;
  keyboardJson: any;
  keyboardFilter = '';

  keymapDb: IKeymapDBEntry[];
  keymapEntry: IKeymapDBEntry;
  keymapJson: any;
  keymapFilter = '';

  @Output() keymapSelected = new EventEmitter<string>();
  @Output() keyboardSelected = new EventEmitter<string>();

  constructor() {}

  ngOnInit(): void {
    console.log('helloWorld');
    fetch(
      'https://raw.githubusercontent.com/qmk-helper/qmk-database/master/keyboards.txt'
    )
      .then((response) => response.text())
      .then((keyboards) => {
        this.keyboardDb = keyboards.split('\n');
      });
  }

  selectKeyboard(event: MatSelectionListChange): void {
    this.keyboardEntry = event.option.value;

    this.keymapDb = [];
    this.keymapEntry = undefined;
    this.keymapJson = undefined;

    fetch(
      `https://raw.githubusercontent.com/qmk-helper/qmk-database/master/keymaps/${this.keyboardEntry}/keymaps.json`
    )
      .then((response) => response.json())
      .then((keymaps) => {
        this.keymapDb = keymaps;
      });

    fetch(
      `https://raw.githubusercontent.com/qmk/qmk_firmware/master/keyboards/${this.keyboardEntry}/info.json`
    )
      .then((response) => response.json())
      .then((keyboardJson) => {
        this.keyboardJson = keyboardJson;
      });
  }

  selectKeymap(event: MatSelectionListChange): void {
    this.keymapEntry = event.option.value;
    fetch(this.getKeymapJsonUrl())
      .then((response) => response.json())
      .then((keymapJson) => {
        this.keymapJson = keymapJson;
      });
  }
  getKeymapGithubUrl(): string {
    if (this.keyboardEntry && this.keymapEntry?.name) {
      return `https://github.com/qmk/qmk_firmware/tree/master/${this.keymapEntry.path}`;
    } else {
      return '';
    }
  }
  getKeyboardJsonUrl(): string {
    if (this.keyboardEntry && this.keymapEntry?.path) {
      return `https://raw.githubusercontent.com/qmk/qmk_firmware/master/keyboards/${this.keyboardEntry}/info.json`;
    } else {
      return '';
    }
  }
  getKeyboardGithubUrl(): string {
    if (this.keyboardEntry && this.keymapEntry?.name) {
      return `https://github.com/qmk/qmk_firmware/tree/master/keyboards/${this.keyboardEntry}`;
    } else {
      return '';
    }
  }
  getKeymapJsonUrl(): string {
    if (this.keyboardEntry && this.keymapEntry?.path) {
      return `https://raw.githubusercontent.com/qmk-helper/qmk-database/master/keymaps/${this.keyboardEntry}/${this.keymapEntry.name}.keymap.json`;
    } else {
      return '';
    }
  }
}
