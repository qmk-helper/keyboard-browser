import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatSelectionListChange } from '@angular/material/list';
import { ActivatedRoute } from '@angular/router';
interface IDbEntry {
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
  keyboardDb: IDbEntry[];
  keyboardEntry: IDbEntry;
  keyboardJson: any;
  keyboardFilter = '';
  selectedKeyboard;

  keymapDb: IDbEntry[];
  keymapEntry: IDbEntry;
  keymapJson: any;
  keymapFilter = '';

  @Output() keymapSelected = new EventEmitter<string>();
  @Output() keyboardSelected = new EventEmitter<string>();

  constructor(private route: ActivatedRoute) {}

  async ngOnInit(): Promise<void> {
    await fetch(
      'https://raw.githubusercontent.com/qmk-helper/qmk-database/master/keyboards.json'
    )
      .then((response) => response.json())
      .then((keyboards) => {
        this.keyboardDb = keyboards;
      });
    this.route.queryParams.subscribe((params) => {
      this.keyboardFilter = params.keyboard;
      console.log(params);
      const queryKeyboard = this.keyboardDb.find((dbEntry) => {
        return dbEntry.name === params.keyboard;
      });
      if (queryKeyboard) {
        this.selectedKeyboard = [queryKeyboard];
        this.setKeyboard(queryKeyboard);
      }
    });
  }

  selectKeyboardEvent(event: MatSelectionListChange): void {
    this.setKeyboard(event.option.value);
  }
  setKeyboard(keyboard: IDbEntry): void {
    this.keyboardEntry = keyboard;

    this.keymapDb = [];
    this.keymapEntry = undefined;
    this.keymapJson = undefined;

    fetch(
      `https://raw.githubusercontent.com/qmk-helper/qmk-database/master/keymaps/${this.keyboardEntry.name}/keymaps.json`
    )
      .then((response) => response.json())
      .then((keymaps) => {
        this.keymapDb = keymaps;
      });

    fetch(
      `https://raw.githubusercontent.com/qmk/qmk_firmware/master/${this.keyboardEntry.path}`
    )
      .then(async (response) => {
        if (response.ok) {
          this.keyboardJson = await response.json();
        } else {
          alert('Unable to find info.json');
        }
      })
      .catch((reason) => {
        alert('Unable to load info.json');
      });
  }

  selectKeymap(event: MatSelectionListChange): void {
    this.keymapEntry = event.option.value;
    fetch(this.getKeymapJsonUrl())
      .then(async (response) => {
        if (response.ok) {
          this.keymapJson = await response.json();
        } else {
          alert('Unable to find keymap.json');
        }
      })
      .catch((reason) => {
        alert('Unable to load keymap.json');
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
    if (this.keyboardEntry) {
      return `https://raw.githubusercontent.com/qmk/qmk_firmware/master/${this.keyboardEntry.path}`;
    } else {
      return '';
    }
  }
  getKeyboardGithubUrl(): string {
    if (this.keyboardEntry) {
      return `https://github.com/qmk/qmk_firmware/tree/master/keyboards/${this.keyboardEntry.name}`;
    } else {
      return '';
    }
  }
  getKeymapJsonUrl(): string {
    if (this.keyboardEntry && this.keymapEntry?.path) {
      return `https://raw.githubusercontent.com/qmk-helper/qmk-database/master/keymaps/${this.keyboardEntry.name}/${this.keymapEntry.name}.keymap.json`;
    } else {
      return '';
    }
  }
}
