import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import * as tc from 'tinycolor2';

@Component({
  selector: 'app-keymap-renderer',
  templateUrl: './keymap-renderer.component.html',
  styleUrls: ['./keymap-renderer.component.scss'],
})
export class KeymapRendererComponent implements OnInit, AfterViewInit {
  @Input()
  kleKeyboard: any;

  @ViewChild('svgRenderer')
  svgRenderer: ElementRef;

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    // resize svg to fit content after initial draw
    const svg = this.svgRenderer.nativeElement;
    const bb = svg.getBBox();
    svg.setAttribute('width', bb.width + 10);
    svg.setAttribute('height', bb.height + 10);
  }

  secondaryColor(color: string): string {
    const tcolor = tc(color);
    if (tcolor.isDark()) {
      return tc(color).lighten(10).toHex8String();
    } else {
      return tc(color).darken(10).toHex8String();
    }
  }
}
