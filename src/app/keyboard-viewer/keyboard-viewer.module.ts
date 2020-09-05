import { ClipboardModule } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { KeyboardViewerComponent } from './keyboard-viewer.component';
import { KeymapRendererComponent } from './keymap-renderer/keymap-renderer.component';

@NgModule({
  declarations: [KeyboardViewerComponent, KeymapRendererComponent],
  imports: [CommonModule, ClipboardModule, MatButtonModule],
  exports: [KeyboardViewerComponent, KeymapRendererComponent],
})
export class KeyboardViewerModule {}
