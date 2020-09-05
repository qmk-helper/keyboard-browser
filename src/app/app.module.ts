import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { KeyboardListModule } from './keyboard-list/keyboard-list.module';
import { KeyboardViewerComponent } from './keyboard-viewer/keyboard-viewer.component';
import { KeymapRendererComponent } from './keyboard-viewer/keymap-renderer/keymap-renderer.component';

@NgModule({
  declarations: [
    AppComponent,
    KeyboardViewerComponent,
    KeymapRendererComponent,
  ],
  imports: [BrowserModule, BrowserAnimationsModule, KeyboardListModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
