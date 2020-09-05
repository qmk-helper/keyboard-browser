import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { KeyboardViewerModule } from '../keyboard-viewer/keyboard-viewer.module';
import { FilterPipe } from './filter.pipe';
import { KeyboardListComponent } from './keyboard-list.component';

@NgModule({
  declarations: [KeyboardListComponent, FilterPipe],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatListModule,
    MatInputModule,
    ScrollingModule,
    KeyboardViewerModule,
    MatExpansionModule,
  ],
  exports: [KeyboardListComponent],
})
export class KeyboardListModule {}
