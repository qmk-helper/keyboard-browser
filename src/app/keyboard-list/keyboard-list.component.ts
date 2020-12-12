import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatSelectionListChange } from '@angular/material/list';
import { ActivatedRoute } from '@angular/router';
import { saveAs } from 'file-saver';

interface IDbEntry {
  json: any;
  name: string;
  path: string;
  error: string;
  'no-cpp': boolean;
}
const qmkFirmwareGithubUrl = 'https://github.com/qmk/qmk_firmware/tree/master/';
const qmkFirmwareRawUrl =
  'https://raw.githubusercontent.com/qmk/qmk_firmware/master/';
const qmkHelperDbRawUrl =
  'https://raw.githubusercontent.com/qmk-helper/qmk-database/master/';
@Component({
  selector: 'app-keyboard-list',
  templateUrl: './keyboard-list.component.html',
  styleUrls: ['./keyboard-list.component.scss'],
})
export class KeyboardListComponent implements OnInit {
  @Output() keymapSelected = new EventEmitter<string>();
  @Output() keyboardSelected = new EventEmitter<string>();

  keyboardDb: IDbEntry[];
  keyboardEntry: IDbEntry;
  keyboardJson: any;
  keyboardFilter = '';
  selectedKeyboard;

  keymapDb: IDbEntry[];
  keymapEntry: IDbEntry;
  keymapJson: {
    keyboard: string;
    keymap: string;
    layers: any[];
    layout: string;
  };
  keymapFilter = '';

  viaKeymap: IDbEntry;

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
      const queryKeyboard = this.keyboardDb.find(
        (dbEntry) => dbEntry.name === params.keyboard
      );
      if (queryKeyboard) {
        this.selectedKeyboard = [queryKeyboard];
        this.setKeyboard(queryKeyboard);
      }
    });
  }

  selectKeyboardEvent(event: MatSelectionListChange): void {
    this.setKeyboard(event.options[0].value);
  }
  setKeyboard(keyboard: IDbEntry): void {
    this.keyboardEntry = keyboard;

    this.keymapDb = [];
    this.keymapEntry = undefined;
    this.keymapJson = undefined;

    fetch(`${qmkHelperDbRawUrl}keymaps/${this.keyboardEntry.name}/keymaps.json`)
      .then((response) => response.json())
      .then((keymaps) => {
        this.keymapDb = keymaps;
        this.viaKeymap = this.keymapDb.find((value) => value.name === 'via');
      });

    fetch(`${qmkFirmwareRawUrl}${this.keyboardEntry.path}`)
      .then(async (response) => {
        if (response.ok) {
          this.keyboardJson = await response.json();
        } else {
          alert('Unable to find info.json');
        }
      })
      .catch(() => {
        alert('Unable to load info.json');
      });
  }

  selectKeymap(event: MatSelectionListChange): void {
    this.keymapEntry = event.options[0].value;
    fetch(this.getKeymapJsonUrl())
      .then(async (response) => {
        if (response.ok) {
          this.keymapJson = await response.json();
        } else {
          alert('Unable to find keymap.json');
        }
      })
      .catch(() => {
        alert('Unable to load keymap.json');
      });
  }
  getKeymapGithubUrl(): string {
    if (this.keyboardEntry && this.keymapEntry?.name) {
      return `${qmkFirmwareGithubUrl}${this.keymapEntry.path}`;
    } else {
      return '';
    }
  }
  getKeyboardJsonUrl(): string {
    if (this.keyboardEntry) {
      return `${qmkFirmwareRawUrl}${this.keyboardEntry.path}`;
    } else {
      return '';
    }
  }
  getKeyboardGithubUrl(): string {
    if (this.keyboardEntry) {
      return `${qmkFirmwareGithubUrl}keyboards/${this.keyboardEntry.name}`;
    } else {
      return '';
    }
  }
  getKeymapJsonUrl(): string {
    if (this.keyboardEntry && this.keymapEntry?.path) {
      return `${qmkHelperDbRawUrl}keymaps/${this.keyboardEntry.name}/${this.keymapEntry.name}.keymap.json`;
    } else {
      return '';
    }
  }

  async downloadViaKeymap() {
    if (!this.viaKeymap?.json) {
      console.log('Downloading via map');

      await fetch(
        `${qmkHelperDbRawUrl}keymaps/${this.keyboardEntry.name}/via.keymap.json`
      )
        .then(async (response) => {
          if (response.ok) {
            this.viaKeymap.json = await response.json();
          } else {
            alert('Unable to find via.keymap.json');
          }
        })
        .catch(() => {
          alert('Unable to load via.keymap.json');
        });
    }
    console.log('VIA', this.viaKeymap);
    console.log('KEYMAP', this.keymapJson);
    console.log(this.keymapJson.layers.length);
    console.log(this.viaKeymap.json.layers.length);
    if (this.keymapJson.layers.length < this.viaKeymap.json.layers.length) {
      console.log('Warning: Not all layers of VIA ar used');
    }
    if (this.keymapJson.layers.length > this.viaKeymap.json.layers.length) {
      console.log('Error: Not all layers can be stored in VIA');
    }
    const viaJson = {
      name: 'KPrepublic XD75',
      vendorProductId: 2017752437,
      layers: [],
    };

    for (let i = 0; i < this.viaKeymap.json.layers.length; i++) {
      viaJson.layers.push(
        this.keymapJson.layers[i] || this.viaKeymap.json.layers[i]
      );
    }

    console.log(viaJson);

    const blob = new Blob([JSON.stringify(viaJson, undefined, 2)], {
      type: 'application/json',
    });

    saveAs(blob, `${this.keymapJson.keymap}.via.json`);
  }
}
