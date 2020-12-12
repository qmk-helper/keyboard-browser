import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KeymapRendererComponent } from './keymap-renderer.component';

describe('KeymapRendererComponent', () => {
  let component: KeymapRendererComponent;
  let fixture: ComponentFixture<KeymapRendererComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KeymapRendererComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KeymapRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
