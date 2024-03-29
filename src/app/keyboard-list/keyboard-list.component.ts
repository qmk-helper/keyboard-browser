import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatSelectionListChange } from '@angular/material/list';
import { ActivatedRoute, Router } from '@angular/router';

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

  selectedKeyboard: IDbEntry[];
  selectedKeymap: IDbEntry[];

  keymapDb: IDbEntry[];
  keymapEntry: IDbEntry;
  keymapJson: any;
  keymapFilter = '';

  @Output() keymapSelected = new EventEmitter<string>();
  @Output() keyboardSelected = new EventEmitter<string>();

  constructor(private route: ActivatedRoute, private router: Router) {}

  async ngOnInit(): Promise<void> {
    await fetch(
      'https://raw.githubusercontent.com/qmk-helper/qmk-database/master/keyboards.json'
    )
      .then((response) => response.json())
      .then((keyboards) => {
        this.keyboardDb = keyboards;
      });
    this.route.queryParams.subscribe(async (params) => {
      console.log(params);
      console.log(this.keyboardEntry?.name);
      const queryKeyboard = this.keyboardDb.find(
        (dbEntry) => dbEntry.name === params.keyboard
      );

      if (queryKeyboard) {
        if (queryKeyboard.name !== this.keyboardEntry?.name) {
          this.selectedKeyboard = [queryKeyboard];
          await this.setKeyboard(queryKeyboard);
        }

        console.log(this.keymapJson);
        const queryKeymap = this.keymapDb.find(
          (dbEntry) => dbEntry.name === params.keymap
        );
        console.log(queryKeymap);
        if (queryKeymap) {
          if (queryKeymap.name !== this.keymapEntry?.name) {
            this.selectedKeymap = [queryKeymap];
            await this.setKeymap(queryKeymap);
          }
        }
      }
    });
  }

  selectKeyboardEvent(event: MatSelectionListChange): void {
    this.setKeyboard(event.option.value);
    this.updateRoute();
  }
  async setKeyboard(keyboard: IDbEntry): Promise<void> {
    this.keyboardEntry = keyboard;

    this.keymapDb = [];
    this.keymapEntry = undefined;
    this.keymapJson = undefined;

    await fetch(
      `https://raw.githubusercontent.com/qmk-helper/qmk-database/master/keymaps/${this.keyboardEntry.name}/keymaps.json`
    )
      .then((response) => response.json())
      .then((keymaps) => {
        this.keymapDb = keymaps;
      });

    await fetch(
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
        console.log('Unable to load info.json', reason);
      });
  }

  async selectKeymapEvent(event: MatSelectionListChange): Promise<void> {
    await this.setKeymap(event.option.value);
    this.updateRoute();
  }
  async setKeymap(keymap: IDbEntry) {
    this.keymapJson = undefined;
    this.keymapEntry = keymap;

    await fetch(this.getKeymapJsonUrl())
      .then(async (response) => {
        if (response.ok) {
          this.keymapJson = await response.json();
        } else {
          alert('Unable to find keymap.json');
        }
      })
      .catch((reason) => {
        alert('Unable to load keymap.json');
        console.log('Unable to load keymap.json', reason);
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

  private updateRoute() {
    this.router.navigate([], {
      queryParams: {
        keyboard: this.keyboardEntry?.name,
        keymap: this.keymapEntry?.name,
      },
    });
  }
}
