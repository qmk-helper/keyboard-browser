import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { KeyboardViewerComponent } from './keyboard-viewer.component';

describe('KeyboardViewerComponent', () => {
  let component: KeyboardViewerComponent;
  let fixture: ComponentFixture<KeyboardViewerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ KeyboardViewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KeyboardViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
