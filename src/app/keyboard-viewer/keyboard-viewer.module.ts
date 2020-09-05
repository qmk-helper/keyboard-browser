import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { KeyboardViewerComponent } from './keyboard-viewer.component';
import { KeymapRendererComponent } from './keymap-renderer/keymap-renderer.component';

@NgModule({
  declarations: [KeyboardViewerComponent, KeymapRendererComponent],
  imports: [CommonModule],
  exports: [KeyboardViewerComponent, KeymapRendererComponent],
})
export class KeyboardViewerModule {}
